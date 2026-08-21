import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/page-hero";
import { buildPageMetadata } from "@/lib/pageMeta";

export async function generateMetadata({ params }: { params: { locale: string } }) {
	return buildPageMetadata(params.locale, "cookiesTitle");
}

export default async function CookiePolicyPage({ params }: { params: { locale: string } }) {
	setRequestLocale(params.locale);
	const t = await getTranslations("legal");

	return (
		<>
			<PageHero title={t("cookiesTitle")} lead={t("cookiesLead")} variant="cookies" compact />
			<article className="mx-auto max-w-3xl px-4 py-16">
				<p className="text-sm leading-relaxed text-muted-foreground">{t("cookiesBody")}</p>
			</article>
		</>
	);
}
