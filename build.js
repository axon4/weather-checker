const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

function copyFiles(pattern, destination) {
	const files = globSync(pattern);

	files.forEach(file => {
		const fileName = path.basename(file);
		const destinationPath = path.join(destination, fileName);

		for (let i = 1; i < 3; i++) {
			try {
				fs.copyFileSync(file, destinationPath);
				console.log(`copy: '${file}' -> '${destinationPath}'`);
			} catch (error) {
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

fs.mkdirSync('./dist', {recursive: true});

copyFiles('favicon.ico', 'dist/');
copyFiles('images/*.svg', 'dist/images/');