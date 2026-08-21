import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
	// Extensionless metadata routes (icon, apple-icon) must stay out, otherwise they
	// get rewritten to a locale prefix and 404.
	matcher: [
		"/",
		"/(uk|en)/:path*",
		"/((?!api|_next|_vercel|icon|apple-icon|manifest|sitemap|robots|.*\\..*).*)",
	],
};
