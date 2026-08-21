import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeroBackground } from "@/components/hero-background";
import { HeroBanner } from "@/components/hero-banner";
import { LeadStudio } from "@/components/lead-studio";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/pageMeta";

export async function generateMetadata({ params }: { params: { locale: string } }) {
	return buildPageMetadata(params.locale, "homeTitle");
}

/* The hero is the LCP block, so it enters with CSS instead of waiting for the gsap chunk. */
const heroEnter = "hero-enter";

export default async function HomePage({ params }: { params: { locale: string } }) {
	setRequestLocale(params.locale);
	const t = await getTranslations("home");

	return (
		<>
			{/* Full-width so the animated field starts right under the header, with no gap. */}
			<section className="relative isolate">
				<HeroBackground />
				<div className="mx-auto grid max-w-6xl gap-8 px-4 pb-8 pt-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:pb-12 lg:pt-16">
					<div className="space-y-6">
						<Badge variant="outline" className={heroEnter}>
							{t("badge")}
						</Badge>
						<h1
							className={`text-balance text-4xl font-semibold tracking-tight md:text-5xl ${heroEnter} hero-enter-1`}
						>
							{t("heroTitle")}
						</h1>
						<p className={`max-w-2xl text-lg text-muted-foreground ${heroEnter} hero-enter-2`}>
							{t("heroLead")}
						</p>
						<div className={`flex flex-wrap gap-3 ${heroEnter} hero-enter-3`}>
							<Button asChild>
								<a href="#lead">{t("ctaPrimary")}</a>
							</Button>
							<Button asChild variant="outline">
								<Link href="/services">{t("ctaSecondary")}</Link>
							</Button>
						</div>
					</div>
					<HeroBanner />
				</div>
			</section>

			<div className="mx-auto max-w-6xl px-4 pb-16 pt-12 lg:pt-16">
				<section className="space-y-6">
					<Reveal>
						<h2 className="text-2xl font-semibold">{t("servicesTitle")}</h2>
						<p className="mt-2 text-muted-foreground">{t("servicesLead")}</p>
					</Reveal>
					<Reveal variant="stagger" stagger={0.1} className="grid gap-4 md:grid-cols-2">
						<Link href="/services">
							<Card className="h-full transition-colors hover:border-primary/40">
								<CardHeader>
									<CardTitle>{t("itCardTitle")}</CardTitle>
									<CardDescription>{t("itCardBody")}</CardDescription>
								</CardHeader>
								<CardContent className="text-sm text-primary">{t("learnMore")}</CardContent>
							</Card>
						</Link>
						<Link href="/services">
							<Card className="h-full transition-colors hover:border-primary/40">
								<CardHeader>
									<CardTitle>{t("adCardTitle")}</CardTitle>
									<CardDescription>{t("adCardBody")}</CardDescription>
								</CardHeader>
								<CardContent className="text-sm text-primary">{t("learnMore")}</CardContent>
							</Card>
						</Link>
					</Reveal>
				</section>

				<section className="mt-20 rounded-2xl border bg-card p-8">
					<Reveal variant="line" className="mb-6 h-px w-full bg-primary/40" />
					<Reveal>
						<h2 className="text-2xl font-semibold">{t("advertiseTitle")}</h2>
						<p className="mt-3 max-w-3xl text-muted-foreground">{t("advertiseLead")}</p>
						<Button asChild className="mt-6">
							<Link href="/advertise">{t("advertiseCta")}</Link>
						</Button>
					</Reveal>
				</section>

				<Reveal as="section" className="mt-20">
					<h2 className="text-2xl font-semibold">{t("portfolioTitle")}</h2>
					<p className="mt-3 max-w-3xl text-muted-foreground">{t("portfolioLead")}</p>
					<Button asChild variant="outline" className="mt-6">
						<Link href="/portfolio">{t("learnMore")}</Link>
					</Button>
				</Reveal>

				<section className="mt-20">
					<h2 className="sr-only">{t("trustTitle")}</h2>
					<Reveal variant="stagger" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{[t("trustResident"), t("trustKved"), t("trustStack"), t("trustLegal")].map((item) => (
							<div key={item} className="rounded-xl border bg-card p-5 text-sm">
								{item}
							</div>
						))}
					</Reveal>
				</section>

				<section id="lead" className="mt-20">
					<Reveal className="mb-6">
						<h2 className="text-2xl font-semibold">{t("ctaTitle")}</h2>
					</Reveal>
					<LeadStudio />
				</section>
			</div>
		</>
	);
}
