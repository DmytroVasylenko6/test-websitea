"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LeadStatus } from "@/components/lead-form";
import {
	FLOW,
	clampRatio,
	completionPercent,
	packetDuration,
	ringCircumference,
	ringDashOffset,
} from "@/lib/leadFlow";
import {
	LEAD_STAGE_IDS,
	leadCompletion,
	leadDoneCount,
	leadReady,
	leadStages,
	nextLeadStage,
	stageLinkFill,
	type LeadStageId,
	type LeadStage,
	type LeadValues,
} from "@/lib/leadProgress";

type Gsap = typeof import("gsap").default;
type Flight = { from: gsap.TweenVars; to: gsap.TweenVars };

const CIRCUMFERENCE = ringCircumference();

/** Blocks reuse the form labels, so the diagram and the fields always read the same. */
const STAGE_LABEL_KEYS: Record<LeadStageId, string> = {
	name: "name",
	contact: "progressContact",
	requestType: "requestType",
	message: "message",
};

function stageState(stage: LeadStage): "empty" | "partial" | "done" {
	if (stage.done) {
		return "done";
	}
	return stage.ratio > 0 ? "partial" : "empty";
}

function prefersReducedMotion(): boolean {
	return (
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches
	);
}

/**
 * Packets travel between two live elements, so the flight is measured from the
 * rendered layout instead of hard-coded offsets. `host` must be the packets' own
 * offset parent: measuring against the bordered card would shift every landing
 * by the border width and leave the packet off-centre inside the target node.
 */
function flightBetween(host: HTMLElement, from: HTMLElement, to: HTMLElement): Flight {
	const hostRect = host.getBoundingClientRect();
	const fromRect = from.getBoundingClientRect();
	const toRect = to.getBoundingClientRect();
	const startX = fromRect.left - hostRect.left + fromRect.width / 2;
	const startY = fromRect.top - hostRect.top + fromRect.height / 2;
	const endX = toRect.left - hostRect.left + toRect.width / 2;
	const endY = toRect.top - hostRect.top + toRect.height / 2;

	return {
		from: { x: startX, y: startY, xPercent: -50, yPercent: -50, opacity: 0, scale: 0.5 },
		to: {
			x: endX,
			y: endY,
			opacity: 1,
			scale: 1,
			duration: packetDuration(Math.hypot(endX - startX, endY - startY)),
			ease: "power1.inOut",
		},
	};
}

export function LeadProgress({ values, status }: { values: LeadValues; status: LeadStatus }) {
	const t = useTranslations("form");
	const root = useRef<HTMLDivElement>(null);
	const layer = useRef<HTMLDivElement>(null);
	const target = useRef<HTMLSpanElement>(null);
	const packets = useRef<Array<HTMLSpanElement | null>>([]);
	const nextPacket = useRef(0);
	/** Blocks already celebrated, so a packet flies once per completion, not once per keystroke. */
	const flown = useRef<LeadStageId[]>([]);
	const [engine, setEngine] = useState<Gsap | null>(null);

	const stages = useMemo(() => leadStages(values), [values]);
	const completion = leadCompletion(stages);
	const doneCount = leadDoneCount(stages);
	const ready = leadReady(stages);
	const pending = nextLeadStage(stages);

	/** Row height plus the gap to the next node: `space-y-4` between blocks, `mt-5` before the target. */
	const railSpan = (index: number) =>
		index === stages.length - 1 ? "calc(100% + 1.25rem)" : "calc(100% + 1rem)";
	const railFill = (index: number) => stageLinkFill(stages, index);

	useEffect(() => {
		let cancelled = false;

		// gsap only drives the packets: bars and ring are CSS transitions, so the
		// diagram already reacts to typing before the animation runtime arrives.
		void import("gsap")
			.then(({ default: gsap }) => {
				if (!cancelled) {
					setEngine(gsap);
				}
			})
			.catch(() => {
				// Without gsap the blocks still fill; only the packets are missing.
			});

		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		const host = root.current;
		const field = layer.current;
		const node = target.current;

		if (!engine || !host || !field || !node || prefersReducedMotion()) {
			return;
		}

		const done = stages.filter((stage) => stage.done).map((stage) => stage.id);
		const fresh = done.filter((id) => !flown.current.includes(id));
		flown.current = done;

		for (const id of fresh) {
			const source = host.querySelector<HTMLElement>(`[data-node="${id}"]`);
			const packet = packets.current[nextPacket.current % FLOW.packetCount];
			nextPacket.current += 1;

			if (!source || !packet) {
				continue;
			}

			const flight = flightBetween(field, source, node);
			engine.fromTo(packet, flight.from, {
				...flight.to,
				onComplete: () => engine.to(packet, { opacity: 0, duration: 0.2 }),
			});
		}
	}, [engine, stages]);

	useEffect(() => {
		const host = root.current;
		const field = layer.current;
		const node = target.current;
		const source = host?.querySelector<HTMLElement>('[data-node="name"]');

		if (!engine || !field || !node || !source || !ready || prefersReducedMotion()) {
			return;
		}

		// A finished form keeps a slow stream running toward the enquiry node.
		const timeline = engine.timeline({ repeat: -1, repeatDelay: FLOW.ambientGap });
		const flight = flightBetween(field, source, node);
		const streaming = packets.current
			.slice(0, 2)
			.filter((packet): packet is HTMLSpanElement => Boolean(packet));

		streaming.forEach((packet, index) => {
			timeline.fromTo(packet, flight.from, { ...flight.to, opacity: 0.9 }, index * 0.35);
		});

		return () => {
			timeline.kill();
			engine.set(streaming, { opacity: 0 });
		};
	}, [engine, ready]);

	useEffect(() => {
		const node = target.current;

		if (!engine || !node || status !== "success" || prefersReducedMotion()) {
			return;
		}

		const tween = engine.fromTo(
			node,
			{ scale: 1 },
			{ scale: 1.4, duration: 0.24, yoyo: true, repeat: 1, ease: "power2.out" },
		);

		return () => {
			tween.kill();
		};
	}, [engine, status]);

	useEffect(() => {
		const pool = packets.current.filter(Boolean) as HTMLSpanElement[];

		return () => {
			engine?.killTweensOf(pool);
		};
	}, [engine]);

	const hint = () => {
		if (status === "success") {
			return t("progressHintSent");
		}
		if (status === "sending") {
			return t("sending");
		}
		if (ready) {
			return t("progressHintReady");
		}
		if (pending) {
			return t("progressHintPending", { field: t(STAGE_LABEL_KEYS[pending]) });
		}
		return t("progressHintIdle");
	};

	return (
		<figure className="m-0">
			<div ref={root} className="relative overflow-hidden rounded-2xl border bg-card p-5">
				<div className="flex items-start justify-between gap-4">
					<div>
						<p className="text-sm font-medium">{t("progressTitle")}</p>
						<p className="mt-1 text-xs text-muted-foreground" aria-live="polite">
							{t("progressCounter", {
								done: doneCount,
								total: LEAD_STAGE_IDS.length,
							})}
						</p>
					</div>
					<div className="relative h-16 w-16 shrink-0">
						<svg viewBox="0 0 64 64" className="h-full w-full -rotate-90" aria-hidden>
							<circle
								cx="32"
								cy="32"
								r={FLOW.ringRadius}
								fill="none"
								strokeWidth={FLOW.ringWidth}
								className="stroke-border"
							/>
							<circle
								cx="32"
								cy="32"
								r={FLOW.ringRadius}
								fill="none"
								strokeWidth={FLOW.ringWidth}
								strokeLinecap="round"
								strokeDasharray={CIRCUMFERENCE}
								strokeDashoffset={ringDashOffset(completion, CIRCUMFERENCE)}
								className="stroke-primary motion-safe:transition-[stroke-dashoffset] motion-safe:duration-500 motion-safe:ease-out"
							/>
						</svg>
						<span className="absolute inset-0 grid place-items-center text-xs font-medium tabular-nums">
							{completionPercent(completion)}%
						</span>
					</div>
				</div>

				<div className="relative mt-6">
					<ol className="space-y-4">
						{stages.map((stage, index) => (
							<li
								key={stage.id}
								data-state={stageState(stage)}
								className="group relative pl-6"
							>
								{/*
								 * Each row owns the rail segment down to the next node, so the lit
								 * line can never run past the block it belongs to.
								 */}
								<span
									aria-hidden
									style={{ height: railSpan(index) }}
									className="absolute left-[7px] top-[0.6875rem] w-px bg-border"
								/>
								<span
									aria-hidden
									style={{ height: `calc(${railSpan(index)} * ${railFill(index)})` }}
									className="absolute left-[7px] top-[0.6875rem] w-px bg-primary motion-safe:transition-[height] motion-safe:duration-500 motion-safe:ease-out"
								/>
								<span
									aria-hidden
									data-node={stage.id}
									className="absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 border-border bg-background transition-colors duration-300 group-data-[state=done]:border-primary group-data-[state=done]:bg-primary group-data-[state=partial]:border-primary/60"
								/>
								<div className="flex items-baseline justify-between gap-3">
									<span className="text-sm">{t(STAGE_LABEL_KEYS[stage.id])}</span>
									<span className="text-[11px] tabular-nums text-muted-foreground group-data-[state=done]:text-primary">
										{completionPercent(stage.ratio)}%
									</span>
								</div>
								<div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
									<div
										style={{ transform: `scaleX(${clampRatio(stage.ratio)})` }}
										className="h-full w-full origin-left rounded-full bg-primary/60 group-data-[state=done]:bg-primary motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out"
									/>
								</div>
							</li>
						))}
					</ol>

					<div
						data-state={status === "success" ? "sent" : ready ? "ready" : "waiting"}
						className="group relative mt-5 pl-6"
					>
						<span
							ref={target}
							aria-hidden
							className="absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 border-dashed border-border bg-background transition-colors duration-300 group-data-[state=ready]:border-solid group-data-[state=ready]:border-primary group-data-[state=sent]:border-solid group-data-[state=sent]:border-primary group-data-[state=sent]:bg-primary"
						/>
						<p className="text-sm font-medium">{t("progressTarget")}</p>
						<p className="mt-1 text-xs text-muted-foreground">{hint()}</p>
					</div>
				</div>

				<div ref={layer} aria-hidden className="pointer-events-none absolute inset-0">
					{Array.from({ length: FLOW.packetCount }, (_, index) => (
						<span
							key={index}
							ref={(element) => {
								packets.current[index] = element;
							}}
							className="absolute left-0 top-0 h-2 w-2 rounded-full bg-primary opacity-0"
						/>
					))}
				</div>
			</div>
			<figcaption className="mt-3 text-xs text-muted-foreground">
				{t("progressNote")}
			</figcaption>
		</figure>
	);
}
