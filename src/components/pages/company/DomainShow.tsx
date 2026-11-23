"use client";
import { useInView } from "framer-motion";
import Image from "next/image";
import { type CSSProperties, useCallback, useRef, useState } from "react";
import { useSafeReducedMotion } from "@/components/motion";
import { cn } from "@/lib/utils";

export type ShowItem = { id: string; title: string; body: string; points: string[]; image: string };

/** Text crossfade inside one shared grid cell: the block keeps the tallest height, so nothing below ever jumps. */
function swap(on: boolean): CSSProperties {
  return on
    ? { opacity: 1, transform: "none", visibility: "visible", transition: "opacity 450ms cubic-bezier(0.16,1,0.3,1) 140ms, transform 650ms cubic-bezier(0.16,1,0.3,1) 140ms, visibility 0s" }
    : { opacity: 0, transform: "translateY(10px)", visibility: "hidden", transition: "opacity 200ms ease-out, transform 0s linear 200ms, visibility 0s linear 200ms" };
}

/**
 * Construction domains as a slow, self-running showcase: photographs dissolve into each other, the active domain's
 * progress line fills, then the next one takes over. It runs only while on screen and stops for good once the
 * visitor picks a domain.
 */
export function DomainShow({ items, accent, label }: { items: ShowItem[]; accent: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useSafeReducedMotion();
  const [active, setActive] = useState(0);
  const [run, setRun] = useState(0);
  const [stopped, setStopped] = useState(false);
  const auto = !reduce && !stopped;
  const running = auto && inView;

  const select = (i: number) => {
    setActive(i);
    setRun((r) => r + 1);
    setStopped(true);
  };
  const next = useCallback(() => {
    setActive((a) => (a + 1) % items.length);
    setRun((r) => r + 1);
  }, [items.length]);

  const cur = items[active];
  return (
    <div ref={ref} className="grid gap-8 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-7">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-ink-800 md:aspect-[16/11] lg:aspect-auto lg:h-full lg:min-h-[600px]">
          {items.map((d, i) => {
            const on = i === active;
            return (
              <div key={d.id} className={cn("absolute inset-0 transition-opacity duration-1200 ease-out-expo", on ? "opacity-100" : "opacity-0")}>
                <Image
                  src={d.image}
                  alt={on ? d.title : ""}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className={cn("object-cover transition-transform ease-out", on ? "scale-[1.07]" : "scale-100")}
                  style={{ transitionDuration: on ? "9000ms" : "1000ms" }}
                />
              </div>
            );
          })}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/10 to-ink-900/20" />
          <div className="absolute inset-x-6 bottom-6 grid md:inset-x-9 md:bottom-8">
            {items.map((d, i) => (
              <div key={d.id} aria-hidden={i !== active} className="col-start-1 row-start-1 flex items-end justify-between gap-6" style={swap(i === active)}>
                <p className="font-display text-[1.7rem] leading-tight text-white md:text-[2.4rem]">{d.title}</p>
                <p dir="ltr" className="num shrink-0 pb-1.5 text-[0.85rem] text-white/60">
                  {String(i + 1).padStart(2, "0")} <span className="text-white/30">/ {String(items.length).padStart(2, "0")}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:col-span-5">
        <div role="tablist" aria-label={label} aria-orientation="vertical" className="border-t border-white/10">
          {items.map((d, i) => {
            const on = i === active;
            return (
              <button
                key={d.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => select(i)}
                className="group relative flex w-full items-baseline justify-between gap-6 border-b border-white/10 py-4 text-start md:py-5"
              >
                <span aria-hidden className="absolute inset-x-0 -bottom-px h-[2px] overflow-hidden">
                  {on && (
                    <span
                      key={run}
                      className={cn("absolute inset-0 origin-left rtl:origin-right", auto && "animate-[heroprogress_8s_linear_forwards]")}
                      style={{ background: accent, ...(auto ? { animationPlayState: running ? "running" : "paused" } : { transform: "scaleX(1)" }) }}
                      onAnimationEnd={auto ? next : undefined}
                    />
                  )}
                </span>
                <span className={cn("font-display text-[1.3rem] leading-snug transition-colors duration-300 md:text-[1.55rem]", on ? "text-white" : "text-white/40 group-hover:text-white/75")}>
                  {d.title}
                </span>
                <span dir="ltr" className={cn("num text-[0.8rem] transition-colors", on ? "text-white/70" : "text-white/30")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
        {/* Detail of the active domain: all blocks share one cell, so the column keeps its height as the show moves on. */}
        <div className="mt-8 grid lg:mt-auto lg:pt-10">
          {items.map((d, i) => (
            <div key={d.id} aria-hidden={i !== active} className="col-start-1 row-start-1" style={swap(i === active)}>
              <p className="text-pretty text-[1.05rem] leading-relaxed text-white/80">{d.body}</p>
              <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
                {d.points.map((x) => (
                  <li key={x} className="flex gap-3 text-[0.96rem] leading-snug text-white/65">
                    <span aria-hidden className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <span className="sr-only" aria-live="polite">
          {cur.title}
        </span>
      </div>
    </div>
  );
}
