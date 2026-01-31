import { error } from '@sveltejs/kit';
import { createClient } from '@sanity/client';
import { env as publicEnv } from '$env/dynamic/public';
import { env as privateEnv } from '$env/dynamic/private';

const hasDraftsConfig = Boolean(
	publicEnv.PUBLIC_SANITY_PROJECT_ID && publicEnv.PUBLIC_SANITY_DATASET && privateEnv.SANITY_TOKEN
);

const client = hasDraftsConfig
	? createClient({
			projectId: publicEnv.PUBLIC_SANITY_PROJECT_ID,
			dataset: publicEnv.PUBLIC_SANITY_DATASET,
			apiVersion: '2025-04-30',
			useCdn: false,
			perspective: 'drafts',
			token: privateEnv.SANITY_TOKEN
		})
	: null;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	if (!client) {
		error(501, 'Article drafts require SANITY_TOKEN and PUBLIC_SANITY_* env vars');
	}

	const data = await client.fetch(
		`*[_type == "article"] | order(publish_date desc){_id, title, content, slug, publish_date, cover, article_type, region, fueltech, summary, author[]->, tags[]->}`
	);

	if (data) {
		return {
			articles: data.filter((d) => d.article_type !== null),
			drafts: data
		};
	}

	error(404, 'Not found');
}
