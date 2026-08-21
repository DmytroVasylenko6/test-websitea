import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/pageMeta";

export async function generateMetadata({ params }: { params: { locale: string } }) {
	return buildPageMetadata(params.locale, "cookiesTitle");
}

export default async function CookiePolicyPage({ params }: { params: { locale: string } }) {
	setRequestLocale(params.locale);
	const t = await getTranslations("legal");

	return (
		<article className="mx-auto max-w-3xl px-4 py-16">
			<h1 className="text-3xl font-semibold tracking-tight">{t("cookiesTitle")}</h1>
			<p className="mt-4 text-sm text-muted-foreground">{t("cookiesBody")}</p>
		</article>
	);
}
