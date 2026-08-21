import { describe, expect, test } from "@jest/globals";
import { createClientContactSchema } from "./contactSchema";
import {
	LEAD_MINIMUMS,
	LEAD_STAGE_IDS,
	leadCompletion,
	leadDoneCount,
	leadReady,
	leadStageRatio,
	leadStages,
	nextLeadStage,
	stageLinkFill,
	type LeadValues,
} from "./leadProgress";

const complete: LeadValues = {
	name: "Ігор",
	phone: "+380671234567",
	email: "",
	message: "Потрібен лендинг і підтримка.",
	requestType: "it",
};

const schema = createClientContactSchema({
	name: "name",
	contact: "contact",
	email: "email",
	phone: "phone",
	message: "message",
	requestType: "requestType",
});

describe("🤖 leadStageRatio", () => {
	test("🤖 grows with the name up to the schema minimum", () => {
		expect(leadStageRatio("name", { name: "" })).toBe(0);
		expect(leadStageRatio("name", { name: "І" })).toBe(1 / LEAD_MINIMUMS.name);
		expect(leadStageRatio("name", { name: "Ігор" })).toBe(1);
	});

	test("🤖 ignores whitespace-only input", () => {
		for (const id of LEAD_STAGE_IDS) {
			if (id === "requestType") {
				continue;
			}
			expect(leadStageRatio(id, { name: "   ", phone: "  ", message: "  \n " })).toBe(0);
		}
	});

	test("🤖 follows whichever contact channel is further along", () => {
		expect(leadStageRatio("contact", { phone: "+380671234567" })).toBe(1);
		expect(leadStageRatio("contact", { email: "office@legal.ua" })).toBe(1);
		expect(leadStageRatio("contact", { phone: "+380", email: "office@" })).toBeWithin(0, 1);
	});

	test("🤖 keeps a half-typed channel below completion", () => {
		expect(leadStageRatio("contact", { email: "office@legal" })).toBeLessThan(1);
		expect(leadStageRatio("contact", { phone: "+38067" })).toBeLessThan(1);
		expect(leadStageRatio("contact", { phone: "067 ABC 45 67" })).toBeLessThan(1);
	});

	test("🤖 counts the digits of a formatted phone, not its punctuation", () => {
		expect(leadStageRatio("contact", { phone: "+380 (67) 123-45-67" })).toBe(1);
	});

	test("🤖 treats the preselected request type as chosen and an unknown one as empty", () => {
		expect(leadStageRatio("requestType", { requestType: "it" })).toBe(1);
		expect(leadStageRatio("requestType", { requestType: "spam" })).toBe(0);
		expect(leadStageRatio("requestType", {})).toBe(0);
	});

	test("🤖 grows with the message up to its minimum", () => {
		expect(leadStageRatio("message", { message: "коротко" })).toBeWithin(0, 1);
		expect(leadStageRatio("message", { message: "x".repeat(LEAD_MINIMUMS.message) })).toBe(1);
		expect(leadStageRatio("message", { message: "x".repeat(400) })).toBe(1);
	});

	test("🤖 survives missing and non-string values", () => {
		const values = { name: undefined, phone: null, message: 42 } as unknown as LeadValues;

		for (const id of LEAD_STAGE_IDS) {
			expect(leadStageRatio(id, values)).toBeWithin(-0.001, 1.001);
		}
	});
});

describe("🤖 leadStages", () => {
	test("🤖 keeps the form order", () => {
		expect(leadStages(complete).map((stage) => stage.id)).toEqual([...LEAD_STAGE_IDS]);
	});

	test("🤖 marks a block done only at full ratio", () => {
		const stages = leadStages({ ...complete, message: "коротко" });

		expect(stages.find((stage) => stage.id === "message")?.done).toBe(false);
		expect(stages.find((stage) => stage.id === "name")?.done).toBe(true);
	});

	test("🤖 handles being called without values", () => {
		expect(leadStages()).toBeArrayOfSize(LEAD_STAGE_IDS.length);
		expect(leadDoneCount(leadStages())).toBe(0);
	});
});

describe("🤖 leadCompletion", () => {
	test("🤖 stays between an empty and a finished form", () => {
		expect(leadCompletion(leadStages({}))).toBe(0);
		expect(leadCompletion(leadStages(complete))).toBe(1);
	});

	test("🤖 rises as fields are filled", () => {
		const steps: LeadValues[] = [
			{},
			{ requestType: "it" },
			{ requestType: "it", name: "Ігор" },
			{ requestType: "it", name: "Ігор", phone: "+380671234567" },
			complete,
		];
		const values = steps.map((step) => leadCompletion(leadStages(step)));

		for (let index = 1; index < values.length; index += 1) {
			expect(values[index]).toBeGreaterThan(values[index - 1]);
		}
	});

	test("🤖 returns zero for an empty stage list", () => {
		expect(leadCompletion([])).toBe(0);
	});
});

describe("🤖 stageLinkFill", () => {
	test("🤖 keeps every segment dark on an empty form", () => {
		const stages = leadStages({});

		for (let index = 0; index < stages.length; index += 1) {
			expect(stageLinkFill(stages, index)).toBe(0);
		}
	});

	test("🤖 leaves the segment of an unfinished block dark", () => {
		const stages = leadStages({ requestType: "it", name: "І" });

		expect(stageLinkFill(stages, 0)).toBe(0);
	});

	test("🤖 lights a finished block's segment only as far as the next block got", () => {
		const stages = leadStages({ name: "Ігор", requestType: "it" });
		const contact = stages[1].ratio;

		expect(stageLinkFill(stages, 0)).toBe(contact);
		expect(stageLinkFill(stages, 0)).toBeLessThan(1);
	});

	test("🤖 never runs past a block that is still empty", () => {
		const stages = leadStages({ name: "Ігор", phone: "+380671234567", requestType: "it" });

		// name -> contact and contact -> type are complete, type -> message is empty.
		expect(stageLinkFill(stages, 0)).toBe(1);
		expect(stageLinkFill(stages, 1)).toBe(1);
		expect(stageLinkFill(stages, 2)).toBe(0);
	});

	test("🤖 reaches the enquiry node only for a fully ready form", () => {
		const last = leadStages(complete).length - 1;

		expect(stageLinkFill(leadStages(complete), last)).toBe(1);
		expect(stageLinkFill(leadStages({ ...complete, name: "" }), last)).toBe(0);
	});

	test("🤖 ignores an index outside the block list", () => {
		const stages = leadStages(complete);

		expect(stageLinkFill(stages, -1)).toBe(0);
		expect(stageLinkFill(stages, 99)).toBe(0);
		expect(stageLinkFill([], 0)).toBe(0);
	});
});

describe("🤖 leadReady / nextLeadStage", () => {
	test("🤖 reports the first block that still needs input", () => {
		expect(nextLeadStage(leadStages({ requestType: "it" }))).toBe("name");
		expect(nextLeadStage(leadStages({ ...complete, message: "" }))).toBe("message");
		expect(nextLeadStage(leadStages(complete))).toBeNull();
	});

	test("🤖 is ready only when every block is done", () => {
		expect(leadReady(leadStages(complete))).toBe(true);
		expect(leadReady(leadStages({ ...complete, phone: "", email: "" }))).toBe(false);
		expect(leadReady([])).toBe(false);
	});

	test("🤖 agrees with the submit schema, so the diagram never promises a rejected form", () => {
		const cases: LeadValues[] = [
			complete,
			{ ...complete, phone: "", email: "office@legal.ua" },
			{ ...complete, phone: "+380 (67) 123-45-67" },
			{ ...complete, name: "І" },
			{ ...complete, message: "коротко" },
			{ ...complete, phone: "", email: "" },
			{ ...complete, phone: "", email: "office@" },
			{ ...complete, phone: "+38067", email: "" },
			{ ...complete, phone: "067 ABC 45 67", email: "" },
		];

		for (const values of cases) {
			const accepted = schema.safeParse({
				name: values.name ?? "",
				phone: values.phone ?? "",
				email: values.email ?? "",
				message: values.message ?? "",
				requestType: values.requestType ?? "it",
			}).success;

			expect(leadReady(leadStages(values))).toBe(accepted);
		}
	});
});
