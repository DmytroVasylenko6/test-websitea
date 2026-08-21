export type Kved = {
	code: string;
	primary: boolean;
	uk: string;
	en: string;
};

export const company = {
	shortName: "Legal Inform Services",
	legalNameUk:
		"ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ «ЛЕГАЛ ІНФОРМ ПОСЛУГИ»",
	legalNameEn: 'LIMITED LIABILITY COMPANY "LEGAL INFORM SERVICE"',
	shortLegalNameUk: "ТОВ «ЛЕГАЛ ІНФОРМ ПОСЛУГИ»",
	shortLegalNameEn: 'LLC "LEGAL INFORM SERVICE"',
	edrpou: "45971518",
	directorUk: "Кірчев Ігор Іванович",
	directorEn: "Ihor Ivanovych Kirchev",
	phone: "+380684908776",
	phoneHref: "tel:+380684908776",
	registeredAt: "2025-07-21",
	diiaCityFrom: "2025-07-29",
	diiaCityRegistryUrl: "https://city.diia.gov.ua/",
	opendatabotUrl: "https://opendatabot.ua/c/45971518",
	address: {
		countryCode: "UA",
		countryUk: "Україна",
		countryEn: "Ukraine",
		postalCode: "65033",
		regionUk: "Одеська область",
		regionEn: "Odesa Oblast",
		cityUk: "Одеса",
		cityEn: "Odesa",
		streetUk: "вул. Стуса Василя, будинок 2/1, офіс 13",
		streetEn: "Vasylia Stusa St., building 2/1, office 13",
	},
	kved: [
		{
			code: "63.12",
			primary: true,
			uk: "Веб-портали",
			en: "Web portals",
		},
		{
			code: "63.11",
			primary: false,
			uk: "Оброблення даних, розміщення інформації на веб-вузлах і пов’язана з ними діяльність",
			en: "Data processing, hosting and related activities",
		},
		{
			code: "62.01",
			primary: false,
			uk: "Комп’ютерне програмування",
			en: "Computer programming",
		},
		{
			code: "62.09",
			primary: false,
			uk: "Інша діяльність у сфері інформаційних технологій і комп’ютерних систем",
			en: "Other information technology and computer service activities",
		},
		{
			code: "73.11",
			primary: false,
			uk: "Рекламні агентства",
			en: "Advertising agencies",
		},
	] satisfies Kved[],
} as const;

const PLACEHOLDER_EMAIL = /example\.com$/i;

export function getPublicEmail(): string | null {
	const email = process.env.CONTACT_EMAIL?.trim();
	if (!email || PLACEHOLDER_EMAIL.test(email)) {
		return null;
	}
	return email;
}

export function getSiteUrl(): string {
	const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
	if (!url) {
		return "http://localhost:3000";
	}
	return url.replace(/\/$/, "");
}

export function formatAddress(locale: "uk" | "en"): string {
	const a = company.address;
	if (locale === "en") {
		return `${a.streetEn}, ${a.cityEn}, ${a.regionEn}, ${a.postalCode}, ${a.countryEn}`;
	}
	return `${a.countryUk}, ${a.postalCode}, ${a.regionUk}, місто ${a.cityUk}, ${a.streetUk}`;
}

export function getMapsEmbedUrl(): string {
	const query = encodeURIComponent(
		`${company.address.cityUk} ${company.address.streetUk}`,
	);
	return `https://maps.google.com/maps?q=${query}&z=16&output=embed`;
}

export function getMapsSearchUrl(): string {
	const query = encodeURIComponent(
		`${company.address.cityUk} ${company.address.streetUk}`,
	);
	return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export const publicDocuments = [
	{
		id: "compliance-initial",
		period: "initial",
	},
	{
		id: "compliance-annual",
		period: "annual",
	},
	{
		id: "audit-opinion",
		period: null,
	},
	{
		id: "charter",
		period: null,
	},
	{
		id: "register-extract",
		period: null,
	},
] as const;

export const adFormats = [
	{
		id: "header",
		sizes: ["728×90", "970×90"],
	},
	{
		id: "sidebar",
		sizes: ["300×250", "160×600"],
	},
	{
		id: "inArticle",
		sizes: ["300×250", "336×280"],
	},
	{
		id: "sticky",
		sizes: ["320×50", "728×90"],
	},
] as const;

export const indicativeRates = [
	{ id: "cpm", unit: "CPM", amountUah: 120 },
	{ id: "cpc", unit: "CPC", amountUah: 8 },
	{ id: "fixedWeek", unit: "week", amountUah: 4500 },
] as const;
