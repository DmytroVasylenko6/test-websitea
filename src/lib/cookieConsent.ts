export const COOKIE_CONSENT_KEY = "li-cookie-consent";
export const COOKIE_CONSENT_EVENT = "li-cookie-consent";

export const CONSENT_NECESSARY = "necessary";
export const CONSENT_ANALYTICS = "analytics";

/** Google Analytics loads only after an explicit analytics choice. */
export function isAnalyticsConsent(value: string | null): boolean {
	return value === CONSENT_ANALYTICS;
}
