export default function getBaseURI() {
	if (window.location.href.includes('/birds-of-zevenwacht/')) {
		return '/birds-of-zevenwacht/';
	} else {
		return '/'
	}
}