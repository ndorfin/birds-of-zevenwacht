export default function () {
	return {
		name: process.env.ENVIRONMENT || 'development',
		baseURL: process.env.BASE_URL || 'https://ndorfin.github.io/birds-of-zevenwacht/',
		timestamps: {
			timestampCSSBuild: 1735225223220,
			html: 1734619420208,
			json: 1734619420205,
			libJS: 1734619420205,
			mjs: 1734875346751,
			static: 1734619420205,
		},
	};
}