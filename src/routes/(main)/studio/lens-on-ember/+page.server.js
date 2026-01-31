import { env } from '$env/dynamic/public';

export async function load({ fetch }) {
	const baseUrl = env.PUBLIC_EMBER_BRIDGE_API;

	if (!baseUrl) {
		return { countries: [], error: 'Ember Bridge API not configured' };
	}

	try {
		const response = await fetch(`${baseUrl}/api/countries`);
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		/** @type {EmberCountry[]} */
		const countries = await response.json();
		return { countries };
	} catch (error) {
		console.error(error);
		return { countries: [], error: 'Unable to fetch countries' };
	}
}
