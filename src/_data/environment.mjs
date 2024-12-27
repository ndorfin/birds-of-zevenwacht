export default function () {
	return {
		name: process.env.ENVIRONMENT || 'development',
		baseURL: process.env.BASE_URL || 'https://ndorfin.github.io/birds-of-zevenwacht/',
		timestamps: {
			css: 1735225223220,
			html: 1734619420208,
			json: 1734619420205,
			libJS: 1734619420205,
			mjs: 1735292839383,
			static: 1734619420205,
		},
	};
}