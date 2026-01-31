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
export async function load({ params }) {
	if (!client) {
		error(501, 'Article drafts require SANITY_TOKEN and PUBLIC_SANITY_* env vars');
	}

	const data = await client.fetch(
		`*[_type == "article" && slug.current == $slug]
			{_id, title, tldr, content, cover, summary, publish_date, author[]->}`,
		{ slug: params.article }
	);

	if (data && data.length > 0) {
		return {
			title: data[0].title,
			tldr: data[0].tldr,
			content: data[0].content,
			author: data[0].author,
			cover: data[0].cover,
			summary: data[0].summary,
			publishDate: data[0].publish_date
		};
	}

	error(404, 'Not found');
}
