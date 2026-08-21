import { z } from "zod";

/** E.164 caps a number at 15 digits; 9 keeps out obviously truncated input. */
export const PHONE_DIGITS = { min: 9, max: 15 } as const;
/** Room for a formatted number such as "+380 (68) 490-87-76". */
export const PHONE_INPUT_MAX = 32;
export const EMAIL_MAX = 120;

/** Separators people actually type, plus an optional leading country plus. */
const PHONE_SHAPE = /^\+?[\d\s().-]+$/;

const emailSchema = z.string().email();

function text(value: unknown): string {
	return typeof value === "string" ? value.trim() : "";
}

export function phoneDigits(value: unknown): string {
	return text(value).replace(/\D/g, "");
}

export function isPhone(value: unknown): boolean {
	const phone = text(value);

	if (phone.length === 0 || phone.length > PHONE_INPUT_MAX || !PHONE_SHAPE.test(phone)) {
		return false;
	}

	const digits = phoneDigits(phone);
	return digits.length >= PHONE_DIGITS.min && digits.length <= PHONE_DIGITS.max;
}

/**
 * Keystroke-level filter for the phone field: keeps digits and the separators a
 * number is written with, allows a single leading plus, and drops everything else
 * so letters can never reach the field.
 */
export function sanitizePhoneInput(value: unknown): string {
	const raw = typeof value === "string" ? value : "";
	const leadingPlus = raw.trimStart().startsWith("+") ? "+" : "";
	const body = raw.replace(/[^\d\s().-]/g, "").trimStart();

	return `${leadingPlus}${body}`.slice(0, PHONE_INPUT_MAX);
}

/** Keeps the country prefix the visitor typed and drops the decoration around it. */
export function normalizePhone(value: unknown): string {
	const phone = text(value);
	const digits = phoneDigits(phone);

	if (digits.length === 0) {
		return "";
	}

	return phone.startsWith("+") ? `+${digits}` : digits;
}

export function isEmail(value: unknown): boolean {
	const email = text(value);

	return (
		email.length > 0 && email.length <= EMAIL_MAX && emailSchema.safeParse(email).success
	);
}

export function normalizeEmail(value: unknown): string {
	return text(value).toLowerCase();
}
