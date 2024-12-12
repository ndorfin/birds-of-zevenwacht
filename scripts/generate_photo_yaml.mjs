import path from 'node:path';
import fs from 'node:fs';
import exifr from 'exifr';

const sourcePhotoFolder = path.resolve('src/_data/source_photos');
const targetPhotoFolder = path.resolve('src/_data/photos');

function createPhotoYML(photoEntryObj) {
	let fileString = '';

	if (!photoEntryObj.exif) {
		fileString += `\
# Add an ISO8601 date
# 2024-09-04T14:23:59Z 
datetime: ${ new Date(photoEntryObj.createdDate).toISOString() }
`
	}

	fileString += `\
# What is the filename of this photo (in the /assets/photos folder)
file: ${ photoEntryObj.filename }
# Link this Photo to a Sighting, by providing the Sighting ID:
# 2024-09-04T14_23
sighting: 
# Describe this image, as if you were explaining it over the phone
description: 
# List each of the bird IDs present in this photo
birds:
  - 
# Link this photo to a photographer (matching a file in the _data/people folder)
photographer: ${ photoEntryObj.photographer }
location:
  area: 
`;

	if (photoEntryObj.exif && photoEntryObj.exif.GPSLatitude ) {
		fileString += `\
  latitude: ${ photoEntryObj.exif.GPSLatitude }
  longitude: ${ photoEntryObj.exif.GPSLongitude }
`
	}

	return fileString;
}

fs.readdir(sourcePhotoFolder, (errAuthor, entries) => {
	const authorNames = entries.filter(entry => {
		return fs.statSync(`${ sourcePhotoFolder }/${ entry }`).isDirectory();
	});
	authorNames.forEach(photographer => {
		fs.readdir(`${ sourcePhotoFolder }/${ photographer }`, (errPhotos, filenames) => {
			filenames.forEach(filename => {
				let photoPath = `${ sourcePhotoFolder }/${ photographer }/${ filename }`;
				fs.readFile(photoPath, (errFile, data) => {
					const { ctime } = fs.statSync(photoPath);
					exifr.parse(data).then(exif => {
						const createdDate = exif ? exif.DateTimeOriginal : new Date(ctime);
						const createdDateString = createdDate.toISOString().replace(/:/g, '_');
						const targetFile = `${ targetPhotoFolder }/${ createdDateString }_${ photographer }.yml`;
						let photoEntryObj = {
							filename,
							photographer,
							exif,
							createdDate,
						}

						if (!fs.existsSync(targetFile)) {
							fs.writeFileSync(targetFile, createPhotoYML(photoEntryObj));
						}
						
					});
				});
			});
		});
	});
});


