import type { Metadata } from "next";
import { company } from "@/config/company";

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

export const OG_IMAGE_WIDTH = 1424;
export const OG_IMAGE_HEIGHT = 752;

/** Card in public/og-image.jpg, used for Open Graph and Twitter previews. */
export function ogImageUrl(siteUrl: string): string {
	return `${siteUrl}/og-image.jpg`;
}

export function ogImageAlt(locale: string): string {
	return locale === "en"
		? "Legal Inform Services — IT services and advertising"
		: "Legal Inform Services — IT-послуги та реклама";
}

/**
 * Full openGraph object for a page. Next merges metadata per top-level key, so
 * a page must repeat siteName/type/locale or they fall back to nothing.
 */
export function openGraphFor(locale: string, url: string, siteUrl: string) {
	return {
		type: "website" as const,
		locale: locale === "en" ? "en_US" : "uk_UA",
		siteName: company.shortName,
		url,
		images: [
			{
				url: ogImageUrl(siteUrl),
				width: OG_IMAGE_WIDTH,
				height: OG_IMAGE_HEIGHT,
				alt: ogImageAlt(locale),
			},
		],
	};
}

export function indexingMetadata(
	locale: string,
	path: string,
	siteUrl: string,
): Pick<Metadata, "alternates" | "openGraph" | "twitter"> {
	const languages = pageLanguageAlternates(siteUrl, path);
	const canonical = locale === "en" ? languages.en : languages.uk;

	return {
		alternates: {
			canonical,
			languages,
		},
		openGraph: openGraphFor(locale, canonical, siteUrl),
		twitter: {
			card: "summary_large_image",
			images: [ogImageUrl(siteUrl)],
		},
	};
}
