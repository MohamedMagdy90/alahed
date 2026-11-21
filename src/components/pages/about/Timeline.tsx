"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

type Item = { year: string; title: string; body: string };

/** Horizontal, snap-scrolling timeline with progress bar and prev/next controls (RTL-aware). */
export function Timeline({ items, locale }: { items: Item[]; locale: Locale }) {
  const ref = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const rtl = locale === "ar";

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft);
    setProgress(max > 0 ? pos / max : 1);
    setAtStart(pos < 4);
    setAtEnd(pos > max - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const step = (el.querySelector("li")?.clientWidth ?? 360) + 1;
    el.scrollBy({ left: dir * step * (rtl ? -1 : 1), behavior: "smooth" });
  };

  const Prev = rtl ? ArrowRight : ArrowLeft;
  const Next = rtl ? ArrowLeft : ArrowRight;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-6">
        <div className="relative h-px flex-1 bg-white/15">
          <div
            className="absolute inset-y-0 start-0 bg-leaf transition-[width] duration-300"
            style={{ width: `${Math.max(8, progress * 100)}%` }}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={atStart}
            aria-label={rtl ? "السابق" : "Previous"}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-leaf hover:bg-leaf hover:text-ink disabled:opacity-30 disabled:hover:border-white/20 disabled:hover:bg-transparent disabled:hover:text-white"
          >
            <Prev className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={atEnd}
            aria-label={rtl ? "التالي" : "Next"}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-leaf hover:bg-leaf hover:text-ink disabled:opacity-30 disabled:hover:border-white/20 disabled:hover:bg-transparent disabled:hover:text-white"
          >
            <Next className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ol
        ref={ref}
        onScroll={update}
        tabIndex={0}
        aria-label={rtl ? "المسيرة الزمنية" : "Timeline"}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory overflow-x-auto scroll-smooth px-5 outline-none md:-mx-8 md:px-8 xl:-mx-10 xl:px-10"
      >
        {items.map((m, i) => (
          <li
            key={m.year}
            className={cn(
              "group relative w-[82vw] shrink-0 snap-start border-s border-white/15 pe-8 ps-7 sm:w-[380px] lg:w-[400px]",
              i === items.length - 1 && "pe-0",
            )}
          >
            <span aria-hidden className="absolute -start-[5px] top-0 h-[9px] w-[9px] rounded-full border border-white/40 bg-ink transition-colors duration-500 group-hover:border-leaf group-hover:bg-leaf" />
            <p className="num font-display text-[clamp(3.5rem,6vw,5.5rem)] leading-none tracking-[-0.04em] text-white/90 transition-colors duration-500 group-hover:text-leaf-300">
              {m.year}
            </p>
            <p className="mt-8 font-display text-[1.35rem] text-white">{m.title}</p>
            <p className="mt-3 max-w-[32ch] text-[0.98rem] leading-relaxed text-white/60">{m.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
