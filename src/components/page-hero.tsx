import type { ReactNode } from "react";
import { PageHeroBackground } from "@/components/page-hero-background";
import type { PageHeroVariant } from "@/lib/pageHeroScene";

type PageHeroProps = {
	title: ReactNode;
	lead: ReactNode;
	variant: PageHeroVariant;
	compact?: boolean;
	action?: ReactNode;
};

export function PageHero({ title, lead, variant, compact = false, action }: PageHeroProps) {
	return (
		<header className="relative isolate overflow-hidden border-b">
			<PageHeroBackground variant={variant} />
			<div
				className={`mx-auto flex min-h-[20rem] items-center px-4 py-16 ${
					compact ? "max-w-3xl" : "max-w-6xl"
				}`}
			>
				<div className="relative max-w-3xl">
					<h1 className="hero-enter text-4xl font-semibold tracking-tight md:text-5xl">
						{title}
					</h1>
					<p className="hero-enter hero-enter-2 mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
						{lead}
					</p>
					{action ? <div className="hero-enter hero-enter-3 mt-8">{action}</div> : null}
				</div>
			</div>
		</header>
	);
}
