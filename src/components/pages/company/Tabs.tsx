"use client";
import { type KeyboardEvent, type ReactNode, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type TabItem = { id: string; label: string; meta?: string; panel: ReactNode };

/** Accessible tab set (roving focus, arrow keys, RTL-aware). Panels are server-rendered and passed in. */
export function Tabs({ items, accent, tone = "light", label }: { items: TabItem[]; accent: string; tone?: "light" | "dark"; label: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const dark = tone === "dark";

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const rtl = document.documentElement.dir === "rtl";
    const next = rtl ? "ArrowLeft" : "ArrowRight";
    const prev = rtl ? "ArrowRight" : "ArrowLeft";
    let i = active;
    if (e.key === next) i = (active + 1) % items.length;
    else if (e.key === prev) i = (active - 1 + items.length) % items.length;
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = items.length - 1;
    else return;
    e.preventDefault();
    setActive(i);
    refs.current[i]?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKey}
        className={cn("mask-fade-x -mx-5 flex gap-1 overflow-x-auto px-5 pb-px md:mx-0 md:px-0", dark ? "border-b border-white/10" : "border-b border-ink/10")}
      >
        {items.map((it, i) => {
          const on = i === active;
          return (
            <button
              key={it.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-t-${it.id}`}
              aria-selected={on}
              aria-controls={`${uid}-p-${it.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                "relative shrink-0 whitespace-nowrap px-4 pb-4 pt-2 text-start text-[0.95rem] transition-colors duration-300 first:ps-0",
                on ? (dark ? "text-white" : "text-ink") : dark ? "text-white/50 hover:text-white/80" : "text-haze hover:text-ink",
              )}
            >
              <span className="font-display">{it.label}</span>
              {it.meta && <span className={cn("num ms-2 text-[0.8rem]", dark ? "text-white/40" : "text-haze-300")}>{it.meta}</span>}
              <span
                aria-hidden
                className={cn("absolute inset-x-4 -bottom-px h-[2px] origin-left transition-transform duration-500 ease-out-expo rtl:origin-right", on ? "scale-x-100" : "scale-x-0")}
                style={{ background: accent, insetInlineStart: i === 0 ? 0 : undefined }}
              />
            </button>
          );
        })}
      </div>
      {items.map((it, i) => (
        <div
          key={it.id}
          role="tabpanel"
          id={`${uid}-p-${it.id}`}
          aria-labelledby={`${uid}-t-${it.id}`}
          hidden={i !== active}
          className="pt-10 md:pt-12"
        >
          {it.panel}
        </div>
      ))}
    </div>
  );
}
