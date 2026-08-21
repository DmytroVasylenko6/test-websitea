import { indicativeRates } from "@/config/company";
import type { ContactInput } from "@/lib/contactSchema";

export function formatContactTelegram(input: ContactInput): string {
	const lines = [
		"New website enquiry",
		`Type: ${input.requestType}`,
		`Name: ${input.name}`,
		input.phone ? `Phone: ${input.phone}` : null,
		input.email ? `Email: ${input.email}` : null,
		input.locale ? `Locale: ${input.locale}` : null,
		input.format ? `Format: ${input.format}` : null,
		typeof input.impressions === "number" ? `Impressions: ${input.impressions}` : null,
		typeof input.clicks === "number" ? `Clicks: ${input.clicks}` : null,
		typeof input.weeks === "number" ? `Weeks: ${input.weeks}` : null,
		typeof input.estimateUah === "number"
			? `Estimate UAH: ${input.estimateUah}`
			: null,
		"",
		input.message,
	];

	return lines.filter((line) => line !== null).join("\n");
}

export function estimatePlacement(options: {
	impressions?: number;
	clicks?: number;
	weeks?: number;
}): number {
	const cpm = indicativeRates.find((rate) => rate.id === "cpm")?.amountUah ?? 0;
	const cpc = indicativeRates.find((rate) => rate.id === "cpc")?.amountUah ?? 0;
	const week = indicativeRates.find((rate) => rate.id === "fixedWeek")?.amountUah ?? 0;

	const fromImpressions = ((options.impressions ?? 0) / 1000) * cpm;
	const fromClicks = (options.clicks ?? 0) * cpc;
	const fromWeeks = (options.weeks ?? 0) * week;

	return Math.round(fromImpressions + fromClicks + fromWeeks);
}
