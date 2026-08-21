"use client";

import { Menu, Phone, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { company } from "@/config/company";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const navItems = [
	{ href: "/services" as const, key: "services" },
	{ href: "/advertise" as const, key: "advertise" },
	{ href: "/portfolio" as const, key: "portfolio" },
	{ href: "/diia-city" as const, key: "diia" },
	{ href: "/contacts" as const, key: "contacts" },
];

export function Header() {
	const t = useTranslations("nav");
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const update = () => setScrolled(window.scrollY > 24);
		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, []);

	return (
		<header
			className={cn(
				"sticky top-0 z-40 border-b bg-background/90 backdrop-blur transition-shadow duration-300",
				scrolled ? "shadow-sm" : "shadow-none",
			)}
		>
			<a
				href="#main"
				className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
			>
				{t("skipToContent")}
			</a>
			<div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
				<Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
					{/* SVG mark is a static vector; next/image does not meaningfully optimize it. */}
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src="/brand/mark.svg" alt="" width={32} height={32} />
					<span>{company.shortName}</span>
				</Link>
				<nav className="hidden items-center gap-6 text-sm md:flex" aria-label="Primary">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="text-muted-foreground transition-colors hover:text-foreground"
						>
							{t(item.key)}
						</Link>
					))}
				</nav>
				<div className="flex items-center gap-1">
					<LanguageSwitcher />
					<ThemeToggle />
					<Button asChild size="sm" className="hidden sm:inline-flex">
						<a href={company.phoneHref}>
							<Phone className="h-4 w-4" />
							{company.phone}
						</a>
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="md:hidden"
						aria-label={open ? t("closeMenu") : t("openMenu")}
						onClick={() => setOpen((value) => !value)}
					>
						{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</Button>
				</div>
			</div>
			{open ? (
				<nav className="border-t px-4 py-3 md:hidden" aria-label="Mobile">
					<ul className="flex flex-col gap-3 text-sm">
						{navItems.map((item) => (
							<li key={item.href}>
								<Link href={item.href} onClick={() => setOpen(false)}>
									{t(item.key)}
								</Link>
							</li>
						))}
						<li>
							<a href={company.phoneHref}>{company.phone}</a>
						</li>
					</ul>
				</nav>
			) : null}
		</header>
	);
}
