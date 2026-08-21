"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const t = useTranslations("theme");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="h-10 w-10" aria-hidden />;
	}

	const isDark = resolvedTheme === "dark";

	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			aria-label={t("toggle")}
			onClick={() => setTheme(isDark ? "light" : "dark")}
		>
			{isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
		</Button>
	);
}
