import { describe, expect, test } from "@jest/globals";
import { contactInputSchema } from "./contactSchema";

describe("🤖 contactInputSchema", () => {
	test("🤖 accepts a phone-only enquiry", () => {
		const result = contactInputSchema.safeParse({
			name: "Ігор",
			phone: "+380684908776",
			email: "",
			message: "Потрібна розробка корпоративного сайту",
			requestType: "it",
		});

		expect(result.success).toBe(true);
	});

	test("🤖 accepts an email-only enquiry", () => {
		const result = contactInputSchema.safeParse({
			name: "Anna",
			phone: "",
			email: "anna@client.example",
			message: "Need a partnership discussion",
			requestType: "partnership",
		});

		expect(result.success).toBe(true);
	});

	test("🤖 rejects missing contact details", () => {
		const result = contactInputSchema.safeParse({
			name: "Anna",
			phone: "",
			email: "",
			message: "Need a partnership discussion",
			requestType: "it",
		});

		expect(result.success).toBe(false);
	});

	test("🤖 rejects a short message", () => {
		const result = contactInputSchema.safeParse({
			name: "Anna",
			phone: "+380684908776",
			email: "",
			message: "Hi",
			requestType: "it",
		});

		expect(result.success).toBe(false);
	});
});
