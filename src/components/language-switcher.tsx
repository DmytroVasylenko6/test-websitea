"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const t = useTranslations("language");

	const nextLocale = locale === "uk" ? "en" : "uk";

	return (
		<Button
			type="button"
			variant="ghost"
			size="sm"
			aria-label={t("label")}
			onClick={() => router.replace(pathname, { locale: nextLocale })}
		>
			{nextLocale.toUpperCase()}
		</Button>
	);
}
