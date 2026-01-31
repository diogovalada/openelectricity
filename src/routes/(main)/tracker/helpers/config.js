/** @typedef {'power' | 'energy' | 'energy-rolling'} TrackerDataType */

/** @type {Record<string, {label: string, intervals: string[], defaultInterval: string, dataType: TrackerDataType, formatRange: string, rangeDays?: number}>} */
export const rangeIntervalMap = {
	'1d': {
		label: '1D',
		intervals: ['5m', '30m'],
		defaultInterval: '30m',
		dataType: 'power',
		formatRange: '7d',
		rangeDays: 1
	},
	'3d': {
		label: '3D',
		intervals: ['5m', '30m'],
		defaultInterval: '30m',
		dataType: 'power',
		formatRange: '7d',
		rangeDays: 3
	},
	'7d': {
		label: '7D',
		intervals: ['5m', '30m'],
		defaultInterval: '30m',
		dataType: 'power',
		formatRange: '7d',
		rangeDays: 7
	},
	'1y': {
		label: '1Y',
		intervals: ['1M', '1Q', '6M', '1Y'],
		defaultInterval: '1M',
		dataType: 'energy',
		formatRange: 'monthly',
		rangeDays: 365
	},
	all: {
		label: 'All',
		intervals: ['1M', '1Q', '6M', '1Y'],
		defaultInterval: '1M',
		dataType: 'energy',
		formatRange: 'yearly'
	},
	'12m': {
		label: '12M Rolling',
		intervals: ['1M', '1Q', '6M'],
		defaultInterval: '1M',
		dataType: 'energy-rolling',
		formatRange: '12-month-rolling',
		rangeDays: 365
	}
};

export const DEFAULT_RANGE = '7d';
export const DEFAULT_GROUP = 'detailed';
export const DEFAULT_REGION = 'NEM';

/** @type {Record<string, string>} */
export const intervalLabels = {
	'5m': '5m',
	'30m': '30m',
	'1M': 'Month',
	'1Q': 'Quarter',
	'6M': 'Half Year',
	'1Y': 'Year'
};
