import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadForm } from "@/components/lead-form";
import { Link } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/pageMeta";

export async function generateMetadata({ params }: { params: { locale: string } }) {
	return buildPageMetadata(params.locale, "homeTitle");
}

export default async function HomePage({ params }: { params: { locale: string } }) {
	setRequestLocale(params.locale);
	const t = await getTranslations("home");

	return (
		<div className="mx-auto max-w-6xl px-4 py-16">
			<section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
				<div className="space-y-6">
					<Badge variant="outline">{t("badge")}</Badge>
					<h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
						{t("heroTitle")}
					</h1>
					<p className="max-w-2xl text-lg text-muted-foreground">{t("heroLead")}</p>
					<div className="flex flex-wrap gap-3">
						<Button asChild>
							<a href="#lead">{t("ctaPrimary")}</a>
						</Button>
						<Button asChild variant="outline">
							<Link href="/services">{t("ctaSecondary")}</Link>
						</Button>
					</div>
				</div>
			</section>

			<section className="mt-20 space-y-6">
				<div>
					<h2 className="text-2xl font-semibold">{t("servicesTitle")}</h2>
					<p className="mt-2 text-muted-foreground">{t("servicesLead")}</p>
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					<Link href="/services">
						<Card>
							<CardHeader>
								<CardTitle>{t("itCardTitle")}</CardTitle>
								<CardDescription>{t("itCardBody")}</CardDescription>
							</CardHeader>
							<CardContent className="text-sm text-primary">{t("learnMore")}</CardContent>
						</Card>
					</Link>
					<Link href="/services">
						<Card>
							<CardHeader>
								<CardTitle>{t("adCardTitle")}</CardTitle>
								<CardDescription>{t("adCardBody")}</CardDescription>
							</CardHeader>
							<CardContent className="text-sm text-primary">{t("learnMore")}</CardContent>
						</Card>
					</Link>
				</div>
			</section>

			<section className="mt-20 rounded-2xl border bg-card p-8">
				<h2 className="text-2xl font-semibold">{t("advertiseTitle")}</h2>
				<p className="mt-3 max-w-3xl text-muted-foreground">{t("advertiseLead")}</p>
				<Button asChild className="mt-6">
					<Link href="/advertise">{t("advertiseCta")}</Link>
				</Button>
			</section>

			<section className="mt-20">
				<h2 className="text-2xl font-semibold">{t("portfolioTitle")}</h2>
				<p className="mt-3 max-w-3xl text-muted-foreground">{t("portfolioLead")}</p>
				<Button asChild variant="outline" className="mt-6">
					<Link href="/portfolio">{t("learnMore")}</Link>
				</Button>
			</section>

			<section className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<h2 className="sr-only">{t("trustTitle")}</h2>
				{[t("trustResident"), t("trustKved"), t("trustStack"), t("trustLegal")].map((item) => (
					<div key={item} className="rounded-xl border bg-card p-5 text-sm">
						{item}
					</div>
				))}
			</section>

			<section id="lead" className="mt-20 max-w-xl">
				<h2 className="mb-6 text-2xl font-semibold">{t("ctaTitle")}</h2>
				<LeadForm />
			</section>
		</div>
	);
}
