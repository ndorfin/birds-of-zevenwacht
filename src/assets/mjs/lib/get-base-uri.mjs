export default function getBaseURI() {
	if (window.location.href.indexOf('/birds-of-zevenwacht/') > -1) {
		return '/birds-of-zevenwacht/';
	} else {
		return '/'
	}
}