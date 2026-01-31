import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const FALLBACK_JSON_API = 'https://data.openelectricity.org.au/v4/stats';

export async function GET({ fetch, setHeaders }) {
	setHeaders({
		'cache-control': 'max-age=1800' // 30 mins
	});
	const baseUrl = env.PUBLIC_JSON_API || FALLBACK_JSON_API;
	const nsw = await fetch(`${baseUrl}/au/NEM/NSW1/energy/all.json`);
	const qld = await fetch(`${baseUrl}/au/NEM/QLD1/energy/all.json`);
	const sa = await fetch(`${baseUrl}/au/NEM/SA1/energy/all.json`);
	const tas = await fetch(`${baseUrl}/au/NEM/TAS1/energy/all.json`);
	const vic = await fetch(`${baseUrl}/au/NEM/VIC1/energy/all.json`);
	const wa = await fetch(`${baseUrl}/au/WEM/energy/all.json`);

	const energyFilter = (d) => d.fuel_tech && d.type === 'energy';
	const latest12MonthsSumData = (d) => {
		return {
			region: d.region,
			id: d.id,
			fuel_tech: d.fuel_tech,
			data_type: d.data_type,
			units: d.units,
			data: d.history.data.slice(-12).reduce((acc, cur) => acc + cur, 0)
		};
	};

	if (nsw.ok && qld.ok && sa.ok && tas.ok && vic.ok && wa.ok) {
		const { data: nswData } = await nsw.json();
		const { data: qldData } = await qld.json();
		const { data: saData } = await sa.json();
		const { data: tasData } = await tas.json();
		const { data: vicData } = await vic.json();
		const { data: waData } = await wa.json();

		return Response.json({
			NSW: nswData.filter(energyFilter).map(latest12MonthsSumData),
			QLD: qldData.filter(energyFilter).map(latest12MonthsSumData),
			SA: saData.filter(energyFilter).map(latest12MonthsSumData),
			TAS: tasData.filter(energyFilter).map(latest12MonthsSumData),
			VIC: vicData.filter(energyFilter).map(latest12MonthsSumData),
			WA: waData.filter(energyFilter).map(latest12MonthsSumData)
		});
	}

	error(404, 'Not found');
}
