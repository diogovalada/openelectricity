import { env } from '$env/dynamic/public';

export async function GET({ params, url, fetch, setHeaders }) {
	setHeaders({
		'cache-control': 'max-age=0'
	});

	if (!env.PUBLIC_RECORDS_API) {
		return Response.json(
			{ error: 'Records API not configured (missing PUBLIC_RECORDS_API).' },
			{ status: 501 }
		);
	}

	const { searchParams } = url;
	const recordId = params.id;
	const page = searchParams.get('page');
	const pageSize = searchParams.get('pageSize');
	let pageParams = '';

	if (page) {
		pageParams = `&page=${page}`;
	}

	if (pageSize) {
		pageParams = `${pageParams}&limit=${pageSize}`;
	}

	const path = `${env.PUBLIC_RECORDS_API}/history/${recordId}?${pageParams}`;

	console.log('path', path);

	const headers = env.PUBLIC_API_KEY ? { Authorization: `Bearer ${env.PUBLIC_API_KEY}` } : undefined;
	const response = await fetch(path, { headers });
	if (response.ok) {
		const data = await response.json();
		return Response.json(data);
	}

	return Response.json({ error: 'Error reading from milestones API.' }, { status: 200 });
}
