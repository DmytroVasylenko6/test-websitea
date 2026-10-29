import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/company";
import { indexablePages, pageLanguageAlternates } from "@/lib/indexing";

export default function sitemap(): MetadataRoute.Sitemap {
	const siteUrl = getSiteUrl();

	return indexablePages.flatMap(({ path }) => {
		const languages = pageLanguageAlternates(siteUrl, path);
		return [
			{
				url: languages.uk,
				alternates: { languages },
			},
			{
				url: languages.en,
				alternates: { languages },
			},
		];
	});
}
