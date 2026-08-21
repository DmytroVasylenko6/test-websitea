import { describe, expect, test } from "@jest/globals";
import { isRateLimited } from "./rateLimit";

describe("🤖 isRateLimited", () => {
	test("🤖 allows the first requests then blocks", () => {
		const key = `test-${Date.now()}`;
		expect(isRateLimited(key, 2, 60_000)).toBe(false);
		expect(isRateLimited(key, 2, 60_000)).toBe(false);
		expect(isRateLimited(key, 2, 60_000)).toBe(true);
	});
});
