import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";
import { company, formatAddress, getMapsEmbedUrl, getMapsSearchUrl, getPublicEmail } from "@/config/company";
import { buildPageMetadata } from "@/lib/pageMeta";

export async function generateMetadata({ params }: { params: { locale: string } }) {
	return buildPageMetadata(params.locale, "contactsTitle");
}

export default async function ContactsPage({ params }: { params: { locale: string } }) {
	setRequestLocale(params.locale);
	const t = await getTranslations("contacts");
	const locale = await getLocale();
	const email = getPublicEmail();

	return (
		<>
			<PageHero title={t("title")} lead={t("lead")} variant="contacts" />
			<div className="mx-auto max-w-6xl px-4 py-16">
			<div className="grid gap-10 lg:grid-cols-2">
				<div className="space-y-4 text-sm">
					<div>
						<p className="font-medium">{t("address")}</p>
						<p className="mt-1 text-muted-foreground">
							{formatAddress(locale === "en" ? "en" : "uk")}
						</p>
					</div>
					<div>
						<p className="font-medium">{t("phone")}</p>
						<a className="mt-1 inline-block underline" href={company.phoneHref}>
							{company.phone}
						</a>
					</div>
					{email ? (
						<div>
							<p className="font-medium">{t("email")}</p>
							<a className="mt-1 inline-block underline" href={`mailto:${email}`}>
								{email}
							</a>
						</div>
					) : null}
					<div>
						<p className="font-medium">{t("map")}</p>
						<div className="mt-3 overflow-hidden rounded-xl border">
							<iframe
								title={t("map")}
								src={getMapsEmbedUrl()}
								className="h-64 w-full"
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
							/>
						</div>
						<a className="mt-2 inline-block text-sm underline" href={getMapsSearchUrl()} target="_blank" rel="noreferrer">
							{t("openMap")}
						</a>
					</div>
				</div>
				<div>
					<h2 className="mb-4 text-xl font-semibold">{t("formTitle")}</h2>
					<LeadForm />
				</div>
			</div>
			</div>
		</>
	);
}
