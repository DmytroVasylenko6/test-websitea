import { adFormats } from "@/config/company";

export type HeroSlotId = (typeof adFormats)[number]["id"];

export type HeroSlot = {
	id: HeroSlotId;
	/** Primary size shown in the banner caption. */
	size: string;
};

/** Seconds a single format stays highlighted before the timeline moves on. */
export const HERO_SLOT_HOLD = 2.4;

export function buildHeroSlots(): HeroSlot[] {
	return adFormats.map((format) => ({
		id: format.id,
		size: format.sizes[0],
	}));
}

export function heroSlotStart(index: number): number {
	if (!Number.isFinite(index) || index <= 0) {
		return 0;
	}
	return Math.floor(index) * HERO_SLOT_HOLD;
}

export function heroTimelineDuration(slotCount: number): number {
	if (!Number.isFinite(slotCount) || slotCount <= 0) {
		return 0;
	}
	return Math.floor(slotCount) * HERO_SLOT_HOLD;
}
