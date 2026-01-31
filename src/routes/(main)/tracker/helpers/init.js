import { setContext, getContext } from 'svelte';
import { FiltersState, setFiltersContext, getFiltersContext } from '../stores/filters.svelte';
import ChartStore from '$lib/components/charts/stores/chart.svelte.js';
import { chartCxtOptions } from './tracker-chart-config';

/**
 * @param {{
 * region?: string,
 * range?: string,
 * interval?: string,
 * group?: string
 * }} data
 */
export default function init(data) {
	setFiltersContext(
		new FiltersState({
			selectedRegion: data.region ?? '',
			selectedRange: data.range ?? '7d',
			selectedInterval: data.interval ?? '30m',
			selectedFuelTechGroup: data.group ?? 'detailed'
		})
	);

	setContext(chartCxtOptions.key, new ChartStore(chartCxtOptions));

	let filtersCxt = getFiltersContext();
	let chartCxt = getContext(chartCxtOptions.key);

	return {
		filtersCxt,
		chartCxt
	};
}
