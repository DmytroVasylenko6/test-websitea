"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	createClientContactSchema,
	type RequestType,
} from "@/lib/contactSchema";

type FormValues = {
	name: string;
	phone: string;
	email: string;
	message: string;
	requestType: RequestType;
};

type LeadFormProps = {
	defaultType?: RequestType;
	extra?: Record<string, unknown>;
};

export function LeadForm({ defaultType = "it", extra }: LeadFormProps) {
	const t = useTranslations("form");
	const locale = useLocale();
	const [status, setStatus] = useState<"idle" | "success" | "error" | "unavailable">("idle");

	const schema = useMemo(
		() =>
			createClientContactSchema({
				name: t("errors.name"),
				contact: t("errors.contact"),
				email: t("errors.email"),
				phone: t("errors.phone"),
				message: t("errors.message"),
				requestType: t("errors.requestType"),
			}),
		[t],
	);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			phone: "",
			email: "",
			message: "",
			requestType: defaultType,
		},
	});

	return (
		<form
			className="grid gap-4"
			onSubmit={handleSubmit(async (values) => {
				setStatus("idle");
				const response = await fetch("/api/contact", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ ...values, locale, ...extra }),
				});

				if (response.status === 503) {
					setStatus("unavailable");
					return;
				}
				if (!response.ok) {
					setStatus("error");
					return;
				}
				setStatus("success");
			})}
		>
			<div className="grid gap-2">
				<Label htmlFor="name">{t("name")}</Label>
				<Input id="name" autoComplete="name" {...register("name")} />
				{errors.name ? (
					<p className="text-sm text-destructive">{errors.name.message}</p>
				) : null}
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="grid gap-2">
					<Label htmlFor="phone">{t("phone")}</Label>
					<Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
					{errors.phone ? (
						<p className="text-sm text-destructive">{errors.phone.message}</p>
					) : null}
				</div>
				<div className="grid gap-2">
					<Label htmlFor="email">{t("email")}</Label>
					<Input id="email" type="email" autoComplete="email" {...register("email")} />
					{errors.email ? (
						<p className="text-sm text-destructive">{errors.email.message}</p>
					) : null}
				</div>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="requestType">{t("requestType")}</Label>
				<select
					id="requestType"
					className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
					{...register("requestType")}
				>
					<option value="it">{t("it")}</option>
					<option value="advertising">{t("advertising")}</option>
					<option value="partnership">{t("partnership")}</option>
				</select>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="message">{t("message")}</Label>
				<Textarea id="message" {...register("message")} />
				{errors.message ? (
					<p className="text-sm text-destructive">{errors.message.message}</p>
				) : null}
			</div>
			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? t("sending") : t("submit")}
			</Button>
			{status === "success" ? <p className="text-sm text-primary">{t("success")}</p> : null}
			{status === "error" ? <p className="text-sm text-destructive">{t("error")}</p> : null}
			{status === "unavailable" ? (
				<p className="text-sm text-destructive">{t("unavailable")}</p>
			) : null}
		</form>
	);
}
