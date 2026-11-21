"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { errorText, getAdminDict, tx } from "@/i18n/admin";
import { login } from "@/lib/admin/auth";
import { cn } from "@/lib/utils";
import { aInput } from "./ui";

export function LoginForm({ locale, next }: { locale: Locale; next?: string }) {
  const d = getAdminDict(locale);
  const t = tx(locale);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await login({ email, password });
      if (res.ok) {
        const safe = next && next.startsWith(`/${locale}/admin`) && !next.startsWith(`/${locale}/admin/login`) ? next : `/${locale}/admin`;
        window.location.assign(safe);
        return;
      }
      setError(res.error === "INVALID" ? d.loginError : errorText(locale, res.error));
    } catch {
      setError(d.error);
    }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-[2px] border border-red-200 bg-red-50 px-4 py-3 text-[0.85rem] text-red-800">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden />
          {error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[0.8rem] font-medium text-ink/75">
          {d.email}
        </label>
        <input
          id="email"
          type="email"
          dir="ltr"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(aInput, "h-12 text-start rtl:text-end")}
          aria-invalid={!!error}
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-[0.8rem] font-medium text-ink/75">
          {d.password}
        </label>
        <div className="relative">
          <input
            id="password"
            type={show ? "text" : "password"}
            dir="ltr"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(aInput, "h-12 pe-12 text-start rtl:text-end")}
            aria-invalid={!!error}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? t("Hide password", "إخفاء كلمة المرور") : t("Show password", "إظهار كلمة المرور")}
            className="absolute end-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center text-haze transition-colors hover:text-ink"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={busy || !email || !password}
        className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-[2px] bg-ink text-[0.9rem] font-medium text-white transition-colors hover:bg-navy disabled:opacity-50"
      >
        <span className="absolute inset-y-0 start-0 w-1 bg-leaf transition-all duration-500 ease-out-expo group-hover:w-2" aria-hidden />
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {busy ? d.signingIn : d.signIn}
      </button>
    </form>
  );
}
