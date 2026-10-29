import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CookieBanner } from "@/components/cookie-banner";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { ThemeProvider } from "@/components/theme-provider";
import { company, getSiteUrl } from "@/config/company";
import { routing, type Locale } from "@/i18n/routing";

const geistSans = localFont({
	src: "../fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
	params,
}: {
	params: { locale: string };
}): Promise<Metadata> {
	const locale = params.locale;
	const isEn = locale === "en";
	const siteUrl = getSiteUrl();

	return {
		metadataBase: new URL(siteUrl),
		title: {
			default: `${company.shortName} — ${isEn ? "IT services and advertising" : "IT-послуги та реклама"}`,
			template: `%s · ${company.shortName}`,
		},
		description: isEn
			? "LLC Legal Inform Service. Web development, support, advertising. Diia.City resident."
			: "ТОВ «ЛЕГАЛ ІНФОРМ ПОСЛУГИ». Веб-розробка, підтримка, реклама. Резидент Дія.City.",
		openGraph: {
			type: "website",
			locale: isEn ? "en_US" : "uk_UA",
			siteName: company.shortName,
			url: siteUrl,
		},
	};
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: { locale: string };
}) {
	const locale = params.locale;
	if (!routing.locales.includes(locale as Locale)) {
		notFound();
	}

	setRequestLocale(locale);
	const messages = await getMessages();

	return (
		<html lang={locale} suppressHydrationWarning className={geistSans.variable}>
			<body className="flex min-h-screen flex-col font-sans">
				<noscript>
					{/* Reveal blocks are hidden by CSS until gsap runs; without scripts nothing would lift that gate. */}
					<style>{`[data-reveal="pending"]{opacity:1 !important;transform:none !important;}`}</style>
				</noscript>
				<ThemeProvider>
					<NextIntlClientProvider locale={locale} messages={messages}>
						<JsonLd />
						<Header />
						<main id="main" className="flex-1">
							{children}
						</main>
						<Footer />
						<CookieBanner />
						<GoogleAnalytics />
					</NextIntlClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
