import { z } from "zod";
import {
	EMAIL_MAX,
	PHONE_INPUT_MAX,
	isEmail,
	isPhone,
	normalizeEmail,
	normalizePhone,
} from "./contactChannels";

export const REQUEST_TYPES = ["it", "advertising", "partnership"] as const;
export type RequestType = (typeof REQUEST_TYPES)[number];

/**
 * Both channels are optional on their own, but each one must be well formed when
 * filled, and the object refinement below requires at least one of them.
 */
function phoneField(message?: string) {
	return z
		.string()
		.trim()
		.max(PHONE_INPUT_MAX)
		.refine((value) => value === "" || isPhone(value), { message })
		.transform(normalizePhone);
}

function emailField(message?: string) {
	return z
		.string()
		.trim()
		.max(EMAIL_MAX)
		.refine((value) => value === "" || isEmail(value), { message })
		.transform(normalizeEmail);
}

export const contactInputSchema = z
	.object({
		name: z.string().trim().min(2).max(120),
		phone: phoneField().optional().default(""),
		email: emailField().optional().default(""),
		message: z.string().trim().min(10).max(4000),
		requestType: z.enum(REQUEST_TYPES),
		locale: z.enum(["uk", "en"]).optional(),
		format: z.string().trim().max(64).optional(),
		impressions: z.number().int().nonnegative().max(10_000_000).optional(),
		clicks: z.number().int().nonnegative().max(1_000_000).optional(),
		weeks: z.number().int().nonnegative().max(52).optional(),
		estimateUah: z.number().nonnegative().max(10_000_000).optional(),
	})
	.refine((data) => isPhone(data.phone) || isEmail(data.email), {
		message: "contact",
		path: ["phone"],
	});

export type ContactInput = z.infer<typeof contactInputSchema>;

export function createClientContactSchema(errors: {
	name: string;
	contact: string;
	email: string;
	phone: string;
	message: string;
	requestType: string;
}) {
	return z
		.object({
			name: z.string().trim().min(2, errors.name).max(120),
			phone: phoneField(errors.phone),
			email: emailField(errors.email),
			message: z.string().trim().min(10, errors.message).max(4000),
			requestType: z.enum(REQUEST_TYPES, { message: errors.requestType }),
		})
		.refine((data) => isPhone(data.phone) || isEmail(data.email), {
			message: errors.contact,
			path: ["phone"],
		});
}
