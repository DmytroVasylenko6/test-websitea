"use client";

import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link, usePathname, routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const shortLabel: Record<Locale, string> = {
	uk: "УКР",
	en: "EN",
};

export function LanguageSwitcher() {
	const locale = useLocale();
	const pathname = usePathname();
	const t = useTranslations("language");

	return (
		<div className="flex items-center" role="group" aria-label={t("label")}>
			{routing.locales.map((code) => {
				const active = locale === code;
				return (
					<Button
						key={code}
						asChild
						variant="ghost"
						size="sm"
						className={cn(
							"px-2",
							active ? "font-semibold text-foreground" : "text-muted-foreground",
						)}
					>
						<Link
							href={pathname}
							locale={code}
							hrefLang={code}
							aria-current={active ? "true" : undefined}
							aria-label={t(code)}
						>
							{shortLabel[code]}
						</Link>
					</Button>
				);
			})}
		</div>
	);
}
