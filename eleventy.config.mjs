import yaml from 'js-yaml';
import { createRequire } from 'module';
import { EleventyHtmlBasePlugin } from '@11ty/eleventy';
import Image from '@11ty/eleventy-img';
import path from 'node:path';
import exifr from 'exifr';

const require = createRequire(import.meta.url);
const markdownIt = require('markdown-it');
const md = new markdownIt({html: true});
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

export default async function(config) {	
	/* Add build:prod pathprefix capabilities for builds against gh-pages */
	config.addPlugin(EleventyHtmlBasePlugin);
	
	/* Add YAML support */
	config.addDataExtension('yml,yaml', contents => yaml.load(contents));
	config.addDataExtension('jpeg', {
		parser: async (file) => {
			let exif = await exifr.parse(file);
			return {
				exif,
			};
		},
		// Using `read: false` changes the parser argument to
		// a file path instead of file contents.
		read: false,
	});
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
		const authorId = src.split('src/_data/source_photos/')[1].split('/')[0];
		let metadata = await Image(src, {
			urlPath: `/assets/photos/${authorId}/`,
			outputDir: `src/assets/photos/${authorId}/`,
			filenameFormat: imageFilenameFormatter,
			formats: ['avif', 'webp', 'jpeg'],
		});
		let imageAttributes = {
			alt,
			loading: 'lazy'
		};
		return Image.generateHTML(metadata, imageAttributes);
	});
	config.addShortcode('photoThumbnail', async function (src, alt) {
		const authorId = src.split('src/_data/source_photos/')[1].split('/')[0];
		let metadata = await Image(src, {
			urlPath: `/assets/photos/${authorId}/`,
			outputDir: `src/assets/photos/${authorId}/`,
			widths: [640],
			filenameFormat: imageFilenameFormatter,
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
