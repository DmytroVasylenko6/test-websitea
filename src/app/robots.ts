import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/company";

export default function robots(): MetadataRoute.Robots {
	const siteUrl = getSiteUrl();

	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/api/"],
		},
		sitemap: `${siteUrl}/sitemap.xml`,
	};
}
