import { afterEach, describe, expect, test } from "@jest/globals";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { CANONICAL_SITE_URL } from "@/config/company";
import { indexingMetadata, pageLanguageAlternates } from "@/lib/indexing";

describe("🤖 indexing metadata", () => {
	const siteUrl = CANONICAL_SITE_URL;

	test("🤖 points Ukrainian pages at the unprefixed URL and English at /en", () => {
		expect(pageLanguageAlternates(siteUrl, "/services")).toEqual({
			uk: `${siteUrl}/services`,
			en: `${siteUrl}/en/services`,
			"x-default": `${siteUrl}/services`,
		});
	});

	test("🤖 sets a self-referencing canonical for each locale", () => {
		expect(indexingMetadata("uk", "", siteUrl).alternates).toEqual({
			canonical: siteUrl,
			languages: {
				uk: siteUrl,
				en: `${siteUrl}/en`,
				"x-default": siteUrl,
			},
		});
		expect(indexingMetadata("en", "/contacts", siteUrl).openGraph).toEqual({
			url: `${siteUrl}/en/contacts`,
		});
	});
});

function setNodeEnv(nodeEnv: "production" | "test") {
	Object.assign(process.env, { NODE_ENV: nodeEnv });
}

describe("🤖 production sitemap and robots", () => {
	const originalUrl = process.env.NEXT_PUBLIC_SITE_URL;
	const originalNodeEnv = process.env.NODE_ENV === "production" ? "production" : "test";

	afterEach(() => {
		if (originalUrl === undefined) {
			delete process.env.NEXT_PUBLIC_SITE_URL;
		} else {
			process.env.NEXT_PUBLIC_SITE_URL = originalUrl;
		}
		setNodeEnv(originalNodeEnv);
	});

	test("🤖 advertises the canonical host even when the env still points at Render", () => {
		setNodeEnv("production");
		process.env.NEXT_PUBLIC_SITE_URL = "https://legal-inform.onrender.com";

		expect(robots().sitemap).toBe(`${CANONICAL_SITE_URL}/sitemap.xml`);

		const entries = sitemap();
		expect(entries).toHaveLength(18);
		expect(
			entries.every(
				(entry) => entry.url === CANONICAL_SITE_URL || entry.url.startsWith(`${CANONICAL_SITE_URL}/`),
			),
		).toBe(true);

		const home = entries.find((entry) => entry.url === CANONICAL_SITE_URL);
		expect(home?.alternates?.languages).toEqual({
			uk: CANONICAL_SITE_URL,
			en: `${CANONICAL_SITE_URL}/en`,
			"x-default": CANONICAL_SITE_URL,
		});
		expect(entries.some((entry) => entry.url.includes("onrender.com"))).toBe(false);
	});
});
