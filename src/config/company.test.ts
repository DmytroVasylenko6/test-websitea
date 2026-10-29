import { afterEach, describe, expect, test } from "@jest/globals";
import { CANONICAL_SITE_URL, getPublicEmail, getSiteUrl } from "../config/company";

describe("🤖 getPublicEmail", () => {
	const original = process.env.CONTACT_EMAIL;

	test("🤖 hides example.com and empty values", () => {
		process.env.CONTACT_EMAIL = "";
		expect(getPublicEmail()).toBeNull();
		process.env.CONTACT_EMAIL = "info@example.com";
		expect(getPublicEmail()).toBeNull();
		process.env.CONTACT_EMAIL = original;
	});

	test("🤖 returns a real mailbox", () => {
		process.env.CONTACT_EMAIL = "office@legalinform.ua";
		expect(getPublicEmail()).toBe("office@legalinform.ua");
		process.env.CONTACT_EMAIL = original;
	});
});

function setNodeEnv(nodeEnv: "production" | "development" | "test") {
	Object.assign(process.env, { NODE_ENV: nodeEnv });
}

describe("🤖 getSiteUrl", () => {
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

	test("🤖 uses localhost when no origin is configured outside production", () => {
		setNodeEnv("test");
		delete process.env.NEXT_PUBLIC_SITE_URL;
		expect(getSiteUrl()).toBe("http://localhost:3000");
	});

	test("🤖 keeps a local origin outside production", () => {
		setNodeEnv("development");
		process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000/";
		expect(getSiteUrl()).toBe("http://localhost:3000");
	});

	test("🤖 ignores stale hosts in production", () => {
		setNodeEnv("production");
		for (const configured of [
			"https://legal-inform.onrender.com",
			"https://ihor-site.vercel.app/",
			"http://localhost:3000",
			"https://web.legal-inform-service.com.ua",
			"https://www.legal-inform-service.com.ua/",
			"https://web.legal-inform-service.com.ua/services",
		]) {
			process.env.NEXT_PUBLIC_SITE_URL = configured;
			expect(getSiteUrl()).toBe(CANONICAL_SITE_URL);
		}
		expect(CANONICAL_SITE_URL).toBe("https://legal-inform-service.com.ua");
	});

	test("🤖 uses an explicit https origin in production", () => {
		setNodeEnv("production");
		process.env.NEXT_PUBLIC_SITE_URL = "https://ads.legal-inform-service.com.ua/";
		expect(getSiteUrl()).toBe("https://ads.legal-inform-service.com.ua");
	});
});
