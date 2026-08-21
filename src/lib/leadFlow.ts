export const FLOW = {
	/** Radius of the completion ring inside its 64x64 viewBox. */
	ringRadius: 26,
	ringWidth: 4,
	/** Packet flight speed in px per second, clamped so any card height stays readable. */
	packetSpeed: 220,
	packetMinDuration: 0.4,
	packetMaxDuration: 1.2,
	/** Pause between ambient packets once every block is ready. */
	ambientGap: 0.7,
	/** Reused packet elements; flights are short, so a small pool is enough. */
	packetCount: 4,
} as const;

export function clampRatio(value: number): number {
	return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

export function ringCircumference(radius: number = FLOW.ringRadius): number {
	return Number.isFinite(radius) && radius > 0 ? 2 * Math.PI * radius : 0;
}

/** Dash offset that leaves `completion` of the ring drawn. */
export function ringDashOffset(completion: number, circumference: number): number {
	const total = Number.isFinite(circumference) && circumference > 0 ? circumference : 0;
	return total * (1 - clampRatio(completion));
}

export function packetDuration(distancePx: number): number {
	const distance = Number.isFinite(distancePx) ? Math.abs(distancePx) : 0;

	return Math.min(
		FLOW.packetMaxDuration,
		Math.max(FLOW.packetMinDuration, distance / FLOW.packetSpeed),
	);
}

export function completionPercent(completion: number): number {
	return Math.round(clampRatio(completion) * 100);
}
