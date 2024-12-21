export default function () {
	return {
		name: process.env.ENVIRONMENT || 'development',
		baseURL: process.env.BASE_URL || 'https://ndorfin.github.io/birds-of-zevenwacht/',
		timestamps: {
			css: 1734621990411,
			html: 1734619420205,
			json: 1734619420205,
			libJS: 1734619420205,
			mjs: 1734619420205,
			static: 1734619420205,
		},
	};
}