export default function () {
	return {
		name: process.env.ENVIRONMENT || 'development',
		timestamp: new Date().valueOf(),
	};
}