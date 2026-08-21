import { describe, expect, jest, test } from "@jest/globals";

jest.mock("next-intl/middleware", () => ({
	__esModule: true,
	default: () => () => undefined,
}));

import { config } from "./middleware";

/**
 * Next matchers use path-to-regexp syntax; only the `:param*` form is used here.
 */
function matches(pathname: string): boolean {
	return config.matcher.some((pattern) => {
		const source = pattern.replace(/\/:[a-zA-Z]+\*/g, "(?:/.*)?");
		return new RegExp(`^${source}$`).test(pathname);
	});
}

describe("🤖 middleware matcher", () => {
	test("🤖 skips metadata routes so they are served as files", () => {
		for (const pathname of [
			"/icon.svg",
			"/apple-icon",
			"/favicon.ico",
			"/robots.txt",
			"/sitemap.xml",
		]) {
			expect(matches(pathname)).toBe(false);
		}
	});

	test("🤖 skips api and framework internals", () => {
		expect(matches("/api/contact")).toBe(false);
		expect(matches("/_next/static/chunk.js")).toBe(false);
		expect(matches("/_vercel/insights")).toBe(false);
	});

	test("🤖 still handles the root and localized pages", () => {
		for (const pathname of ["/", "/services", "/uk", "/uk/contacts", "/en/portfolio"]) {
			expect(matches(pathname)).toBe(true);
		}
	});
});
