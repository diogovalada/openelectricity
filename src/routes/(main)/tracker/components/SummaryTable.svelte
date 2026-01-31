<script>
	import getContext from '$lib/utils/get-context.js';
	import { getNumberFormat } from '$lib/utils/formatters';

	/** @type {{ cxtKey: symbol }} */
	let { cxtKey } = $props();

	/** @type {import('$lib/components/charts/stores/chart.svelte.js').default} */
	let cxt = getContext(cxtKey);

	let lastSeriesData = $derived.by(() => {
		const data = cxt.seriesData || [];
		return data.length ? data[data.length - 1] : undefined;
	});

	let activeData = $derived(cxt.hoverData || cxt.focusData || lastSeriesData);

	let visibleNames = $derived(cxt.visibleSeriesNames || []);

	let rows = $derived(
		(cxt.seriesNames || []).map((name) => {
			const value = activeData ? activeData[name] : undefined;
			return {
				name,
				label: cxt.seriesLabels?.[name] || name,
				colour: cxt.seriesColours?.[name],
				value,
				hidden: cxt.hiddenSeriesNames?.includes(name)
			};
		})
	);

	let total = $derived(
		visibleNames.reduce((sum, name) => sum + (activeData?.[name] || 0), 0)
	);

	const percentFormat = getNumberFormat(1, true);

	function toggleSeries(name) {
		cxt.updateHiddenSeriesNames(name);
	}
</script>

<div class="bg-white rounded-2xl border border-warm-grey p-4 md:p-6">
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-base font-semibold m-0">Summary</h3>
		{#if activeData}
			<span class="text-xs text-mid-grey">Latest</span>
		{/if}
	</div>

	{#if !activeData}
		<div class="h-[180px] bg-light-warm-grey rounded-xl animate-pulse"></div>
	{:else}
		<div class="flex flex-col gap-2">
			{#each rows as row}
				<button
					class="flex items-center justify-between rounded-lg px-3 py-2 text-sm border border-transparent hover:border-mid-warm-grey"
					class:text-mid-grey={row.hidden}
					class:bg-light-warm-grey={row.hidden}
					onclick={() => toggleSeries(row.name)}
				>
					<span class="flex items-center gap-3">
						<span
							class="w-3 h-3 rounded-sm"
							style="background-color: {row.colour || '#999'}"
						></span>
						<span class="font-medium">{row.label}</span>
					</span>
					<span class="flex items-center gap-4">
						<span class="tabular-nums">
							{row.value || row.value === 0
								? `${cxt.convertAndFormatValue(row.value)} ${cxt.chartOptions.displayUnit}`
								: '—'}
						</span>
						<span class="text-xs text-mid-grey tabular-nums">
							{total ? `${percentFormat.format((row.value || 0) / total * 100)}%` : '—'}
						</span>
					</span>
				</button>
			{/each}

			<div class="flex items-center justify-between border-t border-warm-grey pt-3 mt-2 text-sm">
				<span class="font-semibold">Total</span>
				<span class="font-semibold tabular-nums">
					{cxt.convertAndFormatValue(total)} {cxt.chartOptions.displayUnit}
				</span>
			</div>
		</div>
	{/if}
</div>
