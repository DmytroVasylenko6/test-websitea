import { getTranslations, setRequestLocale } from "next-intl/server";
import { AdCalculator } from "@/components/ad-calculator";
import { Button } from "@/components/ui/button";
import { adFormats } from "@/config/company";
import { buildPageMetadata } from "@/lib/pageMeta";

export async function generateMetadata({ params }: { params: { locale: string } }) {
	return buildPageMetadata(params.locale, "advertiseTitle");
}

export default async function AdvertisePage({ params }: { params: { locale: string } }) {
	setRequestLocale(params.locale);
	const t = await getTranslations("advertise");

	return (
		<div className="mx-auto max-w-6xl px-4 py-16">
			<h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
			<p className="mt-3 max-w-3xl text-muted-foreground">{t("lead")}</p>

			<section className="mt-12">
				<h2 className="text-xl font-semibold">{t("formatsTitle")}</h2>
				<div className="mt-6 grid gap-4 sm:grid-cols-2">
					{adFormats.map((format) => (
						<div key={format.id} className="rounded-xl border bg-card p-5">
							<h3 className="font-medium">{t(format.id)}</h3>
							<p className="mt-2 text-sm text-muted-foreground">{format.sizes.join(" · ")}</p>
						</div>
					))}
				</div>
			</section>

			<section className="mt-12">
				<h2 className="text-xl font-semibold">{t("nativeTitle")}</h2>
				<ul className="mt-4 list-disc pl-5 text-sm">
					{(t.raw("nativeItems") as string[]).map((item) => (
						<li key={item}>{item}</li>
					))}
				</ul>
				<Button disabled className="mt-6" title={t("mediaKitDisabled")}>
					{t("mediaKit")}
				</Button>
				<p className="mt-2 text-xs text-muted-foreground">{t("mediaKitDisabled")}</p>
			</section>

			<section className="mt-12 max-w-3xl">
				<h2 className="text-xl font-semibold">{t("legalTitle")}</h2>
				<p className="mt-3 text-sm text-muted-foreground">{t("legalBody")}</p>
			</section>

			<section className="mt-12">
				<h2 className="text-xl font-semibold">{t("ratesTitle")}</h2>
				<p className="mt-2 text-sm text-muted-foreground">{t("ratesNote")}</p>
				<h3 className="mt-8 text-lg font-medium">{t("calculatorTitle")}</h3>
				<div className="mt-6">
					<AdCalculator />
				</div>
			</section>
		</div>
	);
}
