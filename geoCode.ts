import { z } from 'zod';
import { AxiosStatic } from 'axios';

export interface Location {
	name: string;
	latitude: number;
	longitude: number;
};

const GeoCodeResponseSchema = z.object({
	display_name: z.string(),
	lat: z.string(),
	lon: z.string()
});

export const GEOCODE_URL = 'https://geocode.maps.co/search';

async function geoCode(fetcher: AxiosStatic, query: string): Promise<Location> {
	const response = await fetcher.request({
		method: 'GET',
		url: GEOCODE_URL,
		params: {
			q: query
		}
	});

	if (response.status === 200) {
		try {
			const { display_name, lat, lon } = GeoCodeResponseSchema.parse(response.data[0]);

			return {
				name: display_name,
				latitude: parseInt(lat),
				longitude: parseInt(lon)
			};
		} catch (error) {
			throw new Error(`failed to fetch geoCoded-location for: ${query}`);
		};
	} else throw new Error('failed to query geoCode-API');
};

export default geoCode;