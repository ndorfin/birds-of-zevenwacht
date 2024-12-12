export default function () {
	return {
		name: process.env.ENVIRONMENT || "development",
	};
}