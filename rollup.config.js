import {terser} from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';

const libs = ['dataset', 'classlist', 'css-vars', 'events', 'lazy-custom-elements', 'nuff'];
let selectedLib = '*';
for (const arg of process.argv) {
	if (arg.indexOf('--config_lib=') === 0) {
		selectedLib = arg.split('=')[1];
		if (libs.indexOf(selectedLib) < 0) {
			selectedLib = '*';
		}
		break;
	}
}
let builds = [];
for (const lib of libs) {
	if (selectedLib === '*' || selectedLib === lib) {
		builds = builds.concat([
			{in: lib, out: lib, format: 'cjs', min: false},
			{in: lib, out: lib + '.es', format: 'es', min: false},
			{in: lib, out: lib + '.es', format: 'es', min: true},
		]);
	}
}

export default builds.map((build) => {
	// const plugins = [];

	return {
		input: 'src/' + build.in + '.js',
		// plugins: plugins,
		output: {
			file: `dist/${build.out}${build.min ? '.min' : ''}.js`,
			name: 'nuff' + (build.in !== 'nuff' ? '.' + build.in : ''),
			format: build.format,
			sourcemap: true,
			plugins: (build.min ? [terser()] : []).concat([
				filesize({showMinifiedSize: false, showGzippedSize: build.min}),
			]),
		},
		watch: {
			exclude: 'node_modules/**',
		},
	};
});
