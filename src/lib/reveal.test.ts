import { describe, expect, test } from "@jest/globals";
import {
	REVEAL,
	normalizeDelay,
	normalizeStagger,
	revealFromVars,
	revealToVars,
} from "./reveal";

describe("🤖 normalizeStagger", () => {
	test("🤖 keeps a valid custom value", () => {
		expect(normalizeStagger(0.2)).toBe(0.2);
		expect(normalizeStagger(0)).toBe(0);
	});

	test("🤖 falls back to the default for invalid values", () => {
		expect(normalizeStagger()).toBe(REVEAL.stagger);
		expect(normalizeStagger(-1)).toBe(REVEAL.stagger);
		expect(normalizeStagger(Number.NaN)).toBe(REVEAL.stagger);
		expect(normalizeStagger(Number.POSITIVE_INFINITY)).toBe(REVEAL.stagger);
	});
});

describe("🤖 normalizeDelay", () => {
	test("🤖 keeps a valid delay", () => {
		expect(normalizeDelay(0.3)).toBe(0.3);
	});

	test("🤖 drops missing or invalid delays", () => {
		expect(normalizeDelay()).toBe(0);
		expect(normalizeDelay(-2)).toBe(0);
		expect(normalizeDelay(Number.NaN)).toBe(0);
	});
});

describe("🤖 revealFromVars", () => {
	test("🤖 hides and offsets fade-up and stagger blocks", () => {
		for (const variant of ["fade-up", "stagger"] as const) {
			expect(revealFromVars(variant)).toEqual({ opacity: 0, y: REVEAL.offset });
		}
	});

	test("🤖 collapses a line without hiding it", () => {
		expect(revealFromVars("line")).toEqual({ scaleX: 0 });
	});
});

describe("🤖 revealToVars", () => {
	test("🤖 restores fade-up without stagger", () => {
		expect(revealToVars("fade-up")).toEqual({
			opacity: 1,
			y: 0,
			duration: REVEAL.duration,
			ease: REVEAL.ease,
			delay: 0,
			stagger: 0,
		});
	});

	test("🤖 staggers children only for the stagger variant", () => {
		expect(revealToVars("stagger")).toHaveProperty("stagger", REVEAL.stagger);
		expect(revealToVars("stagger", { stagger: 0.15 })).toHaveProperty("stagger", 0.15);
		expect(revealToVars("fade-up", { stagger: 0.15 })).toHaveProperty("stagger", 0);
	});

	test("🤖 grows a line with its own duration and no opacity change", () => {
		const vars = revealToVars("line");

		expect(vars).toEqual({
			scaleX: 1,
			duration: REVEAL.lineDuration,
			ease: REVEAL.ease,
			delay: 0,
		});
		expect(vars).not.toContainKey("opacity");
	});

	test("🤖 sanitizes the delay for every variant", () => {
		expect(revealToVars("fade-up", { delay: -5 })).toHaveProperty("delay", 0);
		expect(revealToVars("line", { delay: 0.4 })).toHaveProperty("delay", 0.4);
	});
});
