import { rangeIntervalMap, DEFAULT_RANGE, DEFAULT_REGION, DEFAULT_GROUP } from './helpers/config';
import { regionsWithDataPaths } from './helpers/regions';
import { groupOptions } from './helpers/groups';

function normaliseRange(rawRange) {
	if (!rawRange) return DEFAULT_RANGE;
	const lower = rawRange.toLowerCase();
	return rangeIntervalMap[lower] ? lower : DEFAULT_RANGE;
}

function normaliseInterval(range, rawInterval) {
	const config = rangeIntervalMap[range];
	if (!config) return rangeIntervalMap[DEFAULT_RANGE].defaultInterval;
	if (rawInterval && config.intervals.includes(rawInterval)) return rawInterval;
	return config.defaultInterval;
}

function normaliseGroup(rawGroup) {
	if (!rawGroup) return DEFAULT_GROUP;
	const valid = groupOptions.some((group) => group.value === rawGroup);
	return valid ? rawGroup : DEFAULT_GROUP;
}

function normaliseRegion(rawRegion) {
	if (!rawRegion) return DEFAULT_REGION;
	const upper = rawRegion.toUpperCase();
	return regionsWithDataPaths[upper] ? upper : DEFAULT_REGION;
}

function getEnergyQuery(region) {
	if (region === 'WEM') {
		return { network: 'WEM', region: '_all' };
	}

	if (region === 'NEM') {
		return { network: 'NEM', region: '_all' };
	}

	return { network: 'NEM', region };
}

export async function load({ url, fetch }) {
	const { searchParams } = url;
	const range = normaliseRange(searchParams.get('range'));
	const interval = normaliseInterval(range, searchParams.get('interval'));
	const region = normaliseRegion(searchParams.get('region'));
	const group = normaliseGroup(searchParams.get('group'));
	const dataType = rangeIntervalMap[range].dataType;

	let dataset;

	if (dataType === 'power') {
		const regionPath = regionsWithDataPaths[region] || regionsWithDataPaths[DEFAULT_REGION];
		const res = await fetch(`/api/tracker/7d?regionPath=${regionPath}`);
		dataset = await res.json();
	} else {
		const { network, region: regionParam } = getEnergyQuery(region);
		const res = await fetch(
			`/api/energy?network=${network}&region=${regionParam}&type=energy&year=all`
		);
		dataset = await res.json();
	}

	return {
		dataset,
		region,
		range,
		interval,
		group,
		dataType
	};
}
