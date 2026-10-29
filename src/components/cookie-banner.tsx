"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import {
	CONSENT_ANALYTICS,
	CONSENT_NECESSARY,
	COOKIE_CONSENT_EVENT,
	COOKIE_CONSENT_KEY,
} from "@/lib/cookieConsent";

function storeConsent(value: typeof CONSENT_NECESSARY | typeof CONSENT_ANALYTICS) {
	window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
	window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}

export function CookieBanner() {
	const t = useTranslations("cookies");
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY);
		setVisible(stored !== CONSENT_NECESSARY && stored !== CONSENT_ANALYTICS);
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
						variant="outline"
						size="sm"
						onClick={() => {
							storeConsent(CONSENT_NECESSARY);
							setVisible(false);
						}}
					>
						{t("necessary")}
					</Button>
					<Button
						size="sm"
						onClick={() => {
							storeConsent(CONSENT_ANALYTICS);
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
