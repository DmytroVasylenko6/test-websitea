import { describe, expect, test } from "@jest/globals";
import { estimatePlacement, formatContactTelegram } from "./formatContactTelegram";

describe("🤖 formatContactTelegram", () => {
	test("🤖 formats required fields and skips empty optional ones", () => {
		const message = formatContactTelegram({
			name: "Ігор",
			phone: "+380684908776",
			email: "",
			message: "Потрібна розробка сайту",
			requestType: "it",
			locale: "uk",
		});

		expect(message).toContain("Type: it");
		expect(message).toContain("Name: Ігор");
		expect(message).toContain("Phone: +380684908776");
		expect(message).not.toContain("Email:");
		expect(message).toContain("Потрібна розробка сайту");
	});

	test("🤖 includes advertising estimate fields", () => {
		const message = formatContactTelegram({
			name: "Anna",
			phone: "",
			email: "anna@client.example",
			message: "Banner placement please",
			requestType: "advertising",
			format: "header",
			impressions: 10000,
			estimateUah: 1200,
		});

		expect(message).toContain("Format: header");
		expect(message).toContain("Impressions: 10000");
		expect(message).toContain("Estimate UAH: 1200");
	});
});

describe("🤖 estimatePlacement", () => {
	test("🤖 sums CPM, CPC and weekly rates", () => {
		expect(estimatePlacement({ impressions: 1000, clicks: 1, weeks: 1 })).toBe(120 + 8 + 4500);
	});

	test("🤖 treats missing values as zero", () => {
		expect(estimatePlacement({})).toBe(0);
	});
});
