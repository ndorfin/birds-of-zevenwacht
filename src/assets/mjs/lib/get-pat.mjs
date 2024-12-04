const getPAT = () => {
	let lsItem = window.localStorage.getItem('PAT');
	if (lsItem) return lsItem;

	let promptedPAT = window.prompt('Please enter your PAT');
	if (promptedPAT) {
		window.localStorage.setItem('PAT', promptedPAT);
		return promptedPAT;
	}
};

export default getPAT;