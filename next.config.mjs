import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const CANONICAL_SITE_URL = "https://legal-inform-service.com.ua";

/** Old hosts that still reach this app. Keep in sync with LEGACY_SITE_HOSTS in company.ts. */
const legacySiteHosts = ["web.legal-inform-service.com.ua", "www.legal-inform-service.com.ua"];

/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return legacySiteHosts.flatMap((host) => [
			{
				source: "/",
				has: [{ type: "host", value: host }],
				destination: CANONICAL_SITE_URL,
				permanent: true,
			},
			{
				source: "/:path+",
				has: [{ type: "host", value: host }],
				destination: `${CANONICAL_SITE_URL}/:path+`,
				permanent: true,
			},
		]);
	},
};

export default withNextIntl(nextConfig);
