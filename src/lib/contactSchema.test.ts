import { describe, expect, test } from "@jest/globals";
import { contactInputSchema, createClientContactSchema } from "./contactSchema";

const base = {
	name: "Ігор",
	phone: "+380684908776",
	email: "",
	message: "Потрібна розробка корпоративного сайту",
	requestType: "it" as const,
};

const messages = {
	name: "name-error",
	contact: "contact-error",
	email: "email-error",
	phone: "phone-error",
	message: "message-error",
	requestType: "requestType-error",
};

const clientSchema = createClientContactSchema(messages);

/** First error message reported for a field, so tests can assert which rule fired. */
function fieldError(
	result: ReturnType<typeof clientSchema.safeParse>,
	field: string,
): string | undefined {
	if (result.success) {
		return undefined;
	}

	return result.error.issues.find((issue) => issue.path[0] === field)?.message;
}

describe("🤖 contactInputSchema", () => {
	test("🤖 accepts a phone-only enquiry", () => {
		expect(contactInputSchema.safeParse(base).success).toBe(true);
	});

	test("🤖 accepts an email-only enquiry", () => {
		const result = contactInputSchema.safeParse({
			...base,
			phone: "",
			email: "anna@client.example",
		});

		expect(result.success).toBe(true);
	});

	test("🤖 accepts a missing phone and email key only when the other channel is valid", () => {
		expect(
			contactInputSchema.safeParse({
				name: base.name,
				message: base.message,
				requestType: base.requestType,
				email: "anna@client.example",
			}).success,
		).toBe(true);

		expect(
			contactInputSchema.safeParse({
				name: base.name,
				message: base.message,
				requestType: base.requestType,
			}).success,
		).toBe(false);
	});

	test("🤖 rejects missing contact details", () => {
		expect(contactInputSchema.safeParse({ ...base, phone: "", email: "" }).success).toBe(
			false,
		);
	});

	test("🤖 rejects a malformed phone even when an email is present", () => {
		const result = contactInputSchema.safeParse({
			...base,
			phone: "067 ABC 45",
			email: "anna@client.example",
		});

		expect(result.success).toBe(false);
	});

	test("🤖 rejects a malformed email even when a phone is present", () => {
		expect(contactInputSchema.safeParse({ ...base, email: "anna@client" }).success).toBe(
			false,
		);
	});

	test("🤖 rejects a truncated phone", () => {
		expect(contactInputSchema.safeParse({ ...base, phone: "+38067" }).success).toBe(false);
	});

	test("🤖 normalizes the channels it stores", () => {
		const result = contactInputSchema.safeParse({
			...base,
			phone: "+380 (68) 490-87-76",
			email: " Office@Legal.UA ",
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.phone).toBe("+380684908776");
			expect(result.data.email).toBe("office@legal.ua");
		}
	});

	test("🤖 rejects a short message", () => {
		expect(contactInputSchema.safeParse({ ...base, message: "Hi" }).success).toBe(false);
	});
});

describe("🤖 createClientContactSchema", () => {
	test("🤖 accepts a filled form", () => {
		expect(clientSchema.safeParse(base).success).toBe(true);
	});

	test("🤖 reports the phone rule for a malformed number", () => {
		expect(fieldError(clientSchema.safeParse({ ...base, phone: "067 ABC" }), "phone")).toBe(
			messages.phone,
		);
	});

	test("🤖 reports the email rule for a malformed address", () => {
		expect(fieldError(clientSchema.safeParse({ ...base, email: "anna@" }), "email")).toBe(
			messages.email,
		);
	});

	test("🤖 reports the missing-contact rule on the phone field", () => {
		expect(
			fieldError(clientSchema.safeParse({ ...base, phone: "", email: "" }), "phone"),
		).toBe(messages.contact);
	});

	test("🤖 keeps the other field rules", () => {
		expect(fieldError(clientSchema.safeParse({ ...base, name: "І" }), "name")).toBe(
			messages.name,
		);
		expect(fieldError(clientSchema.safeParse({ ...base, message: "Hi" }), "message")).toBe(
			messages.message,
		);
		expect(
			fieldError(clientSchema.safeParse({ ...base, requestType: "spam" }), "requestType"),
		).toBe(messages.requestType);
	});

	test("🤖 hands normalized values to the submit handler", () => {
		const result = clientSchema.safeParse({
			...base,
			phone: "067 123 45 67",
			email: "Office@Legal.UA",
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.phone).toBe("0671234567");
			expect(result.data.email).toBe("office@legal.ua");
		}
	});
});
