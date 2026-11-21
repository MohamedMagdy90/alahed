"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { useSafeReducedMotion } from "@/components/motion";
import { CompanyLogo } from "@/components/site/CompanyLogo";
import { ARCS, arc, pt } from "@/components/site/OrbitArcs";
import { Arrow } from "@/components/site/primitives";
import { heroCaption, heroHeadline, heroOrder } from "@/content/pages/home";
import { type Company, companyById } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import { cn } from "@/lib/utils";

/** heroOrder index → logo arc (ARCS[0] outer, [1] middle, [2] inner green). AATC is the founding, inner arc. */
const ARC_FOR = [2, 1, 0];
/** Company accents tuned for legibility on dark photography. */
const ACCENT: Record<string, string> = { aatc: "#6CC951", dopet: "#EC4B43", pemco: "#8EAAE0" };

export type HeroLatest = { title: string; date: string; href: string; label: string } | null;

export function Hero({ locale, latest }: { locale: Locale; latest: HeroLatest }) {
  const ar = locale === "ar";
  const reduce = useSafeReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [active, setActive] = useState(0);
  const [run, setRun] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);

  const companies = heroOrder.map((id) => companyById(id) as Company);
  const cur = companies[active];
  const accent = ACCENT[cur.id];

  // Auto-advance is driven by a CSS animation on the active verb's progress bar, so it can pause cleanly.
  const auto = !reduce && !userPaused;
  const playState = { animationPlayState: auto && !hover && inView ? "running" : "paused" } as const;

  const select = useCallback((i: number) => {
    setActive(i);
    setRun((r) => r + 1);
  }, []);
  const next = useCallback(() => {
    // Reduced-motion users never auto-advance (the global CSS shortens animations to ~0ms).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setActive((a) => (a + 1) % heroOrder.length);
    setRun((r) => r + 1);
  }, []);

  const pauseHandlers = {
    onPointerEnter: () => setHover(true),
    onPointerLeave: () => setHover(false),
    onFocusCapture: () => setHover(true),
    onBlurCapture: () => setHover(false),
  };

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink-900 text-white">
      {/* Photography: one image per company, crossfaded, in full colour */}
      {companies.map((c, i) => (
        <div
          key={c.id}
          aria-hidden
          className={cn("absolute inset-0 -z-30 transition-opacity duration-1200 ease-out", i === active ? "opacity-100" : "opacity-0")}
        >
          <Image
            src={c.image}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover transition-transform ease-linear"
            style={{ transform: i === active && !reduce ? "scale(1.07)" : "scale(1)", transitionDuration: i === active ? "9000ms" : "1200ms" }}
          />
        </div>
      ))}
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-ink-900 via-ink-900/45 to-ink-900/5" />
      <div className="absolute inset-0 -z-20 from-ink-900/80 via-ink-900/30 to-transparent ltr:bg-gradient-to-r rtl:bg-gradient-to-l" />
      <div className="absolute inset-x-0 top-0 -z-20 h-48 bg-gradient-to-b from-ink-900/75 to-transparent" />

      {/* The logo's three arcs: one per company. The active arc draws itself as the story progresses. */}
      <div
        className="absolute -end-[6%] top-1/2 hidden aspect-square w-[min(46vw,760px)] -translate-y-[46%] lg:block"
        {...pauseHandlers}
      >
        <svg viewBox="0 0 800 800" className={cn("absolute inset-0 h-full w-full overflow-visible", ar && "-scale-x-100")} aria-hidden>
          {companies.map((c, i) => {
            const a = ARCS[ARC_FOR[i]];
            const d = arc(a.r, a.start, a.len);
            const on = i === active;
            const [sx, sy] = pt(a.r, a.start);
            return (
              <g key={c.id}>
                <path d={d} fill="none" stroke="white" strokeOpacity={on ? 0.2 : 0.14} strokeWidth={a.width} strokeLinecap="round" />
                {on && (
                  <path
                    key={run}
                    d={d}
                    pathLength={1}
                    fill="none"
                    stroke={accent}
                    strokeWidth={a.width + 1.5}
                    strokeLinecap="round"
                    strokeDasharray="1 1"
                    className={auto ? "animate-[arcdraw_7s_linear_forwards]" : undefined}
                    style={{ strokeDashoffset: auto ? 1 : 0, ...(auto ? playState : {}) }}
                  />
                )}
                <circle
                  cx={sx}
                  cy={sy}
                  r={on ? 7 : 4.5}
                  fill={on ? accent : "white"}
                  fillOpacity={on ? 1 : 0.45}
                  className="transition-all duration-500"
                />
                {/* generous invisible hit area */}
                <path
                  d={d}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={46}
                  className="cursor-pointer"
                  style={{ pointerEvents: "stroke" }}
                  onClick={() => select(i)}
                />
              </g>
            );
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={cur.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <CompanyLogo id={cur.id} locale={locale} tone="white" size={58} decorative />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="container relative flex flex-1 flex-col justify-end pb-10 pt-40 md:pb-14">
        <div className="lg:max-w-[58%]" {...pauseHandlers}>
          <h1 className="text-balance font-display text-[clamp(2.35rem,4.7vw,4.75rem)] font-normal leading-[1.05] tracking-[-0.03em]">
            {heroHeadline[locale].map((seg, k) => {
              if (typeof seg === "string") return <span key={`s${k}`}>{seg}</span>;
              const on = seg.verb === active;
              const c = companies[seg.verb];
              return (
                <button
                  key={`v${seg.verb}`}
                  type="button"
                  onClick={() => select(seg.verb)}
                  aria-pressed={on}
                  aria-controls="hero-company"
                  title={c.name[locale]}
                  className={cn(
                    "relative inline-block rounded-[2px] text-start transition-colors duration-500 focus-visible:outline-offset-4",
                    on ? "text-white" : "text-white/40 hover:text-white/75",
                  )}
                >
                  {seg.text}
                  <span aria-hidden className="absolute inset-x-0 -bottom-[0.04em] h-[3px] overflow-hidden rounded-full bg-white/15">
                    {on && (
                      <span
                        key={run}
                        className={cn("absolute inset-0 origin-left rtl:origin-right", auto && "animate-[heroprogress_7s_linear_forwards]")}
                        style={{ background: ACCENT[c.id], ...(auto ? playState : { transform: "scaleX(1)" }) }}
                        onAnimationEnd={auto ? next : undefined}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </h1>

          <div id="hero-company" className="mt-12 border-t border-white/15 pt-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={cur.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid gap-5 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-10"
              >
                <div className="flex items-center gap-4">
                  <span className="lg:hidden">
                    <CompanyLogo id={cur.id} locale={locale} tone="white" size={30} decorative />
                  </span>
                  <div>
                    <p className="font-display text-[1.15rem] leading-tight">{cur.name[locale]}</p>
                    <p className="mt-1 text-[0.85rem] text-white/55">{ar ? `تأسست عام ${cur.founded}` : `Established ${cur.founded}`}</p>
                  </div>
                </div>
                <div>
                  <p className="max-w-xl text-pretty text-[0.98rem] leading-relaxed text-white/75">{heroCaption[cur.id][locale]}</p>
                  <div className="mt-5 flex items-center gap-5">
                    <Link href={href(locale, `/companies/${cur.slug}`)} className="group inline-flex items-center gap-2 text-[0.92rem] font-medium">
                      <span className="link-underline">{ar ? `اكتشف ${cur.short.ar}` : `Explore ${cur.short.en}`}</span>
                      <span style={{ color: accent }}>
                        <Arrow />
                      </span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Live strip: the newest item from the newsroom (changes whenever the team publishes) */}
      <div className="relative border-t border-white/10 bg-ink-900/60 backdrop-blur-md">
        <div className="container flex h-14 items-center gap-5 text-[0.9rem]">
          {latest ? (
            <>
              <span className="shrink-0 font-medium text-leaf-300">{ar ? "آخر الأخبار" : "Latest"}</span>
              <time className="hidden shrink-0 text-white/50 sm:inline">{latest.date}</time>
              <Link href={latest.href} className="group flex min-w-0 flex-1 items-center gap-3">
                <span className="truncate text-white/85 transition-colors group-hover:text-white">{latest.title}</span>
                <Arrow className="text-white/60" />
              </Link>
            </>
          ) : (
            <span className="flex-1" />
          )}
          {!reduce && (
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-label={userPaused ? (ar ? "تشغيل العرض" : "Play") : ar ? "إيقاف العرض مؤقتًا" : "Pause"}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/50 hover:text-white"
            >
              {userPaused ? <Play className="h-3.5 w-3.5 rtl:-scale-x-100" /> : <Pause className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
