import { describe, expect, test } from "@jest/globals";
import { routing } from "./routing";

describe("🤖 routing", () => {
	test("🤖 keeps Ukrainian as the default and ignores the browser language", () => {
		expect(routing.locales).toEqual(["uk", "en"]);
		expect(routing.defaultLocale).toBe("uk");
		expect(routing.localeDetection).toBe(false);
		expect(routing.localePrefix).toBe("as-needed");
	});
});
