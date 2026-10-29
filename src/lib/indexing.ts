import type { Metadata } from "next";

export const indexablePages = [
	{ path: "", titleKey: "homeTitle" },
	{ path: "/services", titleKey: "servicesTitle" },
	{ path: "/advertise", titleKey: "advertiseTitle" },
	{ path: "/portfolio", titleKey: "portfolioTitle" },
	{ path: "/diia-city", titleKey: "diiaTitle" },
	{ path: "/contacts", titleKey: "contactsTitle" },
	{ path: "/privacy-policy", titleKey: "privacyTitle" },
	{ path: "/terms", titleKey: "termsTitle" },
	{ path: "/cookie-policy", titleKey: "cookiesTitle" },
] as const;

export type PageTitleKey = (typeof indexablePages)[number]["titleKey"];

const pathByTitle = Object.fromEntries(
	indexablePages.map((page) => [page.titleKey, page.path]),
) as Record<PageTitleKey, string>;

export function pathForTitle(titleKey: PageTitleKey): string {
	return pathByTitle[titleKey];
}

/** Ukrainian URLs stay unprefixed; English lives under /en. x-default is Ukrainian. */
export function pageLanguageAlternates(siteUrl: string, path: string) {
	const uk = `${siteUrl}${path}`;
	const en = `${siteUrl}/en${path}`;
	return {
		uk,
		en,
		"x-default": uk,
	};
}

export function indexingMetadata(
	locale: string,
	path: string,
	siteUrl: string,
): Pick<Metadata, "alternates" | "openGraph"> {
	const languages = pageLanguageAlternates(siteUrl, path);
	const canonical = locale === "en" ? languages.en : languages.uk;

	return {
		alternates: {
			canonical,
			languages,
		},
		openGraph: {
			url: canonical,
		},
	};
}
