"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const filters = ["all", "web", "advertising", "it"] as const;

export function PortfolioFilters() {
	const t = useTranslations("portfolio");
	const [filter, setFilter] = useState<(typeof filters)[number]>("all");

	return (
		<div className="mt-8 flex flex-wrap gap-2">
			{filters.map((item) => (
				<Button
					key={item}
					type="button"
					size="sm"
					variant={filter === item ? "default" : "outline"}
					onClick={() => setFilter(item)}
				>
					{item === "all" ? t("filterAll") : t(item)}
				</Button>
			))}
		</div>
	);
}
