import { Octokit } from 'https://esm.sh/@octokit/core';

const getPAT = () => {
	let lsItem = window.localStorage.getItem('PAT');
	if (lsItem) return lsItem;

	let promptedPAT = window.prompt('Please enter your PAT');
	if (promptedPAT) {
		window.localStorage.setItem('PAT', promptedPAT);
		return promptedPAT;
	}
};

const octokit = new Octokit({ 
	auth: getPAT(),
});
const commitDate = new Date();
const commitDateISOFormatted = commitDate.toISOString().substring(0,16).replace(':', '_');

/*
const { data } = await octokit.request('GET /repos/ndorfin/birds-of-zevenwacht/commits', {
	owner: 'ndorfin',
	repo: 'birds-of-zevenwacht',
	headers: {
		'X-GitHub-Api-Version': '2022-11-28'
	}
});

await octokit.request('PUT /repos/ndorfin/birds-of-zevenwacht/contents/{path}', {
	headers: {
		'X-GitHub-Api-Version': '2022-11-28'
	},
	path: `src/_data/sightings/${ commitDateISOFormatted }.yml`,
	message: `Sighting added: ${ commitDateISOFormatted }`,
	branch: 'online-sightings',
	content: `
ZGF0ZXRpbWU6IDIwMjQtMTEtMThUMTc6MDArMDI6MDAKZGVzY3JpcHRpb246IHwt
CiAgSnVzdCBhZnRlciB3ZSBzZXQgb3V0IGZvciBvdXIgcmVndWxhciB3YWxrLCB3
ZSBzcG90dGVkIHVudXN1YWwgc21hbGwgYmlyZHMuIEFzIHBlciB1c3VhbCwgaXQg
bXVzdCBoYXZlIGJlZW4gYmVjYXVzZSB3ZSBkaWRuJ3QgaGF2ZSB0aGUgY2FtZXJh
IHdpdGggdXMhCiAgQSBzbWFsbCBmbG9jayBvZiBmaW5jaC1zaXplZCBiaXJkcyB3
ZXJlIGZseWluZyBmcm9tIGJ1c2ggdG8gYnVzaCBhbG9uZyB0aGUgaG91c2luZyBl
c2F0YXRlJ3MgZmVuY2UuCmJpcmQ6CiAgaWQ6IHdheGJpbGwtY29tbW9uCiAgcXVh
bnRpdHk6IDYtOQpvYnNlcnZlcnM6CiAgLSBzaGF1bgogIC0gaW5ndW5uCmxvY2F0
aW9uOgogIGFyZWE6IHpldmVud2FjaHQtY291bnRyeS1lc3RhdGUKICBsYXRpdHVk
ZTogLTMzLjkzNjAzMwogIGxvbmdpdHVkZTogMTguNzE1MTE2
`, // Base64 encoded blob
});
*/

console.log('data', data);