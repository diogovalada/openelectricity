import detailedGroup from '$lib/fuel-tech-groups/detailed';
import simpleGroup from '$lib/fuel-tech-groups/simple';
import renewablesFossilsGroup from '$lib/fuel-tech-groups/renewables-fossils';

export const groups = [detailedGroup, simpleGroup, renewablesFossilsGroup];

export const groupOptions = groups.map((group) => ({
	label: group.label,
	value: group.value
}));

/** @type {Record<string, Object.<string, string[]>>} */
export let fuelTechMap = {};
/** @type {Record<string, string[]>} */
export let orderMap = {};
/** @type {Record<string, Function>} */
export let labelReducer = {};

groups.forEach((group) => {
	fuelTechMap[group.value] = group.fuelTechs;
	orderMap[group.value] = group.order;
	labelReducer[group.value] = group.fuelTechNameReducer;
});
