import { loadFuelTechs } from '$lib/fuel_techs';
import Statistic from '$lib/utils/Statistic';
import TimeSeries from '$lib/utils/TimeSeries';
import parseInterval from '$lib/utils/intervals';

/**
 * @param {{
 * history: StatsData[],
 * unit: string,
 * colourReducer: *,
 * targetInterval?: string,
 * fuelTechMap: { [key: string]: string[] },
 * fuelTechOrder: string[],
 * labelReducer: *
 * }} param0
 * @returns {{ stats: StatsInstance, timeseries: TimeSeriesInstance }}
 */
export function processPower({
	history,
	fuelTechMap,
	fuelTechOrder,
	unit,
	colourReducer,
	labelReducer,
	targetInterval
}) {
	const stats = new Statistic(history, 'history', unit)
		.invertValues(loadFuelTechs)
		.group(fuelTechMap, loadFuelTechs, false)
		.reorder(fuelTechOrder);

	let targetIntervalStr = targetInterval || stats.minIntervalObj?.intervalString || '30m';
	let loadSeries = stats.data.filter((d) => d.isLoad).map((d) => d.id);

	const timeseriesInstance = new TimeSeries(
		stats.data,
		parseInterval(stats.minIntervalObj?.intervalString || '30m'),
		'history',
		labelReducer,
		colourReducer
	)
		.transform()
		.rollup(parseInterval(targetIntervalStr), 'mean');

	const timeseries = timeseriesInstance.updateMinMax(loadSeries);

	return {
		stats,
		timeseries
	};
}

/**
 * @param {{
 * history: StatsData[],
 * unit: string,
 * colourReducer: *,
 * targetInterval?: string,
 * fuelTechMap: { [key: string]: string[] },
 * fuelTechOrder: string[],
 * labelReducer: *,
 * calculate12MthRollingSum?: boolean
 * }} param0
 * @returns {{ stats: StatsInstance, timeseries: TimeSeriesInstance }}
 */
export function processEnergy({
	history,
	fuelTechMap,
	fuelTechOrder,
	unit,
	colourReducer,
	labelReducer,
	targetInterval,
	calculate12MthRollingSum = false
}) {
	const stats = new Statistic(history, 'history', unit)
		.invertValues(loadFuelTechs)
		.group(fuelTechMap, loadFuelTechs, false)
		.reorder(fuelTechOrder);

	let targetIntervalStr = targetInterval || stats.minIntervalObj?.intervalString || '1M';
	let loadSeries = stats.data.filter((d) => d.isLoad).map((d) => d.id);

	const timeseriesInstance = new TimeSeries(
		stats.data,
		parseInterval(stats.minIntervalObj?.intervalString || '1M'),
		'history',
		labelReducer,
		colourReducer
	)
		.transform()
		.rollup(parseInterval(targetIntervalStr));

	const timeseries = calculate12MthRollingSum
		? timeseriesInstance.calculate12MthRollingSum().updateMinMax(loadSeries)
		: timeseriesInstance.updateMinMax(loadSeries);

	return {
		stats,
		timeseries
	};
}
