import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const FALLBACK_JSON_API = 'https://data.openelectricity.org.au/v4/stats';

export async function GET({ fetch, setHeaders }) {
	setHeaders({
		'cache-control': 'max-age=1800' // 30 mins
	});

	const baseUrl = env.PUBLIC_JSON_API || FALLBACK_JSON_API;
	const res = await fetch(`${baseUrl}/au/NEM/power/7d.json`);

	if (res.ok) {
		const { data } = await res.json();
		return Response.json(
			data.filter((/** @type {StatsData} */ d) => d.fuel_tech && d.type === 'power')
		);
	}

	error(404, 'Not found');
}
