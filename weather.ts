import { z } from 'zod';
import { AxiosStatic } from 'axios';

const weatherCodes: Record<number, string> = {
	0: 'Clear Sky',
	1: 'Mainly Clear',
	2: 'Partly Cloudy',
	3: 'OverCast',
	45: 'Fog',
	48: 'Depositing Rime-Fog',
	51: 'Light Drizzle',
	53: 'Moderate Drizzle',
	55: 'Dense Drizzle',
	56: 'Light Freezing-Drizzle',
	57: 'Dense Freezing-Drizzle',
	61: 'Light Rain',
	63: 'Moderate Rain',
	65: 'Heavy Rain',
	66: 'Light Freezing-Rain',
	67: 'Heavy Freezing-Rain',
	71: 'Slight Snow-Fall',
	73: 'Moderate Snow-Fall',
	75: 'Heavy Snow-Fall',
	77: 'Snow-Grains',
	80: 'Slight Rain-Showers',
	81: 'Moderate Rain-Showers',
	82: 'Violent Rain-Showers',
	85: 'Slight Snow-Showers',
	86: 'Heavy Snow-Showers',
	95: 'Moderate ThunderStorm',
	96: 'ThunderStorm with Slight Hail',
	99: 'ThunderStorm with Heavy Hail'
};

const WeatherResponseSchema = z.object({
	current_weather: z.object({
		time: z.string(),
		is_day: z.number(),
		temperature: z.number(),
		weathercode: z.number(),
		windspeed: z.number(),
		winddirection: z.number()
	}),
	hourly: z.object({
		temperature_2m: z.array(z.number())
	}),
	hourly_units: z.object({
		temperature_2m: z.string()
	})
});

type WeatherResponse = z.infer<typeof WeatherResponseSchema>;

export interface Temperature {
	value: number;
	unit: string;
};

function forMatTemperature(temperature: Temperature): string {
	return `${temperature.value}${temperature.unit}`;
};

export interface Wind {
	speed: number;
	direction: number;
	unit: string;
};

function forMatWindSpeed(wind: Wind): string {
	return `${wind.speed}${wind.unit}`;
};

class Weather {
	constructor(weatherResponse: WeatherResponse) {
		this.time = weatherResponse.current_weather.time;
		this.dayLight = weatherResponse.current_weather.is_day === 1;
		this.temperature = {
			value: weatherResponse.current_weather.temperature,
			unit: weatherResponse.hourly_units.temperature_2m
		};
		this.hourlyTemperature = weatherResponse.hourly.temperature_2m;
		this.weathercode = weatherResponse.current_weather.weathercode;
		this.wind = {
			speed: weatherResponse.current_weather.windspeed,
			direction: weatherResponse.current_weather.winddirection,
			unit: 'mph'
		};
	};

	time: string;
	dayLight: boolean;
	temperature: Temperature;
	hourlyTemperature: number[];
	weathercode: number;
	wind: Wind;

	get condition() {
		return weatherCodes[this.weathercode];
	};

	forMat() {
		const descriptionLength = 16;

		const temperature = 'Temperature'.padStart(descriptionLength, '');
		const windSpeed = 'Wind-Speed'.padStart(descriptionLength, '');
		const condition = 'Condition'.padStart(descriptionLength, '');
		const dateTime = 'DateTime'.padStart(descriptionLength, '');

		const forMattedStrings = [
			`${temperature}: ${forMatTemperature(this.temperature)}`,
			`${windSpeed}: ${forMatWindSpeed(this.wind)}`,
			`${condition}: ${this.condition}`,
			`${dateTime}: ${(this.time.replace('T', ' ').replace(/-/g, '/'))}`
		];

		return forMattedStrings.join('\n');
	};

	lowestTemperature(): number {
		return this.hourlyTemperature.reduce((accumulator, current) => Math.min(accumulator, current));
	};

	highestTemperature(): number {
		return this.hourlyTemperature.reduce((accumulator, current) => Math.max(accumulator, current));
	};
};

async function weather(fetcher: AxiosStatic, latitude: number, longitude: number): Promise<Weather> {
	const response = await fetcher.request({
		method: 'GET',
		url: 'https://api.open-meteo.com/v1/forecast',
		params: {
			latitude,
			longitude,
			current_weather: true,
			temperature_unit: 'celsius',
			windspeed_unit: 'mph',
			hourly: 'temperature_2m',
			forecast_days: 1
		}
	});

	if (response.status === 200) {
		try {
			const data = WeatherResponseSchema.parse(response.data);

			return new Weather(data);
		} catch (error) {
			throw new Error(`failed to fetch weather for: ${latitude}, ${longitude}`);
		};
	} else throw new Error('failed to query weather-API');
};

export default weather;