import { describe, expect, test } from "@jest/globals";
import { maskSecret } from "./maskSecret";

describe("🤖 maskSecret", () => {
	test("🤖 returns a placeholder for empty values", () => {
		expect(maskSecret()).toBe("[empty]");
		expect(maskSecret("")).toBe("[empty]");
	});

	test("🤖 fully masks short secrets", () => {
		expect(maskSecret("abcd")).toBe("***");
	});

	test("🤖 keeps a few leading and trailing characters", () => {
		expect(maskSecret("1234567890abcdef")).toBe("123…def");
	});
});
