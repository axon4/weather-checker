import path from 'path';
import dotEnv from 'dotenv';
import { fastify } from 'fastify';
import formBody from '@fastify/formbody';
import staticFiles from '@fastify/static';
import nunJucks from 'nunjucks';

dotEnv.config();

const environment = process.env.NODE_ENV;

const templates = new nunJucks.Environment(new nunJucks.FileSystemLoader('templates'));

const server = fastify({logger: true});

server.register(formBody);
server.register(staticFiles, {root: path.join(__dirname, '../../dist')});

const getWeatherCodeImage = (code: number): string => {
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