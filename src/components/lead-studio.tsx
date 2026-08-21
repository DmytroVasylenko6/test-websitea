"use client";

import { useState } from "react";
import { LeadForm, type LeadStatus } from "@/components/lead-form";
import { LeadProgress } from "@/components/lead-progress";
import { Reveal } from "@/components/reveal";
import type { LeadValues } from "@/lib/leadProgress";

/** Holds the form state so the diagram beside the form can follow every edit. */
export function LeadStudio() {
	const [values, setValues] = useState<LeadValues>({});
	const [status, setStatus] = useState<LeadStatus>("idle");

	return (
		<div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
			<Reveal className="max-w-xl">
				<LeadForm onValuesChange={setValues} onStatusChange={setStatus} />
			</Reveal>
			{/* Desktop only: on narrow screens the form itself is the whole story. */}
			<Reveal className="hidden lg:block">
				<LeadProgress values={values} status={status} />
			</Reveal>
		</div>
	);
}
