"use client";

import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionary";
import { cn } from "@/lib/utils";
import { Arrow } from "./primitives";

export function SubscribeForm({
  locale,
  list = "news",
  tone = "dark",
  className,
}: {
  locale: Locale;
  list?: "news" | "ir";
  tone?: "dark" | "light";
  className?: string;
}) {
  const t = getDict(locale);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, list, locale }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  const dark = tone === "dark";
  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)} noValidate>
      <div
        className={cn(
          "group flex h-14 items-stretch rounded-[2px] border transition-colors focus-within:border-leaf",
          dark ? "border-white/20 bg-white/[0.04]" : "border-ink/15 bg-white",
        )}
      >
        <label htmlFor={`sub-${list}`} className="sr-only">
          {t.emailPlaceholder}
        </label>
        <input
          id={`sub-${list}`}
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== "loading") setState("idle");
          }}
          placeholder={t.emailPlaceholder}
          className={cn(
            "min-w-0 flex-1 bg-transparent px-5 text-[0.95rem] outline-none",
            dark ? "text-white placeholder:text-white/40" : "text-ink placeholder:text-haze-300",
          )}
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="group inline-flex items-center gap-3 bg-leaf px-5 text-[0.88rem] font-medium text-ink-900 transition-colors hover:bg-[#6cc951] disabled:opacity-70"
        >
          {t.subscribe}
          {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : state === "done" ? <Check className="h-4 w-4" /> : <Arrow />}
        </button>
      </div>
      <p
        aria-live="polite"
        className={cn(
          "mt-3 min-h-5 text-[0.82rem]",
          state === "error" ? "text-red-400" : dark ? "text-leaf-300" : "text-leaf-700",
        )}
      >
        {state === "done" ? t.subscribed : state === "error" ? t.error : ""}
      </p>
    </form>
  );
}
