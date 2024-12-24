import path from 'node:path';
import fs from 'node:fs';
import exifr from 'exifr';

const sourcePhotosFolder = path.resolve('src/_data/source_photos');
const targetPhotosFolder = path.resolve('src/_data/photos');
const targetSightingsFolder = path.resolve('src/_data/sightings');
const targetEXIFFolder = path.resolve('src/_data/exifs');

function getGPSCoords(exifObj, type) {
	if (exifObj[type])
		return exifObj[type];

	let titleCase = `${ type.charAt(0).toUpperCase() }${ type.substring(1) }`;
	
	if (exifObj[`GPS${ titleCase }`])
		return exifObj[`GPS${ titleCase }`];

	return '';
}

function createEXIFYML(exifEntryObj) {
	let fileString = '';

	fileString += `\
DateTimeOriginal: ${ new Date(exifEntryObj.DateTimeOriginal).toISOString() }
Make: ${ exifEntryObj.Make }
Model: ${ exifEntryObj.Model }
LensModel: ${ exifEntryObj.LensModel ? exifEntryObj.LensModel : exifEntryObj['42036'] }
FNumber: ${ exifEntryObj.FNumber }
FocalLengthIn35mmFormat: ${ exifEntryObj.FocalLengthIn35mmFormat ? exifEntryObj.FocalLengthIn35mmFormat : exifEntryObj.FocalLength }
ExposureTime: ${ exifEntryObj.ExposureTime }
ExposureCompensation: ${ exifEntryObj.ExposureCompensation }
ISO: ${ exifEntryObj.ISO }
latitude: ${ getGPSCoords( exifEntryObj, 'latitude') }
longitude: ${ getGPSCoords( exifEntryObj, 'longitude') }
`;

	return fileString;
}

function createSightingYML(sightingEntryObj) {
	let fileString = '';

	fileString += `\
# Add an ISO8601 date
# 2024-09-04T14:23:59Z 
datetime: ${ new Date(sightingEntryObj.createdDate).toISOString() }
`;

	fileString += `\
# Add a description of this sighting. What was significant about it? Did you observe any interesting behaviour?
description: |-
  
bird:
  # Supply a matching Bird ID
  id: 
  # How many individuals did you spot?
  quantity: 
# Link this Sighting to a Photo, by its ID
photos: 
  - ${ sightingEntryObj.photoFileId }
# Include all the people that spotted this bird.
observers:
  - ${ sightingEntryObj.photographer }
location:
  area: 
`;

	if (sightingEntryObj.exif && sightingEntryObj.exif.latitude ) {
		fileString += `\
  latitude: ${ getGPSCoords( sightingEntryObj, 'latitude') }
  longitude: ${ getGPSCoords( sightingEntryObj, 'longitude') }
`;
	}

	return fileString;
}

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
sighting: ${ photoEntryObj.sightingFileId }
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
  latitude: ${ getGPSCoords( photoEntryObj, 'latitude') }
  longitude: ${ getGPSCoords( photoEntryObj, 'longitude') }
`
	}

	return fileString;
}

fs.readdir(sourcePhotosFolder, (errAuthor, entries) => {
	const authorNames = entries.filter(entry => {
		return fs.statSync(`${ sourcePhotosFolder }/${ entry }`).isDirectory();
	});
	authorNames.forEach(photographer => {
		fs.readdir(`${ sourcePhotosFolder }/${ photographer }`, (errPhotos, filenames) => {
			filenames.forEach(filename => {
				let photoPath = `${ sourcePhotosFolder }/${ photographer }/${ filename }`;
				fs.readFile(photoPath, (errFile, data) => {
					const { ctime } = fs.statSync(photoPath);
					exifr.parse(data).then(exif => {
						const createdDate = exif ? exif.DateTimeOriginal : new Date(ctime);
						const createdDateString = createdDate.toISOString();
						const filenamePattern = `${ createdDateString }_${ photographer }`;
						const targetPhotoFile = `${ targetPhotosFolder }/${ filenamePattern }.yml`;
						const targetSightingFile = `${ targetSightingsFolder }/${ filenamePattern }.yml`;
						const targetEXIFFile = `${ targetEXIFFolder }/${ photographer }/${ filename }.yml`;

						if (!fs.existsSync(targetEXIFFile)) {
							fs.writeFileSync(targetEXIFFile, createEXIFYML(exif));

							if (!fs.existsSync(targetPhotoFile)) {
								let photoEntryObj = {
									filename,
									photographer,
									exif,
									createdDate,
									sightingFileId: filenamePattern,
								}
								fs.writeFileSync(targetPhotoFile, createPhotoYML(photoEntryObj));
							}

							if (!fs.existsSync(targetSightingFile)) {
								let sightingEntryObj = {
									photographer,
									exif,
									createdDate,
									photoFileId: filenamePattern,
								}
								fs.writeFileSync(targetSightingFile, createSightingYML(sightingEntryObj));
							}
						}
						
					});
				});
			});
		});
	});
});


