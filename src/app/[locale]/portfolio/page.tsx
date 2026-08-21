import { getTranslations, setRequestLocale } from "next-intl/server";
import { PortfolioFilters } from "@/components/portfolio-filters";
import { buildPageMetadata } from "@/lib/pageMeta";

export async function generateMetadata({ params }: { params: { locale: string } }) {
	return buildPageMetadata(params.locale, "portfolioTitle");
}

export default async function PortfolioPage({ params }: { params: { locale: string } }) {
	setRequestLocale(params.locale);
	const t = await getTranslations("portfolio");

	return (
		<div className="mx-auto max-w-6xl px-4 py-16">
			<h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
			<p className="mt-3 max-w-2xl text-muted-foreground">{t("lead")}</p>
			<PortfolioFilters />
			<div className="mt-10 rounded-xl border border-dashed p-12 text-center text-muted-foreground">
				{t("empty")}
			</div>
		</div>
	);
}
