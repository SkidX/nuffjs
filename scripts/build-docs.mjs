import jsdoc2md from 'jsdoc-to-markdown';
import fs from 'fs';

const srcFiles = ['lazy-custom-elements', 'events', 'classlist', 'dataset', 'css-vars'];

for (const file of srcFiles) {
	const md = jsdoc2md.renderSync({
		files: [`src/${file}.js`],
		'heading-depth': 1,
		plugin: ['dmd-readable'],
	});
	fs.writeFileSync(`docs/${file}.md`, md);
}
