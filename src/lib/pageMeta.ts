import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const descriptions: Record<string, string> = {
	homeTitle: "homeDescription",
	servicesTitle: "servicesDescription",
	advertiseTitle: "advertiseDescription",
	portfolioTitle: "portfolioDescription",
	diiaTitle: "diiaDescription",
	contactsTitle: "contactsDescription",
	privacyTitle: "privacyTitle",
	termsTitle: "termsTitle",
	cookiesTitle: "cookiesTitle",
};

export async function buildPageMetadata(
	locale: string,
	titleKey: keyof typeof descriptions,
): Promise<Metadata> {
	const t = await getTranslations({ locale, namespace: "meta" });
	const descriptionKey = descriptions[titleKey];

	return {
		title: t(titleKey as "homeTitle"),
		description: t((descriptionKey ?? titleKey) as "homeDescription"),
	};
}
