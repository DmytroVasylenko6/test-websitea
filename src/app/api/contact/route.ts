import { NextRequest, NextResponse } from "next/server";
import { contactInputSchema } from "@/lib/contactSchema";
import { formatContactTelegram } from "@/lib/formatContactTelegram";
import { maskSecret } from "@/lib/maskSecret";
import { isRateLimited } from "@/lib/rateLimit";

async function sendTelegramMessage(text: string): Promise<void> {
	const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
	const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

	if (!token || !chatId) {
		throw Object.assign(new Error("Telegram is not configured"), { status: 503 });
	}

	const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			chat_id: chatId,
			text,
		}),
	});

	if (!response.ok) {
		console.error("Telegram send failed", {
			status: response.status,
			token: maskSecret(token),
		});
		throw Object.assign(new Error("Telegram rejected the message"), { status: 502 });
	}
}

export async function POST(request: NextRequest) {
	const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

	if (isRateLimited(ip)) {
		return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
	}

	const parsed = contactInputSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
	}

	try {
		await sendTelegramMessage(formatContactTelegram(parsed.data));
		return NextResponse.json({ ok: true });
	} catch (error) {
		const status = typeof error === "object" && error && "status" in error
			? Number((error as { status: number }).status)
			: 500;
		return NextResponse.json(
			{ ok: false, error: status === 503 ? "unavailable" : "send_failed" },
			{ status },
		);
	}
}
