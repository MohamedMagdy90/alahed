"use client";

import { m, useInView } from "framer-motion";
import Image from "next/image";
import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSafeReducedMotion } from "@/components/motion";
import { CompanyLogo } from "@/components/site/CompanyLogo";
import { BANDS, BOWL, MARK_TONES } from "@/components/site/LogoMark";
import { siteDetails, siteGeo } from "@/content/pages/home";
import { QATAR_PATH, QATAR_VIEWBOX, SITE_POINTS } from "@/content/qatar-map";
import { type CompanyId, companyLabels, companyRank, sites } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ geometry */

const VB_W = 336;
const VB_H = 640;
const HQ = "doha";
const LEAF = "#9ED38D";
const DOT: Record<string, string> = { holding: "#FFFFFF", aatc: "#6CC951", dopet: "#EC4B43", dst: "#F59A8F", pemco: "#8EAAE0" };

// Projection for the graticule and scale bar, anchored on two plotted locations (Doha ↔ Ras Laffan).
const PX_PER_DEG = (SITE_POINTS.doha[1] - SITE_POINTS.raslaffan[1]) / (siteGeo.raslaffan.lat - siteGeo.doha.lat);
const yOfLat = (lat: number) => SITE_POINTS.doha[1] + (siteGeo.doha.lat - lat) * PX_PER_DEG;
const xOfLon = (lon: number) => SITE_POINTS.doha[0] + (lon - siteGeo.doha.lon) * PX_PER_DEG * Math.cos((25.3 * Math.PI) / 180);
const KM20 = (20 / 111.2) * PX_PER_DEG;

/** Which side of its point each label sits on (Doha and Salwa are close together, so they face away). */
const LABEL_SIDE: Record<string, "left" | "right"> = { doha: "right", salwa: "left", newdoha: "right", raslaffan: "left", alkhor: "left", mesaieed: "left", dukhan: "right", karaana: "right" };

const rad = (d: number) => (d * Math.PI) / 180;
function km(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lon - a.lon) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/** Gentle curve from HQ to a site, bowing to the left of the direction of travel. */
function route([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  const k = 0.17;
  const cx = (x1 + x2) / 2 + (y2 - y1) * k;
  const cy = (y1 + y2) / 2 - (x2 - x1) * k;
  return `M${x1} ${y1}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2} ${y2}`;
}

const shortName = (name: string) => name.split(/ — | – /)[0];
const coords = (id: string) => {
  const g = siteGeo[id];
  return `${g.lat.toFixed(2)}° N  ${g.lon.toFixed(2)}° E`;
};

/* ------------------------------------------------------------------ live conditions */

type Now = { t: number; wind: number; dir: number; rh: number; symbol: string | null };

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
const compass = (deg: number, locale: Locale) => COMPASS[locale][Math.round((((deg % 360) + 360) % 360) / 45) % 8];

/** Local time at Group HQ, ticking. Rendered only after mount so server and browser markup always match. */
function DohaClock({ locale, now: wx }: { locale: Locale; now: Now | null }) {
  const ar = locale === "ar";
  const [now, setNow] = useState<Date | null>(null);
  const fmt = useMemo(
    () => ({
      time: new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Qatar", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }),
      day: new Intl.DateTimeFormat(ar ? "ar-QA-u-nu-latn" : "en-GB", { timeZone: "Asia/Qatar", weekday: "long", day: "numeric", month: "long" }),
    }),
    [ar],
  );
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const parts = now ? fmt.time.formatToParts(now) : null;
  const get = (t: string) => parts?.find((p) => p.type === t)?.value ?? "--";
  const cond = wx ? sky(wx.symbol, ar) : null;

  return (
    <div className="inline-flex items-stretch rounded-[2px] border border-white/10 bg-white/[0.03]">
      <div className="px-5 py-4">
        <p className="text-[0.8rem] text-white/50">{ar ? "الوقت الآن في الدوحة" : "Now in Doha"}</p>
        <p dir="ltr" className="num mt-1.5 font-display text-[2.15rem] leading-none tracking-tight text-white" suppressHydrationWarning>
          {get("hour")}:{get("minute")}
          <span className="text-white/35">:{get("second")}</span>
        </p>
      </div>
      <div className="w-px bg-white/10" />
      <div className="flex flex-col justify-center px-5 py-4">
        <p className="text-[0.8rem] text-white/50" suppressHydrationWarning>
          {now ? fmt.day.format(now) : "\u00A0"}
        </p>
        <p className="mt-1.5 text-[0.95rem] text-white/85">
          {wx ? (
            <>
              <span className="num">{Math.round(wx.t)}°C</span>
              {cond && <span className="text-white/55"> · {cond}</span>}
            </>
          ) : (
            <span className="text-white/55">{ar ? "توقيت قطر (UTC+3)" : "Arabia Standard Time (UTC+3)"}</span>
          )}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ section */

/** Location text crossfade: the incoming block rises in after a beat; the outgoing one fades, then hides. */
function swap(on: boolean): CSSProperties {
  return on
    ? {
        opacity: 1,
        transform: "none",
        visibility: "visible",
        transition: "opacity 450ms cubic-bezier(0.16,1,0.3,1) 160ms, transform 600ms cubic-bezier(0.16,1,0.3,1) 160ms, visibility 0s",
      }
    : {
        opacity: 0,
        transform: "translateY(8px)",
        visibility: "hidden",
        transition: "opacity 220ms ease-out, transform 0s linear 220ms, visibility 0s linear 220ms",
      };
}

export function Footprint({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const reduce = useSafeReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const [active, setActive] = useState(0);
  const [run, setRun] = useState(0);
    // The tour runs on its own until the visitor picks a location; then it stays on their choice. (It no longer
  // pauses on hover: the map is large, so a cursor resting on it while scrolling used to freeze the tour.)
  const [stopped, setStopped] = useState(false);
  const [wx, setWx] = useState<Record<string, Now | null> | null>(null);
  const [wxDone, setWxDone] = useState(false);
  const fetched = useRef(false);
  const cur = sites[active];
  const auto = !reduce && !stopped;
  const running = auto && inView;
  const playState = { animationPlayState: running ? "running" : "paused" } as const;
  const select = useCallback((i: number) => {
    setActive(i);
    setRun((r) => r + 1);
    setStopped(true);
  }, []);
  const next = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setActive((a) => (a + 1) % sites.length);
    setRun((r) => r + 1);
  }, []);

  // Live conditions are fetched once, when the section first comes into view.
  useEffect(() => {
    if (!inView || fetched.current) return;
    fetched.current = true;
    fetch("/api/conditions")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j?.ok && setWx(j.sites))
      .catch(() => {})
      .finally(() => setWxDone(true));
  }, [inView]);

  const dist = useMemo(() => Object.fromEntries(sites.map((s) => [s.id, Math.round(km(siteGeo[HQ], siteGeo[s.id]))])), []);
  const distLabel = (id: string) =>
    id === HQ ? (ar ? "المقر الرئيسي للمجموعة" : "Group headquarters") : ar ? `${dist[id]} كم من المقر الرئيسي` : `${dist[id]} km from Group HQ`;

  const curWx = wx?.[cur.id] ?? null;

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink-900 py-24 text-white md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-[0.95rem] font-medium text-leaf-300">{ar ? "حضورنا في قطر" : "On the ground in Qatar"}</p>
            <h2 className="mt-4 text-balance font-display text-display-lg font-normal">{ar ? "أين نعمل" : "Where we work"}</h2>
            <p className="mt-6 max-w-xl text-pretty text-[1.05rem] leading-relaxed text-white/65">
              {ar
                ? "مقرنا في الدوحة، ومراكز الخدمة والمرافق والفرق الميدانية في المدن الصناعية وحقول الإنتاج."
                : "Headquartered in Doha, with service centres, facilities and site teams in the industrial cities and production fields."}
            </p>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <DohaClock locale={locale} now={wx?.[HQ] ?? null} />
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          {/* ---------------- map */}
          <div className="lg:col-span-7">
            <MapPanel locale={locale} activeId={cur.id} onSelect={(id) => select(sites.findIndex((s) => s.id === id))} running={inView && !reduce} />
          </div>

          {/* ---------------- location card */}
          <div className="lg:col-span-5">
            <div className="flex h-full flex-col overflow-hidden rounded-[2px] border border-white/10 bg-white/[0.03]">
              <div className="relative aspect-[16/10] overflow-hidden bg-ink-800">
                {sites.map((s) => {
                  const on = s.id === cur.id;
                  return (
                    <Image
                      key={s.id}
                      src={siteGeo[s.id].image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className={cn(
                        "object-cover transition-[opacity,transform] duration-1200 ease-out-expo",
                        on ? "scale-100 opacity-100" : "scale-[1.06] opacity-0",
                      )}
                    />
                  );
                })}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/10 to-ink-900/30" />
                {curWx && (
                  <div className="absolute start-4 top-4 inline-flex items-center gap-2 rounded-[2px] bg-ink-900/70 px-3 py-1.5 text-[0.8rem] text-white/90 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
                    {ar ? "الآن" : "Now"}
                    <span className="num font-medium text-white">{Math.round(curWx.t)}°C</span>
                    {sky(curWx.symbol, ar) && <span className="text-white/60">{sky(curWx.symbol, ar)}</span>}
                  </div>
                )}
                <p dir="ltr" className="num absolute bottom-4 start-5 font-mono text-[0.74rem] tracking-wide text-white/75 rtl:end-5 rtl:start-auto">
                  {coords(cur.id)}
                </p>
              </div>

              {/* Every location's text shares one grid cell, so the card keeps the tallest height and the tabs below
                  never jump as the tour moves on (or when the live conditions arrive). */}
              <div className="grid flex-1 p-6 md:p-8">
                {sites.map((s) => {
                  const on = s.id === cur.id;
                  const sWx = wx?.[s.id] ?? null;
                  return (
                    <div key={s.id} aria-hidden={!on} className="col-start-1 row-start-1 flex flex-col" style={swap(on)}>
                      <p className="text-[0.88rem] text-leaf-300">{distLabel(s.id)}</p>
                      <h3 className="mt-2 font-display text-[1.75rem] leading-tight md:text-[2rem]">{s.name[locale]}</h3>
                      <ul className="mt-5 space-y-3">
                        {(siteDetails[s.id] ?? []).map((d) => (
                          <li key={d.text.en} className="flex items-start gap-3 text-[0.95rem] leading-snug text-white/75">
                            <span aria-hidden className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: DOT[d.company] }} />
                            <span>
                              {d.text[locale]}
                              <span className="text-white/40"> · {companyLabels[d.company]?.[locale]}</span>
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Space is reserved while the conditions load; dropped only if the service is unavailable. */}
                      {(sWx || !wxDone) && (
                        <dl className={cn("mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-5", !sWx && "invisible")}>
                          <div>
                            <dt className="text-[0.78rem] text-white/45">{ar ? "الحرارة" : "Temperature"}</dt>
                            <dd className="num mt-1 text-[0.98rem]">{sWx ? `${sWx.t.toFixed(1)}°C` : "-"}</dd>
                          </div>
                          <div>
                            <dt className="text-[0.78rem] text-white/45">{ar ? "الرياح" : "Wind"}</dt>
                            <dd className="mt-1 text-[0.98rem]">
                              <span className="num">{sWx ? Math.round(sWx.wind * 3.6) : "-"}</span> {ar ? "كم/س" : "km/h"}{" "}
                              <span className="text-white/55">{sWx ? compass(sWx.dir, locale) : ""}</span>
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[0.78rem] text-white/45">{ar ? "الرطوبة" : "Humidity"}</dt>
                            <dd className="num mt-1 text-[0.98rem]">{sWx ? `${Math.round(sWx.rh)}%` : "-"}</dd>
                          </div>
                        </dl>
                      )}

                      <div className="mt-auto flex flex-wrap items-center gap-x-7 gap-y-4 pt-7">
                        {s.companies
                          .filter((c): c is CompanyId => c !== "holding")
                          .sort((a, b) => companyRank(a) - companyRank(b))
                          .map((c) => (
                            <CompanyLogo key={c} id={c} locale={locale} tone="white" size={30} className="opacity-90" />
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- location tabs with the tour's progress */}
        <div
          role="tablist"
          aria-label={ar ? "مواقع المجموعة" : "Group locations"}
          className="no-scrollbar mt-6 grid auto-cols-[minmax(9.5rem,1fr)] grid-flow-col overflow-x-auto border-t border-white/10 lg:auto-cols-fr"
        >
          {sites.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => select(i)}
                className="group relative pe-4 pt-5 text-start"
              >
                <span aria-hidden className="absolute inset-x-0 -top-px h-[2px] overflow-hidden">
                  {on && (
                    <span
                      key={run}
                      className={cn("absolute inset-0 origin-left bg-leaf rtl:origin-right", auto && "animate-[heroprogress_7s_linear_forwards]")}
                      style={auto ? playState : { transform: "scaleX(1)" }}
                      onAnimationEnd={auto ? next : undefined}
                    />
                  )}
                </span>
                <span className={cn("block font-display text-[1.08rem] leading-tight transition-colors", on ? "text-white" : "text-white/45 group-hover:text-white/80")}>
                  {shortName(s.name[locale])}
                </span>
                <span className="mt-1 block text-[0.8rem] text-white/40">
                  {s.id === HQ ? (ar ? "المقر الرئيسي" : "Group HQ") : ar ? `${dist[s.id]} كم` : `${dist[s.id]} km`}
                </span>
              </button>
            );
          })}
        </div>

        {(wx || !wxDone) && (
          <p className={cn("mt-8 text-[0.78rem] text-white/35", !wx && "invisible")}>
            {ar ? "الأحوال الجوية: " : "Local conditions: "}
            <a href="https://www.met.no/en" target="_blank" rel="noreferrer" className="underline decoration-white/20 underline-offset-2 hover:text-white/60">
              MET Norway
            </a>
            {ar ? "، تُحدَّث كل 30 دقيقة. المسافات خطوط مستقيمة من المقر الرئيسي." : ", refreshed every 30 minutes. Distances are straight-line from Group HQ."}
          </p>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ map */

function MapPanel({
  locale,
  activeId,
  onSelect,
  running,
}: {
  locale: Locale;
  activeId: string;
  onSelect: (id: string) => void;
  running: boolean;
}) {
  const hq = SITE_POINTS[HQ];
  const [ax, ay] = SITE_POINTS[activeId];
  const zoom = activeId === HQ ? 1 : 1.1;
  const markScale = 24 / 128;
  const flowState = { animationPlayState: running ? "running" : "paused" } as const;

  return (
    <div className="relative h-[460px] overflow-hidden rounded-[2px] border border-white/10 bg-[radial-gradient(120%_85%_at_68%_48%,#12224F_0%,#0A1638_45%,#060D22_100%)] md:h-[640px]">
      <div className="absolute inset-0 py-7 md:py-9">
        <div className="relative mx-auto h-full max-w-full" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
          <div
            className="absolute inset-0 transition-transform duration-1200 ease-out-expo"
            style={{ transform: `scale(${zoom})`, transformOrigin: `${(ax / VB_W) * 100}% ${(ay / VB_H) * 100}%` }}
          >
            <svg viewBox={QATAR_VIEWBOX} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
              <defs>
                <pattern id="fp-dots" width="5.2" height="5.2" patternUnits="userSpaceOnUse">
                  <circle cx="2.6" cy="2.6" r="0.95" fill="white" fillOpacity="0.26" />
                </pattern>
                <radialGradient id="fp-glow">
                  <stop offset="0%" stopColor={LEAF} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={LEAF} stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Graticule */}
              <g stroke="white" strokeOpacity="0.07" strokeWidth="0.6" strokeDasharray="2 4" vectorEffect="non-scaling-stroke">
                {[25, 25.5, 26].map((lat) => (
                  <line key={lat} x1={-500} x2={836} y1={yOfLat(lat)} y2={yOfLat(lat)} />
                ))}
                {[51, 51.5].map((lon) => (
                  <line key={lon} y1={-300} y2={940} x1={xOfLon(lon)} x2={xOfLon(lon)} />
                ))}
              </g>
              <g className="font-mono max-md:hidden" fill="white" fillOpacity="0.32" fontSize="8.5">
                {[25, 25.5, 26].map((lat) => (
                  <text key={lat} x={348} y={yOfLat(lat) - 3}>
                    {lat.toFixed(1)}°N
                  </text>
                ))}
                {[51, 51.5].map((lon) => (
                  <text key={lon} x={xOfLon(lon) + 4} y={6}>
                    {lon.toFixed(1)}°E
                  </text>
                ))}
              </g>

              {/* Land: dot matrix + coastline drawing itself */}
              <path d={QATAR_PATH} fill="white" fillOpacity="0.025" />
              <path d={QATAR_PATH} fill="url(#fp-dots)" />
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

              {/* North arrow + 20 km scale */}
              <g className="max-md:hidden" stroke="white" strokeOpacity="0.4" fill="none" strokeWidth="0.8">
                <path d="M18 44 L18 22 M14 28 L18 22 L22 28" />
                <path d={`M6 628 H${6 + KM20} M6 624 V632 M${6 + KM20} 624 V632`} />
              </g>
              <g className="font-mono max-md:hidden" fill="white" fillOpacity="0.45" fontSize="8.5">
                <text x="18" y="15" textAnchor="middle">
                  N
                </text>
                <text x={6 + KM20 / 2} y="620" textAnchor="middle">
                  20 km
                </text>
              </g>

              {/* Routes from HQ, with live pulses */}
              {sites
                .filter((s) => s.id !== HQ)
                .map((s, i) => {
                  const d = route(hq, SITE_POINTS[s.id]);
                  const on = s.id === activeId;
                  return (
                    <g key={s.id}>
                      <path
                        d={d}
                        fill="none"
                        stroke={on ? LEAF : "white"}
                        strokeOpacity={on ? 0.8 : 0.3}
                        strokeWidth={on ? 1.3 : 0.8}
                        strokeDasharray={on ? undefined : "1.5 3"}
                        className="transition-[stroke,stroke-opacity] duration-500"
                      />
                      <path
                        d={d}
                        pathLength={1}
                        fill="none"
                        stroke={on ? "#FFFFFF" : LEAF}
                        strokeOpacity={on ? 1 : 0.85}
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

              {/* HQ: a slow sonar ring */}
              <circle
                cx={hq[0]}
                cy={hq[1]}
                r={16}
                fill="none"
                stroke={LEAF}
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

              {/* Locations */}
              {sites.map((s) => {
                const [x, y] = SITE_POINTS[s.id];
                const on = s.id === activeId;
                return (
                  <g key={s.id} className="cursor-pointer" onClick={() => onSelect(s.id)}>
                    <circle cx={x} cy={y} r={34} fill="url(#fp-glow)" className="transition-opacity duration-700" opacity={on ? 1 : 0} />
                    {on && s.id !== HQ && (
                      <circle
                        cx={x}
                        cy={y}
                        r={5}
                        fill="none"
                        stroke={LEAF}
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
                    {s.id !== HQ && (
                      <circle
                        cx={x}
                        cy={y}
                        r={on ? 4.6 : 3.2}
                        fill={on ? LEAF : "white"}
                        stroke="#060D22"
                        strokeWidth={1.4}
                        className="transition-all duration-500"
                      />
                    )}
                    <circle cx={x} cy={y} r={16} fill="transparent" />
                  </g>
                );
              })}

              {/* HQ is marked with the Al-Ahed mark itself, its open bowl centred on Doha */}
              <g
                transform={`translate(${(hq[0] - BOWL.x * markScale).toFixed(2)} ${(hq[1] - BOWL.y * markScale).toFixed(2)}) scale(${markScale})`}
                className="cursor-pointer"
                onClick={() => onSelect(HQ)}
              >
                {BANDS.map((b, i) => (
                  <path key={b.d} d={b.d} fill={MARK_TONES.light[i]} />
                ))}
              </g>
              <circle cx={hq[0]} cy={hq[1]} r={2.4} fill="white" />
            </svg>

            {/* Labels */}
            {sites.map((s) => {
              const [x, y] = SITE_POINTS[s.id];
              const on = s.id === activeId;
              const right = LABEL_SIDE[s.id] === "right";
              return (
                <button
                  type="button"
                  key={s.id}
                  tabIndex={-1}
                  onClick={() => onSelect(s.id)}
                  className={cn(
                    "absolute whitespace-nowrap rounded-[2px] px-2 py-1 text-[0.72rem] transition-colors duration-300 md:text-[0.8rem]",
                    on ? "bg-white text-ink shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)]" : "text-white/65 hover:text-white",
                  )}
                  style={{
                    top: `${(y / VB_H) * 100}%`,
                    ...(right
                      ? { left: `calc(${(x / VB_W) * 100}% + ${s.id === HQ ? 18 : 11}px)` }
                      : { right: `calc(${100 - (x / VB_W) * 100}% + 11px)` }),
                    transform: "translateY(-50%)",
                  }}
                >
                  {shortName(s.name[locale])}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
