import { createClient } from '@sanity/client';
import { env } from '$env/dynamic/public';
import imageUrlBuilder from '@sanity/image-url';

const hasSanityConfig = Boolean(env.PUBLIC_SANITY_PROJECT_ID && env.PUBLIC_SANITY_DATASET);

const noopClient = {
	/**
	 * @returns {Promise<[]>}
	 */
	fetch: async () => []
};

export const client = hasSanityConfig
	? createClient({
			projectId: env.PUBLIC_SANITY_PROJECT_ID,
			dataset: env.PUBLIC_SANITY_DATASET,
			apiVersion: '2023-10-11',
			useCdn: false
		})
	: noopClient;

const builder = hasSanityConfig ? imageUrlBuilder(client) : null;

const emptyBuilder = {
	width: () => emptyBuilder,
	height: () => emptyBuilder,
	url: () => ''
};

export const urlFor = (source) => {
	if (!builder) return emptyBuilder;
	return builder.image(source);
};
