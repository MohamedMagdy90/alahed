"use client";

import { useInView } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSafeReducedMotion } from "@/components/motion";
import { LogoMark } from "@/components/site/LogoMark";
import { clients, companies } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

const ROW = 46; // px per manufacturer row (desktop)
const IN = "#3F9A2C"; // leaf-600: flows into the Group
const OUT = "#1F4FA8"; // brand: flows out to operators

type Side = "in" | "out";
type Geo = { w: number; h: number; hub: { x: number; y: number; r: number }; in: string[]; out: string[]; inPts: [number, number][]; outPts: [number, number][] };

// Deterministic timing so server, client and every visit look the same.
const dur = (i: number, side: Side) => `${(side === "in" ? 3.6 : 3.1) + ((i * 37) % 17) / 10}s`;
const delay = (i: number) => `${-(((i * 53) % 29) / 10)}s`;

export function Partners({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const principals = companies.find((c) => c.id === "aatc")?.partners ?? [];
  const reduce = useSafeReducedMotion();

  const wrap = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const inRefs = useRef<(HTMLLIElement | null)[]>([]);
  const outRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [geo, setGeo] = useState<Geo | null>(null);
  const inView = useInView(wrap, { amount: 0.2 });
  const [hl, setHl] = useState<{ side: Side; i: number } | null>(null);
  const [pointer, setPointer] = useState(false);

  const measure = useCallback(() => {
    const box = wrap.current?.getBoundingClientRect();
    const hb = hubRef.current?.getBoundingClientRect();
    if (!box || !hb || box.width === 0) return;
    const hub = { x: hb.left - box.left + hb.width / 2, y: hb.top - box.top + hb.height / 2, r: hb.width / 2 };
    const ring = hub.r + 16;

    const build = (els: (HTMLLIElement | null)[], side: Side) => {
      const n = els.length;
      const paths: string[] = [];
      const pts: [number, number][] = [];
      els.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cy = r.top - box.top + r.height / 2;
        const leftOfHub = r.left + r.width / 2 - box.left < hub.x;
        const ax = leftOfHub ? r.right - box.left + 12 : r.left - box.left - 12;
        const hx = hub.x + (leftOfHub ? -ring : ring);
        const hy = hub.y + (n > 1 ? (i / (n - 1) - 0.5) : 0) * hub.r * 1.15;
        const c1 = ax + (hx - ax) * 0.55;
        const c2 = hx - (hx - ax) * 0.45;
        // Into the Group: label → hub. Out to operators: hub → label. Pulses travel along the path direction.
        paths.push(
          side === "in"
            ? `M${ax.toFixed(1)} ${cy.toFixed(1)}C${c1.toFixed(1)} ${cy.toFixed(1)} ${c2.toFixed(1)} ${hy.toFixed(1)} ${hx.toFixed(1)} ${hy.toFixed(1)}`
            : `M${hx.toFixed(1)} ${hy.toFixed(1)}C${c2.toFixed(1)} ${hy.toFixed(1)} ${c1.toFixed(1)} ${cy.toFixed(1)} ${ax.toFixed(1)} ${cy.toFixed(1)}`,
        );
        pts.push([ax, cy]);
      });
      return { paths, pts };
    };
    const a = build(inRefs.current, "in");
    const b = build(outRefs.current, "out");
    setGeo({ w: box.width, h: box.height, hub, in: a.paths, out: b.paths, inPts: a.pts, outPts: b.pts });
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (wrap.current) ro.observe(wrap.current);
    document.fonts?.ready.then(() => measure()).catch(() => {});
    return () => ro.disconnect();
  }, [measure]);

  // When nobody is pointing, the diagram quietly traces one connection at a time, alternating sides.
  useEffect(() => {
    if (!inView || pointer || reduce) return;
    let k = 0;
    const tick = () => {
      const side: Side = k % 2 === 0 ? "in" : "out";
      const n = side === "in" ? principals.length : clients.length;
      setHl({ side, i: (k * 5 + 2) % n });
      k += 1;
    };
    tick();
    const id = window.setInterval(tick, 1900);
    return () => window.clearInterval(id);
  }, [inView, pointer, reduce, principals.length]);

  const running = inView && !reduce;
  const isOn = (side: Side, i: number) => hl?.side === side && hl.i === i;

  const header = (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
      <h2 className="text-balance font-display text-display-lg font-normal text-ink lg:col-span-7">
        {ar ? "من كبرى الشركات المصنّعة في العالم إلى مشغّلي الطاقة في قطر" : "From the world’s manufacturers to Qatar’s operators"}
      </h2>
      <p className="max-w-xl text-pretty text-[1.05rem] leading-relaxed text-haze lg:col-span-5">
        {ar
          ? `تمثّل العهد للتجارة والمقاولات ${principals.length} شركة مصنّعة عالمية في قطر، وتخدم شركات المجموعة الثلاث كبرى المشغّلين والحقول في الدولة.`
          : `Al-Ahed T&C represents ${principals.length} international manufacturers in Qatar, and the Group’s three companies serve the country’s major operators and fields.`}
      </p>
    </div>
  );

  const colTitle = (t: string, sub: string, align: "end" | "start") => (
    <div className={cn("pb-6", align === "end" ? "text-end lg:pe-7" : "text-start lg:ps-7")}>
      <p className="font-display text-[1.15rem] text-ink">{t}</p>
      <p className="mt-1 text-[0.85rem] text-haze">{sub}</p>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-pearl-50 py-24 md:py-32">
      <div className="container">
        {header}

        {/* ------------------------------------------------ desktop: live network */}
        <div className="mt-16 hidden lg:block" onPointerEnter={() => setPointer(true)} onPointerLeave={() => setPointer(false)}>
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)]">
            {colTitle(ar ? "شركات مصنّعة نمثّلها" : "Manufacturers we represent", ar ? "عبر العهد للتجارة والمقاولات" : "Through Al-Ahed T&C", "end")}
            <div />
            {colTitle(ar ? "لمن نعمل" : "Who we work for", ar ? "المشغّلون والحقول" : "Operators and fields", "start")}
          </div>

          <div ref={wrap} className="relative grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)] border-t border-ink/10 pt-6">
            {/* curves */}
            {geo && (
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                viewBox={`0 0 ${geo.w} ${geo.h}`}
                aria-hidden
              >
                <circle
                  cx={geo.hub.x}
                  cy={geo.hub.y}
                  r={geo.hub.r + 16}
                  fill="none"
                  stroke="#0A1430"
                  strokeOpacity={0.12}
                  strokeDasharray="2 6"
                  className="animate-spin-slower"
                  style={{ transformBox: "fill-box", transformOrigin: "center", animationPlayState: running ? "running" : "paused" }}
                />
                {(["in", "out"] as const).map((side) =>
                  geo[side].map((d, i) => {
                    const on = isOn(side, i);
                    const col = side === "in" ? IN : OUT;
                    const [px, py] = side === "in" ? geo.inPts[i] : geo.outPts[i];
                    return (
                      <g key={`${side}${d}`}>
                        <path
                          d={d}
                          fill="none"
                          stroke={on ? col : "#0A1430"}
                          strokeOpacity={on ? 0.85 : 0.1}
                          strokeWidth={on ? 1.6 : 1}
                          className="transition-[stroke,stroke-opacity,stroke-width] duration-500"
                        />
                        <path
                          d={d}
                          pathLength={1}
                          fill="none"
                          stroke={col}
                          strokeWidth={on ? 3 : 2.2}
                          strokeLinecap="round"
                          strokeDasharray="0.07 1.43"
                          strokeOpacity={on ? 1 : 0.7}
                          style={{
                            strokeDashoffset: 0.07,
                            animationName: "flow",
                            animationDuration: on ? "1.6s" : dur(i, side),
                            animationTimingFunction: "linear",
                            animationIterationCount: "infinite",
                            animationDelay: delay(i),
                            animationPlayState: running ? "running" : "paused",
                          }}
                        />
                        <circle cx={px} cy={py} r={on ? 3.6 : 2.4} fill={on ? col : "#0A1430"} fillOpacity={on ? 1 : 0.25} className="transition-all duration-300" />
                      </g>
                    );
                  }),
                )}
              </svg>
            )}

            {/* manufacturers */}
            <ul style={{ height: principals.length * ROW }}>
              {principals.map((n, i) => (
                <li
                  key={n}
                  ref={(el) => {
                    inRefs.current[i] = el;
                  }}
                  onPointerEnter={() => setHl({ side: "in", i })}
                  className="flex items-center justify-end pe-7 text-end"
                  style={{ height: ROW }}
                >
                  <span
                    dir="ltr"
                    className={cn(
                      "font-display text-[1.08rem] leading-none transition-colors duration-300 xl:text-[1.14rem]",
                      isOn("in", i) ? "text-ink" : "text-ink/55",
                    )}
                  >
                    {n}
                  </span>
                </li>
              ))}
            </ul>

            {/* hub */}
            <div className="relative flex items-center justify-center">
              <div ref={hubRef} className="relative aspect-square w-[46%] max-w-[250px]">
                <LogoMark className="h-full w-full" tone="brand" glint paused={!running} title={ar ? "شعار العهد القابضة" : "Al-Ahed Holding mark"} />
                <div className="absolute inset-x-[-60%] top-full mt-10 text-center">
                  <p className="font-display text-[1.2rem] text-ink">{ar ? "العهد القابضة" : "Al-Ahed Holding"}</p>
                  <p className="mt-1 text-[0.85rem] text-haze">{ar ? "العهد للتجارة والمقاولات · دوبت · بمكو" : "Al-Ahed T&C · DOPET · PEMCO"}</p>
                </div>
              </div>
            </div>

            {/* operators */}
            <ul className="flex flex-col justify-around" style={{ height: principals.length * ROW }}>
              {clients.map((n, i) => (
                <li
                  key={n}
                  ref={(el) => {
                    outRefs.current[i] = el;
                  }}
                  onPointerEnter={() => setHl({ side: "out", i })}
                  className="flex items-center ps-7 text-start"
                  style={{ height: ROW }}
                >
                  <span
                    dir="ltr"
                    className={cn(
                      "font-display text-[1.2rem] leading-none transition-colors duration-300 xl:text-[1.3rem]",
                      isOn("out", i) ? "text-ink" : "text-ink/60",
                    )}
                  >
                    {n}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ------------------------------------------------ mobile / tablet: stacked flow */}
        <div className="mt-14 lg:hidden">
          {colTitle(ar ? "شركات مصنّعة نمثّلها" : "Manufacturers we represent", ar ? "عبر العهد للتجارة والمقاولات" : "Through Al-Ahed T&C", "start")}
          <ul className="grid grid-cols-2 gap-x-6 border-t border-ink/10 sm:grid-cols-3">
            {principals.map((n) => (
              <li key={n} className="border-b border-ink/10 py-3.5 font-display text-[1rem] text-ink/80">
                <span dir="ltr">{n}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-center py-4" aria-hidden>
            <FlowLine color={IN} running={!reduce} />
            <LogoMark className="my-3 h-24 w-24" tone="brand" glint paused={reduce} />
            <p className="font-display text-[1.05rem] text-ink">{ar ? "العهد القابضة" : "Al-Ahed Holding"}</p>
            <FlowLine color={OUT} running={!reduce} />
          </div>

          {colTitle(ar ? "لمن نعمل" : "Who we work for", ar ? "المشغّلون والحقول" : "Operators and fields", "start")}
          <ul className="grid grid-cols-2 gap-x-6 border-t border-ink/10 sm:grid-cols-3">
            {clients.map((n) => (
              <li key={n} className="border-b border-ink/10 py-3.5 font-display text-[1rem] text-ink/80">
                <span dir="ltr">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FlowLine({ color, running }: { color: string; running: boolean }) {
  return (
    <span className="relative my-2 block h-14 w-px overflow-hidden bg-ink/10">
      <span
        className="absolute inset-x-0 top-0 h-5"
        style={{
          background: `linear-gradient(to bottom, transparent, ${color})`,
          animation: running ? "scrollcue 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite" : undefined,
        }}
      />
    </span>
  );
}
