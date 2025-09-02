import path from 'node:path';
import fs from 'node:fs';
import exifr from 'exifr';
import sharp from 'sharp';
import { 
	createEXIFYML,
	createPhotoYML,
	createSightingYML
} from './lib/yaml_templates.mjs';

const dumpFolder = path.resolve('dump');
const sourcePhotosFolder = path.resolve('src/_data/source_photos');
const targetPhotosFolder = path.resolve('src/_data/photos');
const targetSightingsFolder = path.resolve('src/_data/sightings');
const targetEXIFFolder = path.resolve('src/_data/exifs');

fs.readdir(dumpFolder, (errAuthor, entries) => {
	const authorNames = entries.filter(entry => {
		return fs.statSync(`${ dumpFolder }/${ entry }`).isDirectory();
	});
	authorNames.forEach(photographer => {
		fs.readdir(`${ dumpFolder }/${ photographer }`, (errPhotos, filenames) => {
			filenames.forEach(filename => {
				if (filename.includes('.DS_Store')) return;
				console.log('filename', filename)
				let photoPath = `${ dumpFolder }/${ photographer }/${ filename }`;
				let targetPhotoPath = `${ sourcePhotosFolder }/${ photographer }/${ filename }`
				
				// Step 1: Transform
				// ==============================================
				// Save a smaller copy in the `source_photos` folder
				// We'll use this later to generate images using `eleventy-img`
				const imageToProcess = sharp(photoPath)
				
				imageToProcess
					.metadata()
					.then(metadata => {
						if (metadata.width < 2400) {
							return imageToProcess
								.withMetadata()
								.toFile(targetPhotoPath);
						} else {
							return imageToProcess
								.resize({width: 2400})
								.withMetadata()
								.toFile(targetPhotoPath);
						}
					}).finally(() => {
						fs.readFile(photoPath, (errFile, data) => {
						// Step 2: Generate EXIF data entry
						// ==============================================
						const { ctime, birthtime } = fs.statSync(photoPath);
						exifr.parse(data).then(exif => {
							const createdDate = (exif && exif.DateTimeOriginal) ? exif.DateTimeOriginal : new Date(birthtime);
							const createdDateString = createdDate.toISOString();
							const filenamePattern = `${ createdDateString }_${ photographer }`;
							const targetPhotoFile = `${ targetPhotosFolder }/${ filenamePattern }.yml`;
							const targetSightingFile = `${ targetSightingsFolder }/${ filenamePattern }.yml`;
							const targetEXIFFile = `${ targetEXIFFolder }/${ photographer }/${ filename }.yml`;

							if (!fs.existsSync(targetEXIFFile)) {
								if (exif && exif.DateTimeOriginal) {
									fs.writeFileSync(targetEXIFFile, createEXIFYML(exif));
								}

								// Step 3: Create photo data entry
								// ==============================================
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

								// Step 4: Create sighting data entry
								// ==============================================
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
});
