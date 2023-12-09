import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { strict as assert } from 'assert';
import weather, { WEATHER_URL, Weather, WeatherResponseSchema } from './weather';

const MOCK_WEATHER_API_RESPONSE = {
	latitude: 51.16438,
	longitude: -2.3841858e-7,
	generationtime_ms: 0.06902217864990234,
	utc_offset_seconds: 0,
	timezone: 'GMT',
	timezone_abbreviation: 'GMT',
	elevation: 30,
	current_weather: {
		time: '2023-12-09T12:15',
		temperature: 13.9,
		windspeed: 15.7,
		winddirection: 246,
		is_day: 1,
		weathercode: 2
	},
	hourly_units: {
		time: 'iso8601',
		temperature_2m: '°C'
	},
	hourly: {
		time: [
			'2023-05-13T00:00', '2023-05-13T01:00',
			'2023-05-13T02:00', '2023-05-13T03:00',
			'2023-05-13T04:00', '2023-05-13T05:00',
			'2023-05-13T06:00', '2023-05-13T07:00',
			'2023-05-13T08:00', '2023-05-13T09:00',
			'2023-05-13T10:00', '2023-05-13T11:00',
			'2023-05-13T12:00', '2023-05-13T13:00',
			'2023-05-13T14:00', '2023-05-13T15:00',
			'2023-05-13T16:00', '2023-05-13T17:00',
			'2023-05-13T18:00', '2023-05-13T19:00',
			'2023-05-13T20:00', '2023-05-13T21:00',
			'2023-05-13T22:00', '2023-05-13T23:00'
		],
		temperature_2m: [7.8, 10.1, 10.2, 10, 10.2, 10, 10, 9.9, 9.6, 9.6, 9.8, 10.5, 13, 13.8, 13.9, 13.2, 12.1, 10.3, 9.5, 9.2, 9.1, 9, 8.8, 8.9, 8.6, 19.4]
	}
};

describe('Weather', () => {
	let fetcher: MockAdapter;

	beforeEach(() => {
		fetcher = new MockAdapter(axios);
	});

	it('transform API-response', async () => {
		fetcher
			.onGet(WEATHER_URL, {
				params: {
					latitude: 0.0,
					longitude: 0.0,
					current_weather: true,
					temperature_unit: 'celsius',
					windspeed_unit: 'mph',
					hourly: 'temperature_2m',
					forecast_days: 1
				}
			})
			.reply(200, MOCK_WEATHER_API_RESPONSE);

		await weather(axios, 0.0, 0.0);
	});

	it('throw if status-code is not 200', async () => {
		fetcher
			.onGet(WEATHER_URL, {
				params: {
					latitude: 0.0,
					longitude: 0.0,
					current_weather: true,
					temperature_unit: 'celsius',
					windspeed_unit: 'mph',
					hourly: 'temperature_2m',
					forecast_days: 1
				}
			})
			.reply(400, MOCK_WEATHER_API_RESPONSE);

		await expect(weather(axios, 0.0, 0.0)).rejects.toThrow();
	});

	it('throw if API-response changes', async () => {
		fetcher
			.onGet(WEATHER_URL, {
				params: {
					latitude: 0.0,
					longitude: 0.0,
					current_weather: true,
					temperature_unit: 'celsius',
					windspeed_unit: 'mph',
					hourly: 'temperature_2m',
					forecast_days: 1
				}
			})
			.reply(200, {});

		await expect(weather(axios, 0.0, 0.0)).rejects.toThrow();
	});

	it('calculate lowest temperature', async () => {
		const response = WeatherResponseSchema.parse(MOCK_WEATHER_API_RESPONSE);
		const weather = new Weather(response);

		assert.equal(weather.lowestTemperature, 7.8);
	});

	it('calculate highest temperature', async () => {
		const response = WeatherResponseSchema.parse(MOCK_WEATHER_API_RESPONSE);
		const weather = new Weather(response);

		assert.equal(weather.highestTemperature, 19.4);
	});

	it('get condition', async () => {
		const response = WeatherResponseSchema.parse(MOCK_WEATHER_API_RESPONSE);
		const weather = new Weather(response);

		assert.equal(weather.condition, 'Partly Cloudy');
	});
});