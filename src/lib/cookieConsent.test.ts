import { describe, expect, test } from "@jest/globals";
import { CONSENT_ANALYTICS, CONSENT_NECESSARY, isAnalyticsConsent } from "./cookieConsent";

describe("🤖 isAnalyticsConsent", () => {
	test("🤖 allows analytics only for the analytics choice", () => {
		expect(isAnalyticsConsent(CONSENT_ANALYTICS)).toBe(true);
		expect(isAnalyticsConsent(CONSENT_NECESSARY)).toBe(false);
		expect(isAnalyticsConsent(null)).toBe(false);
		expect(isAnalyticsConsent("")).toBe(false);
	});
});
