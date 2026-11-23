"use client";

import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Quote, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { getAdminDict, tx } from "@/i18n/admin";
import { type LeaderMessageInput, saveLeaderMessages } from "@/lib/admin/messages";
import type { LeaderMessage } from "@/lib/settings";
import { cn } from "@/lib/utils";
import { ConfirmDelete, Field, LangTabs, Modal, Toggle, useAction } from "./controls";
import type { PersonRow } from "./PeopleManager";
import { RichText } from "./RichText";
import { Badge, Card, EmptyState, SelectBox, aBtn, aInput } from "./ui";

const newId = () => `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const blank = (): LeaderMessageInput => ({ id: newId(), personId: null, titleEn: "", titleAr: "", bodyEn: "", bodyAr: "", visible: true });
const hasText = (html: string) => html.replace(/<[^>]+>/g, "").trim().length > 0;

export function MessagesManager({ locale, messages, people }: { locale: Locale; messages: LeaderMessage[]; people: PersonRow[] }) {
  const d = getAdminDict(locale);
  const t = tx(locale);
  const { exec, busy } = useAction(locale);
  const [editing, setEditing] = useState<LeaderMessageInput | null>(null);
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [error, setError] = useState<string | undefined>();
  const [moving, setMoving] = useState<string | null>(null);

  const byId = new Map(people.map((p) => [p.id, p]));
  const personName = (p: PersonRow) => (locale === "ar" && p.nameAr ? p.nameAr : p.nameEn);
  const personRole = (p: PersonRow) => (locale === "ar" && p.roleAr ? p.roleAr : p.roleEn);

  const persist = (list: LeaderMessageInput[], success?: string | false) => exec(() => saveLeaderMessages(list), { success });

  const open = (m: LeaderMessageInput) => {
    setError(undefined);
    setLang("en");
    setEditing(m);
  };

  const submit = async () => {
    if (!editing) return;
    if (editing.titleEn.trim().length < 3) {
      setLang("en");
      setError(d.errors.TITLE_REQUIRED);
      return;
    }
    const exists = messages.some((m) => m.id === editing.id);
    const list = exists ? messages.map((m) => (m.id === editing.id ? editing : m)) : [...messages, editing];
    const res = await persist(list);
    if (res.ok) setEditing(null);
  };

  const move = async (i: number, dirn: -1 | 1) => {
    const list = [...messages];
    const j = i + dirn;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    setMoving(list[j].id + dirn);
    await persist(list, false);
    setMoving(null);
  };

  const set = <K extends keyof LeaderMessageInput>(k: K, v: LeaderMessageInput[K]) => setEditing((m) => (m ? { ...m, [k]: v } : m));
  const L = lang === "en" ? "En" : "Ar";
  const dir = lang === "ar" ? "rtl" : "ltr";
  const linked = editing?.personId ? byId.get(editing.personId) : undefined;

  return (
    <>
      <Card
        className="mb-6"
        title={
          <span className="flex items-center gap-3">
            {t("Leadership messages", "كلمات القيادة")}
            <span className="num font-mono text-[0.75rem] text-haze">{messages.length}</span>
          </span>
        }
        description={t(
          "Shown at the top of the Leadership page, e.g. the Chairman's message. The portrait, name and position come from the linked profile.",
          "تظهر أعلى صفحة القيادة، مثل كلمة رئيس مجلس الإدارة. تُؤخذ الصورة والاسم والمنصب من الملف المرتبط.",
        )}
        actions={
          <button type="button" onClick={() => open(blank())} className={aBtn("ghost", "sm")}>
            <Plus />
            {d.add}
          </button>
        }
        bodyClassName="p-0"
      >
        {messages.length === 0 ? (
          <EmptyState
            title={t("No messages yet", "لا توجد كلمات بعد")}
            body={t("Add a message to show it on the Leadership page.", "أضف كلمة لتظهر في صفحة القيادة.")}
          />
        ) : (
          <ol>
            {messages.map((m, i) => {
              const p = m.personId ? byId.get(m.personId) : undefined;
              return (
                <li key={m.id} className={cn("flex items-center gap-4 border-b border-ink/[0.07] px-5 py-3.5 last:border-0", !m.visible && "bg-pearl-50/70")}>
                  <span className="num w-6 shrink-0 font-mono text-[0.72rem] text-haze">{String(i + 1).padStart(2, "0")}</span>
                  <span className={cn("relative grid h-14 w-12 shrink-0 place-items-center overflow-hidden rounded-[2px] bg-ink text-white/70", !m.visible && "opacity-50")}>
                    {p?.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.photo} alt="" className="h-full w-full object-cover object-top" />
                    ) : (
                      <Quote className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn("truncate font-medium", m.visible ? "text-ink" : "text-ink/50")}>{locale === "ar" && m.titleAr ? m.titleAr : m.titleEn}</p>
                    <p className="truncate text-[0.8rem] text-haze">{p ? `${personName(p)} · ${personRole(p)}` : t("No profile linked", "لا يوجد ملف مرتبط")}</p>
                  </div>
                  <div className="hidden items-center gap-2 md:flex">
                    {(!m.titleAr || !hasText(m.bodyAr)) && <Badge tone="amber">{d.missingAr}</Badge>}
                    {!p && <Badge tone="amber">{t("Link a profile", "اربط ملفًا")}</Badge>}
                    {!m.visible && <Badge>{t("Hidden", "مخفي")}</Badge>}
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    {([-1, 1] as const).map((dirn) => (
                      <button
                        key={dirn}
                        type="button"
                        disabled={busy || moving !== null || (dirn === -1 ? i === 0 : i === messages.length - 1)}
                        onClick={() => move(i, dirn)}
                        className={aBtn("ghost", "iconSm")}
                        aria-label={dirn === -1 ? t("Move up", "تحريك لأعلى") : t("Move down", "تحريك لأسفل")}
                      >
                        {moving === m.id + dirn ? <Loader2 className="animate-spin" /> : dirn === -1 ? <ArrowUp /> : <ArrowDown />}
                      </button>
                    ))}
                    <button type="button" onClick={() => open({ ...m })} className={aBtn("ghost", "iconSm")} aria-label={d.edit}>
                      <Pencil />
                    </button>
                    <ConfirmDelete
                      locale={locale}
                      title={t("Delete this message?", "حذف هذه الكلمة؟")}
                      onConfirm={() => persist(messages.filter((x) => x.id !== m.id), d.deleted)}
                      trigger={
                        <button type="button" className={aBtn("ghost", "iconSm", "hover:bg-red-50 hover:text-red-700")} aria-label={d.delete}>
                          <Trash2 />
                        </button>
                      }
                    />
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </Card>

      <Modal
        locale={locale}
        open={!!editing}
        onOpenChange={(v) => !v && !busy && setEditing(null)}
        size="xl"
        title={messages.some((m) => m.id === editing?.id) ? t("Edit message", "تعديل الكلمة") : t("New message", "كلمة جديدة")}
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
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-ink">
                {linked?.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={linked.photo} alt="" className="h-full w-full object-cover object-top" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center px-4 text-center text-[0.75rem] leading-relaxed text-white/60">
                    {linked ? t("This profile has no portrait yet.", "لا توجد صورة لهذا الملف بعد.") : t("Choose a profile below.", "اختر ملفًا أدناه.")}
                  </span>
                )}
              </div>
              <Field
                label={t("Profile", "الملف")}
                htmlFor="msg-person"
                hint={t("Portrait, name and position are taken from this profile.", "تُؤخذ الصورة والاسم والمنصب من هذا الملف.")}
              >
                <SelectBox id="msg-person" value={editing.personId ?? ""} onChange={(e) => set("personId", e.target.value || null)}>
                  <option value="">{t("— None —", "— بدون —")}</option>
                  {(["board", "management"] as const).map((g) => (
                    <optgroup key={g} label={g === "board" ? t("Board of Directors", "مجلس الإدارة") : t("Executive management", "الإدارة التنفيذية")}>
                      {people
                        .filter((p) => p.group === g)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {personName(p)} — {personRole(p)}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </SelectBox>
              </Field>
              <Toggle id="msg-visible" checked={editing.visible} onChange={(v) => set("visible", v)} label={t("Visible on site", "ظاهر في الموقع")} />
            </div>

            <div className="min-w-0 space-y-5">
              <LangTabs value={lang} onChange={setLang} locale={locale} arMissing={!editing.titleAr?.trim() || !hasText(editing.bodyAr ?? "")} />
              <Field label={t("Heading", "العنوان")} htmlFor={`msg-title${L}`} required={lang === "en"} error={lang === "en" ? error : undefined}>
                <input
                  id={`msg-title${L}`}
                  dir={dir}
                  value={editing[`title${L}`] ?? ""}
                  onChange={(e) => set(`title${L}`, e.target.value)}
                  placeholder={lang === "en" ? "Chairman's message" : "كلمة رئيس مجلس الإدارة"}
                  aria-invalid={lang === "en" && !!error}
                  className={cn(aInput, lang === "ar" && "font-arabic")}
                />
              </Field>
              <div>
                <p className="mb-1.5 text-[0.8rem] font-medium text-ink/75">{t("Message", "نص الكلمة")}</p>
                <div className={lang === "en" ? "" : "hidden"}>
                  <RichText value={editing.bodyEn ?? ""} onChange={(v) => set("bodyEn", v)} dir="ltr" locale={locale} minHeight={320} />
                </div>
                <div className={lang === "ar" ? "" : "hidden"}>
                  <RichText value={editing.bodyAr ?? ""} onChange={(v) => set("bodyAr", v)} dir="rtl" locale={locale} minHeight={320} />
                </div>
                <p className="mt-1.5 text-[0.72rem] leading-relaxed text-haze">
                  {t("The first paragraph is shown larger, as an introduction.", "تظهر الفقرة الأولى بخط أكبر كمقدمة.")}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
