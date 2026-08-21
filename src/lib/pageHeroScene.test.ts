import { describe, expect, test } from "@jest/globals";
import {
	buildPageHeroScene,
	type PageHeroVariant,
	type SceneCircle,
	type SceneLine,
	type SceneRect,
} from "./pageHeroScene";

const variants: PageHeroVariant[] = [
	"services",
	"advertise",
	"portfolio",
	"diia",
	"contacts",
	"privacy",
	"terms",
	"cookies",
];

function numbersInScene(scene: {
	lines: SceneLine[];
	circles: SceneCircle[];
	rects: SceneRect[];
}): number[] {
	return [
		...scene.lines.flatMap((line) => [line.x1, line.y1, line.x2, line.y2, line.alpha]),
		...scene.circles.flatMap((circle) => [
			circle.x,
			circle.y,
			circle.radius,
			circle.alpha,
		]),
		...scene.rects.flatMap((rect) => [
			rect.x,
			rect.y,
			rect.width,
			rect.height,
			rect.alpha,
		]),
	];
}

describe("🤖 buildPageHeroScene", () => {
	test.each(variants)("🤖 builds visible primitives for %s", (variant) => {
		const scene = buildPageHeroScene(variant, 1200, 360, 4);

		expect(scene.lines.length + scene.circles.length + scene.rects.length).toBeGreaterThan(0);
		expect(numbersInScene(scene).every(Number.isFinite)).toBe(true);
	});

	test("🤖 gives every page a distinct composition", () => {
		const signatures = variants.map((variant) => {
			const scene = buildPageHeroScene(variant, 1200, 360, 4);
			return `${scene.lines.length}:${scene.circles.length}:${scene.rects.length}`;
		});

		expect(new Set(signatures).size).toBeGreaterThanOrEqual(6);
	});

	test.each(variants)("🤖 handles an unmeasured canvas for %s", (variant) => {
		const scene = buildPageHeroScene(variant, Number.NaN, -20, Number.NaN);

		expect(numbersInScene(scene).every(Number.isFinite)).toBe(true);
	});

	test("🤖 animates scenes without changing their primitive contract", () => {
		for (const variant of variants) {
			const start = buildPageHeroScene(variant, 1200, 360, 0);
			const later = buildPageHeroScene(variant, 1200, 360, 5);

			expect(later.lines).toBeArrayOfSize(start.lines.length);
			expect(later.circles).toBeArrayOfSize(start.circles.length);
			expect(later.rects).toBeArrayOfSize(start.rects.length);
			expect(numbersInScene(later)).not.toEqual(numbersInScene(start));
		}
	});

	test("🤖 keeps alpha values in the canvas range", () => {
		for (const variant of variants) {
			const scene = buildPageHeroScene(variant, 1200, 360, 20);
			const alphas = [
				...scene.lines.map((line) => line.alpha),
				...scene.circles.map((circle) => circle.alpha),
				...scene.rects.map((rect) => rect.alpha),
			];

			expect(alphas.every((alpha) => alpha >= 0 && alpha <= 1)).toBe(true);
		}
	});
});
