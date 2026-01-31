import { env } from '$env/dynamic/public';

export function GET({ fetch }) {
	if (!env.PUBLIC_RECORDS_API) {
		return Response.json(
			{ error: 'Records API not configured (missing PUBLIC_RECORDS_API).' },
			{ status: 501 }
		);
	}

	const path = `${env.PUBLIC_RECORDS_API}/metadata`;

	return fetch(path);
}
