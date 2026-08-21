import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { company, formatAddress, publicDocuments } from "@/config/company";
import { buildPageMetadata } from "@/lib/pageMeta";

export async function generateMetadata({ params }: { params: { locale: string } }) {
	return buildPageMetadata(params.locale, "diiaTitle");
}

function formatDate(iso: string, locale: string) {
	return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "uk-UA", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date(`${iso}T00:00:00`));
}

export default async function DiiaCityPage({ params }: { params: { locale: string } }) {
	setRequestLocale(params.locale);
	const t = await getTranslations("diia");
	const locale = await getLocale();
	const isEn = locale === "en";

	const rows = [
		{ label: t("fullName"), value: isEn ? company.legalNameEn : company.legalNameUk },
		{ label: t("edrpou"), value: company.edrpou },
		{ label: t("director"), value: isEn ? company.directorEn : company.directorUk },
		{ label: t("address"), value: formatAddress(isEn ? "en" : "uk") },
		{ label: t("registered"), value: formatDate(company.registeredAt, locale) },
	];

	return (
		<div className="mx-auto max-w-6xl px-4 py-16">
			<h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
			<p className="mt-3 max-w-3xl text-muted-foreground">{t("lead")}</p>

			<section className="mt-10 overflow-hidden rounded-xl border">
				<h2 className="border-b bg-muted/50 px-5 py-3 font-medium">{t("requisites")}</h2>
				<dl>
					{rows.map((row) => (
						<div key={row.label} className="grid gap-1 border-b px-5 py-4 last:border-b-0 md:grid-cols-[220px_1fr]">
							<dt className="text-sm text-muted-foreground">{row.label}</dt>
							<dd className="text-sm">{row.value}</dd>
						</div>
					))}
				</dl>
			</section>

			<section className="mt-10 rounded-xl border bg-card p-6">
				<h2 className="text-xl font-semibold">{t("residentTitle")}</h2>
				<p className="mt-3 text-sm text-muted-foreground">
					{t("residentBody", { date: formatDate(company.diiaCityFrom, locale) })}
				</p>
				<div className="mt-4 flex flex-wrap gap-4 text-sm">
					<a className="underline" href={company.diiaCityRegistryUrl} rel="noreferrer" target="_blank">
						{t("registryLink")}
					</a>
					<a className="underline" href={company.opendatabotUrl} rel="noreferrer" target="_blank">
						{t("opendatabot")}
					</a>
				</div>
			</section>

			<section className="mt-10">
				<h2 className="text-xl font-semibold">{t("docsTitle")}</h2>
				<p className="mt-2 text-sm text-muted-foreground">{t("docsLead")}</p>
				<ul className="mt-6 divide-y rounded-xl border">
					{publicDocuments.map((doc) => (
						<li key={doc.id} className="flex items-center justify-between gap-4 px-5 py-4">
							<span className="text-sm">{t(doc.id)}</span>
							<Button disabled size="sm" title={t("docPending")}>
								{t("docPending")}
							</Button>
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}
