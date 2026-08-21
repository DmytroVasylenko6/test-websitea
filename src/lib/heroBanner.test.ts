import { describe, expect, test } from "@jest/globals";
import { adFormats } from "../config/company";
import {
	HERO_SLOT_HOLD,
	buildHeroSlots,
	heroSlotStart,
	heroTimelineDuration,
} from "./heroBanner";

describe("🤖 buildHeroSlots", () => {
	test("🤖 mirrors the published ad formats", () => {
		const slots = buildHeroSlots();

		expect(slots).toBeArrayOfSize(adFormats.length);
		expect(slots.map((slot) => slot.id)).toEqual(adFormats.map((format) => format.id));
	});

	test("🤖 uses the primary size of every format", () => {
		for (const slot of buildHeroSlots()) {
			const format = adFormats.find((item) => item.id === slot.id);
			expect(slot.size).toBe(format?.sizes[0]);
		}
	});

	test("🤖 never exposes an empty size", () => {
		for (const slot of buildHeroSlots()) {
			expect(slot.size).toBeString();
			expect(slot.size.length).toBeGreaterThan(0);
		}
	});
});

describe("🤖 heroSlotStart", () => {
	test("🤖 spaces slots by the hold duration", () => {
		expect(heroSlotStart(0)).toBe(0);
		expect(heroSlotStart(1)).toBe(HERO_SLOT_HOLD);
		expect(heroSlotStart(3)).toBe(HERO_SLOT_HOLD * 3);
	});

	test("🤖 clamps invalid indexes to the timeline start", () => {
		expect(heroSlotStart(-2)).toBe(0);
		expect(heroSlotStart(Number.NaN)).toBe(0);
		expect(heroSlotStart(Number.POSITIVE_INFINITY)).toBe(0);
	});

	test("🤖 ignores fractional indexes", () => {
		expect(heroSlotStart(1.9)).toBe(HERO_SLOT_HOLD);
	});
});

describe("🤖 heroTimelineDuration", () => {
	test("🤖 covers every slot once", () => {
		expect(heroTimelineDuration(buildHeroSlots().length)).toBe(
			HERO_SLOT_HOLD * adFormats.length,
		);
	});

	test("🤖 returns zero for an empty or invalid banner", () => {
		expect(heroTimelineDuration(0)).toBe(0);
		expect(heroTimelineDuration(-1)).toBe(0);
		expect(heroTimelineDuration(Number.NaN)).toBe(0);
	});
});
