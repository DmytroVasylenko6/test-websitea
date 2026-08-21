import { describe, expect, test } from "@jest/globals";
import { getPublicEmail } from "../config/company";

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
