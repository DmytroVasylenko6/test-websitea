"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import {
	REVEAL,
	revealFromVars,
	revealToVars,
	type RevealVariant,
} from "@/lib/reveal";

type GsapContext = ReturnType<typeof import("gsap").default.context>;

type RevealProps = {
	children?: ReactNode;
	as?: ElementType;
	className?: string;
	id?: string;
	variant?: RevealVariant;
	stagger?: number;
	delay?: number;
};

function markReady(element: HTMLElement) {
	element.dataset.reveal = "ready";
}

export function Reveal({
	children,
	as: Tag = "div",
	className,
	id,
	variant = "fade-up",
	stagger,
	delay,
}: RevealProps) {
	const root = useRef<HTMLElement>(null);

	useEffect(() => {
		const scope = root.current;
		if (!scope) {
			return;
		}

		let context: GsapContext | undefined;
		let cancelled = false;

		// gsap loads on demand: the markup is server-rendered and must not wait for the animation runtime.
		void Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
			.then(([{ default: gsap }, { ScrollTrigger }]) => {
				if (cancelled) {
					return;
				}

				gsap.registerPlugin(ScrollTrigger);

				context = gsap.context(() => {
					const targets =
						variant === "stagger"
							? (Array.from(scope.children) as HTMLElement[])
							: [scope];

					if (targets.length === 0) {
						markReady(scope);
						return;
					}

					const media = gsap.matchMedia();

					media.add("(prefers-reduced-motion: reduce)", () => {
						markReady(scope);
					});

					media.add("(prefers-reduced-motion: no-preference)", () => {
						const tween = gsap.fromTo(targets, revealFromVars(variant), {
							...revealToVars(variant, { stagger, delay }),
							scrollTrigger: { trigger: scope, start: REVEAL.start, once: true },
						});

						// The from-values are already inline, so lifting the CSS gate cannot flash the final state.
						markReady(scope);

						return () => {
							tween.scrollTrigger?.kill();
							tween.kill();
						};
					});

					return () => {
						media.revert();
					};
				}, scope);
			})
			.catch(() => {
				markReady(scope);
			});

		return () => {
			cancelled = true;
			context?.revert();
		};
	}, [variant, stagger, delay]);

	return (
		<Tag
			ref={root}
			id={id}
			data-reveal="pending"
			data-reveal-variant={variant}
			className={className}
		>
			{children}
		</Tag>
	);
}
