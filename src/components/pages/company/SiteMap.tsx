"use client";
import { m, useInView } from "framer-motion";
import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSafeReducedMotion } from "@/components/motion";
import { QATAR_PATH, QATAR_VIEWBOX, SITE_POINTS } from "@/content/qatar-map";
import { MAP_LABEL } from "@/content/site";
import { cn } from "@/lib/utils";

export type MapSite = { id: string; name: string; details: string[]; distance: string; short: string; coords: string };
type Now = { t: number; wind: number; dir: number; rh: number; symbol: string | null };

const VB_W = 336;
const VB_H = 640;
/**
 * Which side of its point each label sits on. Doha, Salwa and New Doha are close together, so they face away;
 * Mesaieed faces the sea so it never runs into Al Karaana's label at almost the same latitude.
 */
const LABEL_SIDE: Record<string, "left" | "right"> = { doha: "right", salwa: "left", newdoha: "right", raslaffan: "left", alkhor: "left", mesaieed: "right", dukhan: "right", karaana: "right" };

function route([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  const k = 0.17;
  const cx = (x1 + x2) / 2 + (y2 - y1) * k;
  const cy = (y1 + y2) / 2 - (x2 - x1) * k;
  return `M${x1} ${y1}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2} ${y2}`;
}

function sky(symbol: string | null, ar: boolean) {
  if (!symbol) return null;
  const s = symbol.replace(/_(day|night|polartwilight)$/, "");
  if (s.includes("thunder")) return ar ? "عواصف رعدية" : "Thunderstorms";
  if (/rain|showers|sleet/.test(s)) return ar ? "أمطار" : "Rain";
  if (s === "fog") return ar ? "ضباب" : "Fog";
  if (s === "clearsky") return ar ? "صافٍ" : "Clear";
  if (s === "fair") return ar ? "صافٍ غالبًا" : "Mostly clear";
  if (s === "partlycloudy") return ar ? "غائم جزئيًا" : "Partly cloudy";
  if (s === "cloudy") return ar ? "غائم" : "Cloudy";
  return null;
}

const COMPASS = {
  en: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
  ar: ["شمالية", "شمالية شرقية", "شرقية", "جنوبية شرقية", "جنوبية", "جنوبية غربية", "غربية", "شمالية غربية"],
};
const compass = (deg: number, ar: boolean) => COMPASS[ar ? "ar" : "en"][Math.round((((deg % 360) + 360) % 360) / 45) % 8];

function swap(on: boolean): CSSProperties {
  return on
    ? { opacity: 1, transform: "none", visibility: "visible", transition: "opacity 450ms cubic-bezier(0.16,1,0.3,1) 140ms, transform 600ms cubic-bezier(0.16,1,0.3,1) 140ms, visibility 0s" }
    : { opacity: 0, transform: "translateY(8px)", visibility: "hidden", transition: "opacity 200ms ease-out, transform 0s linear 200ms, visibility 0s linear 200ms" };
}

/** Local time in Doha, ticking. Rendered after mount only, so server and browser markup always match. */
export function DohaTime({ ar }: { ar: boolean }) {
  const [now, setNow] = useState<Date | null>(null);
  const fmt = useMemo(() => new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Qatar", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }), []);
  const day = useMemo(() => new Intl.DateTimeFormat(ar ? "ar-QA-u-nu-latn" : "en-GB", { timeZone: "Asia/Qatar", weekday: "long" }), [ar]);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <p className="flex items-center gap-2.5 text-[0.88rem] text-white/55" suppressHydrationWarning>
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inset-0 animate-ping2 rounded-full bg-leaf" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-leaf" />
      </span>
      {ar ? "الآن في الدوحة" : "Now in Doha"}
      <span dir="ltr" className="num text-white/90">
        {now ? fmt.format(now) : "--:--"}
      </span>
      {now && <span>· {day.format(now)}</span>}
    </p>
  );
}

/**
 * The company's own locations on a live map of Qatar: routes run from its head office to each site with pulses
 * travelling along them; a slow tour moves from site to site (only while on screen) until the visitor picks one.
 */
export function SiteMap({ sites, homeId, tint, label, ar }: { sites: MapSite[]; homeId: string; tint: string; label: string; ar: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const reduce = useSafeReducedMotion();
  const [active, setActive] = useState(0);
  const [run, setRun] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [wx, setWx] = useState<Record<string, Now | null> | null>(null);
  const [wxDone, setWxDone] = useState(false);
  const fetched = useRef(false);
  const tour = sites.length > 1;
  const auto = tour && !reduce && !stopped;
  const running = auto && inView;
  const flowState = { animationPlayState: inView && !reduce ? "running" : "paused" } as const;

  const select = useCallback((i: number) => {
    setActive(i);
    setRun((r) => r + 1);
    setStopped(true);
  }, []);
  const next = useCallback(() => {
    setActive((a) => (a + 1) % sites.length);
    setRun((r) => r + 1);
  }, [sites.length]);

  // Live conditions (MET Norway, cached server-side for 30 minutes), fetched once when the map first shows.
  useEffect(() => {
    if (!inView || fetched.current) return;
    fetched.current = true;
    fetch("/api/conditions")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j?.ok && setWx(j.sites))
      .catch(() => {})
      .finally(() => setWxDone(true));
  }, [inView]);

  const cur = sites[active];
  const home = SITE_POINTS[homeId];
  const [ax, ay] = SITE_POINTS[cur.id];

  return (
    <div ref={ref} className="grid gap-6 lg:grid-cols-12">
      {/* ---------------- map: sized to how many sites it shows; on desktop it also grows with the detail column */}
      <div className="lg:col-span-6">
        <div
          dir="ltr"
          className={cn(
            "relative overflow-hidden rounded-[2px] border border-white/10 bg-[radial-gradient(120%_85%_at_68%_45%,#12224F_0%,#0A1638_45%,#060D22_100%)] lg:h-full",
            tour ? "h-[440px] md:h-[600px] lg:min-h-[500px]" : "h-[400px] md:h-[500px] lg:min-h-[440px]",
          )}
        >
          <div className="absolute inset-0 py-7 md:py-9">
            <div className="relative mx-auto h-full max-w-full" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
              <div
                className="absolute inset-0 transition-transform duration-1200 ease-out-expo"
                style={{ transform: `scale(${cur.id === homeId ? 1 : 1.08})`, transformOrigin: `${(ax / VB_W) * 100}% ${(ay / VB_H) * 100}%` }}
              >
                <svg viewBox={QATAR_VIEWBOX} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
                  <defs>
                    <pattern id="sm-dots" width="5.2" height="5.2" patternUnits="userSpaceOnUse">
                      <circle cx="2.6" cy="2.6" r="0.95" fill="white" fillOpacity="0.24" />
                    </pattern>
                    <radialGradient id="sm-glow">
                      <stop offset="0%" stopColor={tint} stopOpacity="0.4" />
                      <stop offset="100%" stopColor={tint} stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <path d={QATAR_PATH} fill="white" fillOpacity="0.025" />
                  <path d={QATAR_PATH} fill="url(#sm-dots)" />
                  <m.path
                    d={QATAR_PATH}
                    fill="none"
                    stroke="white"
                    strokeOpacity={0.42}
                    strokeWidth={0.9}
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1] }}
                  />
                  {/* Routes from the head office, with pulses travelling out to each site */}
                  {sites
                    .filter((s) => s.id !== homeId)
                    .map((s, i) => {
                      const d = route(home, SITE_POINTS[s.id]);
                      const on = s.id === cur.id;
                      return (
                        <g key={s.id}>
                          <path
                            d={d}
                            fill="none"
                            stroke={on ? tint : "white"}
                            strokeOpacity={on ? 0.85 : 0.28}
                            strokeWidth={on ? 1.3 : 0.8}
                            strokeDasharray={on ? undefined : "1.5 3"}
                            className="transition-[stroke,stroke-opacity] duration-500"
                          />
                          <path
                            d={d}
                            pathLength={1}
                            fill="none"
                            stroke={on ? "#FFFFFF" : tint}
                            strokeWidth={on ? 2.4 : 1.7}
                            strokeLinecap="round"
                            strokeDasharray="0.07 1.43"
                            style={{
                              strokeDashoffset: 0.07,
                              animationName: "flow",
                              animationDuration: `${on ? 2.2 : 3.4 + i * 0.45}s`,
                              animationTimingFunction: "linear",
                              animationIterationCount: "infinite",
                              animationDelay: `${-i * 0.9}s`,
                              ...flowState,
                            }}
                          />
                        </g>
                      );
                    })}
                  {/* Head office: a slow sonar ring */}
                  <circle
                    cx={home[0]}
                    cy={home[1]}
                    r={14}
                    fill="none"
                    stroke={tint}
                    strokeWidth={0.8}
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "center",
                      animationName: "sonar",
                      animationDuration: "4.2s",
                      animationTimingFunction: "cubic-bezier(0.2, 0.6, 0.3, 1)",
                      animationIterationCount: "infinite",
                      opacity: 0,
                      ...flowState,
                    }}
                  />
                  {sites.map((s, i) => {
                    const [x, y] = SITE_POINTS[s.id];
                    const on = s.id === cur.id;
                    const isHome = s.id === homeId;
                    return (
                      <g key={s.id} className="cursor-pointer" onClick={() => select(i)}>
                        <circle cx={x} cy={y} r={36} fill="url(#sm-glow)" className="transition-opacity duration-700" opacity={on ? 1 : 0} />
                        {on && !isHome && (
                          <circle
                            cx={x}
                            cy={y}
                            r={5}
                            fill="none"
                            stroke={tint}
                            strokeWidth={1}
                            style={{
                              transformBox: "fill-box",
                              transformOrigin: "center",
                              animationName: "sonar",
                              animationDuration: "2.4s",
                              animationTimingFunction: "cubic-bezier(0.2, 0.6, 0.3, 1)",
                              animationIterationCount: "infinite",
                              ...flowState,
                            }}
                          />
                        )}
                        <circle
                          cx={x}
                          cy={y}
                          r={isHome ? 5.4 : on ? 4.6 : 3.2}
                          fill={on || isHome ? tint : "white"}
                          stroke="#060D22"
                          strokeWidth={1.4}
                          className="transition-all duration-500"
                        />
                        {isHome && <circle cx={x} cy={y} r={1.8} fill="#060D22" />}
                        <circle cx={x} cy={y} r={16} fill="transparent" />
                      </g>
                    );
                  })}
                </svg>
                {/* Labels */}
                {sites.map((s, i) => {
                  const [x, y] = SITE_POINTS[s.id];
                  const on = s.id === cur.id;
                  const right = LABEL_SIDE[s.id] === "right";
                  return (
                    <button
                      key={s.id}
                      type="button"
                      tabIndex={-1}
                      onClick={() => select(i)}
                      className={cn(
                        "absolute -translate-y-1/2 whitespace-nowrap py-1 text-[0.78rem] transition-colors duration-500 md:text-[0.84rem]",
                        right ? "ps-3" : "-translate-x-full pe-3",
                        on ? "text-white" : "text-white/45 hover:text-white/80",
                      )}
                      style={{ left: `${(x / VB_W) * 100}%`, top: `${(y / VB_H) * 100}%` }}
                    >
                      <span dir={ar ? "rtl" : "ltr"}>{MAP_LABEL[s.id]?.[ar ? "ar" : "en"] ?? s.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- site detail (open, no box) above the ruled list of every site */}
      <div className={cn("flex flex-col lg:col-span-6 lg:ps-8 xl:ps-12", !tour && "lg:justify-center")}>
        {/* Every site shares one grid cell, so the block keeps the tallest site's height and the readout sits at the
            same place for each of them. A single site (no list) is centred beside the map instead. */}
        <div className={cn("grid", tour && "lg:mb-12")}>
          {sites.map((s, i) => {
            const on = i === active;
            const w = wx?.[s.id] ?? null;
            const cond = w ? sky(w.symbol, ar) : null;
            return (
              <div key={s.id} aria-hidden={!on} className="col-start-1 row-start-1 flex flex-col" style={swap(on)}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <p className="text-[0.88rem]" style={{ color: tint }}>
                    {s.distance}
                  </p>
                  <p dir="ltr" className="num font-mono text-[0.74rem] tracking-wide text-white/45">
                    {s.coords}
                  </p>
                </div>
                <h3 className="mt-3 text-balance font-display text-[clamp(2rem,3.4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-white">{s.name}</h3>
                <ul className="mt-7 space-y-3.5">
                  {s.details.map((d) => (
                    <li key={d} className="flex gap-3 text-[1rem] leading-snug text-white/75">
                      <span aria-hidden className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: tint }} />
                      {d}
                    </li>
                  ))}
                </ul>

                {/* Live conditions at the site. Space is held while they load; dropped only if unavailable. */}
                {(w || !wxDone) && (
                  <div className="mt-auto pt-9">
                    <dl className={cn("grid grid-cols-3 gap-4 border-t border-white/10 pt-5", !w && "invisible")}>
                      <div>
                        <dt className="text-[0.78rem] text-white/45">{ar ? "الحرارة" : "Temperature"}</dt>
                        <dd className="mt-1 text-[0.98rem]">
                          <span className="num">{w ? `${w.t.toFixed(1)}°C` : "-"}</span>
                          {cond && <span className="text-white/55"> {cond}</span>}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[0.78rem] text-white/45">{ar ? "الرياح" : "Wind"}</dt>
                        <dd className="mt-1 text-[0.98rem]">
                          <span className="num">{w ? Math.round(w.wind * 3.6) : "-"}</span> {ar ? "كم/س" : "km/h"}{" "}
                          <span className="text-white/55">{w ? compass(w.dir, ar) : ""}</span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[0.78rem] text-white/45">{ar ? "الرطوبة" : "Humidity"}</dt>
                        <dd className="num mt-1 text-[0.98rem]">{w ? `${Math.round(w.rh)}%` : "-"}</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {tour && (
          <div role="tablist" aria-label={label} aria-orientation="vertical" className="mt-12 border-t border-white/10 lg:mt-auto lg:pt-0">
            {sites.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => select(i)}
                  className="group relative flex w-full items-baseline justify-between gap-6 border-b border-white/10 py-3.5 text-start md:py-4"
                >
                  <span aria-hidden className="absolute inset-x-0 -bottom-px h-[2px] overflow-hidden">
                    {on && (
                      <span
                        key={run}
                        className={cn("absolute inset-0 origin-left rtl:origin-right", auto && "animate-[heroprogress_6s_linear_forwards]")}
                        style={{ background: tint, ...(auto ? { animationPlayState: running ? "running" : "paused" } : { transform: "scaleX(1)" }) }}
                        onAnimationEnd={auto ? next : undefined}
                      />
                    )}
                  </span>
                  <span
                    className={cn(
                      "font-display text-[1.1rem] leading-tight transition-[color,transform] duration-500 ease-out-expo md:text-[1.25rem]",
                      on ? "translate-x-1 text-white rtl:-translate-x-1" : "text-white/45 group-hover:text-white/80",
                    )}
                  >
                    {s.name}
                  </span>
                  <span className={cn("num shrink-0 text-[0.82rem] transition-colors", on ? "text-white/70" : "text-white/30")}>{s.short}</span>
                </button>
              );
            })}
          </div>
        )}
        {wx && (
          <p className="mt-5 text-[0.76rem] text-white/35">
            {ar ? "الأحوال الجوية: " : "Local conditions: "}
            <a href="https://www.met.no/en" target="_blank" rel="noreferrer" className="underline decoration-white/20 underline-offset-2 hover:text-white/60">
              MET Norway
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
