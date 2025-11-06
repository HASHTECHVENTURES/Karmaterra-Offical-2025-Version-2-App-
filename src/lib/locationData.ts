import { locationData, type Country, type State, type City } from './locationDataComprehensive';

export type SimpleCountry = { name: string; code: string };

export const getCountries = (): SimpleCountry[] => {
	return locationData.countries.map((c: Country) => ({ name: c.name, code: c.code }));
};

export const getStatesByCountry = (countryName: string): string[] => {
	const country = locationData.countries.find((c: Country) => c.name === countryName);
	return country ? country.states.map((s: State) => s.name) : [];
};

export const getCitiesByState = (countryName: string, stateName: string): string[] => {
	const country = locationData.countries.find((c: Country) => c.name === countryName);
	if (!country) return [];
	const state = country.states.find((s: State) => s.name === stateName);
	return state ? state.cities.map((ci: City) => ci.name) : [];
};

export const getCountryCodeByName = (countryName: string): string | undefined => {
	return locationData.countries.find((c: Country) => c.name === countryName)?.code;
};


