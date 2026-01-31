import { readable, writable } from 'svelte/store';
import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

let parsedFeatureFlagsValue = {};
try {
	parsedFeatureFlagsValue = env.PUBLIC_FEATURE_FLAGS ? JSON.parse(env.PUBLIC_FEATURE_FLAGS) : {};
} catch (error) {
	console.warn('Invalid PUBLIC_FEATURE_FLAGS, falling back to empty object.', error);
	parsedFeatureFlagsValue = {};
}

console.log('PUBLIC_FEATURE_FLAGS', parsedFeatureFlagsValue);

export const parsedFeatureFlags = parsedFeatureFlagsValue;
/** @type {import('svelte/store').Readable<*>} */
export const featureFlags = readable(parsedFeatureFlags);

// Get value from localStorage if in browser and the value is stored, otherwise fallback
function fromLocalStorage(storageKey, fallbackValue) {
	if (browser) {
		const storedValue = window.localStorage.getItem(storageKey);

		if (storedValue !== 'undefined' && storedValue !== null) {
			return typeof fallbackValue === 'object'
				? JSON.parse(storedValue)
				: storedValue === 'true'
				? true
				: storedValue === 'false'
				? false
				: storedValue;
		}
	}

	return fallbackValue;
}
function toLocalStorage(store, storageKey) {
	if (browser) {
		store.subscribe((value) => {
			let storageValue = typeof value === 'object' ? JSON.stringify(value) : value;

			window.localStorage.setItem(storageKey, storageValue);
		});
	}
}

/** @type {import('svelte/store').Readable<string>} */
export const dataTrackerLink = readable(env.PUBLIC_EXPLORE_URL ?? 'https://explore.openelectricity.org.au');

export const bannerOpen = writable(fromLocalStorage('bannerOpen', true));
toLocalStorage(bannerOpen, 'bannerOpen');
