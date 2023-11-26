import axios from 'axios';

const weatherCodes: Record<number, string> = {
	0: 'clear sky',
	1: 'mainly clear',
	2: 'partly cloudy',
	3: 'overCast',
	45: 'fog',
	48: 'depositing rime-fog',
	51: 'light drizzle',
	53: 'moderate drizzle',
	55: 'dense drizzle',
	56: 'light freezing-drizzle',
	57: 'dense freezing-drizzle',
	61: 'light rain',
	63: 'moderate rain',
	65: 'heavy rain',
	66: 'light freezing-rain',
	67: 'heavy freezing-rain',
	71: 'slight snow-fall',
	73: 'moderate snow-fall',
	75: 'heavy snow-fall',
	77: 'snow-grains',
	80: 'slight rain-showers',
	81: 'moderate rain-showers',
	82: 'violent rain-showers',
	85: 'slight snow-showers',
	86: 'heavy snow-showers',
	95: 'moderate thunderStorm',
	96: 'thunderStorm with slight hail',
	99: 'thunderStorm with heavy hail'
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

		const temperature = 'Temperature'.padStart(descriptionLength, ' ');
		const windSpeed = 'Wind-Speed'.padStart(descriptionLength, ' ');
		const condition = 'Condition'.padStart(descriptionLength, ' ');

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