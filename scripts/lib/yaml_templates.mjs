function getGPSCoords(exifObj, type) {
	if (exifObj[type])
		return exifObj[type];

	let titleCase = `${ type.charAt(0).toUpperCase() }${ type.substring(1) }`;
	
	if (exifObj[`GPS${ titleCase }`])
		return exifObj[`GPS${ titleCase }`];

	return '';
}

export default function createEXIFYML(exifEntryObj) {
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

export function createSightingYML(sightingEntryObj) {
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

export function createPhotoYML(photoEntryObj) {
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