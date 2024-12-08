import yaml from 'js-yaml';
import { createRequire } from 'module';
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import Image from "@11ty/eleventy-img";
import path from "node:path";
const require = createRequire(import.meta.url);
const inspect = require('util').inspect;
const markdownIt = require('markdown-it');

const md = new markdownIt({html: true});

export default async function(config) {	
	/* Add build:prod pathprefix capabilities for builds against gh-pages */
	config.addPlugin(EleventyHtmlBasePlugin);
	/* Add YAML support */
	config.addDataExtension('yml', contents => yaml.load(contents));

	/* Copy assets straight through to the `public` folder */
	config.addPassthroughCopy({'src/_root': '.'});
	config.addPassthroughCopy({'src/assets': 'assets'});

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
	config.addFilter('debug', content => {
		return inspect(content);
	});
	config.addFilter('stringify', data => {
		return JSON.stringify(data, null, '\t');
	});

	/* Shortcodes */
	config.addShortcode('datetime', function(date) {
		const newDate = new Date(date);
		return `<time datetime="${ newDate.toISOString() }">
			${ newDate.toLocaleString('za') }
		</time>`;
	});
	config.addShortcode('photoImage', async function (src, alt) {
		const species = path.dirname(src).split('src/assets/photos/')[1];
		let metadata = await Image(src, {
			urlPath: `/assets/photos/${ species }`,
			outputDir: `src/assets/photos/${species}/`,
			filenameFormat: function (id, src, width, format, options) {
				const extension = path.extname(src);
				const name = path.basename(src, extension);
				// id: hash of the original image
				// src: original image path
				// width: current width in px
				// format: current file format
				// options: set of options passed to the Image call
				return `${name}-${width}.${format}`;
			},
			formats: ['avif', 'webp', 'jpeg'],
		});
		let imageAttributes = {
			alt,
			loading: 'lazy'
		};

		return Image.generateHTML(metadata, imageAttributes);
	});
	config.addShortcode('photoThumbnail', async function (src, alt) {
		const species = path.dirname(src).split('src/assets/photos/')[1];
		let metadata = await Image(src, {
			urlPath: `/assets/photos/${ species }`,
			outputDir: `src/assets/photos/${species}/`,
			widths: [640],
			filenameFormat: function (id, src, width, format, options) {
				const extension = path.extname(src);
				const name = path.basename(src, extension);
				// id: hash of the original image
				// src: original image path
				// width: current width in px
				// format: current file format
				// options: set of options passed to the Image call
				return `${name}-${width}.${format}`;
			},
			formats: ['avif', 'webp', 'jpeg'],
		});
		let imageAttributes = {
			alt,
			loading: 'lazy'
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
