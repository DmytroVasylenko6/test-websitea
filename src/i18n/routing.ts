import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["uk", "en"],
	defaultLocale: "uk",
	// Unprefixed URLs stay Ukrainian. Accept-Language and the NEXT_LOCALE cookie
	// must not override that, or the switcher and the page language diverge.
	localeDetection: false,
	localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
	createNavigation(routing);
