import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const FALLBACK_JSON_API = 'https://data.openelectricity.org.au/v4/stats';

export async function GET({ fetch, url }) {
	let { searchParams } = url;
	let regionPath = searchParams.get('regionPath') || 'au/NEM';

	const baseUrl = env.PUBLIC_JSON_API || FALLBACK_JSON_API;
	let res = await fetch(`${baseUrl}/${regionPath}/power/7d.json`);

	if (res.ok) {
		let data = await res.json();
		return Response.json(data);
	}

	error(404, 'Not found');
}
