import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/company";

const paths = [
	"",
	"/services",
	"/advertise",
	"/portfolio",
	"/diia-city",
	"/contacts",
	"/privacy-policy",
	"/terms",
	"/cookie-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
	const siteUrl = getSiteUrl();

	return paths.flatMap((path) => [
		{
			url: `${siteUrl}${path}`,
			alternates: {
				languages: {
					uk: `${siteUrl}${path}`,
					en: `${siteUrl}/en${path}`,
				},
			},
		},
		{
			url: `${siteUrl}/en${path}`,
			alternates: {
				languages: {
					uk: `${siteUrl}${path}`,
					en: `${siteUrl}/en${path}`,
				},
			},
		},
	]);
}
