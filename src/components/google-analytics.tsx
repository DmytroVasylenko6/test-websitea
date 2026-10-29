"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { COOKIE_CONSENT_EVENT, COOKIE_CONSENT_KEY, isAnalyticsConsent } from "@/lib/cookieConsent";

export const GA_MEASUREMENT_ID = "G-TJGS9RNZKD";

declare global {
	interface Window {
		gtag?: (...args: unknown[]) => void;
	}
}

export function GoogleAnalytics() {
	const pathname = usePathname();
	const [enabled, setEnabled] = useState(false);
	const skipFirstView = useRef(true);

	useEffect(() => {
		const sync = () => {
			setEnabled(isAnalyticsConsent(window.localStorage.getItem(COOKIE_CONSENT_KEY)));
		};
		sync();
		window.addEventListener(COOKIE_CONSENT_EVENT, sync);
		return () => window.removeEventListener(COOKIE_CONSENT_EVENT, sync);
	}, []);

	useEffect(() => {
		if (!enabled) return;
		// The config call below already records the first view. Later client navigations do not.
		if (skipFirstView.current) {
			skipFirstView.current = false;
			return;
		}
		window.gtag?.("config", GA_MEASUREMENT_ID, { page_path: pathname || "/" });
	}, [enabled, pathname]);

	if (!enabled) return null;

	return (
		<>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
				strategy="afterInteractive"
			/>
			<Script id="google-analytics" strategy="afterInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					window.gtag = gtag;
					gtag('js', new Date());
					gtag('config', '${GA_MEASUREMENT_ID}');
				`}
			</Script>
		</>
	);
}
