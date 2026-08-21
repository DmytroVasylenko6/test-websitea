"use client";

import { useEffect, useRef } from "react";
import {
	FIELD,
	createParticles,
	linkAlpha,
	particleCount,
	rescaleParticles,
	stepParticle,
	type Particle,
} from "@/lib/heroField";

type GsapContext = ReturnType<typeof import("gsap").default.context>;

/** Reads an hsl triple from a CSS custom property, e.g. "174 40% 28%". */
function readTone(styles: CSSStyleDeclaration, token: string, fallback: string): string {
	const value = styles.getPropertyValue(token).trim();
	return value.length > 0 ? value : fallback;
}

export function HeroBackground() {
	const wrapper = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const host = wrapper.current;
		const canvas = canvasRef.current;
		const context = canvas?.getContext("2d");

		if (!host || !canvas || !context) {
			return;
		}

		let gsapContext: GsapContext | undefined;
		let cancelled = false;

		void import("gsap")
			.then(({ default: gsap }) => {
				if (cancelled) {
					return;
				}

				let particles: Particle[] = [];
				let bounds = { width: 0, height: 0 };
				let dotTone = "174 40% 28%";
				let linkTone = dotTone;

				const readTones = () => {
					const styles = getComputedStyle(host);
					dotTone = readTone(styles, "--primary", dotTone);
					linkTone = readTone(styles, "--muted-foreground", dotTone);
				};

				const resize = () => {
					const rect = host.getBoundingClientRect();
					const ratio = Math.min(window.devicePixelRatio || 1, 2);
					const next = { width: rect.width, height: rect.height };
					const count = particleCount(next);

					canvas.width = Math.round(next.width * ratio);
					canvas.height = Math.round(next.height * ratio);
					context.setTransform(ratio, 0, 0, ratio, 0, 0);

					particles =
						particles.length === count
							? rescaleParticles(particles, bounds, next)
							: createParticles(next, count);

					bounds = next;
				};

				const draw = () => {
					context.clearRect(0, 0, bounds.width, bounds.height);

					for (let i = 0; i < particles.length; i += 1) {
						const a = particles[i];

						for (let j = i + 1; j < particles.length; j += 1) {
							const b = particles[j];
							const alpha = linkAlpha(Math.hypot(a.x - b.x, a.y - b.y));

							if (alpha > 0) {
								context.strokeStyle = `hsl(${linkTone} / ${alpha})`;
								context.lineWidth = 1;
								context.beginPath();
								context.moveTo(a.x, a.y);
								context.lineTo(b.x, b.y);
								context.stroke();
							}
						}
					}

					context.fillStyle = `hsl(${dotTone} / ${FIELD.dotAlpha})`;
					for (const particle of particles) {
						context.beginPath();
						context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
						context.fill();
					}
				};

				readTones();
				resize();

				gsapContext = gsap.context(() => {
					const media = gsap.matchMedia();

					// Theme switching swaps the hsl tokens, so the field has to re-read them.
					const themeWatcher = new MutationObserver(() => {
						readTones();
						draw();
					});
					themeWatcher.observe(document.documentElement, {
						attributes: true,
						attributeFilter: ["class"],
					});

					const resizeObserver = new ResizeObserver(() => {
						resize();
						draw();
					});
					resizeObserver.observe(host);

					media.add("(prefers-reduced-motion: reduce)", () => {
						draw();
					});

					media.add("(prefers-reduced-motion: no-preference)", () => {
						const render = (_time: number, deltaMs: number) => {
							particles = particles.map((particle) =>
								stepParticle(particle, bounds, deltaMs / 1000),
							);
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

						// Pausing off-screen keeps the loop off the main thread for the rest of the page.
						const visibility = new IntersectionObserver(
							([entry]) => {
								if (entry.isIntersecting) {
									start();
								} else {
									stop();
								}
							},
							{ rootMargin: "80px" },
						);
						visibility.observe(host);

						gsap.to("[data-hero-blob]", {
							xPercent: (index) => (index === 0 ? 8 : -6),
							yPercent: (index) => (index === 0 ? -6 : 7),
							scale: 1.08,
							duration: 16,
							ease: "sine.inOut",
							repeat: -1,
							yoyo: true,
							stagger: 2,
						});

						return () => {
							visibility.disconnect();
							stop();
						};
					});

					return () => {
						themeWatcher.disconnect();
						resizeObserver.disconnect();
						media.revert();
					};
				}, host);
			})
			.catch(() => {
				// Without gsap the gradient stays as a plain static background.
			});

		return () => {
			cancelled = true;
			gsapContext?.revert();
		};
	}, []);

	return (
		<div
			ref={wrapper}
			aria-hidden
			className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
		>
			<div
				data-hero-blob
				className="absolute -left-24 -top-28 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.16),transparent_70%)]"
			/>
			<div
				data-hero-blob
				className="absolute -right-20 top-16 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--accent-foreground)/0.12),transparent_70%)]"
			/>
			<canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
			<div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
		</div>
	);
}
