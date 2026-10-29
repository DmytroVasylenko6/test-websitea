import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getSiteUrl } from "@/config/company";
import { indexingMetadata, pathForTitle, type PageTitleKey } from "@/lib/indexing";

const descriptions = {
	homeTitle: "homeDescription",
	servicesTitle: "servicesDescription",
	advertiseTitle: "advertiseDescription",
	portfolioTitle: "portfolioDescription",
	diiaTitle: "diiaDescription",
	contactsTitle: "contactsDescription",
	privacyTitle: "privacyTitle",
	termsTitle: "termsTitle",
	cookiesTitle: "cookiesTitle",
} as const satisfies Record<PageTitleKey, string>;

export async function buildPageMetadata(
	locale: string,
	titleKey: PageTitleKey,
): Promise<Metadata> {
	const t = await getTranslations({ locale, namespace: "meta" });
	const descriptionKey = descriptions[titleKey];

	return {
		title: t(titleKey),
		description: t(descriptionKey),
		...indexingMetadata(locale, pathForTitle(titleKey), getSiteUrl()),
	};
}
