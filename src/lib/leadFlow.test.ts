import { describe, expect, test } from "@jest/globals";
import {
	FLOW,
	clampRatio,
	completionPercent,
	packetDuration,
	ringCircumference,
	ringDashOffset,
} from "./leadFlow";

describe("🤖 clampRatio", () => {
	test("🤖 keeps values inside the unit range", () => {
		expect(clampRatio(0.42)).toBe(0.42);
		expect(clampRatio(-3)).toBe(0);
		expect(clampRatio(9)).toBe(1);
	});

	test("🤖 falls back to zero for unusable numbers", () => {
		expect(clampRatio(Number.NaN)).toBe(0);
		expect(clampRatio(Number.POSITIVE_INFINITY)).toBe(0);
	});
});

describe("🤖 ringCircumference", () => {
	test("🤖 measures the ring from its radius", () => {
		expect(ringCircumference()).toBeCloseTo(2 * Math.PI * FLOW.ringRadius);
		expect(ringCircumference(10)).toBeCloseTo(2 * Math.PI * 10);
	});

	test("🤖 collapses for a degenerate radius", () => {
		expect(ringCircumference(0)).toBe(0);
		expect(ringCircumference(-5)).toBe(0);
		expect(ringCircumference(Number.NaN)).toBe(0);
	});
});

describe("🤖 ringDashOffset", () => {
	const circumference = ringCircumference();

	test("🤖 hides the ring when nothing is filled and draws it in full when complete", () => {
		expect(ringDashOffset(0, circumference)).toBeCloseTo(circumference);
		expect(ringDashOffset(1, circumference)).toBe(0);
	});

	test("🤖 shrinks as completion grows", () => {
		expect(ringDashOffset(0.25, circumference)).toBeGreaterThan(
			ringDashOffset(0.75, circumference),
		);
	});

	test("🤖 clamps out-of-range completion and a broken circumference", () => {
		expect(ringDashOffset(-1, circumference)).toBeCloseTo(circumference);
		expect(ringDashOffset(4, circumference)).toBe(0);
		expect(ringDashOffset(0.5, Number.NaN)).toBe(0);
	});
});

describe("🤖 packetDuration", () => {
	test("🤖 scales with the flight distance", () => {
		const distance = FLOW.packetSpeed * 0.8;

		expect(packetDuration(distance)).toBeCloseTo(0.8);
		expect(packetDuration(distance)).toBeGreaterThan(packetDuration(distance / 2));
	});

	test("🤖 stays inside the duration bounds", () => {
		expect(packetDuration(0)).toBe(FLOW.packetMinDuration);
		expect(packetDuration(100_000)).toBe(FLOW.packetMaxDuration);
		expect(packetDuration(Number.NaN)).toBe(FLOW.packetMinDuration);
	});

	test("🤖 ignores flight direction", () => {
		expect(packetDuration(-300)).toBe(packetDuration(300));
	});
});

describe("🤖 completionPercent", () => {
	test("🤖 rounds to a whole percentage", () => {
		expect(completionPercent(0)).toBe(0);
		expect(completionPercent(0.256)).toBe(26);
		expect(completionPercent(1)).toBe(100);
	});

	test("🤖 clamps unusable input", () => {
		expect(completionPercent(-2)).toBe(0);
		expect(completionPercent(5)).toBe(100);
		expect(completionPercent(Number.NaN)).toBe(0);
	});
});
