import { env } from '$env/dynamic/public';

export async function GET({ fetch, setHeaders }) {
	setHeaders({
		'cache-control': 'max-age=300' // 5 mins = 300secs
	});

	if (!env.PUBLIC_FLOWS_API) {
		return Response.json(
			{ error: 'Flows API not configured (missing PUBLIC_FLOWS_API).' },
			{ status: 501 }
		);
	}

	const headers = env.PUBLIC_API_KEY ? { Authorization: `Bearer ${env.PUBLIC_API_KEY}` } : undefined;
	const response = await fetch(`${env.PUBLIC_FLOWS_API}/nem`, { headers });

	if (response.ok) {
		const data = await response.json();
		return Response.json(data);
	}

	return Response.json({ error: 'Error reading from flows API.' }, { status: 500 });
}
