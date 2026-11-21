"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { siteDetails } from "@/content/pages/home";
import { QATAR_PATH, QATAR_VIEWBOX, SITE_POINTS } from "@/content/qatar-map";
import { companyLabels, sites } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

const VB_W = 336;
const VB_H = 640;
const DOT: Record<string, string> = { holding: "#0A1430", aatc: "#5DB543", dopet: "#E0322F", pemco: "#2D62C4" };

export function Footprint({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const [active, setActive] = useState("doha");
  const hq = SITE_POINTS.doha;

  return (
    <section className="bg-pearl-50 py-24 md:py-32">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-balance font-display text-display-lg font-normal text-ink">{ar ? "أين نعمل" : "Where we work"}</h2>
            <p className="mt-6 max-w-md text-pretty text-[1.05rem] leading-relaxed text-haze">
              {ar
                ? "مقرنا في الدوحة، ومراكز الخدمة والمرافق والفرق الميدانية في المدن الصناعية وحقول الإنتاج."
                : "Headquartered in Doha, with service centres, facilities and site teams in the industrial cities and production fields."}
            </p>

            <ul className="mt-10 border-t border-ink/10">
              {sites.map((s) => {
                const on = s.id === active;
                const details = siteDetails[s.id] ?? [];
                return (
                  <li key={s.id} className="border-b border-ink/10">
                    <button
                      type="button"
                      onMouseEnter={() => setActive(s.id)}
                      onFocus={() => setActive(s.id)}
                      onClick={() => setActive(s.id)}
                      aria-expanded={on}
                      className="group w-full py-5 text-start"
                    >
                      <span className="flex items-center justify-between gap-4">
                        <span className={cn("font-display text-[1.35rem] leading-tight transition-colors", on ? "text-ink" : "text-ink/50 group-hover:text-ink/80")}>
                          {s.name[locale]}
                        </span>
                        <span className="flex shrink-0 gap-1.5" aria-hidden>
                          {s.companies.map((c) => (
                            <span key={c} className="h-2 w-2 rounded-full" style={{ background: DOT[c], opacity: on ? 1 : 0.35 }} />
                          ))}
                        </span>
                      </span>
                      <span className={cn("grid transition-[grid-template-rows] duration-500 ease-out-expo", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                        <span className="overflow-hidden">
                          <span className="block space-y-2 pt-4">
                            {details.map((d) => (
                              <span key={d.text.en} className="flex items-start gap-3 text-[0.94rem] leading-snug text-ink/75">
                                <span aria-hidden className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: DOT[d.company] }} />
                                <span>
                                  {d.text[locale]}
                                  <span className="text-haze"> · {companyLabels[d.company]?.[locale]}</span>
                                </span>
                              </span>
                            ))}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="relative rounded-[2px] border border-ink/10 bg-white">
              <div className="relative mx-auto aspect-[336/640] h-[540px] max-w-full py-8 md:h-[660px]">
                <div className="relative h-full w-full">
                  <svg viewBox={QATAR_VIEWBOX} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
                    <motion.path
                      d={QATAR_PATH}
                      fill="#F4F2EC"
                      stroke="rgba(10,20,48,0.45)"
                      strokeWidth={1}
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
                    />
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
                            stroke={on ? "#2E7A20" : "rgba(10,20,48,0.16)"}
                            strokeWidth={on ? 1.3 : 0.8}
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
                          <circle cx={x} cy={y} r={on ? 11 : 0} fill="#5DB543" fillOpacity={0.18} className="transition-all duration-500" />
                          <circle cx={x} cy={y} r={on ? 5 : 3.5} fill={on ? "#2E7A20" : "#0A1430"} className="transition-all duration-300" />
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
                        tabIndex={-1}
                        onMouseEnter={() => setActive(s.id)}
                        onClick={() => setActive(s.id)}
                        className={cn(
                          "absolute whitespace-nowrap rounded-[2px] px-2 py-1 text-[0.8rem] transition-colors duration-300",
                          on ? "bg-ink text-white" : "text-ink/60 hover:text-ink",
                        )}
                        style={{
                          top: `${(y / VB_H) * 100}%`,
                          ...(left ? { left: `calc(${(x / VB_W) * 100}% + 12px)` } : { right: `calc(${100 - (x / VB_W) * 100}% + 12px)` }),
                          transform: "translateY(-50%)",
                        }}
                      >
                        {s.name[locale].split(" — ")[0].split(" – ")[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink/10 px-6 py-4 text-[0.82rem] text-haze">
                {(["aatc", "dopet", "pemco"] as const).map((c) => (
                  <span key={c} className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: DOT[c] }} />
                    {companyLabels[c][locale]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
