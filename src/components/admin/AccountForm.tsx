"use client";

import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { getAdminDict, tx } from "@/i18n/admin";
import { updateAccount } from "@/lib/admin/users";
import { cn } from "@/lib/utils";
import { Field, useAction } from "./controls";
import { Card, aBtn, aInput } from "./ui";

function strength(p: string) {
  let s = 0;
  if (p.length >= 10) s++;
  if (p.length >= 14) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(4, s);
}

export function AccountForm({ locale, name: initName, email, role }: { locale: Locale; name: string; email: string; role: "admin" | "editor" }) {
  const d = getAdminDict(locale);
  const t = tx(locale);
  const profile = useAction(locale);
  const pwd = useAction(locale);
  const [name, setName] = useState(initName);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const mismatch = confirm.length > 0 && next !== confirm;
  const sc = strength(next);
  const labels = [t("Too short", "قصيرة جدًا"), t("Weak", "ضعيفة"), t("Fair", "مقبولة"), t("Good", "جيدة"), t("Strong", "قوية")];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title={t("Profile", "الملف الشخصي")} bodyClassName="space-y-5">
        <Field label={d.name} htmlFor="accName">
          <input id="accName" value={name} onChange={(e) => setName(e.target.value)} className={aInput} />
        </Field>
        <Field label={d.email} hint={t("Ask an administrator to change your sign-in email.", "اطلب من مدير النظام تغيير بريد الدخول.")}>
          <input value={email} disabled dir="ltr" className={cn(aInput, "rtl:text-right")} />
        </Field>
        <Field label={d.role}>
          <input value={role === "admin" ? d.admin : d.editor} disabled className={aInput} />
        </Field>
        <div className="flex justify-end border-t border-ink/[0.07] pt-5">
          <button
            type="button"
            disabled={profile.busy || name.trim().length < 2 || name === initName}
            onClick={() => profile.exec(() => updateAccount({ name }))}
            className={aBtn("primary", "md", "min-w-[120px]")}
          >
            {profile.busy ? <Loader2 className="animate-spin" /> : <Save />}
            {d.save}
          </button>
        </div>
      </Card>

      <Card title={t("Change password", "تغيير كلمة المرور")} description={d.errors.PASSWORD_TOO_SHORT} bodyClassName="space-y-5">
        <Field label={t("Current password", "كلمة المرور الحالية")} htmlFor="cur">
          <input id="cur" type="password" dir="ltr" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={aInput} />
        </Field>
        <Field label={t("New password", "كلمة المرور الجديدة")} htmlFor="new">
          <input id="new" type="password" dir="ltr" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className={aInput} />
          {next && (
            <div className="mt-2 flex items-center gap-3">
              <div className="grid flex-1 grid-cols-4 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={cn("h-1 rounded-full transition-colors", i < sc ? (sc >= 3 ? "bg-leaf" : sc === 2 ? "bg-amber-500" : "bg-red-500") : "bg-ink/10")}
                  />
                ))}
              </div>
              <span className="w-16 text-end text-[0.72rem] text-haze">{labels[next.length < 10 ? 0 : sc]}</span>
            </div>
          )}
        </Field>
        <Field label={t("Confirm new password", "تأكيد كلمة المرور الجديدة")} htmlFor="confirm" error={mismatch ? t("Passwords don't match.", "كلمتا المرور غير متطابقتين.") : undefined}>
          <input
            id="confirm"
            type="password"
            dir="ltr"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={mismatch}
            className={aInput}
          />
        </Field>
        <div className="flex justify-end border-t border-ink/[0.07] pt-5">
          <button
            type="button"
            disabled={pwd.busy || !current || next.length < 10 || next !== confirm}
            onClick={async () => {
              const res = await pwd.exec(() => updateAccount({ name: initName, currentPassword: current, newPassword: next }), {
                success: t("Password changed.", "تم تغيير كلمة المرور."),
              });
              if (res.ok) {
                setCurrent("");
                setNext("");
                setConfirm("");
              }
            }}
            className={aBtn("primary", "md", "min-w-[160px]")}
          >
            {pwd.busy && <Loader2 className="animate-spin" />}
            {t("Update password", "تحديث كلمة المرور")}
          </button>
        </div>
      </Card>
    </div>
  );
}
