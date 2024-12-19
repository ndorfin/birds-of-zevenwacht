import terser from '@rollup/plugin-terser';
import fs from 'node:fs';

export default {
	input: './src/assets/mjs/index.mjs',
	output: {
		file: './src/assets/mjs/bundle.mjs',
		format: 'es'
	},
	plugins: [
		terser(),
		{
			name: 'closeBundle',
			closeBundle() {
				// Update timestamp
				const environmentFilePath = './src/_data/environment.mjs';
				let environmentFileContent = fs.readFileSync(environmentFilePath, 'utf8');
				let newContent = environmentFileContent.replace(/timestampMJSBuild: [\d]+/g, `timestampMJSBuild: ${ new Date().valueOf() }`);
				fs.writeFileSync(environmentFilePath, newContent);
				console.log(environmentFilePath + ' updated');
			}
		},
	]
};