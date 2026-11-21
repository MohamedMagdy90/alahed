"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Field, Honeypot, inputCls, textareaCls } from "@/components/site/form";
import { Arrow, btnClass } from "@/components/site/primitives";
import type { Locale } from "@/i18n/config";
import { CONTACT_SUBJECTS, subjectLabels } from "@/lib/forms";

type Errors = Partial<Record<"name" | "email" | "subject" | "message" | "consent", string>>;

export function ContactForm({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");

  const t = {
    name: ar ? "الاسم الكامل" : "Full name",
    email: ar ? "البريد الإلكتروني" : "Email",
    phone: ar ? "رقم الهاتف" : "Phone",
    company: ar ? "الشركة" : "Company",
    subject: ar ? "نوع الاستفسار" : "Enquiry type",
    message: ar ? "رسالتك" : "Your message",
    consent: ar ? "أوافق على معالجة بياناتي وفق" : "I agree to my data being processed in line with the",
    privacy: ar ? "سياسة الخصوصية" : "privacy policy",
    send: ar ? "إرسال الرسالة" : "Send message",
    required: ar ? "هذا الحقل مطلوب." : "This field is required.",
    badEmail: ar ? "يرجى إدخال بريد إلكتروني صحيح." : "Please enter a valid email address.",
    short: ar ? "يرجى كتابة 10 أحرف على الأقل." : "Please write at least 10 characters.",
    rate: ar ? "تم إرسال عدد كبير من الطلبات. يرجى المحاولة لاحقًا." : "Too many submissions. Please try again later.",
    fail: ar ? "تعذّر إرسال رسالتك. يرجى المحاولة مرة أخرى." : "We couldn't send your message. Please try again.",
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = Object.fromEntries(fd.entries()) as Record<string, string>;
    const errs: Errors = {};
    if (!v.name || v.name.trim().length < 2) errs.name = t.required;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email || "")) errs.email = t.badEmail;
    if (!v.subject) errs.subject = t.required;
    if (!v.message || v.message.trim().length < 10) errs.message = t.short;
    if (!v.consent) errs.consent = t.required;
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setState("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, locale, consent: undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "SERVER");
      setState("done");
    } catch (err) {
      setServerError(err instanceof Error && err.message === "RATE_LIMIT" ? t.rate : t.fail);
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-[2px] border border-leaf/40 bg-leaf-50 p-10">
        <CheckCircle2 className="h-8 w-8 text-leaf-700" />
        <p className="mt-6 font-display text-[1.8rem] leading-tight text-ink">{ar ? "شكرًا لتواصلك معنا." : "Thank you for getting in touch."}</p>
        <p className="mt-3 max-w-md text-[1rem] leading-relaxed text-haze">
          {ar ? "تم استلام رسالتك، وسيتواصل معك أحد أعضاء فريقنا في أقرب وقت." : "We've received your message and a member of our team will be in touch shortly."}
        </p>
        <button type="button" onClick={() => setState("idle")} className="mt-8 text-[0.9rem] text-ink underline decoration-ink/30 underline-offset-4">
          {ar ? "إرسال رسالة أخرى" : "Send another message"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-6 md:grid-cols-2">
      <Honeypot />
      <Field label={t.name} htmlFor="c-name" required error={errors.name}>
        <input id="c-name" name="name" autoComplete="name" className={inputCls} aria-invalid={!!errors.name} />
      </Field>
      <Field label={t.email} htmlFor="c-email" required error={errors.email}>
        <input id="c-email" name="email" type="email" autoComplete="email" dir="ltr" className={inputCls} aria-invalid={!!errors.email} />
      </Field>
      <Field label={t.phone} htmlFor="c-phone">
        <input id="c-phone" name="phone" type="tel" autoComplete="tel" dir="ltr" className={inputCls} />
      </Field>
      <Field label={t.company} htmlFor="c-company">
        <input id="c-company" name="company" autoComplete="organization" className={inputCls} />
      </Field>
      <Field label={t.subject} htmlFor="c-subject" required error={errors.subject} className="md:col-span-2">
        <select id="c-subject" name="subject" defaultValue="" className={inputCls} aria-invalid={!!errors.subject}>
          <option value="" disabled>
            {ar ? "اختر نوع الاستفسار" : "Select an enquiry type"}
          </option>
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {subjectLabels[s][locale]}
            </option>
          ))}
        </select>
      </Field>
      <Field label={t.message} htmlFor="c-message" required error={errors.message} className="md:col-span-2">
        <textarea id="c-message" name="message" rows={6} className={textareaCls} aria-invalid={!!errors.message} />
      </Field>
      <div className="md:col-span-2">
        <label className="flex items-start gap-3 text-[0.9rem] text-ink/75">
          <input type="checkbox" name="consent" value="1" className="mt-1 h-4 w-4 shrink-0 accent-[#3F9A2C]" />
          <span>
            {t.consent}{" "}
            <Link href={`/${locale}/legal/privacy`} className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
              {t.privacy}
            </Link>
            .
          </span>
        </label>
        {errors.consent && <p className="mt-1.5 text-[0.8rem] text-red-600">{errors.consent}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-5 md:col-span-2">
        <button type="submit" disabled={state === "sending"} className={btnClass("dark")}>
          <span className="flex items-center gap-2 px-5">
            {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
            {t.send}
          </span>
          <span className="grid w-12 place-items-center border-s border-white/15">
            <Arrow />
          </span>
        </button>
        {serverError && (
          <p role="alert" className="text-[0.9rem] text-red-600">
            {serverError}
          </p>
        )}
      </div>
    </form>
  );
}
