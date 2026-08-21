import { z } from "zod";

export const REQUEST_TYPES = ["it", "advertising", "partnership"] as const;
export type RequestType = (typeof REQUEST_TYPES)[number];

export const contactInputSchema = z
	.object({
		name: z.string().trim().min(2).max(120),
		phone: z.string().trim().max(32).optional().default(""),
		email: z
			.string()
			.trim()
			.max(120)
			.optional()
			.default("")
			.refine((value) => value === "" || z.string().email().safeParse(value).success),
		message: z.string().trim().min(10).max(4000),
		requestType: z.enum(REQUEST_TYPES),
		locale: z.enum(["uk", "en"]).optional(),
		format: z.string().trim().max(64).optional(),
		impressions: z.number().int().nonnegative().max(10_000_000).optional(),
		clicks: z.number().int().nonnegative().max(1_000_000).optional(),
		weeks: z.number().int().nonnegative().max(52).optional(),
		estimateUah: z.number().nonnegative().max(10_000_000).optional(),
	})
	.refine((data) => data.phone.length >= 8 || data.email.length > 3, {
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
			phone: z.string().trim().max(32),
			email: z
				.string()
				.trim()
				.max(120)
				.refine((value) => value === "" || z.string().email().safeParse(value).success, {
					message: errors.email,
				}),
			message: z.string().trim().min(10, errors.message).max(4000),
			requestType: z.enum(REQUEST_TYPES, { message: errors.requestType }),
		})
		.refine((data) => data.phone.length >= 8 || data.email.length > 3, {
			message: errors.contact,
			path: ["phone"],
		});
}
