import yaml from 'js-yaml';
import { createRequire } from 'module';
import { EleventyHtmlBasePlugin } from '@11ty/eleventy';
import Image from '@11ty/eleventy-img';
import path from 'node:path';
import exifr from 'exifr';

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
	config.addPlugin(EleventyHtmlBasePlugin);

	/* Add YAML support */
	config.addDataExtension('yml,yaml', contents => yaml.load(contents));
	config.addDataExtension('jpeg,jpg,JPG,JPEG', {
		parser: async (file) => {
			let attributes = [
				'DateTimeOriginal',
				'Make',
				'Model',
				'LensModel',
				'FNumber',
				'FocalLengthIn35mmFormat',
				'ExposureTime',
				'ExposureCompensation',
				'ISO'
			];
			let exif = await exifr.parse(file, attributes);
			return {
				exif,
			};
		},
		// Using `read: false` changes the parser argument to
		// a file path instead of file contents.
		read: false,
	});
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
	config.addFilter('CCYYMMDD', date => {
		return new Date(date).toISOString().substring(0, 10);
	});
	config.addFilter('sortByDatetimeRecent', (obj) => {
		const sorted = {};
		Object.keys(obj)
			.sort((a, b) => {
				return obj[a].datetime < obj[b].datetime ? 1 : -1;
			})
			.forEach((name) => (sorted[name] = obj[name]));
		return sorted;
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
	config.addFilter('ogImage', (filename, photographerId) => {
		let thumbnailPhoto = filename.replace(/\.jpeg$/, '-640.jpeg').replace(/\.JPG$/, '-640.JPG');
		return `/assets/photos/${ photographerId }/${ thumbnailPhoto }`;
	});

	/* Shortcodes */
	config.addShortcode('datetime', function (date) {
		const newDate = new Date(date);
		return `<time datetime="${newDate.toISOString()}">
			${newDate.toLocaleString('za')}
		</time>`;
	});
	config.addShortcode('photoImage', async function (src, alt) {
		const authorId = src.split('src/_data/source_photos/')[1].split('/')[0];
		const imageId = src.split(`src/_data/source_photos/${authorId}/`)[1].replace('.','_');
		let metadata = await Image(src, {
			urlPath: `/assets/photos/${authorId}/`,
			outputDir: `src/assets/photos/${authorId}/`,
			widths: [2400],
			filenameFormat: imageFilenameFormatter,
			formats: ['avif', 'webp', 'jpeg'],
		});
		let imageAttributes = {
			alt,
			loading: 'lazy',
			id: `image_${ imageId }`,
			style: `view-transition-name: image_${ imageId };`
		};
		return Image.generateHTML(metadata, imageAttributes);
	});
	config.addShortcode('photoThumbnail', async function (src, alt) {
		const authorId = src.split('src/_data/source_photos/')[1].split('/')[0];
		const imageId = src.split(`src/_data/source_photos/${authorId}/`)[1].replace('.','_');
		let metadata = await Image(src, {
			urlPath: `/assets/photos/${authorId}/`,
			outputDir: `src/assets/photos/${authorId}/`,
			widths: [640],
			filenameFormat: imageFilenameFormatter,
			formats: ['avif', 'webp', 'jpeg'],
		});
		let imageAttributes = {
			alt,
			loading: 'lazy',
			id: `image_${ imageId }`,
			style: `view-transition-name: image_${ imageId };`
		};
		return Image.generateHTML(metadata, imageAttributes);
	});

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
