import axios from 'axios';

export interface Location {
	name: string;
	latitude: string;
	longitude: string;
};

interface GeoCodeResponse {
	display_name: string;
	lat: string;
	lon: string;
};

async function geoCode(query: string): Promise<Location> {
	const response = await axios.request<GeoCodeResponse[]>({
		method: 'GET',
		url: 'https://geocode.maps.co/search',
		params: {
			q: query
		}
	});

	if (response.status === 200) {
		if (response.data.length > 0) {
			const { display_name, lat, lon } = response.data[0];

			return {
				name: display_name,
				latitude: lat,
				longitude: lon
			};
		} else throw new Error(`failed to fetch geoCoded-location for ${query}`);
	} else throw new Error('failed to query geoCode-API');
};

export default geoCode;