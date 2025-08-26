import yaml from 'js-yaml';
import { createRequire } from 'module';
import { EleventyHtmlBasePlugin } from '@11ty/eleventy';
import Image from '@11ty/eleventy-img';
import path from 'node:path';
import exifr from 'exifr';
import { parse } from 'csv-parse/sync';
import htmlmin from 'html-minifier-terser';
import dirOutputPlugin from '@11ty/eleventy-plugin-directory-output';

const require = createRequire(import.meta.url);
const markdownIt = require('markdown-it');
const md = new markdownIt({ html: true });
const imageFilenameFormatter = function (id, src, width, format, options) {
	const extension = path.extname(src);
	const name = path.basename(src, extension);
	// id: hash of the original image
	// src: original image path
	// width: current width in px
	// format: current file format
	// options: set of options passed to the Image call
	return `${name}-${width}.${format}`;
};

export default async function (config) {
	/* Add build:prod pathprefix capabilities for builds against gh-pages */
	config.setQuietMode(true);
	config.addPlugin(EleventyHtmlBasePlugin);
	config.addPlugin(dirOutputPlugin, {
		// Customize columns
		columns: {
			filesize: true, // Use `false` to disable
			benchmark: true, // Use `false` to disable
		},

		// Will show in yellow if greater than this number of bytes
		warningFileSize: 400 * 1000,
	});

	/* Add YAML support */
	config.addDataExtension('yml,yaml', contents => yaml.load(contents));

	/* Copy assets straight through to the `public` folder */
	config.addPassthroughCopy({ 'src/_root': '.' });
	config.addPassthroughCopy({ 'src/assets': 'assets' });

	/* Filters */
	config.addFilter('markdown', content => {
		// Adds markdown support to any field
		// e.g. {{ pattern.description | markdown | safe }}
		return md.render(content);
	});
	config.addFilter('objToArray', data => {
		// When using multiple files in the `data` directory
		// 11ty appends them as key/value pairs to an object.
		// This filter is useful for turning that object into an array,
		// by ignoring the filename (key), and extracting the values.
		return Object.values(data);
	});
	config.addFilter('stringify', data => {
		return JSON.stringify(data, null, '\t');
	});
	config.addFilter('uniques', data => {
		return Array.from(new Set(data));
	});
	config.addFilter('CCYYMMDD', date => {
		return new Date(date).toISOString().substring(0, 10);
	});
	config.addFilter('getYear', date => {
		return new Date(date).getFullYear();
	});
	config.addFilter('byPerson', (obj, personId) => {
		const filtered = {};
		Object.keys(obj)
			.filter((item) => {
				if (obj[item].observers) {
					return obj[item].observers.indexOf(personId) > -1;
				} else {
					return obj[item].photographer === personId;
				}
			})
			.forEach((name) => (filtered[name] = obj[name]));
		return filtered;
	});
	config.addFilter('byArea', (obj, areaId) => {
		const filtered = {};
		Object.keys(obj)
			.filter((item) => {
				return obj[item].location.area == areaId;
			})
			.forEach((name) => (filtered[name] = obj[name]));
		return filtered;
	});
	config.addFilter('byBird', (obj, birdId) => {
		const filtered = {};
		Object.keys(obj)
			.filter((item) => {
				if (obj[item].bird) {
					return obj[item].bird.id == birdId;
				} else {
					return obj[item].birds.indexOf(birdId) > -1;
				}
			})
			.forEach((name) => (filtered[name] = obj[name]));
		return filtered;
	});
	config.addFilter('sortByProp', (obj, prop) => {
		const sorted = {};
		Object.keys(obj)
			.sort((a, b) => {
				return obj[a][prop] < obj[b][prop] ? 1 : -1;
			})
			.forEach((name) => (sorted[name] = obj[name]));
		return sorted;
	});
	config.addFilter('ogImage', (filename, photographerId) => {
		let thumbnailPhoto = filename.replace(/\.JPEG$/,'-640.JPEG').replace(/\.jpeg$/,'-640.jpeg').replace(/\.JPG$/,'-640.JPG').replace(/\.jpg$/,'-640.jpg');
		return `/assets/photos/${ photographerId }/${ thumbnailPhoto }`;
	});

	/* Shortcodes */
	config.addShortcode('datetime', function (date) {
		const newDate = new Date(date);
		return `<time datetime="${newDate.toISOString()}">
			${newDate.toLocaleString('za')}
		</time>`;
	});
	config.addShortcode('photoImage', async function (src, alt, widths = [640, 1200, 2400], sizes = "100vh") {
		const authorId = src.split('src/_data/source_photos/')[1].split('/')[0];
		const imageId = src.split(`src/_data/source_photos/${authorId}/`)[1].replace('.','_');
		let metadata = await Image(src, {
			urlPath: `/assets/photos/${authorId}/`,
			outputDir: `src/assets/photos/${authorId}/`,
			widths,
			filenameFormat: imageFilenameFormatter,
			formats: ['avif', 'jpeg'],
		});
		let imageAttributes = {
			alt,
			loading: 'eager',
			sizes: `
				(max-width: 320px) 640w,
				(max-width: 600px) 1200w,
				2400w
			`,
			style: `view-transition-name: image_${ imageId };`
		};
		return Image.generateHTML(metadata, imageAttributes);
	});
	config.addShortcode('photoThumbnail', async function (src, alt, translateX = 0, translateY = 0, scale = 1) {
		const authorId = src.split('src/_data/source_photos/')[1].split('/')[0];
		const imageId = src.split(`src/_data/source_photos/${authorId}/`)[1].replace('.','_');
		let metadata = await Image(src, {
			urlPath: `/assets/photos/${authorId}/`,
			outputDir: `src/assets/photos/${authorId}/`,
			widths: [640],
			filenameFormat: imageFilenameFormatter,
			formats: ['avif', 'jpeg'],
		});
		let imageAttributes = {
			alt,
			loading: 'lazy',
			style: `
				--thumbnail-translate-x: ${ translateX };
				--thumbnail-translate-y: ${ translateY };
				--thumbnail-scale: ${ scale };
				view-transition-name: image_${ imageId };
			`
		};
		return Image.generateHTML(metadata, imageAttributes);
	});

	if (process.env.ELEVENTY_RUN_MODE === 'build'){
		config.addTransform('htmlmin', function (content) {
			if ((this.page.outputPath || '').endsWith('.html')) {
				let minified = htmlmin.minify(content, {
					useShortDoctype: true,
					removeComments: false,
					collapseWhitespace: true,
				});
				return minified;
			}
			// If not an HTML output, return content as-is
			return content;
		});
	}

	return {
		templateFormats: ['html', 'md', 'njk'],
		htmlTemplateEngine: ['njk', 'md'],
		dir: {
			// ⚠️ These values are both relative to your input directory.
			input: './src',
			output: './dist',
			data: './_data',
			includes: './_includes',
			layouts: './_layouts',
		},
	}
}
