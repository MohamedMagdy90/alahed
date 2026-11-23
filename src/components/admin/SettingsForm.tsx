"use client";

import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { getAdminDict, tx } from "@/i18n/admin";
import { saveIrContact, saveShareInfo } from "@/lib/admin/settings";
import type { IrContact, ShareInfo } from "@/lib/settings";
import { cn } from "@/lib/utils";
import { Field, Segmented, Toggle, useAction } from "./controls";
import { Card, aBtn, aInput, aTextarea, monoLabel } from "./ui";

const numOrNull = (v: string) => {
  if (v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export function SettingsForm({ locale, share: initShare, ir: initIr }: { locale: Locale; share: ShareInfo; ir: IrContact }) {
  const d = getAdminDict(locale);
  const t = tx(locale);
  const shareAction = useAction(locale);
  const irAction = useAction(locale);
  const [share, setShare] = useState(initShare);
  const [ir, setIr] = useState(initIr);
  const [num, setNum] = useState({
    price: initShare.price?.toString() ?? "",
    change: initShare.change?.toString() ?? "",
    changePct: initShare.changePct?.toString() ?? "",
  });
  const s = <K extends keyof ShareInfo>(k: K, v: ShareInfo[K]) => setShare((p) => ({ ...p, [k]: v }));
  const listed = share.status === "listed";

  return (
    <div className="grid gap-6 xl:grid-cols-12">
      <Card
        className="xl:col-span-8"
        title={t("Listing & share information", "معلومات الإدراج والسهم")}
        description={t(
          "One switch controls everything about the listing on the public website.",
          "مفتاح واحد يتحكم في كل ما يتعلق بالإدراج على الموقع العام.",
        )}
        bodyClassName="space-y-6 p-5 md:p-6"
      >
        <div
          className={cn(
            "rounded-[2px] border p-4 transition-colors md:p-5",
            share.visible ? "border-leaf/40 bg-leaf/[0.06]" : "border-ink/10 bg-pearl-50",
          )}
        >
          <Toggle
            id="listing-visible"
            checked={share.visible}
            onChange={(v) => s("visible", v)}
            label={t("Show listing information on the website", "إظهار معلومات الإدراج على الموقع")}
            description={t(
              "When off, visitors see no trace of the listing: the header status line, the share section on the home page, the Investors page and every link to it, the “next chapter” milestone, the investor enquiry type and the securities clauses of the disclaimer are all removed. Turn it on once the listing is officially announced.",
              "عند الإيقاف لا يظهر للزوار أي أثر للإدراج: تُزال حالة الإدراج أعلى الموقع، وقسم السهم في الصفحة الرئيسية، وصفحة المستثمرين وكل الروابط إليها، ومرحلة «الفصل القادم»، ونوع استفسار المستثمرين، وبنود الأوراق المالية في إخلاء المسؤولية. فعّله بعد الإعلان الرسمي عن الإدراج.",
            )}
          />
          <p className="mt-4 flex items-center gap-2 border-t border-ink/[0.07] pt-3 text-[0.78rem]">
            <span className={cn("h-1.5 w-1.5 rounded-full", initShare.visible ? "bg-leaf" : "bg-ink/30")} />
            <span className="text-haze">
              {initShare.visible
                ? t("Live: listing information is visible on the website.", "منشور: معلومات الإدراج ظاهرة على الموقع.")
                : t("Live: listing information is hidden from the website.", "منشور: معلومات الإدراج مخفية عن الموقع.")}
            </span>
            {share.visible !== initShare.visible && (
              <span className="font-medium text-amber-700">{t("Save to apply.", "احفظ للتطبيق.")}</span>
            )}
          </p>
        </div>

        <Field label={t("Listing status", "حالة الإدراج")}>
          <Segmented
            value={share.status}
            onChange={(v) => s("status", v)}
            options={[
              { value: "pre-listing", label: t("Pre-listing", "ما قبل الإدراج") },
              { value: "listed", label: t("Listed", "مُدرجة") },
            ]}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-4">
          <Field label={t("Exchange", "السوق")} htmlFor="exchange">
            <input id="exchange" dir="ltr" value={share.exchange} onChange={(e) => s("exchange", e.target.value)} className={aInput} />
          </Field>
          <Field label={t("Ticker", "رمز السهم")} htmlFor="ticker">
            <input id="ticker" dir="ltr" value={share.ticker} onChange={(e) => s("ticker", e.target.value.toUpperCase())} className={cn(aInput, "font-mono")} />
          </Field>
          <Field label="ISIN" htmlFor="isin">
            <input id="isin" dir="ltr" value={share.isin} onChange={(e) => s("isin", e.target.value.toUpperCase())} className={cn(aInput, "font-mono")} />
          </Field>
          <Field label={t("Currency", "العملة")} htmlFor="currency">
            <input id="currency" dir="ltr" value={share.currency} onChange={(e) => s("currency", e.target.value.toUpperCase())} className={cn(aInput, "font-mono")} />
          </Field>
        </div>

        <div className={cn("rounded-[2px] border border-ink/[0.07] p-4 transition-opacity", listed ? "bg-white" : "bg-pearl-50 opacity-60")}>
          <p className={cn(monoLabel, "mb-4")}>
            {t("Latest price (enter manually after listing)", "آخر سعر (يُدخل يدويًا بعد الإدراج)")}
          </p>
          <div className="grid gap-5 sm:grid-cols-4">
            {(
              [
                ["price", t("Price", "السعر")],
                ["change", t("Change", "التغير")],
                ["changePct", t("Change %", "نسبة التغير %")],
              ] as const
            ).map(([k, label]) => (
              <Field key={k} label={label} htmlFor={k}>
                <input
                  id={k}
                  dir="ltr"
                  inputMode="decimal"
                  disabled={!listed}
                  value={num[k]}
                  onChange={(e) => {
                    setNum((n) => ({ ...n, [k]: e.target.value }));
                    s(k, numOrNull(e.target.value));
                  }}
                  className={cn(aInput, "num")}
                />
              </Field>
            ))}
            <Field label={t("As of", "بتاريخ")} htmlFor="asOf">
              <input
                id="asOf"
                type="date"
                disabled={!listed}
                value={share.asOf ? share.asOf.slice(0, 10) : ""}
                onChange={(e) => s("asOf", e.target.value ? `${e.target.value}T12:00:00.000Z` : null)}
                className={cn(aInput, "num")}
              />
            </Field>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label={t("Disclaimer note — English", "الملاحظة — بالإنجليزية")} htmlFor="noteEn">
            <textarea id="noteEn" dir="ltr" rows={4} value={share.noteEn} onChange={(e) => s("noteEn", e.target.value)} className={aTextarea} />
          </Field>
          <Field label={t("Disclaimer note — Arabic", "الملاحظة — بالعربية")} htmlFor="noteAr">
            <textarea id="noteAr" dir="rtl" rows={4} value={share.noteAr} onChange={(e) => s("noteAr", e.target.value)} className={cn(aTextarea, "font-arabic")} />
          </Field>
        </div>

        <div className="flex justify-end border-t border-ink/[0.07] pt-5">
          <button
            type="button"
            disabled={shareAction.busy}
            onClick={() => shareAction.exec(() => saveShareInfo(share))}
            className={aBtn("primary", "md", "min-w-[120px]")}
          >
            {shareAction.busy ? <Loader2 className="animate-spin" /> : <Save />}
            {shareAction.busy ? d.saving : d.save}
          </button>
        </div>
      </Card>

      <div className="space-y-6 xl:col-span-4">
        <Card
          title={t("Investor relations contact", "جهة اتصال علاقات المستثمرين")}
          description={t(
            "Shown on the Investors page, while listing information is switched on.",
            "تظهر في صفحة المستثمرين عند تفعيل إظهار معلومات الإدراج.",
          )}
          bodyClassName="space-y-5"
        >
          <Field label={`${d.name} — English`} htmlFor="irNameEn">
            <input id="irNameEn" dir="ltr" value={ir.nameEn} onChange={(e) => setIr({ ...ir, nameEn: e.target.value })} className={aInput} />
          </Field>
          <Field label={`${d.name} — العربية`} htmlFor="irNameAr">
            <input id="irNameAr" dir="rtl" value={ir.nameAr} onChange={(e) => setIr({ ...ir, nameAr: e.target.value })} className={cn(aInput, "font-arabic")} />
          </Field>
          <Field label={d.email} htmlFor="irEmail">
            <input id="irEmail" type="email" dir="ltr" value={ir.email} onChange={(e) => setIr({ ...ir, email: e.target.value })} className={cn(aInput, "rtl:text-right")} />
          </Field>
          <Field label={t("Phone", "الهاتف")} htmlFor="irPhone">
            <input id="irPhone" dir="ltr" value={ir.phone} onChange={(e) => setIr({ ...ir, phone: e.target.value })} className={cn(aInput, "num rtl:text-right")} />
          </Field>
          <div className="flex justify-end border-t border-ink/[0.07] pt-5">
            <button type="button" disabled={irAction.busy} onClick={() => irAction.exec(() => saveIrContact(ir))} className={aBtn("primary", "md", "min-w-[120px]")}>
              {irAction.busy ? <Loader2 className="animate-spin" /> : <Save />}
              {irAction.busy ? d.saving : d.save}
            </button>
          </div>
        </Card>

        <div className="rounded-[2px] border border-amber-300/60 bg-amber-50 p-5 text-[0.82rem] leading-relaxed text-amber-900">
          <p className="font-medium">{t("Regulatory note", "ملاحظة تنظيمية")}</p>
          <p className="mt-1.5 text-amber-900/80">
            {t(
              "Share prices and listing announcements must match official QSE / QFMA disclosures. Update this page only after the official announcement.",
              "يجب أن تطابق أسعار الأسهم وإعلانات الإدراج الإفصاحات الرسمية لبورصة قطر وهيئة قطر للأسواق المالية. حدّث هذه الصفحة فقط بعد الإعلان الرسمي.",
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
