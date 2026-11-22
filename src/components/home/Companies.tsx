"use client";

import Image from "next/image";
import { type KeyboardEvent, useRef, useState } from "react";
import { CompanyLogo } from "@/components/site/CompanyLogo";
import { TextLink } from "@/components/site/primitives";
import { companies } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import { cn } from "@/lib/utils";

export function Companies({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const fwd = ar ? "ArrowLeft" : "ArrowRight";
    const back = ar ? "ArrowRight" : "ArrowLeft";
    let i = active;
    if (e.key === fwd) i = (active + 1) % companies.length;
    else if (e.key === back) i = (active - 1 + companies.length) % companies.length;
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = companies.length - 1;
    else return;
    e.preventDefault();
    setActive(i);
    tabs.current[i]?.focus();
  };

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 className="text-balance font-display text-display-lg font-normal text-ink lg:col-span-6">
            {ar ? "شركات المجموعة" : "Our companies"}
          </h2>
          <p className="text-pretty text-[1.05rem] leading-relaxed text-haze lg:col-span-6 lg:ps-10">
            {ar
              ? "لكل شركة تخصصها الخاص. ومعًا تخدم الأصل طوال عمره: من المعدات التي يُبنى بها، إلى الأعمال التي تُنشئه وتصونه، وصولًا إلى الفحص الذي يضمن سلامته."
              : "Each company is a specialist in its own field. Together they serve an asset for its whole life: the equipment that goes into it, the work that builds and maintains it, and the inspection that keeps it safe."}
          </p>
        </div>

        <div role="tablist" aria-label={ar ? "شركات المجموعة" : "Group companies"} className="mt-14 grid grid-cols-3 border-b border-ink/10">
          {companies.map((c, i) => {
            const on = i === active;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`co-tab-${c.id}`}
                aria-selected={on}
                aria-controls={`co-panel-${c.id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={onKey}
                className="group relative flex min-h-[6.5rem] flex-col items-start justify-center gap-3 pe-4 text-start md:flex-row md:items-center md:justify-between md:pe-8"
              >
                <span className="flex h-12 items-center">
                  <CompanyLogo
                    id={c.id}
                    locale={locale}
                    size={40}
                    tone={on ? "color" : "ink"}
                    className={cn(!on && "group-hover:opacity-100 group-hover:[filter:none]", "max-md:!h-auto max-md:max-h-9 max-md:!w-auto max-md:max-w-[88%]")}
                  />
                </span>
                <span className={cn("text-[0.85rem] transition-colors", on ? "text-ink" : "text-haze")}>
                  {ar ? `منذ ${c.founded}` : `Since ${c.founded}`}
                </span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-px h-[2px] origin-left transition-transform duration-500 ease-out-expo rtl:origin-right"
                  style={{ background: c.accent, transform: on ? "scaleX(1)" : "scaleX(0)" }}
                />
              </button>
            );
          })}
        </div>

        {companies.map((c, i) => {
          const on = i === active;
          const principals = c.partners ?? [];
          const projects = c.projects?.[locale] ?? [];
          return (
            <div
              key={c.id}
              role="tabpanel"
              id={`co-panel-${c.id}`}
              aria-labelledby={`co-tab-${c.id}`}
              hidden={!on}
              data-vt-card
              className="pt-12 animate-in fade-in-0 duration-500"
            >
              <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
                <div className="lg:col-span-7">
                  <div data-vt="media" className="relative aspect-[16/11] overflow-hidden rounded-[2px] bg-pearl-100">
                    <Image
                      src={c.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="object-cover animate-in zoom-in-[1.03] duration-1000"
                    />
                  </div>
                </div>

                <div className="flex flex-col lg:col-span-5">
                  <h3 className="font-display text-display-md font-normal text-ink">{c.name[locale]}</h3>
                  <p className="mt-2 text-[0.9rem] text-haze">{c.legal[locale]}</p>
                  <p className="mt-6 text-pretty text-[1.02rem] leading-relaxed text-ink/75">{c.summary[locale]}</p>

                  <div className="mt-8 border-t border-ink/10 pt-6">
                    <p className="text-[0.88rem] font-medium text-ink">{ar ? "ما نقدّمه" : "What we do"}</p>
                    <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                      {c.services[locale].slice(0, 6).map((s) => (
                        <li key={s} className="flex items-start gap-2.5 text-[0.92rem] leading-snug text-ink/75">
                          <span aria-hidden className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full" style={{ background: c.accent }} />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {principals.length > 0 && (
                    <div className="mt-6 border-t border-ink/10 pt-6">
                      <p className="text-[0.88rem] font-medium text-ink">{ar ? "شركات مصنّعة نمثّلها" : "Manufacturers we represent"}</p>
                      <p className="mt-2 text-[0.92rem] leading-relaxed text-ink/75">
                        {principals.slice(0, 6).join(ar ? "، " : ", ")}
                        {principals.length > 6 && (ar ? ` و${principals.length - 6} شركات أخرى` : `, and ${principals.length - 6} more`)}
                      </p>
                    </div>
                  )}

                  {projects.length > 0 && (
                    <div className="mt-6 border-t border-ink/10 pt-6">
                      <p className="text-[0.88rem] font-medium text-ink">{ar ? "مشاريع مختارة" : "Selected projects"}</p>
                      <ul className="mt-3 space-y-2.5">
                        {projects.slice(0, 3).map((p) => (
                          <li key={p} className="text-[0.92rem] leading-snug text-ink/75">
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!principals.length && !projects.length && (
                    <div className="mt-6 border-t border-ink/10 pt-6">
                      <p className="text-[0.88rem] font-medium text-ink">{ar ? "الموقع" : "Based in"}</p>
                      <p className="mt-2 text-[0.92rem] text-ink/75">{c.facilities[locale].join(ar ? "، " : ", ")}</p>
                    </div>
                  )}

                  <div className="mt-auto flex flex-wrap gap-x-8 gap-y-3 pt-10">
                    <TextLink href={href(locale, `/companies/${c.slug}`)}>{ar ? "صفحة الشركة" : "Company page"}</TextLink>
                    {c.website && (
                      <TextLink href={c.website} external>
                        {c.website.replace(/^https?:\/\/(www\.)?/, "")}
                      </TextLink>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
