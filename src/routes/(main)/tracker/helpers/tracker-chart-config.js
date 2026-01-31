/** @typedef {{
 * key: symbol,
 * title: string,
 * prefix: SiPrefix,
 * baseUnit: string,
 * displayPrefix: SiPrefix,
 * allowedPrefixes: SiPrefix[],
 * chartStyles?: { chartHeightClasses: string }
 * }} chartCxtOptions */

/** @type {chartCxtOptions} */
export const chartCxtOptions = {
	key: Symbol('tracker-power-chart'),
	title: 'Generation',
	prefix: 'M',
	displayPrefix: 'M',
	allowedPrefixes: ['M', 'G'],
	baseUnit: 'W',
	chartStyles: { chartHeightClasses: 'h-[360px] md:h-[520px]' }
};
