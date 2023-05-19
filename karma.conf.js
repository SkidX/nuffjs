module.exports = function (config) {
	let coverage = true;
	let lib = '*';
	const libs = ['dataset', 'classlist', 'css-vars', 'events', 'lazy-custom-elements', 'nuff'];
	for (const arg of process.argv) {
		if (arg === '--noCoverage') {
			coverage = false;
		} else if (arg.indexOf('--lib=') === 0) {
			lib = arg.split('=')[1];
			if (libs.indexOf(lib) < 0) {
				lib = '*';
			}
		}
	}

	const rollupExportName = 'nuff';

	const srcFiles = ['src/nuff.js'];

	const testFiles = ['tests/' + lib + '*.test.js'];

	const rollupPlugins = [];

	const browsers = ['ChromeHeadless', 'FirefoxHeadless', 'EdgeHeadless'];
	const preprocessors = {};
	for (const testFile of testFiles) {
		preprocessors[testFile] = ['rollup', 'inject-html'];
	}
	for (const srcFile of srcFiles) {
		preprocessors[srcFile] = ['rollup', 'sourcemap', 'coverage'];
	}

	const coverageReporters = [{type: 'html', subdir: (browser) => browser.toLowerCase().split(/[ /-]/)[0]}];
	const reporters = ['progress', 'summary'];
	if (coverage) {
		coverageReporters.push({type: 'text'});
		reporters.push('coverage');
	}
	config.set({
		client: {
			// runInParent: true,
			// useIframe: false,
		},
		frameworks: ['jasmine', 'viewport'],
		browsers: browsers,
		files: srcFiles.concat(testFiles).map((file) => ({pattern: file, watched: false})),
		preprocessors: preprocessors,
		reporters: reporters,
		coverageReporter: {
			dir: './coverage',
			reporters: coverageReporters,
		},
		injectHtml: {
			file: 'tests/test.html',
		},
		rollupPreprocessor: {
			// rollup settings. See Rollup documentation
			plugins: rollupPlugins,
			output: {
				format: 'umd',
				name: rollupExportName,
				sourcemap: 'inline',
				sourcemapPathTransform: (relativeSourcePath, sourcemapPath) => {
					if (relativeSourcePath.indexOf('src') === 0) {
						relativeSourcePath = relativeSourcePath.substr(4);
					} else if (relativeSourcePath.indexOf('node_modules') === 0) {
						relativeSourcePath = '../' + relativeSourcePath;
					}
					return relativeSourcePath;
				},
			},
		},
		singleRun: false,
		// autoWatchBatchDelay: 1000,
		plugins: [
			'karma-inject-html',
			'@chiragrupani/karma-chromium-edge-launcher',
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-rollup-preprocessor',
			'karma-coverage',
			'karma-jasmine',
			'karma-sourcemap-loader',
			'karma-summary-reporter',
			'karma-viewport',
		],
	});
};
