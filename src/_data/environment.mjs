export default function () {
	return {
		name: process.env.ENVIRONMENT || 'development',
		baseURL: process.env.BASE_URL || 'https://ndorfin.github.io/birds-of-zevenwacht/',
		timestampCSSBuild: 1734614998677,
		timestampMJSBuild: 1734614971640,
	};
}