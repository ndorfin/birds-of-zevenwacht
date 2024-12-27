// dependencies
const fs = require('fs');
const cssnano = require('cssnano');
const postcss = require('postcss');
const atImport = require('postcss-import');
const url = require("postcss-url")

// css to be processed
const css = fs.readFileSync('./src/assets/css/index.css', 'utf8');

// process css
postcss([cssnano({ preset: require('cssnano-preset-default') })])
  .use(atImport())
	// .use(url([
  //   // using custom function to build url
  //   { filter: '**/img/*.svg', url: (asset) => asset.originUrl.replace('../../img', '../img') }
	// ]))
  .process(css, {
    // `from` option is needed here
    from: './src/assets/css/index.css',
  })
  .then((result) => {
    const output = result.css;
		fs.writeFile('./src/assets/css/all.css', output, err => {
			if (err) {
				console.error(err);
			} else {
				console.log('/src/assets/css/all.css created');
			}
		});
  })
	.then(() => {
		// Update timestamp
		const environmentFilePath = './src/_data/environment.mjs';
		let environmentFileContent = fs.readFileSync(environmentFilePath, 'utf8');
		let newContent = environmentFileContent.replace(/css: [\d]+/g, `css: ${ new Date().valueOf() }`);
		fs.writeFileSync(environmentFilePath, newContent);
		console.log(environmentFilePath + ' updated');
	});

