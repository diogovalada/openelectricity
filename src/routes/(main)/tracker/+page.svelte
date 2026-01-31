<script>
	import { subDays } from 'date-fns';
	import { colourReducer } from '$lib/stores/theme';
	import { parseUnit } from '$lib/utils/si-units';
	import nighttimes from '$lib/utils/nighttimes';
	import energyHistory from '$lib/energy_history';
	import LensChart from '$lib/components/charts/LensChart.svelte';
	import Filters from './components/Filters.svelte';
	import SummaryTable from './components/SummaryTable.svelte';
	import init from './helpers/init';
	import { processPower, processEnergy } from './helpers/process';
	import { fuelTechMap, orderMap, labelReducer } from './helpers/groups';
	import { rangeIntervalMap } from './helpers/config';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
	let dataset = $derived(data.dataset);
	let region = $derived(data.region);
	let range = $derived(data.range);
	let interval = $derived(data.interval);
	let group = $derived(data.group);

	let { filtersCxt, chartCxt } = init({ region, range, interval, group });

	$effect(() => {
		filtersCxt.selectedRegion = region;
		filtersCxt.selectedRange = range;
		filtersCxt.selectedInterval = interval;
		filtersCxt.selectedFuelTechGroup = group;
	});

	$effect(() => {
		// Ensure stacked area charts always have a y-domain list of visible series.
		if (chartCxt?.chartOptions?.isChartTypeArea) {
			chartCxt.yKey = chartCxt.visibleSeriesNames;
		}
	});

	let rangeConfig = $derived(rangeIntervalMap[filtersCxt.selectedRange]);
	let dataType = $derived(filtersCxt.dataType);

	let historyData = $derived.by(() => {
		const dataList = dataset?.data || [];
		if (dataType === 'power') {
			// `/api/tracker/7d` returns a "power" payload with all series in `data`.
			return dataList;
		}
		return energyHistory(dataList);
	});

	let processed = $derived.by(() => {
		if (!historyData?.length) return null;

		const unit = historyData[0]?.units || (dataType === 'power' ? 'MW' : 'MWh');
		const groupKey = filtersCxt.selectedFuelTechGroup;

		if (dataType === 'power') {
			return processPower({
				history: historyData,
				unit,
				colourReducer: $colourReducer,
				fuelTechMap: fuelTechMap[groupKey],
				fuelTechOrder: orderMap[groupKey],
				labelReducer: labelReducer[groupKey],
				targetInterval: filtersCxt.selectedInterval
			});
		}

		return processEnergy({
			history: historyData,
			unit,
			colourReducer: $colourReducer,
			fuelTechMap: fuelTechMap[groupKey],
			fuelTechOrder: orderMap[groupKey],
			labelReducer: labelReducer[groupKey],
			targetInterval: filtersCxt.selectedInterval,
			calculate12MthRollingSum: dataType === 'energy-rolling'
		});
	});

	let filteredSeriesData = $derived.by(() => {
		if (!processed?.timeseries?.data) return [];
		const data = processed.timeseries.data;
		if (!rangeConfig?.rangeDays || data.length === 0) return data;
		const lastDate = data[data.length - 1].date;
		const startDate = subDays(lastDate, rangeConfig.rangeDays);
		return data.filter((/** @type {TimeSeriesData} */ d) => d.date >= startDate);
	});

	function getAllowedPrefixes(prefix) {
		if (prefix === 'M') return ['M', 'G', 'T'];
		if (prefix === 'G') return ['G', 'T'];
		if (prefix === 'k') return ['k', 'M'];
		return [prefix];
	}

	$effect(() => {
		if (!processed?.timeseries) return;
		const ts = processed.timeseries;
		const unit = historyData?.[0]?.units || (dataType === 'power' ? 'MW' : 'MWh');
		const { baseUnit, prefix } = parseUnit(unit);

		chartCxt.seriesData = filteredSeriesData;
		chartCxt.seriesNames = ts.seriesNames;
		chartCxt.seriesColours = ts.seriesColours;
		chartCxt.seriesLabels = ts.seriesLabels;
		chartCxt.hiddenSeriesNames = [];
		chartCxt.yKey = ts.seriesNames;

		chartCxt.title = `${filtersCxt.selectedRegionLabel} ${dataType === 'power' ? 'Power' : 'Energy'}`;
		chartCxt.chartOptions.baseUnit = baseUnit;
		chartCxt.chartOptions.prefix = prefix;
		chartCxt.chartOptions.displayPrefix = prefix;
		chartCxt.chartOptions.allowedPrefixes = getAllowedPrefixes(prefix);

		chartCxt.timeZone = filtersCxt.selectedRegion === 'WEM' ? '+08:00' : '+10:00';
		chartCxt.xTicks = filtersCxt.valueFormatters.ticks(filteredSeriesData);
		chartCxt.formatX = filtersCxt.valueFormatters.format;
		chartCxt.formatTickX = filtersCxt.valueFormatters.formatTick;

		if (dataType === 'power' && filteredSeriesData.length > 1) {
			chartCxt.shadingData = nighttimes(
				filteredSeriesData[0].date,
				filteredSeriesData[filteredSeriesData.length - 1].date,
				chartCxt.timeZone
			);
			chartCxt.shadingFill = '#33333311';
		} else {
			chartCxt.shadingData = undefined;
			chartCxt.shadingFill = undefined;
		}
	});

	/**
	 * @param {string | undefined} hoverKey
	 * @param {TimeSeriesData | undefined} hoverData
	 */
	function updateChartHover(hoverKey, hoverData) {
		chartCxt.hoverTime = hoverData ? hoverData.time : undefined;
		chartCxt.hoverKey = hoverKey;
	}

	/** @param {TimeSeriesData} evt */
	function onpointerup(evt) {
		const isSame = chartCxt.focusTime === evt.time;
		chartCxt.focusTime = isSame ? undefined : evt.time;
	}

	/**
	 * @param {{ data: TimeSeriesData, key?: string } | TimeSeriesData} evt
	 */
	function onmousemove(evt) {
		if (!evt) return;
		let key = /** @type {string | undefined} */ (evt.key);
		let data = key
			? /** @type {TimeSeriesData | undefined} */ (evt.data)
			: /** @type {TimeSeriesData | undefined} */ (evt);
		updateChartHover(key, data);
	}

	function onmouseout() {
		updateChartHover(undefined, undefined);
	}
</script>

<section class="container max-w-none lg:container py-10">
	<header class="mb-8">
		<h1 class="text-3xl md:text-4xl font-semibold m-0">Tracker</h1>
		<p class="text-sm text-mid-grey mt-2">
			Live and historical electricity generation data for Australian regions.
		</p>
	</header>

	<Filters />

	<div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
		<div class="lg:col-span-2">
			{#if processed?.timeseries}
				<LensChart
					cxtKey={chartCxt.key}
					displayOptions={true}
					{onmousemove}
					{onmouseout}
					{onpointerup}
				/>
			{:else}
				<div class="h-[360px] md:h-[520px] bg-light-warm-grey rounded-2xl animate-pulse"></div>
			{/if}
		</div>
		<div>
			<SummaryTable cxtKey={chartCxt.key} />
		</div>
	</div>
</section>
