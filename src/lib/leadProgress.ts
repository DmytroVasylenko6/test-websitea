import { PHONE_DIGITS, isEmail, isPhone, phoneDigits } from "./contactChannels";
import { REQUEST_TYPES } from "./contactSchema";

export type LeadValues = {
	name?: string;
	phone?: string;
	email?: string;
	message?: string;
	requestType?: string;
};

export type LeadStageId = "name" | "contact" | "requestType" | "message";

export type LeadStage = {
	id: LeadStageId;
	/** Share of the stage requirement that is already met, 0..1. */
	ratio: number;
	done: boolean;
};

export const LEAD_STAGE_IDS = ["name", "contact", "requestType", "message"] as const;

/**
 * Mirrors the minimums enforced by contactSchema, so a block never lights up for
 * a value the submit would reject.
 */
export const LEAD_MINIMUMS = {
	name: 2,
	phone: PHONE_DIGITS.min,
	email: 4,
	message: 10,
} as const;

/** Ceiling for a value that is still being typed and would not pass validation yet. */
const TYPING_CAP = 0.75;

function text(value: unknown): string {
	return typeof value === "string" ? value.trim() : "";
}

function share(length: number, minimum: number): number {
	if (!Number.isFinite(length) || length <= 0) {
		return 0;
	}
	if (minimum <= 0) {
		return 1;
	}

	return Math.min(1, length / minimum);
}

function isRequestType(value: unknown): boolean {
	return typeof value === "string" && (REQUEST_TYPES as readonly string[]).includes(value);
}

/**
 * The form accepts a phone or an email, so the block follows whichever is further
 * along — and only reaches 1 for a value the submit validation would accept.
 */
function contactRatio(values: LeadValues): number {
	const phoneShare = isPhone(values.phone)
		? 1
		: Math.min(share(phoneDigits(values.phone).length, LEAD_MINIMUMS.phone), TYPING_CAP);
	const emailShare = isEmail(values.email)
		? 1
		: Math.min(share(text(values.email).length, LEAD_MINIMUMS.email), TYPING_CAP);

	return Math.max(phoneShare, emailShare);
}

export function leadStageRatio(id: LeadStageId, values: LeadValues): number {
	switch (id) {
		case "name":
			return share(text(values.name).length, LEAD_MINIMUMS.name);
		case "contact":
			return contactRatio(values);
		case "requestType":
			return isRequestType(values.requestType) ? 1 : 0;
		case "message":
			return share(text(values.message).length, LEAD_MINIMUMS.message);
		default:
			return 0;
	}
}

export function leadStages(values: LeadValues = {}): LeadStage[] {
	return LEAD_STAGE_IDS.map((id) => {
		const ratio = leadStageRatio(id, values);
		return { id, ratio, done: ratio >= 1 };
	});
}

function clamp01(value: number): number {
	return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

/** Average fill across the blocks: the ring moves on every keystroke, not only on completion. */
export function leadCompletion(stages: LeadStage[]): number {
	if (stages.length === 0) {
		return 0;
	}

	const total = stages.reduce((sum, stage) => sum + clamp01(stage.ratio), 0);
	return total / stages.length;
}

/**
 * How much of the rail segment between block `index` and the next node is lit: it
 * stays dark until the block itself is done, then follows the next block's progress.
 * That keeps the line from ever running past the point actually reached.
 */
export function stageLinkFill(stages: LeadStage[], index: number): number {
	const current = stages[index];

	if (!current?.done) {
		return 0;
	}

	const next = stages[index + 1];
	if (next) {
		return clamp01(next.ratio);
	}

	// The last segment ends at the enquiry node, which is only reached by a full form.
	return leadReady(stages) ? 1 : 0;
}

export function leadDoneCount(stages: LeadStage[]): number {
	return stages.filter((stage) => stage.done).length;
}

export function leadReady(stages: LeadStage[]): boolean {
	return stages.length > 0 && stages.every((stage) => stage.done);
}

export function nextLeadStage(stages: LeadStage[]): LeadStageId | null {
	return stages.find((stage) => !stage.done)?.id ?? null;
}
