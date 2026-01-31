import { json, text } from '@sveltejs/kit';
import md5 from 'md5';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request }) {
	if (!env.MAILCHIMP_API_KEY || !env.MAILCHIMP_LIST_ID) {
		return json({ error: 'Mailchimp not configured' }, { status: 501 });
	}

	const { email } = await request.json();
	const lowerCaseEmail = email.toLowerCase();
	const response = await fetch(
		`https://us13.api.mailchimp.com/3.0/lists/${env.MAILCHIMP_LIST_ID}/members/${md5(lowerCaseEmail)}`,
		{
			method: 'PUT',
			headers: {
				Authorization: `apikey ${env.MAILCHIMP_API_KEY}`
			},
			body: JSON.stringify({
				email_address: lowerCaseEmail,
				status_if_new: 'pending'
			})
		}
	);

	const data = await response.json();

	return json({
		email: data.email_address,
		status: data.status
	});
}

// This handler will respond to POST, PATCH, DELETE, etc.
/** @type {import('./$types').RequestHandler} */
export async function fallback({ request }) {
	return text('Nothing to see here');
}
