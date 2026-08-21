import { getLocale, getTranslations } from "next-intl/server";
import { company, formatAddress, getPublicEmail } from "@/config/company";
import { Link } from "@/i18n/routing";

function formatDate(iso: string, locale: string) {
	return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "uk-UA", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date(`${iso}T00:00:00`));
}

export async function Footer() {
	const t = await getTranslations("footer");
	const locale = await getLocale();
	const email = getPublicEmail();
	const legalName = locale === "en" ? company.legalNameEn : company.legalNameUk;

	return (
		<footer className="mt-auto border-t bg-muted/40">
			<div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
				<div className="space-y-2 text-sm">
					<p className="font-medium">{legalName}</p>
					<p className="text-muted-foreground">
						{t("edrpou")} {company.edrpou}
					</p>
					<p className="text-muted-foreground">
						{t("resident", { date: formatDate(company.diiaCityFrom, locale) })}
					</p>
				</div>
				<div className="space-y-2 text-sm">
					<p className="font-medium">{t("requisites")}</p>
					<p className="text-muted-foreground">{formatAddress(locale === "en" ? "en" : "uk")}</p>
					<p>
						<a className="underline-offset-4 hover:underline" href={company.phoneHref}>
							{company.phone}
						</a>
					</p>
					{email ? (
						<p>
							<a className="underline-offset-4 hover:underline" href={`mailto:${email}`}>
								{email}
							</a>
						</p>
					) : null}
				</div>
				<div className="flex flex-col gap-2 text-sm">
					<Link href="/privacy-policy" className="hover:underline">
						{locale === "en" ? "Privacy policy" : "Політика конфіденційності"}
					</Link>
					<Link href="/terms" className="hover:underline">
						{locale === "en" ? "Terms of use" : "Правила користування"}
					</Link>
					<Link href="/cookie-policy" className="hover:underline">
						{locale === "en" ? "Cookie policy" : "Політика cookie"}
					</Link>
				</div>
			</div>
			<div className="border-t py-4 text-center text-xs text-muted-foreground">
				© {new Date().getFullYear()} {company.shortName}. {t("rights")}
			</div>
		</footer>
	);
}
