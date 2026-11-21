"use client";

import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { getAdminDict, tx } from "@/i18n/admin";
import { type PersonInput, deletePerson, movePerson, savePerson } from "@/lib/admin/people";
import { cn } from "@/lib/utils";
import { ConfirmDelete, Field, ImageUpload, LangTabs, Modal, Segmented, Toggle, useAction } from "./controls";
import { RichText } from "./RichText";
import { ALink, Badge, Card, EmptyState, aBtn, aInput, monoLabel } from "./ui";

export type PersonRow = {
  id: string;
  group: "board" | "management";
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  bioEn: string;
  bioAr: string;
  photo: string | null;
  active: boolean;
};

const blank = (group: PersonRow["group"]): PersonInput => ({
  group,
  nameEn: "",
  nameAr: "",
  roleEn: "",
  roleAr: "",
  bioEn: "",
  bioAr: "",
  photo: null,
  active: true,
});

export function PeopleManager({ locale, people, openNew }: { locale: Locale; people: PersonRow[]; openNew?: boolean }) {
  const d = getAdminDict(locale);
  const t = tx(locale);
  const { exec, busy } = useAction(locale);
  const [editing, setEditing] = useState<PersonInput | null>(openNew ? blank("board") : null);
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [moving, setMoving] = useState<string | null>(null);

  const groups: { id: PersonRow["group"]; label: string; body: string }[] = [
    { id: "board", label: t("Board of Directors", "مجلس الإدارة"), body: t("Shown first on the Leadership page.", "يظهر أولًا في صفحة القيادة.") },
    { id: "management", label: t("Executive management", "الإدارة التنفيذية"), body: t("Senior executives across the group.", "كبار التنفيذيين في المجموعة.") },
  ];

  const open = (p: PersonInput) => {
    setErrors({});
    setLang("en");
    setEditing(p);
  };

  const submit = async () => {
    if (!editing) return;
    const errs: Record<string, string> = {};
    if (editing.nameEn.trim().length < 2) errs.nameEn = d.errors.NAME_REQUIRED;
    if (editing.roleEn.trim().length < 2) errs.roleEn = d.errors.ROLE_REQUIRED;
    setErrors(errs);
    if (Object.keys(errs).length) {
      setLang("en");
      return;
    }
    const res = await exec(() => savePerson(editing));
    if (res.ok) setEditing(null);
  };

  const set = <K extends keyof PersonInput>(k: K, v: PersonInput[K]) => setEditing((p) => (p ? { ...p, [k]: v } : p));
  const L = lang === "en" ? "En" : "Ar";
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button type="button" onClick={() => open(blank("board"))} className={aBtn("accent")}>
          <Plus />
          {t("Add profile", "إضافة ملف")}
        </button>
      </div>

      <div className="space-y-6">
        {groups.map((g) => {
          const list = people.filter((p) => p.group === g.id);
          return (
            <Card
              key={g.id}
              title={
                <span className="flex items-center gap-3">
                  {g.label}
                  <span className="num font-mono text-[0.75rem] text-haze">{list.length}</span>
                </span>
              }
              description={g.body}
              actions={
                <button type="button" onClick={() => open(blank(g.id))} className={aBtn("ghost", "sm")}>
                  <Plus />
                  {d.add}
                </button>
              }
              bodyClassName="p-0"
            >
              {list.length === 0 ? (
                <EmptyState
                  title={t("No profiles yet", "لا توجد ملفات بعد")}
                  body={t("The Leadership page shows a 'to be announced' note until profiles are added.", "تعرض صفحة القيادة عبارة «سيتم الإعلان لاحقًا» حتى تتم إضافة الملفات.")}
                />
              ) : (
                <ol>
                  {list.map((p, i) => (
                    <li key={p.id} className={cn("flex items-center gap-4 border-b border-ink/[0.07] px-5 py-3.5 last:border-0", !p.active && "bg-pearl-50/70")}>
                      <span className="num w-6 shrink-0 font-mono text-[0.72rem] text-haze">{String(i + 1).padStart(2, "0")}</span>
                      <span className={cn("relative h-14 w-12 shrink-0 overflow-hidden rounded-[2px] bg-ink", !p.active && "opacity-50")}>
                        {p.photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.photo} alt="" className="h-full w-full object-cover object-top" />
                        ) : (
                          <span className="grid h-full w-full place-items-center font-display text-[0.95rem] text-white/80">
                            {p.nameEn
                              .split(/\s+/)
                              .filter((w) => /^[A-Z]/.test(w))
                              .map((w) => w[0])
                              .slice(0, 2)
                              .join("")}
                          </span>
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={cn("truncate font-medium", p.active ? "text-ink" : "text-ink/50")}>{locale === "ar" && p.nameAr ? p.nameAr : p.nameEn}</p>
                        <p className="truncate text-[0.8rem] text-haze">{locale === "ar" && p.roleAr ? p.roleAr : p.roleEn}</p>
                      </div>
                      <div className="hidden items-center gap-2 md:flex">
                        {(!p.nameAr || !p.roleAr) && <Badge tone="amber">{d.missingAr}</Badge>}
                        {!p.active && <Badge>{t("Hidden", "مخفي")}</Badge>}
                      </div>
                      <div className="flex shrink-0 items-center gap-0.5">
                        {(["up", "down"] as const).map((dirn) => (
                          <button
                            key={dirn}
                            type="button"
                            disabled={moving !== null || (dirn === "up" ? i === 0 : i === list.length - 1)}
                            onClick={async () => {
                              setMoving(p.id + dirn);
                              await exec(() => movePerson(p.id, dirn === "up" ? -1 : 1), { success: false });
                              setMoving(null);
                            }}
                            className={aBtn("ghost", "iconSm")}
                            aria-label={dirn === "up" ? t("Move up", "تحريك لأعلى") : t("Move down", "تحريك لأسفل")}
                          >
                            {moving === p.id + dirn ? <Loader2 className="animate-spin" /> : dirn === "up" ? <ArrowUp /> : <ArrowDown />}
                          </button>
                        ))}
                        <button type="button" onClick={() => open({ ...p })} className={aBtn("ghost", "iconSm")} aria-label={d.edit}>
                          <Pencil />
                        </button>
                        <ConfirmDelete
                          locale={locale}
                          title={t("Delete this profile?", "حذف هذا الملف؟")}
                          onConfirm={() => exec(() => deletePerson(p.id), { success: d.deleted })}
                          trigger={
                            <button type="button" className={aBtn("ghost", "iconSm", "hover:bg-red-50 hover:text-red-700")} aria-label={d.delete}>
                              <Trash2 />
                            </button>
                          }
                        />
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </Card>
          );
        })}
      </div>

      <p className="mt-6 text-[0.8rem] text-haze">
        {t("Changes appear on the public", "تظهر التغييرات فورًا في")}{" "}
        <ALink href={`/${locale}/leadership`} target="_blank" variant="ghost" size="sm" className="h-auto px-1 text-leaf-700 underline underline-offset-4">
          {t("Leadership page", "صفحة القيادة")}
        </ALink>{" "}
        {t("immediately.", "العامة.")}
      </p>

      <Modal
        locale={locale}
        open={!!editing}
        onOpenChange={(v) => !v && !busy && setEditing(null)}
        size="xl"
        title={editing?.id ? t("Edit profile", "تعديل الملف") : t("New profile", "ملف جديد")}
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
          <div className="grid gap-6 md:grid-cols-[200px_1fr]">
            <div className="space-y-5">
              <div>
                <p className="mb-1.5 text-[0.8rem] font-medium text-ink/75">{t("Portrait", "الصورة")}</p>
                <ImageUpload value={editing.photo ?? null} onChange={(v) => set("photo", v)} locale={locale} aspect="aspect-[4/5]" />
                <p className="mt-1.5 text-[0.72rem] leading-relaxed text-haze">{t("Portrait 4:5, face near the top.", "صورة عمودية 4:5، والوجه قرب الأعلى.")}</p>
              </div>
              <Field label={t("Section", "القسم")}>
                <Segmented
                  className="w-full"
                  value={editing.group}
                  onChange={(v) => set("group", v)}
                  options={[
                    { value: "board", label: t("Board", "المجلس") },
                    { value: "management", label: t("Management", "الإدارة") },
                  ]}
                />
              </Field>
              <Toggle id="active" checked={editing.active} onChange={(v) => set("active", v)} label={t("Visible on site", "ظاهر في الموقع")} />
            </div>

            <div className="min-w-0 space-y-5">
              <LangTabs value={lang} onChange={setLang} locale={locale} arMissing={!editing.nameAr?.trim() || !editing.roleAr?.trim()} />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={d.name} htmlFor={`name${L}`} required={lang === "en"} error={lang === "en" ? errors.nameEn : undefined}>
                  <input
                    id={`name${L}`}
                    dir={dir}
                    value={editing[`name${L}`] ?? ""}
                    onChange={(e) => set(`name${L}`, e.target.value)}
                    aria-invalid={lang === "en" && !!errors.nameEn}
                    className={cn(aInput, lang === "ar" && "font-arabic")}
                  />
                </Field>
                <Field label={t("Position", "المنصب")} htmlFor={`role${L}`} required={lang === "en"} error={lang === "en" ? errors.roleEn : undefined}>
                  <input
                    id={`role${L}`}
                    dir={dir}
                    value={editing[`role${L}`] ?? ""}
                    onChange={(e) => set(`role${L}`, e.target.value)}
                    aria-invalid={lang === "en" && !!errors.roleEn}
                    className={cn(aInput, lang === "ar" && "font-arabic")}
                  />
                </Field>
              </div>
              <div>
                <p className="mb-1.5 flex items-baseline justify-between text-[0.8rem] font-medium text-ink/75">
                  {t("Biography", "السيرة الذاتية")}
                  <span className={cn(monoLabel, "font-normal")}>{d.optional}</span>
                </p>
                <div className={lang === "en" ? "" : "hidden"}>
                  <RichText value={editing.bioEn ?? ""} onChange={(v) => set("bioEn", v)} dir="ltr" locale={locale} minHeight={220} />
                </div>
                <div className={lang === "ar" ? "" : "hidden"}>
                  <RichText value={editing.bioAr ?? ""} onChange={(v) => set("bioAr", v)} dir="rtl" locale={locale} minHeight={220} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
