import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import TailWindCSS from 'tailwindcss';
import PostCSS from 'postcss';
import autoPreFixer from 'autoprefixer';

const inPutPath = './templates/style.css';
const outPutPath = './build/style.css';
const buildFolder = './build';
const inPut = fs.readFileSync(inPutPath, 'utf-8');

PostCSS([TailWindCSS, autoPreFixer]).process(inPut, {
	from: inPutPath,
	to: outPutPath
})
	.then(outPut => {
		if (!fs.existsSync(buildFolder)) fs.mkdirSync(buildFolder);

		fs.writeFileSync(outPutPath, outPut.content);
	})
	.catch(console.error);

function copyFiles(pattern: string, destination: string): void {
	const files = globSync(pattern);

	files.forEach(file => {
		const fileName = path.basename(file);
		const destinationPath = path.join(destination, fileName);

		for (let i = 1; i < 3; i++) {
			try {
				fs.copyFileSync(file, destinationPath);
				console.log(`copy: '${file}' -> '${destinationPath}'`);
			} catch (error: any) {
				if (error.code === 'ENOENT') {
					const parent = path.dirname(destinationPath);

					fs.mkdirSync(parent, {recursive: true});

					continue;
				} else {
					console.error(error);

					break;
				};
			};
		};
	});
};

copyFiles('./favicon.ico', './build/');
copyFiles('./images/*.svg', './build/images/');