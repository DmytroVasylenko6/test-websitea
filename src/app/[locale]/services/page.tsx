import { Code2, Megaphone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/pageMeta";

export async function generateMetadata({ params }: { params: { locale: string } }) {
	return buildPageMetadata(params.locale, "servicesTitle");
}

export default async function ServicesPage({ params }: { params: { locale: string } }) {
	setRequestLocale(params.locale);
	const t = await getTranslations("services");

	return (
		<div className="mx-auto max-w-6xl px-4 py-16">
			<h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
			<p className="mt-3 max-w-2xl text-muted-foreground">{t("lead")}</p>
			<div className="mt-12 grid gap-8 md:grid-cols-2">
				<section className="rounded-xl border bg-card p-6">
					<Code2 className="mb-4 h-6 w-6 text-primary" />
					<h2 className="text-xl font-semibold">{t("itTitle")}</h2>
					<ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
						{(t.raw("itItems") as string[]).map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</section>
				<section className="rounded-xl border bg-card p-6">
					<Megaphone className="mb-4 h-6 w-6 text-primary" />
					<h2 className="text-xl font-semibold">{t("adTitle")}</h2>
					<ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
						{(t.raw("adItems") as string[]).map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</section>
			</div>
			<p className="mt-8 text-sm text-muted-foreground">
				{t("inventoryNote")}{" "}
				<Link href="/advertise" className="underline">
					→
				</Link>
			</p>
		</div>
	);
}
