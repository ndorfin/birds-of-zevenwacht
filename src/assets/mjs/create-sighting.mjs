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

const toggleButtonStates = (nodeList) => {
	for (let button of nodeList) {
		button.disabled = !!button.disabled;
	}
}

const handleSubmit = (event) => {
	event.preventDefault();
	const formElem = event.target.closest('form');
	const formButtons = formElem.querySelectorAll('button');
	const formData = new FormData(formElem);
	
	toggleButtonStates(formButtons);
	
	let base64Blob = createSightingBlob(formData);
	if (base64Blob) {
		makeCommit(base64Blob).then(() => {
			formElem.reset();
			window.alert('Sighting submitted, thanks!');
			toggleButtonStates(formButtons);
		});
	} else {
		window.alert('File creation failed');
		toggleButtonStates(formButtons);
	}
	
}

document.addEventListener('submit', handleSubmit);