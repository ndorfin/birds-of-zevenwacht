import { Octokit } from 'https://esm.sh/@octokit/core';
import getPAT from './lib/get-pat.mjs';
import createSightingBlob from './lib/create-sighting-blob.mjs';

async function makeCommit(blob) {
	const octokit = new Octokit({ 
		auth: getPAT(),
	});
	const commitDate = new Date();
	const commitDateISOFormatted = commitDate.toISOString().substring(0,16).replace(':', '_');	

	await octokit.request('PUT /repos/ndorfin/birds-of-zevenwacht/contents/{path}', {
		headers: {
			'X-GitHub-Api-Version': '2022-11-28'
		},
		branch: 'online-sightings',
		path: `src/_data/sightings/${ commitDateISOFormatted }.yml`,
		message: `Sighting added: ${ commitDateISOFormatted }`,
		content: `${ blob }`,
	});
}


const handleSubmit = (event) => {
	event.preventDefault();
	let formData = new FormData(event.target);
	let base64Blob = createSightingBlob(formData);
	if (base64Blob) {
		makeCommit(base64Blob);
	} else {
		window.alert('File creation failed')
	}
}

document.addEventListener('submit', handleSubmit);