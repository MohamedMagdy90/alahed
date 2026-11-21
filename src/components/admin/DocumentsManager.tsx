"use client";

import { FileText, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { documentCategories } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { formatDate } from "@/i18n/config";
import { getAdminDict, tx } from "@/i18n/admin";
import { type DocumentInput, deleteDocument, saveDocument } from "@/lib/admin/documents";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ConfirmDelete, Field, Modal, PdfUpload, Toggle, dateInputToIso, isoToDateInput, useAction } from "./controls";
import { Badge, Card, EmptyState, SelectBox, Table, aBtn, aInput } from "./ui";

export type DocumentRow = {
  id: string;
  category: DocumentInput["category"];
  titleEn: string;
  titleAr: string;
  year: number;
  fileUrl: string;
  fileSize: number;
  published: boolean;
  publishedAt: string;
};

export function DocumentsManager({ locale, docs, openNew }: { locale: Locale; docs: DocumentRow[]; openNew?: boolean }) {
  const d = getAdminDict(locale);
  const t = tx(locale);
  const { exec, busy } = useAction(locale);
  const [cat, setCat] = useState<string>("all");
  const blank = (): DocumentInput => ({
    category: cat !== "all" ? (cat as DocumentInput["category"]) : "financial",
    titleEn: "",
    titleAr: "",
    year: new Date().getFullYear(),
    fileUrl: "",
    fileSize: 0,
    published: true,
    publishedAt: `${new Date().toISOString().slice(0, 10)}T12:00:00.000Z`,
  });
  const [editing, setEditing] = useState<DocumentInput | null>(openNew ? blank() : null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: docs.length };
    for (const x of docs) c[x.category] = (c[x.category] || 0) + 1;
    return c;
  }, [docs]);
  const list = cat === "all" ? docs : docs.filter((x) => x.category === cat);

  const set = <K extends keyof DocumentInput>(k: K, v: DocumentInput[K]) => setEditing((p) => (p ? { ...p, [k]: v } : p));

  const submit = async () => {
    if (!editing) return;
    const errs: Record<string, string> = {};
    if (editing.titleEn.trim().length < 2) errs.titleEn = d.errors.TITLE_REQUIRED;
    if (!editing.fileUrl) errs.file = d.errors.FILE_REQUIRED;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const res = await exec(() => saveDocument(editing));
    if (res.ok) setEditing(null);
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {[["all", { en: d.all, ar: d.all }] as const, ...Object.entries(documentCategories)].map(([k, v]) => (
            <button
              key={k}
              type="button"
              onClick={() => setCat(k)}
              className={cn(
                "inline-flex h-8 items-center gap-2 rounded-full border px-3.5 text-[0.8rem] transition-colors",
                cat === k ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-ink/75 hover:border-ink/35",
              )}
            >
              {v[locale]}
              <span className={cn("num text-[0.72rem]", cat === k ? "text-white/60" : "text-haze")}>{counts[k] || 0}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setErrors({});
            setEditing(blank());
          }}
          className={aBtn("accent")}
        >
          <Plus />
          {t("Upload document", "رفع وثيقة")}
        </button>
      </div>

      <Card bodyClassName="p-0">
        {list.length === 0 ? (
          <EmptyState
            title={t("No documents in this category", "لا توجد وثائق في هذه الفئة")}
            body={t("The Investors page shows 'to be published' until documents are uploaded.", "تعرض صفحة المستثمرين عبارة «سيتم النشر لاحقًا» حتى يتم رفع الوثائق.")}
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>{d.title}</th>
                <th>{t("Category", "الفئة")}</th>
                <th>{t("Year", "السنة")}</th>
                <th>{d.status}</th>
                <th className="w-px" />
              </tr>
            </thead>
            <tbody>
              {list.map((x) => (
                <tr key={x.id}>
                  <td className="max-w-[420px]">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-9 shrink-0 place-items-center rounded-[2px] bg-pearl-100 text-red-600 ring-1 ring-ink/[0.07]">
                        <FileText className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      <div className="min-w-0">
                        <a href={x.fileUrl} target="_blank" rel="noreferrer" className="block truncate font-medium text-ink hover:underline hover:underline-offset-4">
                          {x.titleEn}
                        </a>
                        <span className={cn("block truncate font-arabic text-[0.8rem]", x.titleAr ? "text-haze" : "text-amber-700")} dir="rtl">
                          {x.titleAr || d.missingAr}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-ink/80">{documentCategories[x.category]?.[locale]}</td>
                  <td>
                    <span className="num block text-ink">{x.year}</span>
                    <span className="num block text-[0.72rem] text-haze">{formatBytes(x.fileSize, locale)}</span>
                  </td>
                  <td>
                    <Badge tone={x.published ? "green" : "neutral"} dot>
                      {x.published ? d.published : t("Hidden", "مخفي")}
                    </Badge>
                    <span className="num mt-1 block text-[0.72rem] text-haze">{formatDate(x.publishedAt, locale, { day: "numeric", month: "short", year: "numeric" })}</span>
                  </td>
                  <td>
                    <div className="flex justify-end gap-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setErrors({});
                          setEditing({ ...x });
                        }}
                        className={aBtn("ghost", "iconSm")}
                        aria-label={d.edit}
                      >
                        <Pencil />
                      </button>
                      <ConfirmDelete
                        locale={locale}
                        title={t("Delete this document?", "حذف هذه الوثيقة؟")}
                        body={t("It will be removed from the Investors page. The uploaded file is kept on the server.", "ستُزال من صفحة المستثمرين، مع الاحتفاظ بالملف المرفوع على الخادم.")}
                        onConfirm={() => exec(() => deleteDocument(x.id), { success: d.deleted })}
                        trigger={
                          <button type="button" className={aBtn("ghost", "iconSm", "hover:bg-red-50 hover:text-red-700")} aria-label={d.delete}>
                            <Trash2 />
                          </button>
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal
        locale={locale}
        open={!!editing}
        onOpenChange={(v) => !v && !busy && setEditing(null)}
        size="lg"
        title={editing?.id ? t("Edit document", "تعديل الوثيقة") : t("Upload document", "رفع وثيقة")}
        description={t("PDF files only. Documents are listed on the Investors page by category and year.", "ملفات PDF فقط. تُعرض الوثائق في صفحة المستثمرين حسب الفئة والسنة.")}
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
          <div className="space-y-5">
            <Field label={t("File", "الملف")} required error={errors.file}>
              <PdfUpload
                locale={locale}
                value={editing.fileUrl}
                size={editing.fileSize ?? 0}
                onChange={({ url, size }) => {
                  setEditing((p) => (p ? { ...p, fileUrl: url, fileSize: size } : p));
                  setErrors((e) => ({ ...e, file: "" }));
                }}
              />
            </Field>
            <Field label={`${d.title} — English`} htmlFor="titleEn" required error={errors.titleEn}>
              <input id="titleEn" dir="ltr" value={editing.titleEn} onChange={(e) => set("titleEn", e.target.value)} aria-invalid={!!errors.titleEn} className={aInput} />
            </Field>
            <Field label={`${d.title} — العربية`} htmlFor="titleAr">
              <input id="titleAr" dir="rtl" value={editing.titleAr ?? ""} onChange={(e) => set("titleAr", e.target.value)} className={cn(aInput, "font-arabic")} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label={t("Category", "الفئة")} htmlFor="category">
                <SelectBox id="category" value={editing.category} onChange={(e) => set("category", e.target.value as DocumentInput["category"])}>
                  {Object.entries(documentCategories).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v[locale]}
                    </option>
                  ))}
                </SelectBox>
              </Field>
              <Field label={t("Reporting year", "سنة التقرير")} htmlFor="year">
                <input
                  id="year"
                  type="number"
                  min={1975}
                  max={2100}
                  value={editing.year}
                  onChange={(e) => set("year", Number.parseInt(e.target.value || "0", 10))}
                  className={cn(aInput, "num")}
                />
              </Field>
              <Field label={t("Publication date", "تاريخ النشر")} htmlFor="docDate">
                <input
                  id="docDate"
                  type="date"
                  value={isoToDateInput(editing.publishedAt)}
                  onChange={(e) => e.target.value && set("publishedAt", dateInputToIso(e.target.value, editing.publishedAt))}
                  className={cn(aInput, "num")}
                />
              </Field>
            </div>
            <div className="rounded-[2px] border border-ink/[0.07] bg-pearl-50 p-4">
              <Toggle
                id="published"
                checked={editing.published}
                onChange={(v) => set("published", v)}
                label={t("Show on Investors page", "إظهار في صفحة المستثمرين")}
                description={t("Turn off to hide the document without deleting it.", "أوقف التشغيل لإخفاء الوثيقة دون حذفها.")}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
