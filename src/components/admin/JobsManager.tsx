"use client";

import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { companyLabels } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { getAdminDict, tx } from "@/i18n/admin";
import { type JobInput, deleteJob, saveJob, setJobOpen } from "@/lib/admin/jobs";
import { CAREER_AREAS, JOB_COMPANIES, JOB_EMPLOYMENT, areaLabels, employmentLabels } from "@/lib/forms";
import { cn } from "@/lib/utils";
import { CharCount, ConfirmDelete, Field, LangTabs, Modal, Toggle, dateInputToIso, isoToDateInput, useAction } from "./controls";
import { ALink, Badge, Card, EmptyState, SelectBox, aBtn, aInput, aTextarea } from "./ui";

export type JobRow = {
  id: string;
  company: (typeof JOB_COMPANIES)[number];
  area: (typeof CAREER_AREAS)[number];
  employment: (typeof JOB_EMPLOYMENT)[number];
  titleEn: string;
  titleAr: string;
  locationEn: string;
  locationAr: string;
  summaryEn: string;
  summaryAr: string;
  open: boolean;
  postedAt: string;
  applications: number;
};

const blank = (): JobInput => ({
  company: "holding",
  area: "engineering",
  employment: "full-time",
  titleEn: "",
  titleAr: "",
  locationEn: "Doha, Qatar",
  locationAr: "الدوحة، قطر",
  summaryEn: "",
  summaryAr: "",
  open: true,
  postedAt: new Date().toISOString(),
});

export function JobsManager({ locale, jobs, openNew }: { locale: Locale; jobs: JobRow[]; openNew?: boolean }) {
  const d = getAdminDict(locale);
  const t = tx(locale);
  const { exec, busy } = useAction(locale);
  const [editing, setEditing] = useState<JobInput | null>(openNew ? blank() : null);
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toggling, setToggling] = useState<string | null>(null);

  const open = (j: JobInput) => {
    setErrors({});
    setLang("en");
    setEditing(j);
  };

  const submit = async () => {
    if (!editing) return;
    const errs: Record<string, string> = {};
    if (editing.titleEn.trim().length < 3) errs.titleEn = d.errors.TITLE_REQUIRED;
    setErrors(errs);
    if (Object.keys(errs).length) {
      setLang("en");
      return;
    }
    const res = await exec(() => saveJob(editing));
    if (res.ok) setEditing(null);
  };

  const set = <K extends keyof JobInput>(k: K, v: JobInput[K]) => setEditing((p) => (p ? { ...p, [k]: v } : p));
  const L = lang === "en" ? "En" : "Ar";
  const dir = lang === "ar" ? "rtl" : "ltr";
  const label = (row: Pick<JobRow, "titleEn" | "titleAr">) => (locale === "ar" && row.titleAr ? row.titleAr : row.titleEn);

  const groups = [
    { id: "open", title: t("Accepting applications", "مفتوحة للتقديم"), body: t("Listed on the Careers page and counted on the home page.", "تظهر في صفحة الوظائف ويُعرض عددها في الصفحة الرئيسية."), list: jobs.filter((j) => j.open) },
    { id: "closed", title: t("Closed", "مغلقة"), body: t("Hidden from the website. Re-open a role at any time.", "مخفية من الموقع، ويمكن إعادة فتحها في أي وقت."), list: jobs.filter((j) => !j.open) },
  ];

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button type="button" onClick={() => open(blank())} className={aBtn("accent")}>
          <Plus />
          {t("Add role", "إضافة وظيفة")}
        </button>
      </div>

      <div className="space-y-6">
        {groups.map((g) => (
          <Card
            key={g.id}
            title={
              <span className="flex items-center gap-3">
                {g.title}
                <span className="num font-mono text-[0.75rem] text-haze">{g.list.length}</span>
              </span>
            }
            description={g.body}
            bodyClassName="p-0"
          >
            {g.list.length === 0 ? (
              g.id === "open" ? (
                <EmptyState
                  title={t("No open roles", "لا توجد وظائف مفتوحة")}
                  body={t(
                    "The Careers page invites general applications to the talent pool until a role is added.",
                    "تدعو صفحة الوظائف إلى التقديم العام ضمن قاعدة المواهب حتى تتم إضافة وظيفة.",
                  )}
                  action={
                    <button type="button" onClick={() => open(blank())} className={aBtn("outline", "sm")}>
                      <Plus />
                      {t("Add role", "إضافة وظيفة")}
                    </button>
                  }
                />
              ) : (
                <p className="px-5 py-6 text-[0.85rem] text-haze">{d.empty}</p>
              )
            ) : (
              <ul>
                {g.list.map((j) => (
                  <li key={j.id} className={cn("flex items-center gap-4 border-b border-ink/[0.07] px-5 py-3.5 last:border-0", !j.open && "bg-pearl-50/70")}>
                    <div className="min-w-0 flex-1">
                      <p className={cn("truncate font-medium", j.open ? "text-ink" : "text-ink/55")}>{label(j)}</p>
                      <p className="truncate text-[0.8rem] text-haze">
                        {[companyLabels[j.company]?.[locale], locale === "ar" ? j.locationAr || j.locationEn : j.locationEn, employmentLabels[j.employment][locale]]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <div className="hidden items-center gap-2 md:flex">
                      {j.applications > 0 && (
                        <Badge tone="blue">
                          <span className="num">{j.applications}</span> {t("applications", "طلبات")}
                        </Badge>
                      )}
                      {!j.titleAr && <Badge tone="amber">{d.missingAr}</Badge>}
                      <span className="num text-[0.78rem] text-haze">{new Date(j.postedAt).toLocaleDateString(locale === "ar" ? "ar-QA" : "en-GB", { day: "numeric", month: "short", year: "numeric", numberingSystem: "latn" })}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        disabled={toggling !== null}
                        onClick={async () => {
                          setToggling(j.id);
                          await exec(() => setJobOpen(j.id, !j.open), { success: j.open ? t("Role closed.", "تم إغلاق الوظيفة.") : t("Role re-opened.", "تمت إعادة فتح الوظيفة.") });
                          setToggling(null);
                        }}
                        className={aBtn("ghost", "sm")}
                      >
                        {toggling === j.id && <Loader2 className="animate-spin" />}
                        {j.open ? t("Close", "إغلاق") : t("Re-open", "إعادة فتح")}
                      </button>
                      <button
                        type="button"
                        onClick={() => open({ ...j, postedAt: new Date(j.postedAt).toISOString() })}
                        className={aBtn("ghost", "iconSm")}
                        aria-label={d.edit}
                      >
                        <Pencil />
                      </button>
                      <ConfirmDelete
                        locale={locale}
                        title={t("Delete this role?", "حذف هذه الوظيفة؟")}
                        body={t(
                          "Applications already received stay in the inbox. To stop new applications without deleting, close the role instead.",
                          "تبقى الطلبات المستلمة في صندوق الوارد. لإيقاف التقديم دون حذف، أغلق الوظيفة بدلًا من ذلك.",
                        )}
                        onConfirm={() => exec(() => deleteJob(j.id), { success: d.deleted })}
                        trigger={
                          <button type="button" className={aBtn("ghost", "iconSm", "hover:bg-red-50 hover:text-red-700")} aria-label={d.delete}>
                            <Trash2 />
                          </button>
                        }
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>

      <p className="mt-6 text-[0.8rem] text-haze">
        {t("Applications for a role arrive in the", "تصل طلبات التقديم إلى")}{" "}
        <ALink href={`/${locale}/admin/inbox?filter=career`} variant="ghost" size="sm" className="h-auto px-1 text-leaf-700 underline underline-offset-4">
          {t("Inbox", "صندوق الوارد")}
        </ALink>{" "}
        {t("with the role title. Changes appear on the public", "مع اسم الوظيفة. وتظهر التغييرات فورًا في")}{" "}
        <ALink href={`/${locale}/careers`} target="_blank" variant="ghost" size="sm" className="h-auto px-1 text-leaf-700 underline underline-offset-4">
          {t("Careers page", "صفحة الوظائف")}
        </ALink>
        {t(" immediately.", ".")}
      </p>

      <Modal
        locale={locale}
        open={!!editing}
        onOpenChange={(v) => !v && !busy && setEditing(null)}
        size="xl"
        title={editing?.id ? t("Edit role", "تعديل الوظيفة") : t("New role", "وظيفة جديدة")}
        footer={
          <>
            <button type="button" onClick={() => setEditing(null)} className={aBtn("outline")} disabled={busy}>
              {d.cancel}
            </button>
            <button type="button" onClick={submit} className={aBtn("primary", "md", "min-w-[110px]")} disabled={busy}>
              {busy && <Loader2 className="animate-spin" />}
              {busy ? d.saving : d.save}
            </button>
          </>
        }
      >
        {editing && (
          <div className="grid gap-6 md:grid-cols-[230px_1fr]">
            <div className="space-y-5">
              <Field label={d.company} htmlFor="job-company">
                <SelectBox id="job-company" value={editing.company} onChange={(e) => set("company", e.target.value as JobInput["company"])}>
                  {JOB_COMPANIES.map((c) => (
                    <option key={c} value={c}>
                      {companyLabels[c][locale]}
                    </option>
                  ))}
                </SelectBox>
              </Field>
              <Field label={t("Area", "المجال")} htmlFor="job-area">
                <SelectBox id="job-area" value={editing.area} onChange={(e) => set("area", e.target.value as JobInput["area"])}>
                  {CAREER_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {areaLabels[a][locale]}
                    </option>
                  ))}
                </SelectBox>
              </Field>
              <Field label={t("Employment", "نوع التوظيف")} htmlFor="job-employment">
                <SelectBox id="job-employment" value={editing.employment} onChange={(e) => set("employment", e.target.value as JobInput["employment"])}>
                  {JOB_EMPLOYMENT.map((m) => (
                    <option key={m} value={m}>
                      {employmentLabels[m][locale]}
                    </option>
                  ))}
                </SelectBox>
              </Field>
              <Field label={t("Posted on", "تاريخ النشر")} htmlFor="job-posted">
                <input
                  id="job-posted"
                  type="date"
                  value={isoToDateInput(editing.postedAt)}
                  onChange={(e) => e.target.value && set("postedAt", dateInputToIso(e.target.value, editing.postedAt))}
                  className={aInput}
                />
              </Field>
              <Toggle id="job-open" checked={editing.open} onChange={(v) => set("open", v)} label={t("Accepting applications", "مفتوحة للتقديم")} />
            </div>

            <div className="min-w-0 space-y-5">
              <LangTabs value={lang} onChange={setLang} locale={locale} arMissing={!editing.titleAr?.trim()} />
              <Field label={t("Job title", "المسمى الوظيفي")} htmlFor={`title${L}`} required={lang === "en"} error={lang === "en" ? errors.titleEn : undefined}>
                <input
                  id={`title${L}`}
                  dir={dir}
                  value={editing[`title${L}`] ?? ""}
                  onChange={(e) => set(`title${L}`, e.target.value)}
                  aria-invalid={lang === "en" && !!errors.titleEn}
                  className={cn(aInput, lang === "ar" && "font-arabic")}
                />
              </Field>
              <Field label={t("Location", "الموقع")} htmlFor={`location${L}`}>
                <input
                  id={`location${L}`}
                  dir={dir}
                  value={editing[`location${L}`] ?? ""}
                  onChange={(e) => set(`location${L}`, e.target.value)}
                  className={cn(aInput, lang === "ar" && "font-arabic")}
                />
              </Field>
              <Field
                label={t("Summary", "نبذة عن الوظيفة")}
                htmlFor={`summary${L}`}
                aside={<CharCount value={editing[`summary${L}`] ?? ""} max={1500} />}
                hint={t("A few lines on the role and the experience required. Shown on the Careers page.", "بضعة أسطر عن الوظيفة والخبرة المطلوبة. تظهر في صفحة الوظائف.")}
              >
                <textarea
                  id={`summary${L}`}
                  dir={dir}
                  rows={7}
                  value={editing[`summary${L}`] ?? ""}
                  onChange={(e) => set(`summary${L}`, e.target.value)}
                  className={cn(aTextarea, lang === "ar" && "font-arabic")}
                />
              </Field>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
