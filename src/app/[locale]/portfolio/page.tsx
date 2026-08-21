import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/page-hero";
import { PortfolioFilters } from "@/components/portfolio-filters";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/pageMeta";

export async function generateMetadata({ params }: { params: { locale: string } }) {
	return buildPageMetadata(params.locale, "portfolioTitle");
}

export default async function PortfolioPage({ params }: { params: { locale: string } }) {
	setRequestLocale(params.locale);
	const t = await getTranslations("portfolio");

	return (
		<>
			<PageHero
				title={t("title")}
				lead={t("lead")}
				variant="portfolio"
				action={
					<Button asChild>
						<Link href="/#lead">{t("cta")}</Link>
					</Button>
				}
			/>
			<div className="mx-auto max-w-6xl px-4 py-16">
				<PortfolioFilters />
				<div className="mt-10 rounded-xl border border-dashed p-12 text-center text-muted-foreground">
					{t("empty")}
				</div>
			</div>
		</>
	);
}
