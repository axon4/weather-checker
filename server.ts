import path from 'path';
import dotEnv from 'dotenv';
import { fastify } from 'fastify';
import formBody from '@fastify/formbody';
import staticFiles from '@fastify/static';
import axios from 'axios';
import { z } from 'zod';
import nunJucks from 'nunjucks';
import geoCode from './geoCode';
import weather from './weather';

dotEnv.config();

const environment = process.env.NODE_ENV;
const server = fastify({logger: true});
const templates = new nunJucks.Environment(new nunJucks.FileSystemLoader('templates'));

server.register(formBody);
server.register(staticFiles, {root: path.join(__dirname, '../../dist')});

const locationSchema = z.object({
	query: z.string()
});

function getWeatherCodeImage(code: number): string {
	switch (code) {
		case 0: return '/images/clear.svg';

		case 1: return '/images/clear.svg';

		case 2: return '/images/cloudy.svg';

		case 3: return '/images/overCast.svg';

		case 45: return '/images/fog.svg';

		case 48: return '/images/fog.svg';

		case 51: return '/images/drizzle.svg';

		case 53: return '/images/drizzle.svg';

		case 55: return '/images/drizzle.svg';

		case 56: return '/images/drizzle.svg';

		case 57: return '/images/drizzle.svg';

		case 61: return '/images/rain.svg';

		case 63: return '/images/rain.svg';

		case 65: return '/images/rain.svg';

		case 66: return '/images/rain.svg';

		case 67: return '/images/rain.svg';

		case 71: return '/images/snow.svg';

		case 73: return '/images/snow.svg';

		case 75: return '/images/snow.svg';

		case 77: return '/images/snow.svg';

		case 80: return '/images/rain.svg';

		case 81: return '/images/rain.svg';

		case 82: return '/images/rain.svg';

		case 85: return '/images/snow.svg';

		case 86: return '/images/snow.svg';

		case 95: return '/images/thunderStorm.svg';

		case 96: return '/images/thunderStorm.svg';

		case 99: return '/images/thunderStorm.svg';

		default: return '/images/information.svg';
	};
};

server.get('/', async (request, response) => {
	try {
		const { query } = locationSchema.parse(request.query);

		const location = await geoCode(axios, query);
		const foreCast = await weather(axios, location.latitude, location.longitude);

		const rendered = templates.render('weather.njk', {
			environment,
			location: location.name,
			currentDateTime: (new Date()).toLocaleDateString(),
			weather: {
				...foreCast,
				condition: foreCast.condition,
				conditionImage: getWeatherCodeImage(foreCast.weathercode),
				lowTemperature: foreCast.lowestTemperature,
				highestTemperature: foreCast.highestTemperature
			}
		});

		await response.header('Content-Type', 'text/html; charset=UTF-8').send(rendered);
	} catch (error) {
		console.error(error);

		const rendered = templates.render('home.njk', { environment });

		await response.header('Content-Type', 'text/html; charset=UTF-8').send(rendered);
	};
});

(async function (): Promise<void> {
	try {
		await server.listen({port: 3000});
	} catch (error) {
		server.log.error(error);
		process.exit(1);
	};
})();