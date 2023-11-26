import geoCode, { Location } from './geoCode';
import weather from './weather';

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

		console.log(`fetching weather-foreCast for: ${location.name}...\n`);

		try {
			const foreCast = await weather(location.latitude, location.longitude);

			console.log(foreCast.forMat());
		} catch (error) {
			console.error(error);

			return 1;
		};

		return 0;
	};
};

main().catch(console.error);