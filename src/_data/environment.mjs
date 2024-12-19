export default function () {
	return {
		name: process.env.ENVIRONMENT || 'development',
		baseURL: process.env.BASE_URL || 'https://ndorfin.github.io/birds-of-zevenwacht/',
		timestampCSSBuild: 1734615575046,
		timestampMJSBuild: 1734615280277,
	};
}