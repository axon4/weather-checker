import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import geoCode, { GEOCODE_URL } from './geoCode';

const MOCK_GEOCODE_API_RESPONSE = [
	{
		place_id: 286256198,
		licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
		powered_by: 'Map Maker: https://maps.co',
		osm_type: 'relation',
		osm_id: 207359,
		boundingbox: ['51.2867601', '51.6918741', '-0.5103751', '0.3340155'],
		lat: '51.5073219',
		lon: '-0.1276474',
		display_name: 'London, City of London, Greater London, England, United Kingdom',
		class: 'amenity',
		type: 'administrative',
		importance: 0.7478636922747882
	},
	{
		place_id: 285931093,
		licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
		powered_by: 'Map Maker: https://maps.co',
		osm_type: 'way',
		osm_id: 807458549,
		boundingbox: ['25.1505411', '25.3929701', '51.3957733', '51.6470846'],
		lat: '25.2856329',
		lon: '51.5264162',
		display_name: 'Doha, Qatar',
		class: 'boundary',
		type: 'capital',
		importance: 0.9407827616237295
	}
];

describe('GeoCode', () => {
	let fetcher: MockAdapter;

	beforeEach(() => {
		fetcher = new MockAdapter(axios);
	});

	it('transform API-response', async () => {
		fetcher
			.onGet(GEOCODE_URL, {
				params: {
					q: 'test'
				}
			})
			.reply(200, MOCK_GEOCODE_API_RESPONSE);

		await geoCode(axios, 'test');
	});

	it('throw if status-code is not 200', async () => {
		fetcher
			.onGet(GEOCODE_URL, {
				params: {
					q: 'test'
				}
			})
			.reply(400, MOCK_GEOCODE_API_RESPONSE);

		await expect(geoCode(axios, 'test')).rejects.toThrow();
	});

	it('throw if API-response changes', async () => {
		fetcher
			.onGet(GEOCODE_URL, {
				params: {
					q: 'test'
				}
			})
			.reply(200, {});

		await expect(geoCode(axios, 'test')).rejects.toThrow();
	});
});