"use client";

import { useEffect, useRef } from "react";
import {
	buildPageHeroScene,
	type PageHeroScene,
	type PageHeroVariant,
} from "@/lib/pageHeroScene";

type PageHeroBackgroundProps = {
	variant: PageHeroVariant;
};

function readTone(styles: CSSStyleDeclaration, token: string, fallback: string): string {
	const value = styles.getPropertyValue(token).trim();
	return value.length > 0 ? value : fallback;
}

function drawScene(
	context: CanvasRenderingContext2D,
	scene: PageHeroScene,
	width: number,
	height: number,
	primary: string,
	secondary: string,
) {
	context.clearRect(0, 0, width, height);
	context.lineCap = "round";
	context.lineJoin = "round";

	for (const rect of scene.rects) {
		context.beginPath();
		context.roundRect(rect.x, rect.y, rect.width, rect.height, rect.radius ?? 0);
		if (rect.fill) {
			context.fillStyle = `hsl(${primary} / ${rect.alpha * 0.45})`;
			context.fill();
		}
		context.strokeStyle = `hsl(${secondary} / ${rect.alpha})`;
		context.lineWidth = 1;
		context.stroke();
	}

	for (const line of scene.lines) {
		context.beginPath();
		context.setLineDash(line.dash ?? []);
		context.moveTo(line.x1, line.y1);
		context.lineTo(line.x2, line.y2);
		context.strokeStyle = `hsl(${secondary} / ${line.alpha})`;
		context.lineWidth = 1;
		context.stroke();
	}
	context.setLineDash([]);

	for (const circle of scene.circles) {
		context.beginPath();
		context.arc(circle.x, circle.y, Math.max(0, circle.radius), 0, Math.PI * 2);
		if (circle.fill) {
			context.fillStyle = `hsl(${primary} / ${circle.alpha})`;
			context.fill();
		} else {
			context.strokeStyle = `hsl(${primary} / ${circle.alpha})`;
			context.lineWidth = 1;
			context.stroke();
		}
	}
}

export function PageHeroBackground({ variant }: PageHeroBackgroundProps) {
	const hostRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const host = hostRef.current;
		const canvas = canvasRef.current;
		const context = canvas?.getContext("2d");

		if (!host || !canvas || !context) {
			return;
		}

		let cancelled = false;
		let cleanupAnimation: (() => void) | undefined;
		let width = 0;
		let height = 0;
		let elapsed = 0;
		let primary = "174 40% 28%";
		let secondary = "160 6% 38%";

		const readTones = () => {
			const styles = getComputedStyle(host);
			primary = readTone(styles, "--primary", primary);
			secondary = readTone(styles, "--muted-foreground", secondary);
		};

		const draw = () => {
			drawScene(
				context,
				buildPageHeroScene(variant, width, height, elapsed),
				width,
				height,
				primary,
				secondary,
			);
		};

		const resize = () => {
			const rect = host.getBoundingClientRect();
			const ratio = Math.min(window.devicePixelRatio || 1, 2);
			width = rect.width;
			height = rect.height;
			canvas.width = Math.round(width * ratio);
			canvas.height = Math.round(height * ratio);
			context.setTransform(ratio, 0, 0, ratio, 0, 0);
			draw();
		};

		readTones();
		resize();

		const resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(host);

		const themeObserver = new MutationObserver(() => {
			readTones();
			draw();
		});
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});

		void import("gsap")
			.then(({ default: gsap }) => {
				if (cancelled) {
					return;
				}

				const media = gsap.matchMedia();
				media.add("(prefers-reduced-motion: no-preference)", () => {
					const render = (_time: number, deltaMs: number) => {
						elapsed += Math.min(deltaMs / 1000, 0.05);
						draw();
					};
					let running = false;
					const start = () => {
						if (!running) {
							running = true;
							gsap.ticker.add(render);
						}
					};
					const stop = () => {
						if (running) {
							running = false;
							gsap.ticker.remove(render);
						}
					};
					const visibility = new IntersectionObserver(
						([entry]) => (entry.isIntersecting ? start() : stop()),
						{ rootMargin: "80px" },
					);
					visibility.observe(host);

					return () => {
						visibility.disconnect();
						stop();
					};
				});
				cleanupAnimation = () => media.revert();
			})
			.catch(() => {
				// The first static frame remains visible if GSAP cannot load.
			});

		return () => {
			cancelled = true;
			cleanupAnimation?.();
			resizeObserver.disconnect();
			themeObserver.disconnect();
		};
	}, [variant]);

	return (
		<div
			ref={hostRef}
			aria-hidden
			className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
		>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_42%,hsl(var(--primary)/0.09),transparent_32%)]" />
			<canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-90" />
			<div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
			<div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-background" />
		</div>
	);
}
