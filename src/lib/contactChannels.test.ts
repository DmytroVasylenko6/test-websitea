import { describe, expect, test } from "@jest/globals";
import {
	EMAIL_MAX,
	PHONE_DIGITS,
	PHONE_INPUT_MAX,
	isEmail,
	isPhone,
	normalizeEmail,
	normalizePhone,
	phoneDigits,
	sanitizePhoneInput,
} from "./contactChannels";

describe("🤖 phoneDigits", () => {
	test("🤖 keeps only the digits", () => {
		expect(phoneDigits("+380 (68) 490-87-76")).toBe("380684908776");
		expect(phoneDigits("  067.123.45.67  ")).toBe("0671234567");
	});

	test("🤖 returns an empty string for anything unusable", () => {
		for (const value of ["", "   ", "abc", undefined, null, 42]) {
			expect(phoneDigits(value)).toBe("");
		}
	});
});

describe("🤖 isPhone", () => {
	test("🤖 accepts the formats visitors actually type", () => {
		for (const value of [
			"+380671234567",
			"+380 67 123 45 67",
			"+380 (67) 123-45-67",
			"0671234567",
			"067 123 45 67",
			"+1 202 555 0125",
		]) {
			expect(isPhone(value)).toBe(true);
		}
	});

	test("🤖 rejects letters and stray symbols", () => {
		for (const value of ["+380 67 ABC 45 67", "call me", "+380671234567;", "067/1234567"]) {
			expect(isPhone(value)).toBe(false);
		}
	});

	test("🤖 rejects a plus that is not the country prefix", () => {
		expect(isPhone("++380671234567")).toBe(false);
		expect(isPhone("380+671234567")).toBe(false);
	});

	test("🤖 enforces the digit bounds", () => {
		expect(isPhone("1".repeat(PHONE_DIGITS.min - 1))).toBe(false);
		expect(isPhone("1".repeat(PHONE_DIGITS.min))).toBe(true);
		expect(isPhone(`+${"1".repeat(PHONE_DIGITS.max)}`)).toBe(true);
		expect(isPhone(`+${"1".repeat(PHONE_DIGITS.max + 1)}`)).toBe(false);
	});

	test("🤖 rejects input longer than the field allows", () => {
		expect(isPhone(`+380${" ".repeat(PHONE_INPUT_MAX)}671234567`)).toBe(false);
	});

	test("🤖 rejects empty and non-string values", () => {
		for (const value of ["", "   ", undefined, null, 380671234567]) {
			expect(isPhone(value)).toBe(false);
		}
	});
});

describe("🤖 sanitizePhoneInput", () => {
	test("🤖 keeps digits and the separators a number is written with", () => {
		for (const value of ["+380 (67) 123-45-67", "067.123.45.67", "+380671234567"]) {
			expect(sanitizePhoneInput(value)).toBe(value);
		}
	});

	test("🤖 drops letters and other characters as they are typed", () => {
		expect(sanitizePhoneInput("067abc123")).toBe("067123");
		expect(sanitizePhoneInput("тел 067 123 45 67")).toBe(" 067 123 45 67".trimStart());
		expect(sanitizePhoneInput("067/123#45$67")).toBe("0671234567");
		expect(sanitizePhoneInput("067 123 45 67 🙂")).toBe("067 123 45 67 ");
	});

	test("🤖 allows a plus only as the country prefix", () => {
		expect(sanitizePhoneInput("+")).toBe("+");
		expect(sanitizePhoneInput("+380+67")).toBe("+38067");
		expect(sanitizePhoneInput("380+671234567")).toBe("380671234567");
	});

	test("🤖 never exceeds the field limit", () => {
		expect(sanitizePhoneInput(`+${"1".repeat(PHONE_INPUT_MAX * 2)}`)).toHaveLength(
			PHONE_INPUT_MAX,
		);
	});

	test("🤖 returns an empty string for non-string input", () => {
		for (const value of [undefined, null, 380671234567]) {
			expect(sanitizePhoneInput(value)).toBe("");
		}
	});

	test("🤖 leaves an already valid number acceptable to the validator", () => {
		const typed = sanitizePhoneInput("+380 (67) 123-45-67");

		expect(isPhone(typed)).toBe(true);
		expect(normalizePhone(typed)).toBe("+380671234567");
	});
});

describe("🤖 normalizePhone", () => {
	test("🤖 strips the decoration and keeps the typed country prefix", () => {
		expect(normalizePhone("+380 (67) 123-45-67")).toBe("+380671234567");
		expect(normalizePhone("067 123 45 67")).toBe("0671234567");
	});

	test("🤖 does not invent a country prefix", () => {
		expect(normalizePhone("380671234567")).toBe("380671234567");
	});

	test("🤖 collapses unusable input to an empty string", () => {
		for (const value of ["", "  ", "phone", undefined, null]) {
			expect(normalizePhone(value)).toBe("");
		}
	});
});

describe("🤖 isEmail", () => {
	test("🤖 accepts ordinary addresses", () => {
		for (const value of ["office@legal.ua", "ihor.v+tag@company.co.uk", " office@legal.ua "]) {
			expect(isEmail(value)).toBe(true);
		}
	});

	test("🤖 rejects half-typed and malformed addresses", () => {
		for (const value of [
			"office@",
			"office@legal",
			"@legal.ua",
			"office legal.ua",
			"office@@legal.ua",
			"office@legal..ua",
		]) {
			expect(isEmail(value)).toBe(false);
		}
	});

	test("🤖 rejects an address longer than the field allows", () => {
		expect(isEmail(`${"a".repeat(EMAIL_MAX)}@legal.ua`)).toBe(false);
	});

	test("🤖 rejects empty and non-string values", () => {
		for (const value of ["", "   ", undefined, null, 5]) {
			expect(isEmail(value)).toBe(false);
		}
	});
});

describe("🤖 normalizeEmail", () => {
	test("🤖 trims and lowercases", () => {
		expect(normalizeEmail("  Office@Legal.UA ")).toBe("office@legal.ua");
	});

	test("🤖 collapses unusable input to an empty string", () => {
		for (const value of [undefined, null, "   "]) {
			expect(normalizeEmail(value)).toBe("");
		}
	});
});
