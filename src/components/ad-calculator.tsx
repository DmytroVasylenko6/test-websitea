"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { adFormats, indicativeRates } from "@/config/company";
import { estimatePlacement } from "@/lib/formatContactTelegram";
import { LeadForm } from "@/components/lead-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdCalculator() {
	const t = useTranslations("advertise");
	const [format, setFormat] = useState<(typeof adFormats)[number]["id"]>(adFormats[0].id);
	const [impressions, setImpressions] = useState(10000);
	const [clicks, setClicks] = useState(0);
	const [weeks, setWeeks] = useState(1);

	const estimate = useMemo(
		() => estimatePlacement({ impressions, clicks, weeks }),
		[impressions, clicks, weeks],
	);

	return (
		<div className="grid gap-8 lg:grid-cols-2">
			<div className="grid gap-4">
				<div className="grid gap-2">
					<Label htmlFor="format">{t("format")}</Label>
					<select
						id="format"
						className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
						value={format}
						onChange={(event) =>
							setFormat(event.target.value as (typeof adFormats)[number]["id"])
						}
					>
						{adFormats.map((item) => (
							<option key={item.id} value={item.id}>
								{t(item.id)}
							</option>
						))}
					</select>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="impressions">{t("impressions")}</Label>
					<Input
						id="impressions"
						type="number"
						min={0}
						value={impressions}
						onChange={(event) => setImpressions(Number(event.target.value) || 0)}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="clicks">{t("clicks")}</Label>
					<Input
						id="clicks"
						type="number"
						min={0}
						value={clicks}
						onChange={(event) => setClicks(Number(event.target.value) || 0)}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="weeks">{t("weeks")}</Label>
					<Input
						id="weeks"
						type="number"
						min={0}
						value={weeks}
						onChange={(event) => setWeeks(Number(event.target.value) || 0)}
					/>
				</div>
				<p className="text-lg font-medium">
					{t("estimate")}: {estimate} {t("uah")}
				</p>
				<p className="text-sm text-muted-foreground">
					{indicativeRates.map((rate) => `${t(rate.id)} ${rate.amountUah} ${t("uah")}`).join(" · ")}
				</p>
			</div>
			<LeadForm
				defaultType="advertising"
				extra={{ format, impressions, clicks, weeks, estimateUah: estimate }}
			/>
		</div>
	);
}
