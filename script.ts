import geoCode, { Location } from './geoCode';

async function main(): Promise<0 | 1> {
	if (process.argv.length !== 3) {
		console.error('inCorrect syntax');

		return 1;
	} else {
		const query = process.argv[2];
		let location: Location;

		try {
			location = await geoCode(query);
		} catch (error) {
			console.error(error);

			return 1;
		};

		console.log(location);

		return 0;
	};
};

main().catch(console.error);