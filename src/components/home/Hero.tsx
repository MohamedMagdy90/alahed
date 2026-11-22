"use client";

import { useInView } from "framer-motion";
import { Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useCallback, useEffect, useId, useReducer, useRef, useState } from "react";
import { useSafeReducedMotion } from "@/components/motion";
import { CompanyLogo } from "@/components/site/CompanyLogo";
import { BANDS, BOWL, MARK_VIEWBOX } from "@/components/site/LogoMark";
import { Arrow } from "@/components/site/primitives";
import { heroCaption, heroHeadline, heroOrder } from "@/content/pages/home";
import { type Company, companyById } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import { openRolesLabel } from "@/lib/forms";

const COMPANIES = heroOrder.map((id) => companyById(id) as Company);

/**
 * heroOrder index → logo band (BANDS[0] is the outer band). The mark has four crescents and the Group has four
 * companies: AATC, the founding company, is the innermost band, then DOPET, DOPET Sales & Technologies and PEMCO
 * outward (greens inside, blues outside, as in the logo). The mark as a whole is the Group.
 */
const BAND_FOR = [3, 2, 1, 0];
/** Company accents tuned for legibility on dark photography (DOPET S&T: a lighter red beside DOPET's). */
const ACCENT: Record<string, string> = { aatc: "#6CC951", dopet: "#EC4B43", dst: "#F4845F", pemco: "#8EAAE0" };

/** One company is on screen this long; the progress bar and the band sweep share this clock. */
const SLIDE_MS = 7000;
/** Photo dissolve. The incoming photo fades in over the outgoing one, which stays opaque underneath. */
const FADE_MS = 1400;
/** Photo drift: long enough to cover the slide plus the dissolve into the next one. */
const ZOOM_MS = SLIDE_MS + FADE_MS + 800;
const EASE_SWAP = "cubic-bezier(0.45, 0, 0.55, 1)";
const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
/** Punctuation that must stay on the same line as the verb before it (Latin and Arabic). */
const LEADING_PUNCT = /^[,.;:\u060C\u061B]+/;

type State = {
  active: number;
  /** Slides currently painted (the active one plus any it is still dissolving over). */
  shown: boolean[];
  /** Stacking order: the most recently activated slide is on top. */
  stamp: number[];
  /** Restart counter per company, so its progress bar and band sweep start again from zero. */
  runs: number[];
  counter: number;
};
type Action = { type: "go"; to: number } | { type: "next" } | { type: "settled"; counter: number };

const INITIAL: State = {
  active: 0,
  shown: COMPANIES.map((_, i) => i === 0),
  stamp: COMPANIES.map((_, i) => (i === 0 ? 1 : 0)),
  runs: COMPANIES.map(() => 0),
  counter: 1,
};

function reducer(s: State, a: Action): State {
  if (a.type === "settled") {
    // The incoming photo now fully covers the others: hide them (out of sight) so their drift resets.
    if (a.counter !== s.counter) return s;
    return { ...s, shown: s.shown.map((_, i) => i === s.active) };
  }
  const to = a.type === "next" ? (s.active + 1) % COMPANIES.length : a.to;
  const runs = s.runs.slice();
  runs[to] += 1;
  if (to === s.active) return { ...s, runs };
  const counter = s.counter + 1;
  const stamp = s.stamp.slice();
  stamp[to] = counter;
  const shown = s.shown.slice();
  shown[to] = true;
  return { active: to, shown, stamp, runs, counter };
}

/** Enter: fade + small rise after a short beat. Leave: fade only, then reset the offset once invisible. */
function swap(on: boolean, rise = 8): CSSProperties {
  return on
    ? {
        opacity: 1,
        transform: "none",
        visibility: "visible",
        transition: `opacity 700ms ${EASE_OUT} 220ms, transform 900ms ${EASE_OUT} 220ms, visibility 0s`,
      }
    : {
        opacity: 0,
        transform: `translateY(${rise}px)`,
        visibility: "hidden",
        transition: "opacity 320ms ease-out, transform 0s linear 320ms, visibility 0s linear 320ms",
      };
}

export type HeroLatest = { title: string; date: string; href: string; label: string } | null;

export function Hero({ locale, latest, openRoles = 0 }: { locale: Locale; latest: HeroLatest; openRoles?: number }) {
  const ar = locale === "ar";
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const reduce = useSafeReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [{ active, shown, stamp, runs, counter }, dispatch] = useReducer(reducer, INITIAL);
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);

  const cur = COMPANIES[active];
  const accent = ACCENT[cur.id];

  // Auto-advance is driven by CSS animations (progress bar, band sweep, photo drift) so they all pause together.
  const auto = !reduce;
  const running = auto && !userPaused && !hover && inView;
  const playState = running ? "running" : "paused";

  const select = useCallback((i: number) => dispatch({ type: "go", to: i }), []);
  const next = useCallback(() => {
    // Reduced-motion users never auto-advance (the global CSS shortens animations to ~0ms).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    dispatch({ type: "next" });
  }, []);

  // Once the dissolve has finished, retire the photos underneath.
  useEffect(() => {
    const t = window.setTimeout(() => dispatch({ type: "settled", counter }), FADE_MS + 120);
    return () => window.clearTimeout(t);
  }, [counter]);

  // Download and decode every photo up front, so no dissolve ever waits on (or stutters for) a decode.
  useEffect(() => {
    for (const c of COMPANIES) {
      const img = new window.Image();
      img.src = c.image;
      img.decode?.().catch(() => {});
    }
  }, []);

  const pauseHandlers = {
    onPointerEnter: () => setHover(true),
    onPointerLeave: () => setHover(false),
    onFocusCapture: () => setHover(true),
    onBlurCapture: () => setHover(false),
  };

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink-900 text-white">
      {/* Photography: one image per company. The newest slide dissolves in on top; nothing snaps back in view. */}
      <div aria-hidden className="absolute inset-0 -z-30">
        {COMPANIES.map((c, i) => (
          <div
            key={c.id}
            className="absolute inset-0"
            style={{
              zIndex: stamp[i],
              opacity: shown[i] ? 1 : 0,
              transition: shown[i] ? `opacity ${FADE_MS}ms ${EASE_SWAP}` : "none",
            }}
          >
            <Image
              src={c.image}
              alt=""
              fill
              priority={i === 0}
              loading={i === 0 ? undefined : "eager"}
              sizes="100vw"
              className="object-cover"
              style={{
                animation: auto && shown[i] ? `herozoom ${ZOOM_MS}ms linear forwards` : "none",
                animationPlayState: playState,
              }}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-ink-900 via-ink-900/45 to-ink-900/5" />
      <div className="absolute inset-0 -z-20 from-ink-900/80 via-ink-900/30 to-transparent ltr:bg-gradient-to-r rtl:bg-gradient-to-l" />
      <div className="absolute inset-x-0 top-0 -z-20 h-48 bg-gradient-to-b from-ink-900/75 to-transparent" />

      {/* The Al-Ahed mark itself: four crescents traced from the logo, one per company. The active company's band
          fills along its taper, tip to tip, as its time runs; the previous band fades out as the next one starts. */}
      <div
        className="absolute -end-[3%] top-1/2 hidden aspect-square w-[min(40vw,660px)] -translate-y-[44%] lg:block"
        style={{ animation: "herofade 1.6s ease-out 0.25s both" }}
        {...pauseHandlers}
      >
        <svg viewBox={MARK_VIEWBOX} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <defs>
            {COMPANIES.map((c, i) => (
              <clipPath key={c.id} id={`${uid}band${i}`}>
                <path d={BANDS[BAND_FOR[i]].d} />
              </clipPath>
            ))}
          </defs>
          {COMPANIES.map((c, i) => {
            const b = BANDS[BAND_FOR[i]];
            const on = i === active;
            return (
              <g key={c.id}>
                <path
                  d={b.d}
                  fill="white"
                  fillOpacity={on ? 0.3 : 0.2}
                  style={{ transition: `fill-opacity 900ms ${EASE_SWAP}` }}
                />
                <g
                  clipPath={`url(#${uid}band${i})`}
                  style={{ opacity: on ? 1 : 0, transition: on ? "opacity 250ms ease-out" : `opacity 900ms ${EASE_SWAP}` }}
                >
                  <path
                    key={runs[i]}
                    d={b.sweep}
                    pathLength={1}
                    fill="none"
                    stroke={ACCENT[c.id]}
                    strokeWidth={b.sweepWidth}
                    strokeDasharray="1 1"
                    style={{
                      strokeDashoffset: auto ? 1 : 0,
                      animation: auto ? `arcdraw ${SLIDE_MS}ms linear forwards` : "none",
                      animationPlayState: on ? playState : "paused",
                    }}
                  />
                </g>
                {/* generous invisible hit area along the band */}
                <path
                  d={b.sweep}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={b.sweepWidth + 5}
                  className="cursor-pointer"
                  style={{ pointerEvents: "stroke" }}
                  onClick={() => select(i)}
                />
              </g>
            );
          })}
        </svg>
        {/* The active company's logo sits in the mark's open bowl; logos crossfade in place */}
        <div
          className="pointer-events-none absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center"
          style={{ left: `${(BOWL.x / 128) * 100}%`, top: `${(BOWL.y / 128) * 100}%` }}
        >
          {COMPANIES.map((c, i) => (
            <div key={c.id} className="col-start-1 row-start-1" style={swap(i === active, 6)}>
              <CompanyLogo id={c.id} locale={locale} tone="white" size={58} decorative />
            </div>
          ))}
        </div>
      </div>

      <div className="container relative flex flex-1 flex-col justify-end pb-10 pt-40 md:pb-14">
        <div className="lg:max-w-[58%]" {...pauseHandlers}>
          <h1
            className="text-balance font-display text-[clamp(2.25rem,4.4vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.03em]"
            style={{ animation: `herorise 1.1s ${EASE_OUT} 0.05s both` }}
          >
            {heroHeadline[locale].map((seg, k, all) => {
              if (typeof seg === "string") {
                // Punctuation right after a verb is rendered with that verb (below), so no line starts with a comma.
                const text = k > 0 && typeof all[k - 1] !== "string" ? seg.replace(LEADING_PUNCT, "") : seg;
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed, never-reordered list; separators like ", " repeat
                return text ? <span key={`s${k}`}>{text}</span> : null;
              }
              const on = seg.verb === active;
              const c = COMPANIES[seg.verb];
              const after = all[k + 1];
              const tail = typeof after === "string" ? (after.match(LEADING_PUNCT)?.[0] ?? "") : "";
              return (
                <span key={`v${seg.verb}`} className="whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => select(seg.verb)}
                    aria-pressed={on}
                    aria-controls="hero-company"
                    title={c.name[locale]}
                    className={`relative inline-block rounded-[2px] text-start transition-colors duration-700 focus-visible:outline-offset-4 ${
                      on ? "text-white" : "text-white/40 hover:text-white/75"
                    }`}
                  >
                    {seg.text}
                    <span aria-hidden className="absolute inset-x-0 -bottom-[0.04em] h-[3px] overflow-hidden rounded-full bg-white/15">
                      <span
                        key={runs[seg.verb]}
                        className="absolute inset-0 origin-left rtl:origin-right"
                        style={{
                          background: ACCENT[c.id],
                          opacity: on ? 1 : 0,
                          transition: on ? "opacity 250ms ease-out" : `opacity 900ms ${EASE_SWAP}`,
                          ...(auto
                            ? {
                                animation: `heroprogress ${SLIDE_MS}ms linear forwards`,
                                animationPlayState: on ? playState : "paused",
                              }
                            : { transform: "scaleX(1)" }),
                        }}
                        onAnimationEnd={on && auto ? next : undefined}
                      />
                    </span>
                  </button>
                  {tail}
                </span>
              );
            })}
          </h1>

          {/* All four captions share one grid cell: the block keeps the tallest height, so the headline never jumps. */}
          <div
            id="hero-company"
            className="mt-12 grid border-t border-white/15 pt-6"
            style={{ animation: `herorise 1.1s ${EASE_OUT} 0.18s both` }}
          >
            {COMPANIES.map((c, i) => {
              const on = i === active;
              return (
                <div
                  key={c.id}
                  aria-hidden={!on}
                  className="col-start-1 row-start-1 grid gap-5 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-10"
                  style={swap(on)}
                >
                  <div className="flex items-center gap-4">
                    <span className="lg:hidden">
                      <CompanyLogo id={c.id} locale={locale} tone="white" size={30} decorative />
                    </span>
                    <div>
                      <p className="font-display text-[1.15rem] leading-tight">{c.name[locale]}</p>
                      <p className="mt-1 text-[0.85rem] text-white/55">{ar ? `تأسست عام ${c.founded}` : `Established ${c.founded}`}</p>
                    </div>
                  </div>
                  <div>
                    <p className="max-w-xl text-pretty text-[0.98rem] leading-relaxed text-white/75">{heroCaption[c.id][locale]}</p>
                    <div className="mt-5 flex items-center gap-5">
                      <Link
                        href={href(locale, `/companies/${c.slug}`)}
                        tabIndex={on ? undefined : -1}
                        className="group inline-flex items-center gap-2 text-[0.92rem] font-medium"
                      >
                        <span className="link-underline">{ar ? `اكتشف ${c.short.ar}` : `Explore ${c.short.en}`}</span>
                        <span style={{ color: ACCENT[c.id] }}>
                          <Arrow />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live strip: the newest item from the newsroom (changes whenever the team publishes).
          Solid tint rather than backdrop blur: blur would have to be recomputed on every frame of the photo drift. */}
      <div className="relative border-t border-white/10 bg-ink-900/75">
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
          {/* Open roles from the admin panel (hidden when nothing is advertised) */}
          {openRoles > 0 && (
            <Link
              href={`${href(locale, "/careers")}#roles`}
              className="hidden shrink-0 items-center gap-2 border-s border-white/15 ps-5 text-white/75 transition-colors hover:text-white md:inline-flex"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-leaf-300 opacity-60 motion-safe:animate-ping" />
                <span className="relative h-2 w-2 rounded-full bg-leaf-300" />
              </span>
              <span className="num">{openRolesLabel(openRoles, locale)}</span>
            </Link>
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
