"use client";

import { Briefcase, Download, Mail, MailOpen, MessageSquare, Phone, Reply, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import { formatDate } from "@/i18n/config";
import { getAdminDict, tx } from "@/i18n/admin";
import { deleteMessage, setMessageRead } from "@/lib/admin/inbox";
import { cn } from "@/lib/utils";
import { ConfirmDelete, useAction } from "./controls";
import { Badge, EmptyState, aBtn, monoLabel } from "./ui";

export type MessageRow = {
  id: string;
  kind: "contact" | "career";
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  position: string;
  message: string;
  attachment: string | null;
  locale: string;
  read: boolean;
  createdAt: string;
};

export function InboxView({ locale, messages, initialOpen }: { locale: Locale; messages: MessageRow[]; initialOpen?: string }) {
  const d = getAdminDict(locale);
  const t = tx(locale);
  const { exec } = useAction(locale);
  const [openId, setOpenId] = useState<string | null>(initialOpen && messages.some((m) => m.id === initialOpen) ? initialOpen : null);
  const [localRead, setLocalRead] = useState<Record<string, boolean>>({});
  const current = messages.find((m) => m.id === openId) || null;
  const isRead = (m: MessageRow) => localRead[m.id] ?? m.read;

  // Opening a message marks it as read.
  useEffect(() => {
    if (!current || isRead(current)) return;
    setLocalRead((r) => ({ ...r, [current.id]: true }));
    exec(() => setMessageRead(current.id, true), { success: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  if (messages.length === 0) {
    return (
      <div className="rounded-[2px] border border-ink/10 bg-white">
        <EmptyState
          title={t("No messages", "لا توجد رسائل")}
          body={t("Enquiries from the Contact page and applications from the Careers page will appear here.", "ستظهر هنا الاستفسارات من صفحة التواصل والطلبات من صفحة الوظائف.")}
        />
      </div>
    );
  }

  const label = (m: MessageRow) => (m.kind === "career" ? t("Job application", "طلب توظيف") : m.subject || t("General enquiry", "استفسار عام"));
  const cvHref = (a: string) => `/api/admin/cv/${a.replace(/^cv\//, "")}`;

  return (
    <div className="grid overflow-hidden rounded-[2px] border border-ink/10 bg-white lg:grid-cols-[380px_1fr]">
      {/* List */}
      <ul className={cn("max-h-[72vh] overflow-y-auto border-ink/10 lg:border-e", current && "hidden lg:block")}>
        {messages.map((m) => {
          const read = isRead(m);
          const active = m.id === openId;
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setOpenId(m.id)}
                className={cn(
                  "relative flex w-full items-start gap-3 border-b border-ink/[0.07] px-5 py-4 text-start transition-colors",
                  active ? "bg-pearl-100" : "hover:bg-pearl-50",
                )}
              >
                {active && <span className="absolute inset-y-0 start-0 w-[2px] bg-leaf" aria-hidden />}
                <span
                  className={cn(
                    "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1",
                    m.kind === "career" ? "bg-brand-50 text-brand-700 ring-brand/15" : "bg-pearl-100 text-ink/60 ring-ink/10",
                  )}
                >
                  {m.kind === "career" ? <Briefcase className="h-3.5 w-3.5" /> : <MessageSquare className="h-3.5 w-3.5" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className={cn("truncate text-[0.88rem]", read ? "text-ink/70" : "font-semibold text-ink")}>{m.name}</span>
                    <span className="num shrink-0 text-[0.7rem] text-haze">{formatDate(m.createdAt, locale, { day: "numeric", month: "short" })}</span>
                  </span>
                  <span className={cn("mt-0.5 block truncate text-[0.8rem]", read ? "text-haze" : "text-ink/80")}>{label(m)}</span>
                  <span className="mt-0.5 block truncate text-[0.75rem] text-haze">{m.message}</span>
                </span>
                {!read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-leaf" aria-label={t("Unread", "غير مقروءة")} />}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Detail */}
      <div className={cn("min-h-[480px]", !current && "hidden lg:block")}>
        {!current ? (
          <div className="grid h-full place-items-center p-10 text-center">
            <div>
              <MailOpen className="mx-auto h-8 w-8 text-ink/15" strokeWidth={1.2} />
              <p className="mt-4 text-[0.9rem] text-haze">{t("Select a message to read it.", "اختر رسالة لقراءتها.")}</p>
            </div>
          </div>
        ) : (
          <article className="flex h-full flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/[0.07] px-6 py-3">
              <button type="button" onClick={() => setOpenId(null)} className={aBtn("ghost", "sm", "lg:hidden")}>
                <span aria-hidden className="rtl:rotate-180">
                  ←
                </span>
                {d.back}
              </button>
              <div className="ms-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setLocalRead((r) => ({ ...r, [current.id]: false }));
                    exec(() => setMessageRead(current.id, false), { success: t("Marked as unread.", "تم التعليم كغير مقروءة.") });
                    setOpenId(null);
                  }}
                  className={aBtn("ghost", "sm")}
                >
                  <Mail />
                  {t("Mark unread", "تعليم كغير مقروءة")}
                </button>
                <ConfirmDelete
                  locale={locale}
                  title={t("Delete this message?", "حذف هذه الرسالة؟")}
                  onConfirm={async () => {
                    const res = await exec(() => deleteMessage(current.id), { success: d.deleted });
                    if (res.ok) setOpenId(null);
                  }}
                  trigger={
                    <button type="button" className={aBtn("ghost", "sm", "hover:bg-red-50 hover:text-red-700")}>
                      <Trash2 />
                      {d.delete}
                    </button>
                  }
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-7 md:px-10">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={current.kind === "career" ? "blue" : "neutral"}>{current.kind === "career" ? t("Careers", "الوظائف") : t("Contact", "تواصل")}</Badge>
                <Badge>{current.locale === "ar" ? "العربية" : "English"}</Badge>
              </div>
              <h2 className="mt-4 font-display text-[1.6rem] leading-tight text-ink">{label(current)}</h2>
              <p className="num mt-1 text-[0.8rem] text-haze">
                {formatDate(current.createdAt, locale, { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>

              <dl className="mt-7 grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 sm:grid-cols-2">
                {[
                  { k: d.name, v: current.name },
                  { k: d.email, v: current.email, href: `mailto:${current.email}`, ltr: true },
                  { k: t("Phone", "الهاتف"), v: current.phone, href: current.phone ? `tel:${current.phone.replace(/\s/g, "")}` : undefined, ltr: true },
                  { k: current.kind === "career" ? t("Position", "الوظيفة") : t("Organisation", "الجهة"), v: current.kind === "career" ? current.position : current.company },
                ].map((row) => (
                  <div key={row.k} className="bg-white px-4 py-3">
                    <dt className={monoLabel}>{row.k}</dt>
                    <dd className="mt-1 truncate text-[0.9rem] text-ink" dir={row.ltr ? "ltr" : undefined} style={row.ltr ? { textAlign: locale === "ar" ? "right" : "left" } : undefined}>
                      {row.v ? (
                        row.href ? (
                          <a href={row.href} className="hover:underline hover:underline-offset-4">
                            {row.v}
                          </a>
                        ) : (
                          row.v
                        )
                      ) : (
                        <span className="text-haze">—</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              {current.message && (
                <div className="mt-7">
                  <p className={cn(monoLabel, "mb-3")}>{t("Message", "الرسالة")}</p>
                  <p className="whitespace-pre-wrap text-[0.95rem] leading-[1.75] text-ink/85" dir="auto">
                    {current.message}
                  </p>
                </div>
              )}

              {current.attachment && (
                <a
                  href={cvHref(current.attachment)}
                  className="group mt-7 flex items-center gap-4 rounded-[2px] border border-ink/10 bg-pearl-50 p-4 transition-colors hover:border-ink/30"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-[2px] bg-white text-brand ring-1 ring-ink/10">
                    <Download className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.88rem] font-medium text-ink">{t("Download CV", "تنزيل السيرة الذاتية")}</span>
                    <span className="block truncate text-[0.75rem] text-haze" dir="ltr">
                      {current.attachment.split("/").pop()}
                    </span>
                  </span>
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-ink/[0.07] bg-pearl-50/60 px-6 py-4">
              <a
                href={`mailto:${current.email}?subject=${encodeURIComponent(`Re: ${current.kind === "career" ? `Application — ${current.position || "Al-Ahed Holding"}` : current.subject || "Your enquiry"}`)}`}
                className={aBtn("primary")}
              >
                <Reply className="rtl:-scale-x-100" />
                {t("Reply by email", "الرد بالبريد")}
              </a>
              {current.phone && (
                <a href={`tel:${current.phone.replace(/\s/g, "")}`} className={aBtn("outline")}>
                  <Phone />
                  {t("Call", "اتصال")}
                </a>
              )}
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
