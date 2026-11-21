"use client";

import { ChevronDown, ExternalLink, Loader2, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { companyLabels, postTypes } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { getAdminDict, tx } from "@/i18n/admin";
import { type PostInput, deletePost, savePost } from "@/lib/admin/posts";
import { cn } from "@/lib/utils";
import { CharCount, ConfirmDelete, Field, ImageUpload, LangTabs, Segmented, Toggle, dateInputToIso, isoToDateInput, useAction } from "./controls";
import { RichText } from "./RichText";
import { Badge, Card, SelectBox, aBtn, aInput, aTextarea, monoLabel } from "./ui";

export type PostFormState = {
  id?: string;
  slug: string;
  type: "news" | "blog" | "event" | "press" | "award";
  company: "holding" | "aatc" | "dopet" | "pemco";
  status: "draft" | "published";
  featured: boolean;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  bodyEn: string;
  bodyAr: string;
  coverImage: string | null;
  seoTitleEn: string;
  seoTitleAr: string;
  seoDescEn: string;
  seoDescAr: string;
  publishedAt: string;
};

const toSlug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

export function PostEditor({ locale, initial, siteUrl }: { locale: Locale; initial: PostFormState; siteUrl: string }) {
  const d = getAdminDict(locale);
  const t = tx(locale);
  const router = useRouter();
  const { exec, busy } = useAction(locale);

  const [s, setS] = useState<PostFormState>(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [lang, setLang] = useState<"en" | "ar">(locale === "ar" && initial.id ? "ar" : "en");
  const [slugTouched, setSlugTouched] = useState(!!initial.id);
  const [seoOpen, setSeoOpen] = useState(false);
  const [titleError, setTitleError] = useState(false);

  const dirty = JSON.stringify(s) !== saved;
  const set = <K extends keyof PostFormState>(k: K, v: PostFormState[K]) => setS((p) => ({ ...p, [k]: v }));

  // Auto-slug from the English title until the slug is edited manually.
  useEffect(() => {
    if (!slugTouched) setS((p) => ({ ...p, slug: toSlug(p.titleEn) }));
  }, [s.titleEn, slugTouched]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const fn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", fn);
    return () => window.removeEventListener("beforeunload", fn);
  }, [dirty]);

  const save = useCallback(
    async (override?: Partial<PostFormState>) => {
      const next = { ...s, ...override };
      if (next.titleEn.trim().length < 3) {
        setTitleError(true);
        setLang("en");
        document.getElementById("titleEn")?.focus();
      }
      const res = await exec(() => savePost(next as PostInput), {
        success: next.status === "published" ? t("Article saved and published.", "تم حفظ المقال ونشره.") : t("Draft saved.", "تم حفظ المسودة."),
      });
      if (res.ok && res.data) {
        const updated = { ...next, id: res.data.id, slug: res.data.slug };
        setS(updated);
        setSaved(JSON.stringify(updated));
        setSlugTouched(true);
        setTitleError(false);
        if (!s.id) router.replace(`/${locale}/admin/posts/${res.data.id}`);
      } else if (!res.ok && res.error === "TITLE_REQUIRED") {
        setTitleError(true);
      }
    },
    [s, exec, t, router, locale],
  );

  // Ctrl/Cmd + S
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!busy) save();
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [save, busy]);

  const arMissing = !s.titleAr.trim() || !s.bodyAr.trim();
  const isScheduled = s.status === "published" && new Date(s.publishedAt) > new Date();
  const publicUrl = `/${locale}/news/${s.slug}`;
  const L = lang === "en" ? "En" : "Ar";
  const dir = lang === "ar" ? "rtl" : "ltr";
  const title = s[`title${L}`];
  const excerpt = s[`excerpt${L}`];
  const seoTitle = s[`seoTitle${L}`];
  const seoDesc = s[`seoDesc${L}`];

  const preview = useMemo(
    () => ({
      title: seoTitle || title || t("Untitled article", "مقال بدون عنوان"),
      desc: seoDesc || excerpt || t("Add an excerpt or meta description to control how this article appears in search results.", "أضف ملخصًا أو وصفًا لتحديد طريقة ظهور المقال في نتائج البحث."),
    }),
    [seoTitle, title, seoDesc, excerpt, t],
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 border-b border-ink/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <Link href={`/${locale}/admin/posts`} className="mb-4 inline-flex items-center gap-1.5 text-[0.8rem] text-haze hover:text-ink">
            <span aria-hidden className="rtl:rotate-180">
              ←
            </span>
            {d.nav.posts}
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-[1.9rem] font-normal leading-tight text-ink md:text-[2.2rem]">
              {s.id ? t("Edit article", "تعديل المقال") : t("New article", "مقال جديد")}
            </h1>
            <Badge tone={s.status === "published" ? (isScheduled ? "blue" : "green") : "neutral"} dot>
              {s.status === "published" ? (isScheduled ? t("Scheduled", "مجدول") : d.published) : d.draft}
            </Badge>
            {dirty && (
              <span className="flex items-center gap-1.5 text-[0.75rem] text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {d.unsaved}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {s.id && (
            <ConfirmDelete
              locale={locale}
              title={t("Delete this article?", "حذف هذا المقال؟")}
              onConfirm={async () => {
                const res = await exec(() => deletePost(s.id as string), { success: d.deleted, refresh: false });
                if (res.ok) {
                  setSaved(JSON.stringify(s));
                  router.replace(`/${locale}/admin/posts`);
                  router.refresh();
                }
              }}
              trigger={
                <button type="button" className={aBtn("ghost", "icon", "text-red-700 hover:bg-red-50 hover:text-red-700")} aria-label={d.delete}>
                  <Trash2 />
                </button>
              }
            />
          )}
          {s.id && s.status === "published" && !dirty && (
            <a href={publicUrl} target="_blank" rel="noreferrer" className={aBtn("outline")}>
              <ExternalLink className="rtl:-scale-x-100" />
              {t("View live", "عرض على الموقع")}
            </a>
          )}
          {s.status === "draft" && (
            <button type="button" disabled={busy} onClick={() => save({ status: "published" })} className={aBtn("outline")}>
              {t("Publish", "نشر")}
            </button>
          )}
          <button type="button" disabled={busy} onClick={() => save()} className={aBtn("primary", "md", "min-w-[120px]")}>
            {busy ? <Loader2 className="animate-spin" /> : <Save />}
            {busy ? d.saving : d.save}
            <kbd className="ms-1 hidden rounded-[2px] border border-white/20 px-1 font-mono text-[0.6rem] text-white/50 xl:inline">⌘S</kbd>
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        {/* Main column */}
        <div className="space-y-6 xl:col-span-8">
          <div className="flex items-center justify-between gap-4">
            <LangTabs value={lang} onChange={setLang} locale={locale} arMissing={arMissing} />
            <span className="text-[0.75rem] text-haze">
              {lang === "ar"
                ? t("Leave Arabic empty to fall back to English.", "إذا تُركت العربية فارغة يظهر النص الإنجليزي.")
                : t("English is required.", "النسخة الإنجليزية مطلوبة.")}
            </span>
          </div>

          <Card bodyClassName="space-y-5 p-5 md:p-6">
            <Field label={d.title} htmlFor={`title${L}`} required={lang === "en"} aside={<CharCount value={title} max={220} />} error={lang === "en" && titleError ? d.errors.TITLE_REQUIRED : undefined}>
              <input
                id={`title${L}`}
                dir={dir}
                value={title}
                onChange={(e) => {
                  set(`title${L}`, e.target.value);
                  if (lang === "en" && titleError && e.target.value.trim().length >= 3) setTitleError(false);
                }}
                aria-invalid={lang === "en" && titleError}
                placeholder={lang === "en" ? "Headline in English" : "العنوان بالعربية"}
                className={cn(aInput, "h-14 font-display text-[1.35rem]", lang === "ar" && "font-arabic")}
              />
            </Field>
            <Field
              label={t("Excerpt", "الملخص")}
              htmlFor={`excerpt${L}`}
              hint={t("One or two sentences shown on news cards and in search results.", "جملة أو جملتان تظهران في بطاقات الأخبار ونتائج البحث.")}
              aside={<CharCount value={excerpt} max={600} />}
            >
              <textarea
                id={`excerpt${L}`}
                dir={dir}
                rows={3}
                value={excerpt}
                onChange={(e) => set(`excerpt${L}`, e.target.value)}
                className={cn(aTextarea, "min-h-[84px]", lang === "ar" && "font-arabic")}
              />
            </Field>
            <div>
              <p className="mb-1.5 text-[0.8rem] font-medium text-ink/75">{t("Article body", "نص المقال")}</p>
              {/* Both editors stay mounted so undo history and cursor survive tab switches. */}
              <div className={lang === "en" ? "" : "hidden"}>
                <RichText value={initial.bodyEn} onChange={(v) => set("bodyEn", v)} dir="ltr" locale={locale} placeholder="Start writing…" />
              </div>
              <div className={lang === "ar" ? "" : "hidden"}>
                <RichText value={initial.bodyAr} onChange={(v) => set("bodyAr", v)} dir="rtl" locale={locale} placeholder="ابدأ الكتابة…" />
              </div>
            </div>
          </Card>

          {/* SEO */}
          <Card bodyClassName="p-0">
            <button type="button" onClick={() => setSeoOpen((o) => !o)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start" aria-expanded={seoOpen}>
              <span>
                <span className="block font-display text-[1.05rem] text-ink">{t("Search engine listing", "الظهور في محركات البحث")}</span>
                <span className="mt-0.5 block text-[0.78rem] text-haze">{t("Optional. Defaults to the title and excerpt.", "اختياري. يُستخدم العنوان والملخص افتراضيًا.")}</span>
              </span>
              <ChevronDown className={cn("h-4 w-4 shrink-0 text-haze transition-transform", seoOpen && "rotate-180")} />
            </button>
            <div className="border-t border-ink/[0.07] px-5 pb-6 pt-5">
              {/* Preview */}
              <div className="rounded-[2px] border border-ink/[0.07] bg-pearl-50 p-4" dir={dir}>
                <p className="truncate text-[0.75rem] text-haze" dir="ltr">
                  {siteUrl.replace(/^https?:\/\//, "")} › {lang} › news › {s.slug || "…"}
                </p>
                <p className={cn("mt-1 truncate text-[1.1rem] text-[#1a0dab]", lang === "ar" && "font-arabic")}>{preview.title}</p>
                <p className={cn("mt-1 line-clamp-2 text-[0.82rem] leading-relaxed text-ink/70", lang === "ar" && "font-arabic")}>{preview.desc}</p>
              </div>
              {seoOpen && (
                <div className="mt-5 space-y-5">
                  <Field label={t("Meta title", "عنوان الصفحة")} htmlFor={`seoTitle${L}`} aside={<CharCount value={seoTitle} max={120} />} hint={t("Ideally under 60 characters.", "يُفضّل أقل من 60 حرفًا.")}>
                    <input id={`seoTitle${L}`} dir={dir} value={seoTitle} onChange={(e) => set(`seoTitle${L}`, e.target.value)} className={aInput} />
                  </Field>
                  <Field label={t("Meta description", "وصف الصفحة")} htmlFor={`seoDesc${L}`} aside={<CharCount value={seoDesc} max={320} />} hint={t("Ideally 120–160 characters.", "يُفضّل بين 120 و160 حرفًا.")}>
                    <textarea id={`seoDesc${L}`} dir={dir} rows={3} value={seoDesc} onChange={(e) => set(`seoDesc${L}`, e.target.value)} className={aTextarea} />
                  </Field>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 xl:col-span-4">
          <Card title={t("Publishing", "النشر")} bodyClassName="space-y-5">
            <Field label={d.status}>
              <Segmented
                className="w-full"
                value={s.status}
                onChange={(v) => set("status", v)}
                options={[
                  { value: "draft", label: d.draft },
                  { value: "published", label: d.published },
                ]}
              />
            </Field>
            <Field
              label={t("Publication date", "تاريخ النشر")}
              htmlFor="publishedAt"
              hint={isScheduled ? t("Future date: the article goes live automatically on this day.", "تاريخ مستقبلي: يُنشر المقال تلقائيًا في هذا اليوم.") : undefined}
            >
              <input
                id="publishedAt"
                type="date"
                value={isoToDateInput(s.publishedAt)}
                onChange={(e) => e.target.value && set("publishedAt", dateInputToIso(e.target.value, initial.publishedAt))}
                className={cn(aInput, "num")}
              />
            </Field>
            <div className="border-t border-ink/[0.07] pt-5">
              <Toggle
                id="featured"
                checked={s.featured}
                onChange={(v) => set("featured", v)}
                label={d.featured}
                description={t("Featured articles lead the Newsroom and home page.", "تتصدر المقالات المميزة المركز الإعلامي والصفحة الرئيسية.")}
              />
            </div>
          </Card>

          <Card title={t("Classification", "التصنيف")} bodyClassName="space-y-5">
            <Field label={d.type} htmlFor="type">
              <SelectBox id="type" value={s.type} onChange={(e) => set("type", e.target.value as PostFormState["type"])}>
                {Object.entries(postTypes).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v[locale]}
                  </option>
                ))}
              </SelectBox>
            </Field>
            <Field label={d.company} htmlFor="company">
              <SelectBox id="company" value={s.company} onChange={(e) => set("company", e.target.value as PostFormState["company"])}>
                {Object.entries(companyLabels).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v[locale]}
                  </option>
                ))}
              </SelectBox>
            </Field>
            <Field
              label={t("URL slug", "رابط المقال")}
              htmlFor="slug"
              hint={
                <span dir="ltr" className="block truncate font-mono text-[0.7rem]">
                  /news/{s.slug || "…"}
                </span>
              }
            >
              <input
                id="slug"
                dir="ltr"
                value={s.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", toSlug(e.target.value.replace(/\s/g, "-")));
                }}
                className={cn(aInput, "font-mono text-[0.82rem]")}
              />
            </Field>
          </Card>

          <Card title={t("Cover image", "صورة الغلاف")} description={t("Landscape, at least 1600 px wide.", "أفقية، بعرض 1600 بكسل على الأقل.")}>
            <ImageUpload value={s.coverImage} onChange={(v) => set("coverImage", v)} locale={locale} />
          </Card>

          {s.id && (
            <p className={cn(monoLabel, "px-1 leading-relaxed")}>
              ID <span className="normal-case">{s.id}</span>
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
