"use client";

import { Check, Copy, KeyRound, Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Locale } from "@/i18n/config";
import { formatDate } from "@/i18n/config";
import { getAdminDict, tx } from "@/i18n/admin";
import { createUser, deleteUser, resetUserPassword, updateUser } from "@/lib/admin/users";
import { cn } from "@/lib/utils";
import { ConfirmDelete, Field, Modal, Segmented, Toggle, useAction } from "./controls";
import { Badge, Card, SelectBox, Table, aBtn, aInput } from "./ui";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
  active: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

function generatePassword(len = 16) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?";
  const buf = new Uint32Array(len);
  crypto.getRandomValues(buf);
  return Array.from(buf, (n) => chars[n % chars.length]).join("");
}

function PasswordInput({ id, value, onChange, locale }: { id: string; value: string; onChange: (v: string) => void; locale: Locale }) {
  const t = tx(locale);
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex gap-2">
      <input id={id} dir="ltr" value={value} onChange={(e) => onChange(e.target.value)} className={cn(aInput, "flex-1 font-mono text-[0.85rem]")} autoComplete="new-password" />
      <button type="button" onClick={() => onChange(generatePassword())} className={aBtn("outline", "icon")} aria-label={t("Generate", "توليد")} title={t("Generate", "توليد")}>
        <RefreshCw />
      </button>
      <button
        type="button"
        disabled={!value}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {
            toast.error(t("Copy failed. Select the text and copy it manually.", "تعذّر النسخ. حدّد النص وانسخه يدويًا."));
          }
        }}
        className={aBtn("outline", "icon")}
        aria-label={t("Copy", "نسخ")}
        title={t("Copy", "نسخ")}
      >
        {copied ? <Check className="text-leaf-700" /> : <Copy />}
      </button>
    </div>
  );
}

export function UsersManager({ locale, users, currentId }: { locale: Locale; users: UserRow[]; currentId: string }) {
  const d = getAdminDict(locale);
  const t = tx(locale);
  const { exec, busy } = useAction(locale);
  const [creating, setCreating] = useState<{ name: string; email: string; role: "admin" | "editor"; password: string } | null>(null);
  const [resetting, setResetting] = useState<{ id: string; name: string; password: string } | null>(null);

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button type="button" onClick={() => setCreating({ name: "", email: "", role: "editor", password: generatePassword() })} className={aBtn("accent")}>
          <Plus />
          {t("Add user", "إضافة مستخدم")}
        </button>
      </div>

      <Card bodyClassName="p-0">
        <Table>
          <thead>
            <tr>
              <th>{d.name}</th>
              <th>{d.role}</th>
              <th>{d.status}</th>
              <th>{t("Last sign-in", "آخر دخول")}</th>
              <th className="w-px" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const self = u.id === currentId;
              return (
                <tr key={u.id} className={cn(!u.active && "opacity-60")}>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink font-mono text-[0.7rem] text-white">
                        {u.name
                          .split(/\s+/)
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 truncate font-medium text-ink">
                          {u.name}
                          {self && <Badge tone="green">{t("You", "أنت")}</Badge>}
                        </p>
                        <p className="truncate text-[0.8rem] text-haze" dir="ltr" style={{ textAlign: locale === "ar" ? "right" : "left" }}>
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="w-44">
                    <SelectBox
                      value={u.role}
                      disabled={self || busy}
                      onChange={(e) => exec(() => updateUser({ id: u.id, role: e.target.value as "admin" | "editor", active: u.active }))}
                      aria-label={d.role}
                      className="[&_select]:h-9"
                    >
                      <option value="editor">{d.editor}</option>
                      <option value="admin">{d.admin}</option>
                    </SelectBox>
                  </td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <Toggle
                        checked={u.active}
                        disabled={self || busy}
                        onChange={(v) => exec(() => updateUser({ id: u.id, role: u.role, active: v }))}
                      />
                      <span className="text-[0.8rem] text-ink/70">{u.active ? d.active : d.inactive}</span>
                    </div>
                  </td>
                  <td className="num whitespace-nowrap text-[0.82rem] text-ink/70">
                    {u.lastLoginAt ? formatDate(u.lastLoginAt, locale, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : <span className="text-haze">{t("Never", "لم يسجّل الدخول")}</span>}
                  </td>
                  <td>
                    <div className="flex justify-end gap-0.5">
                      <button
                        type="button"
                        onClick={() => setResetting({ id: u.id, name: u.name, password: generatePassword() })}
                        className={aBtn("ghost", "iconSm")}
                        aria-label={t("Reset password", "إعادة تعيين كلمة المرور")}
                        title={t("Reset password", "إعادة تعيين كلمة المرور")}
                      >
                        <KeyRound />
                      </button>
                      {!self && (
                        <ConfirmDelete
                          locale={locale}
                          title={t("Delete this user?", "حذف هذا المستخدم؟")}
                          body={t(`${u.name} will lose access immediately. Articles they wrote are kept.`, `سيفقد ${u.name} صلاحية الدخول فورًا، مع الاحتفاظ بالمقالات التي كتبها.`)}
                          onConfirm={() => exec(() => deleteUser(u.id), { success: d.deleted })}
                          trigger={
                            <button type="button" className={aBtn("ghost", "iconSm", "hover:bg-red-50 hover:text-red-700")} aria-label={d.delete}>
                              <Trash2 />
                            </button>
                          }
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>

      <div className="mt-6 grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 md:grid-cols-2">
        <div className="bg-white p-5">
          <p className="font-display text-[1rem] text-ink">{d.editor}</p>
          <p className="mt-1 text-[0.8rem] leading-relaxed text-haze">
            {t("Articles, leadership profiles, IR documents, inbox and subscribers.", "المقالات وملفات القيادة ووثائق المستثمرين وصندوق الوارد والمشتركون.")}
          </p>
        </div>
        <div className="bg-white p-5">
          <p className="font-display text-[1rem] text-ink">{d.admin}</p>
          <p className="mt-1 text-[0.8rem] leading-relaxed text-haze">
            {t("Everything editors can do, plus site settings, listing status and user accounts.", "كل صلاحيات المحرر، إضافة إلى إعدادات الموقع وحالة الإدراج وحسابات المستخدمين.")}
          </p>
        </div>
      </div>

      {/* Create */}
      <Modal
        locale={locale}
        open={!!creating}
        onOpenChange={(v) => !v && !busy && setCreating(null)}
        title={t("Add user", "إضافة مستخدم")}
        description={t("Share the password with the new user securely. They can change it under My account.", "شارك كلمة المرور مع المستخدم الجديد بطريقة آمنة، ويمكنه تغييرها من صفحة حسابي.")}
        footer={
          <>
            <button type="button" onClick={() => setCreating(null)} className={aBtn("outline")} disabled={busy}>
              {d.cancel}
            </button>
            <button
              type="button"
              disabled={busy || !creating?.name || !creating?.email || (creating?.password.length ?? 0) < 10}
              onClick={async () => {
                if (!creating) return;
                const res = await exec(() => createUser(creating), { success: t("User created.", "تم إنشاء المستخدم.") });
                if (res.ok) setCreating(null);
              }}
              className={aBtn("primary", "md", "min-w-[110px]")}
            >
              {busy && <Loader2 className="animate-spin" />}
              {d.create}
            </button>
          </>
        }
      >
        {creating && (
          <div className="space-y-5">
            <Field label={d.name} htmlFor="uName" required>
              <input id="uName" value={creating.name} onChange={(e) => setCreating({ ...creating, name: e.target.value })} className={aInput} />
            </Field>
            <Field label={d.email} htmlFor="uEmail" required>
              <input id="uEmail" type="email" dir="ltr" value={creating.email} onChange={(e) => setCreating({ ...creating, email: e.target.value })} className={cn(aInput, "rtl:text-right")} />
            </Field>
            <Field label={d.role}>
              <Segmented
                className="w-full"
                value={creating.role}
                onChange={(v) => setCreating({ ...creating, role: v })}
                options={[
                  { value: "editor", label: d.editor },
                  { value: "admin", label: d.admin },
                ]}
              />
            </Field>
            <Field label={d.password} htmlFor="uPass" required hint={d.errors.PASSWORD_TOO_SHORT}>
              <PasswordInput id="uPass" value={creating.password} onChange={(v) => setCreating({ ...creating, password: v })} locale={locale} />
            </Field>
          </div>
        )}
      </Modal>

      {/* Reset password */}
      <Modal
        locale={locale}
        open={!!resetting}
        onOpenChange={(v) => !v && !busy && setResetting(null)}
        title={t("Reset password", "إعادة تعيين كلمة المرور")}
        description={resetting?.name}
        footer={
          <>
            <button type="button" onClick={() => setResetting(null)} className={aBtn("outline")} disabled={busy}>
              {d.cancel}
            </button>
            <button
              type="button"
              disabled={busy || (resetting?.password.length ?? 0) < 10}
              onClick={async () => {
                if (!resetting) return;
                const res = await exec(() => resetUserPassword(resetting.id, resetting.password), { success: t("Password updated.", "تم تحديث كلمة المرور."), refresh: false });
                if (res.ok) setResetting(null);
              }}
              className={aBtn("primary", "md", "min-w-[110px]")}
            >
              {busy && <Loader2 className="animate-spin" />}
              {d.save}
            </button>
          </>
        }
      >
        {resetting && (
          <Field label={t("New password", "كلمة المرور الجديدة")} htmlFor="rPass" hint={t("Copy it before saving and share it securely.", "انسخها قبل الحفظ وشاركها بطريقة آمنة.")}>
            <PasswordInput id="rPass" value={resetting.password} onChange={(v) => setResetting({ ...resetting, password: v })} locale={locale} />
          </Field>
        )}
      </Modal>
    </>
  );
}
