import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		// Bind to all interfaces so Playwright (running in a container) can reach the dev server.
		host: true,
		// Allow Playwright (running in a container) to hit the dev server via host.docker.internal.
		allowedHosts: ['localhost', '127.0.0.1', 'host.docker.internal']
	}
});
