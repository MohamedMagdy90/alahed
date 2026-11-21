"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/motion";
import { Em, SectionHeading, Tag } from "@/components/site/primitives";
import { capabilities, companyLabels, sectors } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

const IMAGES: Record<string, string> = {
  brands: "/images/refinery-pipes.jpg",
  epic: "/images/wellhead-dukhan.jpg",
  shutdown: "/images/refinery-towers.jpg",
  service: "/images/fabrication.jpg",
  manpower: "/images/workforce.jpg",
  ndt: "/images/offshore.jpg",
};

const ACCENT: Record<string, string> = { aatc: "#5DB543", dopet: "#E0322F", pemco: "#2D62C4" };

export function Capabilities({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const [active, setActive] = useState(0);
  const cur = capabilities[active];

  return (
    <section className="bg-pearl-50 py-24 md:py-32">
      <div className="container">
        <SectionHeading
          index="04"
          eyebrow={ar ? "ما نقدّمه" : "What we do"}
          title={
            ar ? (
              <>
                قدرات تغطي <Em className="text-brand">دورة حياة الأصول.</Em>
              </>
            ) : (
              <>
                Capabilities across the <Em className="text-brand">asset life cycle.</Em>
              </>
            )
          }
          intro={
            ar
              ? "ست قدرات أساسية تقدّمها شركات المجموعة بشكل منفرد أو كحل متكامل للمشغّلين والمقاولين."
              : "Six core capabilities, delivered by our companies individually or as an integrated solution for operators and contractors."
          }
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-32">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-ink">
                <AnimatePresence mode="sync" initial={false}>
                  <motion.div
                    key={cur.id}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <Image src={IMAGES[cur.id]} alt="" fill sizes="40vw" className="object-cover" />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-8 text-white">
                  <div>
                    <p className="num font-mono text-[0.7rem] text-white/60">
                      {String(active + 1).padStart(2, "0")} / {String(capabilities.length).padStart(2, "0")}
                    </p>
                    <p className="mt-2 font-display text-2xl">{cur.title[locale]}</p>
                  </div>
                  <span
                    className="inline-flex h-7 items-center gap-2 rounded-full bg-white/10 px-3 font-mono text-[0.66rem] uppercase tracking-[0.12em] backdrop-blur rtl:font-arabic rtl:text-[0.75rem] rtl:normal-case rtl:tracking-normal"
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT[cur.company] }} />
                    {companyLabels[cur.company][locale]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <ol className="border-t border-ink/10 lg:col-span-7">
            {capabilities.map((c, i) => {
              const on = i === active;
              return (
                <li key={c.id} className="border-b border-ink/10">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-expanded={on}
                    className="group grid w-full grid-cols-[2.5rem_1fr] items-start gap-4 py-7 text-start md:grid-cols-[3.5rem_1fr_auto] md:gap-6 md:py-8"
                  >
                    <span className={cn("num pt-2 font-mono text-xs transition-colors", on ? "text-leaf-700" : "text-haze-300")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block font-display text-[clamp(1.4rem,2.2vw,2rem)] leading-tight transition-colors duration-500",
                          on ? "text-ink" : "text-ink/35 group-hover:text-ink/60",
                        )}
                      >
                        {c.title[locale]}
                      </span>
                      <span
                        className={cn(
                          "grid transition-[grid-template-rows] duration-700 ease-out-expo",
                          on ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                        )}
                      >
                        <span className="overflow-hidden">
                          <span className="block max-w-lg pt-3 text-[0.98rem] leading-relaxed text-haze">{c.body[locale]}</span>
                          <span className="relative mt-5 block aspect-[16/9] overflow-hidden rounded-[2px] lg:hidden">
                            <Image src={IMAGES[c.id]} alt="" fill sizes="100vw" className="object-cover" />
                          </span>
                        </span>
                      </span>
                    </span>
                    <span className="col-start-2 md:col-start-auto md:pt-2">
                      <Tag className={cn("transition-opacity", on ? "opacity-100" : "opacity-60")}>
                        <span className="me-2 h-1.5 w-1.5 rounded-full" style={{ background: ACCENT[c.company] }} />
                        {companyLabels[c.company][locale]}
                      </Tag>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <Reveal className="mt-16 flex flex-col gap-5 border-t border-ink/10 pt-10 md:flex-row md:items-center md:gap-10">
          <p className="eyebrow shrink-0 text-haze">{ar ? "القطاعات التي نخدمها" : "Sectors we serve"}</p>
          <ul className="flex flex-wrap gap-2">
            {sectors.map((s) => (
              <li key={s.en}>
                <span className="inline-flex h-10 items-center rounded-full border border-ink/10 bg-white px-5 text-[0.9rem] text-ink/80">
                  {s[locale]}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
