import { env } from '$env/dynamic/private';

export async function GET({ url }) {
	if (!env.CLOUDFLARE_WORKER_URL) {
		return new Response('Record preview not configured', { status: 501 });
	}

	const { searchParams } = url;
	const key = searchParams.get('key');

	if (!key) {
		return new Response('No key provided', { status: 400 });
	}

	const res = await fetch(`${env.CLOUDFLARE_WORKER_URL}/?key=${key}`);

	if (res.ok) {
		const blob = await res.blob();
		return new Response(blob);
	}

	return new Response('Error', { status: 500 });
}
