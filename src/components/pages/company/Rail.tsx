"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Horizontal, swipeable rail of cards (children carry `data-card`). Prev/next buttons move one card at a time and
 * a thin thumb shows where the visitor is in the rail. RTL-aware (scrollLeft is negative in right-to-left pages).
 */
export function Rail({ children, label, prevLabel, nextLabel }: { children: ReactNode; label: string; prevLabel: string; nextLabel: string }) {
  const ref = useRef<HTMLElement>(null);
  const [pos, setPos] = useState({ start: 0, size: 1, prev: false, next: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const x = Math.abs(el.scrollLeft);
    const size = el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1;
    setPos({ start: max > 0 ? (x / max) * (1 - size) : 0, size, prev: x > 4, next: x < max - 4 });
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step * (rtl ? -1 : 1), behavior: "smooth" });
  };

  const btn =
    "grid h-11 w-11 place-items-center rounded-[2px] border border-ink/15 text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-30";

  return (
    <div>
      {/* A scrollable region must be reachable from the keyboard, hence the tabIndex. */}
      <section
        ref={ref}
        aria-label={label}
        tabIndex={0}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 px-5 pb-2 md:-mx-8 md:scroll-px-8 md:px-8 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {children}
      </section>
      <div className="mt-8 flex items-center gap-6">
        <div className="relative h-px flex-1 bg-ink/10">
          <span
            className="absolute -top-px h-[3px] bg-ink transition-[inset-inline-start,width] duration-300 ease-out"
            style={{ insetInlineStart: `${pos.start * 100}%`, width: `${pos.size * 100}%` }}
          />
        </div>
        <div className={cn("flex gap-2", !pos.prev && !pos.next && "invisible")}>
          <button type="button" aria-label={prevLabel} disabled={!pos.prev} onClick={() => go(-1)} className={btn}>
            <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
          </button>
          <button type="button" aria-label={nextLabel} disabled={!pos.next} onClick={() => go(1)} className={btn}>
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
          </button>
        </div>
      </div>
    </div>
  );
}
