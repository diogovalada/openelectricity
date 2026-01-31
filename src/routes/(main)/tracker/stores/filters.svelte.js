import { setContext, getContext } from 'svelte';
import rangeIntervalXFormattersGetters from '$lib/utils/range-interval-ticks-formatters';
import { rangeIntervalMap, intervalLabels, DEFAULT_RANGE } from '../helpers/config';
import { regionOptions, regionsWithLabels } from '../helpers/regions';
import { groupOptions } from '../helpers/groups';

const FILTERS_KEY = Symbol('tracker-filters');

export class FiltersState {
	ranges = Object.keys(rangeIntervalMap).map((range) => ({
		label: rangeIntervalMap[range].label,
		value: range
	}));

	regions = regionOptions.map((region) => ({
		label: region.label,
		value: region.value
	}));

	groups = groupOptions;

	/** @type {string} */
	selectedRegion = $state('');

	/** @type {string} */
	selectedRange = $state(DEFAULT_RANGE);

	/** @type {string} */
	selectedInterval = $state('');

	/** @type {string} */
	selectedFuelTechGroup = $state('detailed');

	/** @type {{label: string, value: string}[] | undefined} */
	selectedRangeIntervals = $derived.by(() => {
		let range = rangeIntervalMap[this.selectedRange];
		if (!range?.intervals) return undefined;
		return range.intervals.map((interval) => ({
			label: intervalLabels[interval] || interval,
			value: interval
		}));
	});

	/** @type {string} */
	selectedRegionLabel = $derived(regionsWithLabels[this.selectedRegion] || this.selectedRegion);

	formatRange = $derived(rangeIntervalMap[this.selectedRange]?.formatRange || '7d');

	dataType = $derived(rangeIntervalMap[this.selectedRange]?.dataType || 'power');

	rangeDays = $derived(rangeIntervalMap[this.selectedRange]?.rangeDays);

	valueFormatters = $derived(
		rangeIntervalXFormattersGetters(this.formatRange, this.selectedInterval)
	);

	/**
	 * @param {{
	 *  selectedRegion: string,
	 *  selectedRange: string,
	 *  selectedInterval: string,
	 *  selectedFuelTechGroup: string
	 * }} props
	 */
	constructor({ selectedRegion, selectedRange, selectedInterval, selectedFuelTechGroup }) {
		this.selectedRegion = selectedRegion;
		this.selectedRange = selectedRange;
		this.selectedInterval = selectedInterval;
		this.selectedFuelTechGroup = selectedFuelTechGroup;
	}
}

/** @param {FiltersState} filters */
export function setFiltersContext(filters) {
	setContext(FILTERS_KEY, filters);
}

/** @returns {FiltersState} */
export function getFiltersContext() {
	return getContext(FILTERS_KEY);
}
