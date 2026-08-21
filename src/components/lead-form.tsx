"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EMAIL_MAX, PHONE_INPUT_MAX, sanitizePhoneInput } from "@/lib/contactChannels";
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

export type LeadStatus = "idle" | "sending" | "success" | "error" | "unavailable";

/**
 * A fixed-height slot per field, kept in the layout even while empty, so showing a
 * validation message never moves the fields below it.
 */
function FieldError({ id, message }: { id: string; message?: string }) {
	return (
		<p
			id={id}
			role={message ? "alert" : undefined}
			className="min-h-4 text-xs leading-4 text-destructive"
		>
			{message ?? ""}
		</p>
	);
}

type LeadFormProps = {
	defaultType?: RequestType;
	extra?: Record<string, unknown>;
	/** Called on every edit, so a sibling can visualise how full the form is. */
	onValuesChange?: (values: FormValues) => void;
	onStatusChange?: (status: LeadStatus) => void;
};

export function LeadForm({
	defaultType = "it",
	extra,
	onValuesChange,
	onStatusChange,
}: LeadFormProps) {
	const t = useTranslations("form");
	const locale = useLocale();
	const [status, setStatus] = useState<Exclude<LeadStatus, "sending">>("idle");
	/** The form can appear twice on a page, so ids must not be global constants. */
	const uid = useId();
	const fieldId = (field: keyof FormValues) => `${uid}-${field}`;
	const errorId = (field: keyof FormValues) => `${uid}-${field}-error`;

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
		watch,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		// Report a bad phone or email when the visitor leaves the field, not only on submit.
		mode: "onTouched",
		defaultValues: {
			name: "",
			phone: "",
			email: "",
			message: "",
			requestType: defaultType,
		},
	});

	useEffect(() => {
		if (!onValuesChange) {
			return;
		}

		// A subscription instead of useWatch: the inputs stay uncontrolled and only
		// the listener re-renders on typing.
		onValuesChange(getValues());
		const subscription = watch((values) => onValuesChange(values as FormValues));

		return () => {
			subscription.unsubscribe();
		};
	}, [watch, getValues, onValuesChange]);

	useEffect(() => {
		onStatusChange?.(isSubmitting ? "sending" : status);
	}, [onStatusChange, isSubmitting, status]);

	const phoneField = register("phone");

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
			<div className="grid gap-1.5">
				<Label htmlFor={fieldId("name")}>{t("name")}</Label>
				<Input
					id={fieldId("name")}
					autoComplete="name"
					aria-invalid={errors.name ? true : undefined}
					aria-describedby={errorId("name")}
					{...register("name")}
				/>
				<FieldError id={errorId("name")} message={errors.name?.message} />
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="grid gap-1.5">
					<Label htmlFor={fieldId("phone")}>{t("phone")}</Label>
					<Input
						id={fieldId("phone")}
						type="tel"
						inputMode="tel"
						autoComplete="tel"
						maxLength={PHONE_INPUT_MAX}
						placeholder={t("phonePlaceholder")}
						aria-invalid={errors.phone ? true : undefined}
						aria-describedby={errorId("phone")}
						{...phoneField}
						onChange={(event) => {
							// Filter on the way in, so letters never appear in the field at all.
							event.target.value = sanitizePhoneInput(event.target.value);
							void phoneField.onChange(event);
						}}
					/>
					<FieldError id={errorId("phone")} message={errors.phone?.message} />
				</div>
				<div className="grid gap-1.5">
					<Label htmlFor={fieldId("email")}>{t("email")}</Label>
					<Input
						id={fieldId("email")}
						type="email"
						inputMode="email"
						autoComplete="email"
						maxLength={EMAIL_MAX}
						placeholder={t("emailPlaceholder")}
						aria-invalid={errors.email ? true : undefined}
						aria-describedby={errorId("email")}
						{...register("email")}
					/>
					<FieldError id={errorId("email")} message={errors.email?.message} />
				</div>
			</div>
			<div className="grid gap-1.5">
				<Label htmlFor={fieldId("requestType")}>{t("requestType")}</Label>
				<select
					id={fieldId("requestType")}
					className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
					{...register("requestType")}
				>
					<option value="it">{t("it")}</option>
					<option value="advertising">{t("advertising")}</option>
					<option value="partnership">{t("partnership")}</option>
				</select>
			</div>
			<div className="grid gap-1.5">
				<Label htmlFor={fieldId("message")}>{t("message")}</Label>
				<Textarea
					id={fieldId("message")}
					aria-invalid={errors.message ? true : undefined}
					aria-describedby={errorId("message")}
					{...register("message")}
				/>
				<FieldError id={errorId("message")} message={errors.message?.message} />
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
