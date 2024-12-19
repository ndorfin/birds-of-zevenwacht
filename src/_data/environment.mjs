export default function () {
	return {
		name: process.env.ENVIRONMENT || 'development',
		baseURL: process.env.BASE_URL || 'https://ndorfin.github.io/birds-of-zevenwacht/',
		timestampCSSBuild: 1734612905732,
		timestampMJSBuild: 1734613824065,
	};
}