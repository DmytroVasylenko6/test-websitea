export type RevealVariant = "fade-up" | "stagger" | "line";

export const REVEAL = {
	/** Vertical travel in px — short on purpose, this is a B2B page, not a showreel. */
	offset: 16,
	duration: 0.55,
	lineDuration: 0.7,
	stagger: 0.08,
	ease: "power2.out",
	/** ScrollTrigger start position: reveal slightly before the block is fully in view. */
	start: "top 85%",
} as const;

export type RevealVars = Record<string, number | string>;

export function normalizeStagger(value?: number): number {
	if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
		return REVEAL.stagger;
	}
	return value;
}

export function normalizeDelay(value?: number): number {
	if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
		return 0;
	}
	return value;
}

export function revealFromVars(variant: RevealVariant): RevealVars {
	if (variant === "line") {
		return { scaleX: 0 };
	}
	return { opacity: 0, y: REVEAL.offset };
}

export function revealToVars(
	variant: RevealVariant,
	options: { stagger?: number; delay?: number } = {},
): RevealVars {
	const delay = normalizeDelay(options.delay);

	if (variant === "line") {
		return { scaleX: 1, duration: REVEAL.lineDuration, ease: REVEAL.ease, delay };
	}

	return {
		opacity: 1,
		y: 0,
		duration: REVEAL.duration,
		ease: REVEAL.ease,
		delay,
		stagger: variant === "stagger" ? normalizeStagger(options.stagger) : 0,
	};
}
