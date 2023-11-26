import axios from 'axios';

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

interface WeatherResponse {
	time: string;
	is_day: number;
	temperature: string;
	weathercode: number;
	windspeed: number;
	winddirection: number;
};

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
		this.time = weatherResponse.time;
		this.dayLight = weatherResponse.is_day === 1;
		this.temperature = {
			value: parseInt(weatherResponse.temperature),
			unit: 'C'
		};
		this.weathercode = weatherResponse.weathercode;
		this.wind = {
			speed: weatherResponse.windspeed,
			direction: weatherResponse.winddirection,
			unit: 'mph'
		};
	};

	time: string;
	dayLight: boolean;
	temperature: Temperature;
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

		const forMattedStrings = [
			`${temperature}: ${forMatTemperature(this.temperature)}`,
			`${windSpeed}: ${forMatWindSpeed(this.wind)}`,
			`${condition}: ${this.condition}`,
		];

		return forMattedStrings.join('\n');
	};
};

async function weather(latitude: number, longitude: number): Promise<Weather> {
	const response = await axios.request({
		method: 'GET',
		url: 'https://api.open-meteo.com/v1/forecast',
		params: {
			latitude,
			longitude,
			current_weather: true,
			temperature_unit: 'celsius',
			windspeed_unit: 'mph',
			hourly: 'temperature_2m'
		}
	});

	if (response.status === 200) {
		if (response.data?.current_weather) return new Weather(response.data.current_weather as WeatherResponse);
		else throw new Error(`failed to fetch weather for: ${latitude}, ${longitude}`);
	} else throw new Error('failed to query weather-API');
};

export default weather;