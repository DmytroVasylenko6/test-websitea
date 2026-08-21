export type PageHeroVariant =
	| "services"
	| "advertise"
	| "portfolio"
	| "diia"
	| "contacts"
	| "privacy"
	| "terms"
	| "cookies";

export type SceneLine = {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	alpha: number;
	dash?: number[];
};

export type SceneCircle = {
	x: number;
	y: number;
	radius: number;
	alpha: number;
	fill?: boolean;
};

export type SceneRect = {
	x: number;
	y: number;
	width: number;
	height: number;
	alpha: number;
	radius?: number;
	fill?: boolean;
};

export type PageHeroScene = {
	lines: SceneLine[];
	circles: SceneCircle[];
	rects: SceneRect[];
};

const TAU = Math.PI * 2;

function wave(time: number, offset = 0): number {
	return (Math.sin(time + offset) + 1) / 2;
}

function orbit(
	cx: number,
	cy: number,
	radius: number,
	angle: number,
	size = 3,
): SceneCircle {
	return {
		x: cx + Math.cos(angle) * radius,
		y: cy + Math.sin(angle) * radius,
		radius: size,
		alpha: 0.65,
		fill: true,
	};
}

function servicesScene(width: number, height: number, time: number): PageHeroScene {
	const divider = width * 0.72;
	const left = divider - 92;
	const right = divider + 74;
	const centerY = height / 2;
	const travel = ((time * 0.08) % 1) * height;
	const circles: SceneCircle[] = Array.from({ length: 3 }, (_, index) => ({
		x: right,
		y: centerY,
		radius: 26 + index * 24 + ((time * 8) % 22),
		alpha: 0.18 - index * 0.035,
	}));

	circles.push(
		{ x: left, y: travel, radius: 3, alpha: 0.7, fill: true },
		{ x: left + 36, y: height - travel, radius: 2.5, alpha: 0.55, fill: true },
	);

	return {
		lines: [
			{ x1: divider, y1: 30, x2: divider, y2: height - 30, alpha: 0.12 },
			{ x1: left - 24, y1: 68, x2: left - 40, y2: 68, alpha: 0.45 },
			{ x1: left - 40, y1: 68, x2: left - 40, y2: height - 68, alpha: 0.45 },
			{ x1: left - 40, y1: height - 68, x2: left - 24, y2: height - 68, alpha: 0.45 },
			{ x1: left + 58, y1: 68, x2: left + 74, y2: 68, alpha: 0.45 },
			{ x1: left + 74, y1: 68, x2: left + 74, y2: height - 68, alpha: 0.45 },
			{ x1: left + 74, y1: height - 68, x2: left + 58, y2: height - 68, alpha: 0.45 },
			...Array.from({ length: 7 }, (_, index) => {
				const angle = (index / 7) * TAU;
				return {
					x1: right + Math.cos(angle) * 16,
					y1: centerY + Math.sin(angle) * 16,
					x2: right + Math.cos(angle) * 54,
					y2: centerY + Math.sin(angle) * 54,
					alpha: 0.2,
				};
			}),
		],
		circles,
		rects: [],
	};
}

function advertiseScene(width: number, height: number, time: number): PageHeroScene {
	const startX = width * 0.58;
	const sweep = startX + ((time * 42) % Math.max(1, width - startX + 120)) - 60;
	const slots = [
		{ x: startX, y: 54, width: width * 0.31, height: 42 },
		{ x: startX, y: 120, width: width * 0.18, height: 108 },
		{ x: startX + width * 0.2, y: 120, width: width * 0.11, height: 72 },
		{ x: startX, y: 252, width: width * 0.31, height: 50 },
	];

	return {
		lines: [
			{ x1: sweep, y1: 34, x2: sweep, y2: height - 34, alpha: 0.36 },
			{ x1: startX, y1: 34, x2: width - 28, y2: 34, alpha: 0.18, dash: [3, 7] },
		],
		circles: Array.from({ length: 9 }, (_, index) => ({
			x: startX + ((index * 57 + time * 18) % Math.max(1, width - startX - 20)),
			y: 34,
			radius: 2,
			alpha: 0.28 + (index % 3) * 0.12,
			fill: true,
		})),
		rects: slots.map((slot, index) => ({
			...slot,
			alpha: 0.18 + wave(time * 0.7, index * 1.4) * 0.24,
			radius: 5,
			fill: index === Math.floor(time / 2.8) % slots.length,
		})),
	};
}

function portfolioScene(width: number, height: number, time: number): PageHeroScene {
	const startX = width * 0.56;
	const gap = 12;
	const tileWidth = Math.max(44, (width - startX - gap * 3 - 24) / 3);
	const tileHeight = 86;

	return {
		lines: [],
		circles: Array.from({ length: 6 }, (_, index) => ({
			x: startX + (index % 3) * (tileWidth + gap) + tileWidth / 2,
			y: 68 + Math.floor(index / 3) * (tileHeight + gap) + tileHeight / 2,
			radius: 3 + wave(time * 0.8, index) * 2,
			alpha: 0.45,
			fill: true,
		})),
		rects: Array.from({ length: 6 }, (_, index) => ({
			x: startX + (index % 3) * (tileWidth + gap),
			y:
				68 +
				Math.floor(index / 3) * (tileHeight + gap) +
				Math.sin(time * 0.5 + index) * 5,
			width: tileWidth,
			height: tileHeight,
			alpha: 0.16 + (index % 3) * 0.07,
			radius: 8,
			fill: true,
		})),
	};
}

function diiaScene(width: number, height: number, time: number): PageHeroScene {
	const cx = width * 0.78;
	const cy = height / 2;
	const angle = time * 0.18;

	return {
		lines: [
			{ x1: cx - 78, y1: cy, x2: cx + 78, y2: cy, alpha: 0.1 },
			{ x1: cx, y1: cy - 78, x2: cx, y2: cy + 78, alpha: 0.1 },
		],
		circles: [
			{ x: cx, y: cy, radius: 42, alpha: 0.32 },
			{ x: cx, y: cy, radius: 64, alpha: 0.2 },
			{ x: cx, y: cy, radius: 82, alpha: 0.12, fill: true },
			orbit(cx, cy, 64, angle, 3.5),
			orbit(cx, cy, 64, angle + Math.PI, 2.5),
			{ x: cx, y: cy, radius: 7 + wave(time * 1.2) * 3, alpha: 0.55, fill: true },
		],
		rects: [
			{ x: cx - 138, y: cy - 70, width: 58, height: 76, alpha: 0.14, radius: 5, fill: true },
			{ x: cx + 86, y: cy + 18, width: 58, height: 76, alpha: 0.12, radius: 5, fill: true },
		],
	};
}

function contactsScene(width: number, height: number, time: number): PageHeroScene {
	const cx = width * 0.78;
	const cy = height * 0.52;
	const nodes = [
		{ x: cx - 112, y: cy - 78 },
		{ x: cx + 105, y: cy - 58 },
		{ x: cx + 88, y: cy + 82 },
		{ x: cx - 98, y: cy + 72 },
	];

	return {
		lines: nodes.map((node) => ({ x1: cx, y1: cy, x2: node.x, y2: node.y, alpha: 0.22 })),
		circles: [
			...Array.from({ length: 3 }, (_, index) => ({
				x: cx,
				y: cy,
				radius: 18 + index * 24 + ((time * 10) % 24),
				alpha: 0.22 - index * 0.045,
			})),
			{ x: cx, y: cy, radius: 8, alpha: 0.72, fill: true },
			...nodes.map((node, index) => ({
				...node,
				radius: 4 + wave(time + index) * 2,
				alpha: 0.5,
				fill: true,
			})),
		],
		rects: [],
	};
}

function privacyScene(width: number, height: number, time: number): PageHeroScene {
	const gate = width * 0.76;
	const progress = (time * 0.07) % 1;
	const dots = Array.from({ length: 12 }, (_, index) => {
		const local = (progress + index / 12) % 1;
		return {
			x: width * 0.54 + local * width * 0.42,
			y: 70 + ((index * 43) % Math.max(1, height - 140)),
			radius: local > 0.52 ? 2.2 : 3,
			alpha: local > 0.52 ? 0.28 : 0.58,
			fill: true,
		};
	});

	return {
		lines: [
			{ x1: gate, y1: 38, x2: gate, y2: height - 38, alpha: 0.28, dash: [5, 7] },
			{ x1: gate, y1: 84, x2: gate - 42, y2: 104, alpha: 0.38 },
			{ x1: gate - 42, y1: 104, x2: gate - 42, y2: 182, alpha: 0.38 },
			{ x1: gate - 42, y1: 182, x2: gate, y2: 214, alpha: 0.38 },
			{ x1: gate, y1: 214, x2: gate + 42, y2: 182, alpha: 0.38 },
			{ x1: gate + 42, y1: 182, x2: gate + 42, y2: 104, alpha: 0.38 },
			{ x1: gate + 42, y1: 104, x2: gate, y2: 84, alpha: 0.38 },
		],
		circles: dots,
		rects: [],
	};
}

function termsScene(width: number, height: number, time: number): PageHeroScene {
	const startX = width * 0.57;
	const offset = (time * 12) % 46;

	return {
		lines: Array.from({ length: 9 }, (_, index) => {
			const y = 28 + ((index * 46 + offset) % Math.max(46, height - 32));
			return {
				x1: startX + (index % 3) * 12,
				y1: y,
				x2: width - 34 - (index % 4) * 24,
				y2: y,
				alpha: 0.13 + (index % 3) * 0.08,
			};
		}),
		circles: [],
		rects: [
			{
				x: startX - 24,
				y: 24,
				width: width - startX - 8,
				height: height - 48,
				alpha: 0.12,
				radius: 8,
			},
		],
	};
}

function cookiesScene(width: number, height: number, time: number): PageHeroScene {
	const cx = width * 0.78;
	const cy = height / 2;

	return {
		lines: [],
		circles: [
			{ x: cx, y: cy, radius: 48, alpha: 0.22 },
			{ x: cx, y: cy, radius: 28, alpha: 0.15, fill: true },
			orbit(cx, cy, 68, time * 0.35, 5),
			orbit(cx, cy, 68, time * 0.35 + TAU / 3, 3.5),
			orbit(cx, cy, 68, time * 0.35 + (TAU * 2) / 3, 4),
			{ x: cx - 9, y: cy - 5, radius: 3, alpha: 0.52, fill: true },
			{ x: cx + 11, y: cy + 8, radius: 4, alpha: 0.42, fill: true },
		],
		rects: [
			{ x: cx - 72, y: cy + 98, width: 144, height: 32, alpha: 0.24, radius: 16 },
			{
				x: cx - 64 + wave(time * 0.7) * 104,
				y: cy + 104,
				width: 20,
				height: 20,
				alpha: 0.42,
				radius: 10,
				fill: true,
			},
		],
	};
}

export function buildPageHeroScene(
	variant: PageHeroVariant,
	width: number,
	height: number,
	time: number,
): PageHeroScene {
	const safeWidth = Number.isFinite(width) ? Math.max(0, width) : 0;
	const safeHeight = Number.isFinite(height) ? Math.max(0, height) : 0;
	const safeTime = Number.isFinite(time) ? Math.max(0, time) : 0;

	switch (variant) {
		case "services":
			return servicesScene(safeWidth, safeHeight, safeTime);
		case "advertise":
			return advertiseScene(safeWidth, safeHeight, safeTime);
		case "portfolio":
			return portfolioScene(safeWidth, safeHeight, safeTime);
		case "diia":
			return diiaScene(safeWidth, safeHeight, safeTime);
		case "contacts":
			return contactsScene(safeWidth, safeHeight, safeTime);
		case "privacy":
			return privacyScene(safeWidth, safeHeight, safeTime);
		case "terms":
			return termsScene(safeWidth, safeHeight, safeTime);
		case "cookies":
			return cookiesScene(safeWidth, safeHeight, safeTime);
	}
}
