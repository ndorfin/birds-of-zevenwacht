import fs from 'node:fs';
import exifr from 'exifr';

let targetFile = process.argv[2];

if (!targetFile) console.log('Please supply a path to an image file');

fs.readFile(targetFile, (errFile, data) => {
	exifr.parse(data).then(exif => {
		console.log(exif);
	});
});