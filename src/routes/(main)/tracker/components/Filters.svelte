<script>
	import { goto } from '$app/navigation';
	import { getFiltersContext } from '../stores/filters.svelte';
	import Switch from '$lib/components/Switch.svelte';
	import FormSelect from '$lib/components/form-elements/Select.svelte';

	let cxt = getFiltersContext();

	$effect(() => {
		if (!cxt.selectedRegion || !cxt.selectedRange || !cxt.selectedInterval) return;
		const params = new URLSearchParams({
			region: cxt.selectedRegion,
			range: cxt.selectedRange,
			interval: cxt.selectedInterval,
			group: cxt.selectedFuelTechGroup
		});
		goto(`?${params.toString()}`, { noScroll: true, keepFocus: true });
	});
</script>

<section class="bg-light-warm-grey rounded-2xl p-4 md:p-6 flex flex-col gap-4 md:gap-6">
	<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
		<div class="flex items-center gap-3">
			<span class="font-mono text-xs text-mid-grey">Region</span>
			<FormSelect
				widthClass="w-[220px]"
				paddingX="px-4"
				paddingY="py-2"
				selectedLabelClass="text-sm font-semibold"
				options={cxt.regions}
				selected={cxt.selectedRegion}
				on:change={(evt) => (cxt.selectedRegion = evt.detail.value)}
			/>
		</div>

		<div class="flex items-center gap-3">
			<span class="font-mono text-xs text-mid-grey">Group</span>
			<FormSelect
				widthClass="w-[220px]"
				paddingX="px-4"
				paddingY="py-2"
				selectedLabelClass="text-sm font-semibold"
				options={cxt.groups}
				selected={cxt.selectedFuelTechGroup}
				on:change={(evt) => (cxt.selectedFuelTechGroup = evt.detail.value)}
			/>
		</div>
	</div>

	<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
		<div class="flex items-center gap-3">
			<span class="font-mono text-xs text-mid-grey">Range</span>
			<Switch
				buttons={cxt.ranges}
				selected={cxt.selectedRange}
				xPad={4}
				yPad={2}
				textSize="sm"
				on:change={(evt) => (cxt.selectedRange = evt.detail.value)}
			/>
		</div>

		{#if cxt.selectedRangeIntervals}
			<div class="flex items-center gap-3">
				<span class="font-mono text-xs text-mid-grey">Interval</span>
				<Switch
					buttons={cxt.selectedRangeIntervals}
					selected={cxt.selectedInterval}
					xPad={4}
					yPad={2}
					textSize="sm"
					on:change={(evt) => (cxt.selectedInterval = evt.detail.value)}
				/>
			</div>
		{/if}
	</div>
</section>
