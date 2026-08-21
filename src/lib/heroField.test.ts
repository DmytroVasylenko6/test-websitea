import { describe, expect, test } from "@jest/globals";
import {
	FIELD,
	createParticles,
	linkAlpha,
	particleCount,
	rescaleParticles,
	stepParticle,
	type Particle,
} from "./heroField";

/** Deterministic stand-in for Math.random so particle setup stays assertable. */
function sequence(values: number[]): () => number {
	let index = 0;
	return () => {
		const value = values[index % values.length];
		index += 1;
		return value;
	};
}

describe("🤖 particleCount", () => {
	test("🤖 scales with the available surface", () => {
		const small = particleCount({ width: 400, height: 300 });
		const large = particleCount({ width: 1400, height: 700 });

		expect(large).toBeGreaterThan(small);
	});

	test("🤖 stays inside the density limits", () => {
		expect(particleCount({ width: 320, height: 200 })).toBe(FIELD.minParticles);
		expect(particleCount({ width: 4000, height: 2000 })).toBe(FIELD.maxParticles);
	});

	test("🤖 renders nothing without a measurable box", () => {
		expect(particleCount({ width: 0, height: 500 })).toBe(0);
		expect(particleCount({ width: -100, height: 500 })).toBe(0);
		expect(particleCount({ width: Number.NaN, height: 500 })).toBe(0);
	});
});

describe("🤖 createParticles", () => {
	const bounds = { width: 800, height: 400 };

	test("🤖 creates the requested amount inside the bounds", () => {
		const particles = createParticles(bounds, 10, sequence([0.1, 0.5, 0.9]));

		expect(particles).toBeArrayOfSize(10);
		for (const particle of particles) {
			expect(particle.x).toBeWithin(0, bounds.width + 1);
			expect(particle.y).toBeWithin(0, bounds.height + 1);
			expect(particle.radius).toBeWithin(FIELD.minRadius, FIELD.maxRadius + 0.001);
		}
	});

	test("🤖 always gives a particle some motion", () => {
		for (const particle of createParticles(bounds, 12, sequence([0, 0.25, 0.5, 0.75]))) {
			expect(Math.hypot(particle.vx, particle.vy)).toBeGreaterThan(0);
		}
	});

	test("🤖 ignores invalid counts", () => {
		expect(createParticles(bounds, 0)).toBeArrayOfSize(0);
		expect(createParticles(bounds, -5)).toBeArrayOfSize(0);
		expect(createParticles(bounds, Number.NaN)).toBeArrayOfSize(0);
	});
});

describe("🤖 stepParticle", () => {
	const bounds = { width: 200, height: 100 };
	const particle: Particle = { x: 100, y: 50, vx: 10, vy: -20, radius: 2 };

	test("🤖 moves by velocity times elapsed time", () => {
		const next = stepParticle(particle, bounds, 0.5);

		expect(next.x).toBeCloseTo(100 + 10 * FIELD.maxStep);
		expect(next.y).toBeCloseTo(50 - 20 * FIELD.maxStep);
	});

	test("🤖 clamps long frames so a hidden tab cannot teleport particles", () => {
		const long = stepParticle(particle, bounds, 30);
		const capped = stepParticle(particle, bounds, FIELD.maxStep);

		expect(long).toEqual(capped);
	});

	test("🤖 bounces off every edge instead of escaping", () => {
		const left = stepParticle({ ...particle, x: 1, vx: -100 }, bounds, 0.05);
		expect(left.x).toBe(0);
		expect(left.vx).toBeGreaterThan(0);

		const right = stepParticle({ ...particle, x: 199, vx: 100 }, bounds, 0.05);
		expect(right.x).toBe(bounds.width);
		expect(right.vx).toBeLessThan(0);

		const top = stepParticle({ ...particle, y: 1, vy: -100 }, bounds, 0.05);
		expect(top.y).toBe(0);
		expect(top.vy).toBeGreaterThan(0);

		const bottom = stepParticle({ ...particle, y: 99, vy: 100 }, bounds, 0.05);
		expect(bottom.y).toBe(bounds.height);
		expect(bottom.vy).toBeLessThan(0);
	});

	test("🤖 holds position for a missing or invalid delta", () => {
		for (const delta of [0, -1, Number.NaN]) {
			const next = stepParticle(particle, bounds, delta);
			expect(next.x).toBe(particle.x);
			expect(next.y).toBe(particle.y);
		}
	});

	test("🤖 does not mutate the input particle", () => {
		const input: Particle = { x: 10, y: 10, vx: 5, vy: 5, radius: 2 };
		stepParticle(input, bounds, 0.05);

		expect(input).toEqual({ x: 10, y: 10, vx: 5, vy: 5, radius: 2 });
	});
});

describe("🤖 rescaleParticles", () => {
	const particles: Particle[] = [
		{ x: 100, y: 50, vx: 5, vy: 5, radius: 2 },
		{ x: 0, y: 100, vx: -5, vy: 5, radius: 1.5 },
	];

	test("🤖 keeps particles in the same relative spot", () => {
		const next = rescaleParticles(particles, { width: 200, height: 100 }, { width: 400, height: 200 });

		expect(next[0].x).toBe(200);
		expect(next[0].y).toBe(100);
		expect(next[1].x).toBe(0);
		expect(next[1].y).toBe(200);
	});

	test("🤖 preserves velocity and radius", () => {
		const next = rescaleParticles(particles, { width: 200, height: 100 }, { width: 100, height: 100 });

		expect(next[0].vx).toBe(particles[0].vx);
		expect(next[0].radius).toBe(particles[0].radius);
	});

	test("🤖 returns the field untouched when the old box is unusable", () => {
		for (const from of [
			{ width: 0, height: 100 },
			{ width: 200, height: 0 },
			{ width: Number.NaN, height: 100 },
		]) {
			expect(rescaleParticles(particles, from, { width: 400, height: 200 })).toBe(particles);
		}
	});
});

describe("🤖 linkAlpha", () => {
	test("🤖 fades the link out with distance", () => {
		expect(linkAlpha(0)).toBe(FIELD.maxLinkAlpha);
		expect(linkAlpha(FIELD.linkDistance / 2)).toBeCloseTo(FIELD.maxLinkAlpha / 2);
	});

	test("🤖 draws nothing beyond the link distance", () => {
		expect(linkAlpha(FIELD.linkDistance)).toBe(0);
		expect(linkAlpha(FIELD.linkDistance + 50)).toBe(0);
	});

	test("🤖 rejects invalid distances", () => {
		expect(linkAlpha(-1)).toBe(0);
		expect(linkAlpha(Number.NaN)).toBe(0);
	});

	test("🤖 never exceeds the opacity budget", () => {
		for (let distance = 0; distance < FIELD.linkDistance; distance += 10) {
			expect(linkAlpha(distance)).toBeWithin(0, FIELD.maxLinkAlpha + 0.0001);
		}
	});
});
