"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

const STORAGE_KEY = "li-cookie-consent";

export function CookieBanner() {
	const t = useTranslations("cookies");
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		setVisible(window.localStorage.getItem(STORAGE_KEY) !== "necessary");
	}, []);

	if (!visible) {
		return null;
	}

	return (
		<div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 p-4 shadow-lg backdrop-blur">
			<div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
				<p className="text-sm text-muted-foreground">{t("message")}</p>
				<div className="flex items-center gap-2">
					<Button asChild variant="outline" size="sm">
						<Link href="/cookie-policy">{t("policy")}</Link>
					</Button>
					<Button
						size="sm"
						onClick={() => {
							window.localStorage.setItem(STORAGE_KEY, "necessary");
							setVisible(false);
						}}
					>
						{t("accept")}
					</Button>
				</div>
			</div>
		</div>
	);
}
