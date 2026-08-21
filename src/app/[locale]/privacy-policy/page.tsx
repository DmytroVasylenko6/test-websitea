import { getTranslations, setRequestLocale } from "next-intl/server";
import { company } from "@/config/company";
import { buildPageMetadata } from "@/lib/pageMeta";

export async function generateMetadata({ params }: { params: { locale: string } }) {
	return buildPageMetadata(params.locale, "privacyTitle");
}

export default async function PrivacyPage({ params }: { params: { locale: string } }) {
	setRequestLocale(params.locale);
	const t = await getTranslations("legal");
	const legalName = params.locale === "en" ? company.legalNameEn : company.legalNameUk;

	return (
		<article className="mx-auto max-w-3xl px-4 py-16">
			<h1 className="text-3xl font-semibold tracking-tight">{t("privacyTitle")}</h1>
			<p className="mt-4 text-muted-foreground">
				{t("privacyIntro", { legalName, edrpou: company.edrpou })}
			</p>
			<h2 className="mt-8 text-xl font-semibold">{t("dataTitle")}</h2>
			<p className="mt-3 text-sm text-muted-foreground">{t("dataBody")}</p>
			<h2 className="mt-8 text-xl font-semibold">{t("telegramTitle")}</h2>
			<p className="mt-3 text-sm text-muted-foreground">{t("telegramBody")}</p>
			<h2 className="mt-8 text-xl font-semibold">{t("rightsTitle")}</h2>
			<p className="mt-3 text-sm text-muted-foreground">{t("rightsBody")}</p>
		</article>
	);
}
