import { getLocale, getTranslations } from "next-intl/server";
import { company, getPublicEmail, getSiteUrl } from "@/config/company";

export async function JsonLd() {
	const locale = await getLocale();
	const t = await getTranslations("jsonLd");
	const email = getPublicEmail();
	const isEn = locale === "en";

	const data = {
		"@context": "https://schema.org",
		"@type": ["Organization", "LocalBusiness", "ProfessionalService"],
		name: isEn ? company.shortLegalNameEn : company.shortLegalNameUk,
		legalName: isEn ? company.legalNameEn : company.legalNameUk,
		url: getSiteUrl(),
		telephone: company.phone,
		email: email ?? undefined,
		taxID: company.edrpou,
		foundingDate: company.registeredAt,
		description: t("description"),
		address: {
			"@type": "PostalAddress",
			streetAddress: isEn ? company.address.streetEn : company.address.streetUk,
			addressLocality: isEn ? company.address.cityEn : company.address.cityUk,
			addressRegion: isEn ? company.address.regionEn : company.address.regionUk,
			postalCode: company.address.postalCode,
			addressCountry: company.address.countryCode,
		},
		areaServed: "UA",
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}
