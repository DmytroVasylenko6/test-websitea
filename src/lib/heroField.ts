export type Particle = {
	x: number;
	y: number;
	/** Velocity in px per second. */
	vx: number;
	vy: number;
	radius: number;
};

export type FieldBounds = {
	width: number;
	height: number;
};

export const FIELD = {
	minParticles: 12,
	maxParticles: 48,
	/** One particle per this much surface, so density stays even across breakpoints. */
	areaPerParticle: 24000,
	linkDistance: 130,
	/** Slow drift: the field should read as calm, not as a screensaver. */
	baseSpeed: 9,
	minRadius: 1.1,
	maxRadius: 2.3,
	maxLinkAlpha: 0.26,
	dotAlpha: 0.45,
	/** Longest frame we integrate, so a backgrounded tab cannot teleport particles. */
	maxStep: 0.05,
} as const;

export function particleCount(bounds: FieldBounds): number {
	const width = Number.isFinite(bounds.width) ? Math.max(0, bounds.width) : 0;
	const height = Number.isFinite(bounds.height) ? Math.max(0, bounds.height) : 0;
	const area = width * height;

	if (area <= 0) {
		return 0;
	}

	const byArea = Math.round(area / FIELD.areaPerParticle);
	return Math.min(FIELD.maxParticles, Math.max(FIELD.minParticles, byArea));
}

export function createParticles(
	bounds: FieldBounds,
	count: number,
	random: () => number = Math.random,
): Particle[] {
	const total = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
	const particles: Particle[] = [];

	for (let index = 0; index < total; index += 1) {
		const angle = random() * Math.PI * 2;
		const speed = FIELD.baseSpeed * (0.45 + random() * 0.75);

		particles.push({
			x: random() * bounds.width,
			y: random() * bounds.height,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			radius: FIELD.minRadius + random() * (FIELD.maxRadius - FIELD.minRadius),
		});
	}

	return particles;
}

export function stepParticle(
	particle: Particle,
	bounds: FieldBounds,
	deltaSeconds: number,
): Particle {
	const step =
		Number.isFinite(deltaSeconds) && deltaSeconds > 0
			? Math.min(deltaSeconds, FIELD.maxStep)
			: 0;

	let { x, y, vx, vy } = particle;

	x += vx * step;
	y += vy * step;

	if (x <= 0) {
		x = 0;
		vx = Math.abs(vx);
	} else if (x >= bounds.width) {
		x = bounds.width;
		vx = -Math.abs(vx);
	}

	if (y <= 0) {
		y = 0;
		vy = Math.abs(vy);
	} else if (y >= bounds.height) {
		y = bounds.height;
		vy = -Math.abs(vy);
	}

	return { ...particle, x, y, vx, vy };
}

/** Keeps the existing field on resize instead of respawning it, which would look like a glitch. */
export function rescaleParticles(
	particles: Particle[],
	from: FieldBounds,
	to: FieldBounds,
): Particle[] {
	if (from.width <= 0 || from.height <= 0 || !Number.isFinite(from.width) || !Number.isFinite(from.height)) {
		return particles;
	}

	const scaleX = to.width / from.width;
	const scaleY = to.height / from.height;

	if (!Number.isFinite(scaleX) || !Number.isFinite(scaleY)) {
		return particles;
	}

	return particles.map((particle) => ({
		...particle,
		x: particle.x * scaleX,
		y: particle.y * scaleY,
	}));
}

export function linkAlpha(distance: number): number {
	if (!Number.isFinite(distance) || distance < 0 || distance >= FIELD.linkDistance) {
		return 0;
	}
	return (1 - distance / FIELD.linkDistance) * FIELD.maxLinkAlpha;
}
