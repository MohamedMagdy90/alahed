"use client";

import { CheckCircle2, FileUp, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Field, Honeypot, inputCls, textareaCls } from "@/components/site/form";
import { Arrow, btnClass } from "@/components/site/primitives";
import type { Locale } from "@/i18n/config";
import { CAREER_AREAS, areaLabels } from "@/lib/forms";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";

const OK_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX = 20 * 1024 * 1024;

type Errors = Partial<Record<"name" | "email" | "phone" | "position" | "cv" | "consent", string>>;

export function CareersForm({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = {
    name: ar ? "الاسم الكامل" : "Full name",
    email: ar ? "البريد الإلكتروني" : "Email",
    phone: ar ? "رقم الهاتف" : "Phone",
    position: ar ? "مجال الاهتمام" : "Area of interest",
    message: ar ? "رسالة تعريفية" : "Cover note",
    cv: ar ? "السيرة الذاتية" : "CV / résumé",
    drop: ar ? "اسحب ملفك وأفلته هنا، أو" : "Drag and drop your file here, or",
    browse: ar ? "اختر ملفًا" : "browse",
    types: ar ? "PDF أو DOC أو DOCX، بحد أقصى 20 ميغابايت" : "PDF, DOC or DOCX, up to 20 MB",
    submit: ar ? "إرسال الطلب" : "Submit application",
    required: ar ? "هذا الحقل مطلوب." : "This field is required.",
    badEmail: ar ? "يرجى إدخال بريد إلكتروني صحيح." : "Please enter a valid email address.",
    badType: ar ? "يرجى رفع ملف بصيغة PDF أو DOC أو DOCX." : "Please upload a PDF, DOC or DOCX file.",
    tooLarge: ar ? "حجم الملف يتجاوز 20 ميغابايت." : "The file is larger than 20 MB.",
    rate: ar ? "تم إرسال عدد كبير من الطلبات. يرجى المحاولة لاحقًا." : "Too many submissions. Please try again later.",
    fail: ar ? "تعذّر إرسال طلبك. يرجى المحاولة مرة أخرى." : "We couldn't submit your application. Please try again.",
  };

  const pick = (f: File | undefined | null) => {
    if (!f) return;
    if (!OK_TYPES.includes(f.type)) return setErrors((e) => ({ ...e, cv: t.badType }));
    if (f.size > MAX) return setErrors((e) => ({ ...e, cv: t.tooLarge }));
    setErrors((e) => ({ ...e, cv: undefined }));
    setFile(f);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = Object.fromEntries(fd.entries()) as Record<string, string>;
    const errs: Errors = {};
    if (!v.name || v.name.trim().length < 2) errs.name = t.required;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email || "")) errs.email = t.badEmail;
    if (!v.phone || v.phone.trim().length < 5) errs.phone = t.required;
    if (!v.position) errs.position = t.required;
    if (!file) errs.cv = t.required;
    if (!v.consent) errs.consent = t.required;
    setErrors(errs);
    if (Object.keys(errs).length || !file) return;

    fd.delete("consent");
    fd.set("cv", file);
    fd.set("locale", locale);
    setState("sending");
    setServerError("");
    try {
      const res = await fetch("/api/careers", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "SERVER");
      setState("done");
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      setServerError(code === "RATE_LIMIT" ? t.rate : code === "INVALID_TYPE" ? t.badType : code === "TOO_LARGE" ? t.tooLarge : t.fail);
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-[2px] border border-leaf/40 bg-leaf-50 p-10">
        <CheckCircle2 className="h-8 w-8 text-leaf-700" />
        <p className="mt-6 font-display text-[1.8rem] leading-tight text-ink">{ar ? "تم استلام طلبك بنجاح." : "Your application has been received."}</p>
        <p className="mt-3 max-w-md text-[1rem] leading-relaxed text-haze">
          {ar
            ? "شكرًا لاهتمامك بالانضمام إلى المجموعة. سيراجع فريق الموارد البشرية طلبك ويتواصل معك إذا كان ملفك مناسبًا لإحدى الفرص المتاحة."
            : "Thank you for your interest in joining the Group. Our HR team will review your application and contact you if your profile matches a current opportunity."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-6 md:grid-cols-2">
      <Honeypot />
      <Field label={t.name} htmlFor="a-name" required error={errors.name}>
        <input id="a-name" name="name" autoComplete="name" className={inputCls} aria-invalid={!!errors.name} />
      </Field>
      <Field label={t.email} htmlFor="a-email" required error={errors.email}>
        <input id="a-email" name="email" type="email" autoComplete="email" dir="ltr" className={inputCls} aria-invalid={!!errors.email} />
      </Field>
      <Field label={t.phone} htmlFor="a-phone" required error={errors.phone}>
        <input id="a-phone" name="phone" type="tel" autoComplete="tel" dir="ltr" className={inputCls} aria-invalid={!!errors.phone} />
      </Field>
      <Field label={t.position} htmlFor="a-position" required error={errors.position}>
        <select id="a-position" name="position" defaultValue="" className={inputCls} aria-invalid={!!errors.position}>
          <option value="" disabled>
            {ar ? "اختر المجال" : "Select an area"}
          </option>
          {CAREER_AREAS.map((a) => (
            <option key={a} value={a}>
              {areaLabels[a][locale]}
            </option>
          ))}
        </select>
      </Field>
      <Field label={t.message} htmlFor="a-message" className="md:col-span-2">
        <textarea id="a-message" name="message" rows={5} className={textareaCls} />
      </Field>

      <Field label={t.cv} htmlFor="a-cv" required error={errors.cv} className="md:col-span-2">
        {file ? (
          <div className="flex items-center gap-4 rounded-[2px] border border-ink/15 bg-white p-4">
            <span className="grid h-11 w-11 place-items-center rounded-[2px] bg-leaf-50 text-leaf-700">
              <FileUp className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.95rem] text-ink">{file.name}</span>
              <span className="num font-mono text-[0.75rem] text-haze">{formatBytes(file.size, locale)}</span>
            </span>
            <button
              type="button"
              onClick={() => setFile(null)}
              aria-label={ar ? "إزالة الملف" : "Remove file"}
              className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink hover:bg-ink hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              pick(e.dataTransfer.files?.[0]);
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-[2px] border border-dashed px-6 py-10 text-center transition-colors",
              drag ? "border-leaf bg-leaf-50" : errors.cv ? "border-red-400 bg-white" : "border-ink/20 bg-white",
            )}
          >
            <FileUp className="h-6 w-6 text-haze" />
            <p className="text-[0.95rem] text-ink/75">
              {t.drop}{" "}
              <button type="button" onClick={() => inputRef.current?.click()} className="font-medium text-ink underline decoration-leaf underline-offset-4">
                {t.browse}
              </button>
            </p>
            <p className="text-[0.8rem] text-haze">{t.types}</p>
            <input
              ref={inputRef}
              id="a-cv"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={(e) => pick(e.target.files?.[0])}
            />
          </div>
        )}
      </Field>

      <div className="md:col-span-2">
        <label className="flex items-start gap-3 text-[0.9rem] text-ink/75">
          <input type="checkbox" name="consent" value="1" className="mt-1 h-4 w-4 shrink-0 accent-[#3F9A2C]" />
          <span>
            {ar ? "أوافق على معالجة بياناتي لأغراض التوظيف وفق" : "I agree to my data being processed for recruitment purposes in line with the"}{" "}
            <Link href={`/${locale}/legal/privacy`} className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
              {ar ? "سياسة الخصوصية" : "privacy policy"}
            </Link>
            .
          </span>
        </label>
        {errors.consent && <p className="mt-1.5 text-[0.8rem] text-red-600">{errors.consent}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-5 md:col-span-2">
        <button type="submit" disabled={state === "sending"} className={btnClass("primary")}>
          <span className="flex items-center gap-2 px-5">
            {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
            {t.submit}
          </span>
          <span className="grid w-12 place-items-center border-s border-ink-900/15">
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
