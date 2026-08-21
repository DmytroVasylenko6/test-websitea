"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { company } from "@/config/company";
import { Link } from "@/i18n/routing";
import { HERO_SLOT_HOLD, buildHeroSlots, heroSlotStart } from "@/lib/heroBanner";
import { cn } from "@/lib/utils";

const slots = buildHeroSlots();

type GsapContext = ReturnType<typeof import("gsap").default.context>;

function Slot({ id, active, className }: { id: string; active: boolean; className?: string }) {
	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-lg border border-dashed border-border",
				className,
			)}
		>
			<div
				data-hero-highlight={id}
				className={cn(
					"absolute inset-0 overflow-hidden rounded-[inherit] bg-primary/10 ring-1 ring-primary/40",
					active ? "opacity-100" : "opacity-0",
				)}
			>
				<div
					data-hero-sweep={id}
					className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
				/>
			</div>
		</div>
	);
}

export function HeroBanner() {
	const t = useTranslations("home");
	const tFormat = useTranslations("advertise");
	const root = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const scope = root.current;
		if (!scope) {
			return;
		}

		let context: GsapContext | undefined;
		let cancelled = false;

		// gsap is loaded on demand so the static hero markup ships without the animation runtime.
		void import("gsap").then(({ default: gsap }) => {
			if (cancelled) {
				return;
			}

			context = gsap.context(() => {
				const pick = (attribute: string, id: string) =>
					scope.querySelector<HTMLElement>(`[${attribute}="${id}"]`);

				const steps = slots
					.map((slot) => ({
						highlight: pick("data-hero-highlight", slot.id),
						caption: pick("data-hero-caption", slot.id),
						sweep: pick("data-hero-sweep", slot.id),
					}))
					.filter((step) => step.highlight && step.caption && step.sweep);

				if (steps.length === 0) {
					return;
				}

				const media = gsap.matchMedia();

				media.add("(prefers-reduced-motion: reduce)", () => {
					gsap.set([steps[0].highlight, steps[0].caption], { opacity: 1, y: 0, scale: 1 });
				});

				media.add("(prefers-reduced-motion: no-preference)", () => {
					const timeline = gsap.timeline({ repeat: -1, defaults: { ease: "power2.out" } });

					steps.forEach((step, index) => {
						const at = heroSlotStart(index);

						timeline
							.fromTo(
								step.highlight,
								{ opacity: 0, scale: 0.97 },
								{ opacity: 1, scale: 1, duration: 0.5 },
								at,
							)
							.fromTo(
								step.caption,
								{ opacity: 0, y: 8 },
								{ opacity: 1, y: 0, duration: 0.45 },
								at + 0.06,
							)
							.fromTo(
								step.sweep,
								{ xPercent: -140 },
								{ xPercent: 420, duration: HERO_SLOT_HOLD - 0.8, ease: "none" },
								at + 0.3,
							)
							.to(
								[step.highlight, step.caption],
								{ opacity: 0, duration: 0.35, ease: "power1.in" },
								at + HERO_SLOT_HOLD - 0.35,
							);
					});

					return () => {
						timeline.kill();
					};
				});

				return () => {
					media.revert();
				};
			}, scope);
		});

		return () => {
			cancelled = true;
			context?.revert();
		};
	}, []);

	return (
		<div className="space-y-3">
			<div
				ref={root}
				role="img"
				aria-label={t("bannerAria")}
				className="rounded-2xl border bg-card p-4 sm:p-5"
			>
				<div className="flex items-center gap-1.5 border-b pb-3">
					<span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
					<span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
					<span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
					<span className="ml-2 text-xs text-muted-foreground">{company.shortName}</span>
				</div>

				<div className="mt-4 space-y-3">
					<Slot id="header" active className="h-9" />
					<div className="grid grid-cols-[1fr_5rem] gap-3 sm:grid-cols-[1fr_6rem]">
						<div className="space-y-2">
							<div className="h-3 w-2/3 rounded bg-muted" />
							<div className="h-2 w-full rounded bg-muted" />
							<div className="h-2 w-11/12 rounded bg-muted" />
							<Slot id="inArticle" active={false} className="h-16" />
							<div className="h-2 w-full rounded bg-muted" />
							<div className="h-2 w-4/5 rounded bg-muted" />
						</div>
						<Slot id="sidebar" active={false} className="min-h-[8rem]" />
					</div>
					<Slot id="sticky" active={false} className="h-7" />
				</div>

				<div className="relative mt-4 h-5 border-t pt-4">
					{slots.map((slot, index) => (
						<div
							key={slot.id}
							data-hero-caption={slot.id}
							className={cn(
								"absolute inset-x-0 top-4 flex items-center gap-2 text-xs",
								index === 0 ? "opacity-100" : "opacity-0",
							)}
						>
							<span className="font-medium text-foreground">{tFormat(slot.id)}</span>
							<span className="text-muted-foreground">{slot.size}</span>
						</div>
					))}
				</div>
			</div>

			<p className="text-xs text-muted-foreground">
				{t("bannerNote")}{" "}
				<Link href="/advertise" className="underline underline-offset-4 hover:text-foreground">
					{t("advertiseCta")}
				</Link>
			</p>
		</div>
	);
}
