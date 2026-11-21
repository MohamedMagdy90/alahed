"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Reveal } from "@/components/motion";
import { Em, SectionHeading } from "@/components/site/primitives";
import { companyLabels, sites } from "@/content/site";
import { QATAR_PATH, QATAR_VIEWBOX, SITE_POINTS } from "@/content/qatar-map";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

const COORDS: Record<string, string> = {
  doha: "25.29° N · 51.53° E",
  salwa: "25.20° N · 51.43° E",
  raslaffan: "25.90° N · 51.54° E",
  mesaieed: "24.99° N · 51.55° E",
  dukhan: "25.42° N · 50.78° E",
};
const VB_W = 336;
const VB_H = 640;

export function Footprint({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const [active, setActive] = useState("doha");
  const hq = SITE_POINTS.doha;

  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="container">
        <SectionHeading
          index="05"
          eyebrow={ar ? "انتشارنا" : "Our footprint"}
          title={
            ar ? (
              <>
                حاضرون حيث <Em className="text-brand">تعمل الطاقة في قطر.</Em>
              </>
            ) : (
              <>
                Present wherever <Em className="text-brand">Qatar's energy works.</Em>
              </>
            )
          }
          intro={
            ar
              ? "من المقر الرئيسي في الدوحة إلى المدن الصناعية وحقول الإنتاج، تدعم ورشنا ومراكز خدمتنا وفرقنا الميدانية العمليات في أنحاء الدولة."
              : "From our Doha headquarters to the industrial cities and production fields, our workshops, service centres and site teams support operations across the country."
          }
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <ul className="order-2 border-t border-ink/10 lg:order-1 lg:col-span-5">
            {sites.map((s, i) => {
              const on = s.id === active;
              return (
                <li key={s.id} className="border-b border-ink/10">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(s.id)}
                    onFocus={() => setActive(s.id)}
                    onClick={() => setActive(s.id)}
                    className="group flex w-full items-start gap-5 py-6 text-start"
                  >
                    <span className={cn("num pt-1.5 font-mono text-xs", on ? "text-leaf-700" : "text-haze-300")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span className={cn("block font-display text-[1.4rem] leading-tight transition-colors", on ? "text-ink" : "text-ink/45 group-hover:text-ink/70")}>
                        {s.name[locale]}
                      </span>
                      <span className="mt-3 flex flex-wrap gap-1.5">
                        {s.companies.map((c) => (
                          <span
                            key={c}
                            className={cn(
                              "inline-flex h-6 items-center rounded-full border px-2.5 text-[0.75rem] transition-colors",
                              on ? "border-ink/15 text-ink/75" : "border-ink/10 text-ink/40",
                            )}
                          >
                            {companyLabels[c]?.[locale]}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "num hidden pt-2 font-mono text-[0.68rem] text-haze transition-opacity sm:block",
                        on ? "opacity-100" : "opacity-0",
                      )}
                      dir="ltr"
                    >
                      {COORDS[s.id]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <Reveal className="order-1 lg:order-2 lg:col-span-7">
            <div className="relative overflow-hidden rounded-[2px] bg-ink-900 text-white">
              <div
                className="absolute inset-0 opacity-[0.35]"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(45,98,196,0.35),transparent_60%)]" />

              <div className="relative flex items-center justify-between border-b border-white/10 px-6 py-4 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/50 rtl:font-arabic rtl:text-[0.78rem] rtl:normal-case rtl:tracking-normal">
                <span>{ar ? "دولة قطر" : "State of Qatar"}</span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
                  {ar ? "مواقع التشغيل" : "Operating locations"}
                </span>
              </div>

              <div className="relative mx-auto aspect-[336/640] h-[520px] max-w-full py-6 md:h-[620px]">
                <div className="relative h-full w-full">
                  <svg viewBox={QATAR_VIEWBOX} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
                    <defs>
                      <linearGradient id="qa-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1F4FA8" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#1F4FA8" stopOpacity="0.08" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d={QATAR_PATH}
                      fill="url(#qa-fill)"
                      stroke="rgba(255,255,255,0.55)"
                      strokeWidth={1.2}
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, fillOpacity: 0 }}
                      whileInView={{ pathLength: 1, fillOpacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 2.4, ease: [0.65, 0, 0.35, 1] }}
                    />
                    {/* Links from HQ */}
                    {sites
                      .filter((s) => s.id !== "doha")
                      .map((s) => {
                        const p = SITE_POINTS[s.id];
                        const on = s.id === active;
                        return (
                          <line
                            key={s.id}
                            x1={hq[0]}
                            y1={hq[1]}
                            x2={p[0]}
                            y2={p[1]}
                            stroke={on ? "#5DB543" : "rgba(255,255,255,0.22)"}
                            strokeWidth={on ? 1.4 : 0.8}
                            strokeDasharray="3 4"
                            className="transition-[stroke] duration-500"
                          />
                        );
                      })}
                    {sites.map((s) => {
                      const [x, y] = SITE_POINTS[s.id];
                      const on = s.id === active;
                      return (
                        <g key={s.id}>
                          {on && (
                            <circle cx={x} cy={y} r={6} fill="none" stroke="#5DB543" strokeWidth={1}>
                              <animate attributeName="r" values="6;20" dur="2s" repeatCount="indefinite" />
                              <animate attributeName="stroke-opacity" values="0.9;0" dur="2s" repeatCount="indefinite" />
                            </circle>
                          )}
                          <circle cx={x} cy={y} r={on ? 5.5 : 3.5} fill={on ? "#5DB543" : "#fff"} className="transition-all duration-300" />
                          {s.id === "doha" && <circle cx={x} cy={y} r={9} fill="none" stroke="#fff" strokeOpacity={0.5} />}
                        </g>
                      );
                    })}
                  </svg>

                  {sites.map((s) => {
                    const [x, y] = SITE_POINTS[s.id];
                    const on = s.id === active;
                    const left = x / VB_W < 0.5;
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onMouseEnter={() => setActive(s.id)}
                        onClick={() => setActive(s.id)}
                        className={cn(
                          "absolute whitespace-nowrap text-[0.78rem] transition-all duration-300",
                          on ? "text-white" : "text-white/55 hover:text-white",
                        )}
                        style={{
                          top: `${(y / VB_H) * 100}%`,
                          ...(left ? { left: `calc(${(x / VB_W) * 100}% + 14px)` } : { right: `calc(${100 - (x / VB_W) * 100}% + 14px)` }),
                          transform: "translateY(-50%)",
                        }}
                      >
                        <span className={cn("rounded-[2px] px-2 py-1", on && "bg-white/10 backdrop-blur")}>{s.name[locale].split(" — ")[0].split(" – ")[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative flex items-center justify-between border-t border-white/10 px-6 py-4 font-mono text-[0.68rem] text-white/45" dir="ltr">
                <span className="num">{COORDS[active]}</span>
                <span className="uppercase tracking-[0.14em]">N ↑</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
