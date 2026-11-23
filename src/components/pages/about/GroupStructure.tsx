"use client";

import { m } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CompanyLogo } from "@/components/site/CompanyLogo";
import { Arrow } from "@/components/site/primitives";
import type { CompanyId } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export type StructureShareholder = { name: string; rep: string; stake: number };
export type StructureCompany = {
  id: CompanyId;
  href: string;
  name: string;
  tagline: string;
  founded: number;
  /** Short name of the group company it works within (DOPET S&T → DOPET). */
  within?: string;
  accent: string;
};

/*
 * Ownership chart: shareholders → Al-Ahed Holding → the operating companies.
 * Desktop (lg+): a structure chart. Connector positions come from the grid geometry so every line meets the centre
 * of its card: with N equal columns and a gap g, the outer column centres sit (50/N)% − g(N−1)/(2N) in from each
 * edge. Ownership stakes sit on the lines, as in legal structure charts.
 * Below lg (or for any other shareholder/company count): a tree with a rail on the start side and compact rows.
 */
const LINE = "bg-ink/25";
// 2 columns, gap-6 (1.5rem): outer centres 25% − 0.375rem in from each edge.
const PAIR_IN = "calc(25% - 0.375rem)";
const PAIR_FAR = "calc(75% + 0.375rem)";
// 4 columns, gap-6: outer centres 12.5% − 0.5625rem in from each edge.
const ROW_IN = "calc(12.5% - 0.5625rem)";
const EASE = [0.16, 1, 0.3, 1] as const;

const draw = (axis: "x" | "y", delay: number) => ({
  hide: axis === "y" ? { scaleY: 0 } : { scaleX: 0 },
  show: { ...(axis === "y" ? { scaleY: 1 } : { scaleX: 1 }), transition: { duration: 0.4, delay, ease: EASE } },
});
const appear = (delay: number) => ({
  hide: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.35, delay } },
});
const PILL =
  "num absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-ink/15 bg-white px-2.5 text-[0.75rem] leading-6 text-ink";

function HoldingCard({ ar, className }: { ar: boolean; className?: string }) {
  const roles = ar ? ["التوجيه الاستراتيجي", "الإشراف", "الاستثمار"] : ["Strategic direction", "Oversight", "Investment"];
  return (
    <div className={cn("relative overflow-hidden rounded-[2px] bg-ink-900 px-6 py-8 text-center text-white sm:px-8", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-leaf/60 to-transparent" />
      <Image
        src="/brand/alahed-holding.png"
        alt={ar ? "العهد القابضة" : "Al-Ahed Holding"}
        width={192}
        height={52}
        className="mx-auto h-auto w-44 [filter:brightness(0)_invert(1)] sm:w-48"
      />
      {/* One line from sm up; two clean lines on phones (no orphaned year). */}
      <p className="mt-5 text-[0.88rem] text-white/60">
        <span className="block sm:inline">{ar ? "شركة العهد القابضة ذ.م.م" : "Al-Ahed Holding W.L.L."}</span>
        <span aria-hidden className="hidden sm:inline">
          {" · "}
        </span>
        <span className="block sm:inline">{ar ? "الشركة الأم · تأسست عام 2018" : "Parent company · Est. 2018"}</span>
      </p>
      <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-1.5 border-t border-white/10 pt-5 text-[0.82rem] text-white/75">
        {roles.map((r) => (
          <li key={r} className="flex items-center gap-2">
            <span aria-hidden className="h-1 w-1 rounded-full bg-leaf-300" />
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CompanyCard({ c, locale }: { c: StructureCompany; locale: Locale }) {
  const ar = locale === "ar";
  return (
    <Link
      href={c.href}
      className="group relative flex h-full w-full flex-col rounded-[2px] border border-ink/10 bg-white p-6 transition-[border-color,box-shadow] duration-500 hover:border-ink/20 hover:shadow-[0_22px_44px_-28px_rgba(10,20,48,0.45)]"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-[0.2] transition-transform duration-700 ease-out-expo group-hover:scale-x-100 rtl:origin-right"
        style={{ background: c.accent }}
      />
      <span className="flex h-14 items-center justify-between gap-4">
        <CompanyLogo id={c.id} locale={locale} size={38} decorative />
        <span className="num shrink-0 text-[0.8rem] text-haze">{ar ? `منذ ${c.founded}` : `Est. ${c.founded}`}</span>
      </span>
      <span className="mt-6 font-display text-[1.2rem] leading-snug text-ink">{c.name}</span>
      <span className="mt-2 text-pretty text-[0.9rem] leading-relaxed text-haze">{c.tagline}</span>
      {c.within && <span className="mt-3 text-[0.82rem] text-ink/60">{ar ? `تعمل ضمن ${c.within}` : `Works within ${c.within}`}</span>}
      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[0.88rem] font-medium text-ink">
        <span className="link-underline">{ar ? "استكشف الشركة" : "Explore the company"}</span>
        <Arrow className="text-leaf-700" />
      </span>
    </Link>
  );
}

export function GroupStructure({
  locale,
  shareholders,
  companies,
}: {
  locale: Locale;
  shareholders: StructureShareholder[];
  companies: StructureCompany[];
}) {
  const ar = locale === "ar";
  const chart = shareholders.length === 2 && companies.length === 4;
  return (
    <div>
      {/* ---------- lg+: structure chart ---------- */}
      {chart && (
        <m.div initial="hide" whileInView="show" viewport={{ once: true, margin: "0px 0px -15% 0px" }} className="hidden lg:block">
          <p className="text-center text-[0.85rem] text-haze">{ar ? "المساهمون" : "Shareholders"}</p>
          <div className="mx-auto mt-5 max-w-[54rem]">
            <ul className="grid grid-cols-2 gap-6">
              {shareholders.map((s) => (
                <li key={s.name} className="rounded-[2px] border border-ink/10 bg-pearl-50 px-7 py-6 text-center">
                  <p className="text-balance font-display text-[1.15rem] leading-snug text-ink">{s.name}</p>
                  <p className="mt-1.5 text-[0.88rem] text-haze">{s.rep}</p>
                </li>
              ))}
            </ul>
            {/* Each shareholder drops to a joint; the joint feeds the holding company. */}
            <div className="relative h-24">
              <m.span aria-hidden variants={draw("y", 0)} className={cn("absolute top-0 h-12 w-px origin-top", LINE)} style={{ left: PAIR_IN }} />
              <m.span aria-hidden variants={draw("y", 0)} className={cn("absolute top-0 h-12 w-px origin-top", LINE)} style={{ left: PAIR_FAR }} />
              <m.span aria-hidden variants={draw("x", 0.25)} className={cn("absolute top-12 h-px", LINE)} style={{ left: PAIR_IN, right: PAIR_IN }} />
              <m.span aria-hidden variants={draw("y", 0.45)} className={cn("absolute bottom-0 left-1/2 top-12 w-px origin-top", LINE)} />
              {shareholders.map((s, i) => (
                // The grid follows the reading direction, so in Arabic the first shareholder is on the right.
                <m.span key={s.name} variants={appear(0.3)} className={cn(PILL, "top-6")} style={{ left: (i === 0) !== ar ? PAIR_IN : PAIR_FAR }}>
                  {s.stake}%
                </m.span>
              ))}
            </div>
          </div>

          <HoldingCard ar={ar} className="mx-auto max-w-[30rem]" />

          <div aria-hidden className="relative h-12">
            <m.span variants={draw("y", 0.6)} className={cn("absolute inset-y-0 left-1/2 w-px origin-top", LINE)} />
          </div>

          <div className="relative">
            <m.span aria-hidden variants={draw("x", 0.75)} className={cn("absolute top-0 h-px", LINE)} style={{ left: ROW_IN, right: ROW_IN }} />
            <ul className="grid grid-cols-4 gap-6">
              {companies.map((c) => (
                <li key={c.id} className="flex flex-col items-center">
                  <div className="relative h-16 w-px">
                    <m.span aria-hidden variants={draw("y", 0.9)} className={cn("absolute inset-0 origin-top", LINE)} />
                    <m.span variants={appear(1)} className={cn(PILL, "left-1/2 top-1/2")}>
                      100%
                    </m.span>
                  </div>
                  <CompanyCard c={c} locale={locale} />
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-10 text-center text-[0.82rem] text-haze">
            {ar ? "تمثّل النسب المئوية نسب الملكية المباشرة." : "Percentages show direct shareholding."}
          </p>
        </m.div>
      )}

      {/* ---------- Phone / tablet: tree with a rail on the start side ---------- */}
      <div className={cn(chart && "lg:hidden")}>
        <p className="text-[0.85rem] text-haze">{ar ? "المساهمون" : "Shareholders"}</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {shareholders.map((s) => (
            <li key={s.name} className="flex items-center justify-between gap-5 rounded-[2px] border border-ink/10 bg-pearl-50 px-5 py-4">
              <div className="min-w-0">
                <p className="font-display text-[1.05rem] leading-snug text-ink">{s.name}</p>
                <p className="mt-1 text-[0.85rem] leading-snug text-haze">{s.rep}</p>
              </div>
              <p className="num shrink-0 font-display text-[1.6rem] leading-none text-ink">{s.stake}%</p>
            </li>
          ))}
        </ul>
        <div aria-hidden className={cn("mx-auto h-8 w-px", LINE)} />
        <HoldingCard ar={ar} />
        <ul className="ms-6 sm:ms-10">
          {companies.map((c, i) => {
            const last = i === companies.length - 1;
            return (
              <li key={c.id} className="relative ps-7 pt-3 sm:ps-9">
                {/* Rail: runs the full row, and stops at the card's centre on the last row. pt-3 = 0.75rem. */}
                <span aria-hidden className={cn("absolute start-0 top-0 w-px", LINE, last ? "h-[calc(50%+0.375rem)]" : "h-full")} />
                <span aria-hidden className={cn("absolute start-0 top-[calc(50%+0.375rem)] h-px w-7 sm:w-9", LINE)} />
                <Link
                  href={c.href}
                  className="group flex items-center gap-4 rounded-[2px] border border-ink/10 bg-white px-4 py-4 transition-colors hover:border-ink/25 sm:px-5"
                >
                  <span className="grid w-16 shrink-0 place-items-center sm:w-20">
                    <CompanyLogo id={c.id} locale={locale} size={26} decorative />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[1.02rem] leading-snug text-ink">{c.name}</span>
                    {/* Each part kept whole, so a narrow row never leaves "100%" on a line of its own. */}
                    <span className="num mt-0.5 block text-[0.8rem] text-haze">
                      <span className="whitespace-nowrap">{ar ? `منذ ${c.founded}` : `Est. ${c.founded}`}</span>
                      {" · "}
                      <span className="whitespace-nowrap">{ar ? "مملوكة بالكامل" : "100% owned"}</span>
                    </span>
                    {c.within && <span className="mt-0.5 block text-[0.8rem] text-ink/60">{ar ? `تعمل ضمن ${c.within}` : `Works within ${c.within}`}</span>}
                  </span>
                  <Arrow className="text-leaf-700" />
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-8 text-[0.82rem] text-haze">{ar ? "تمثّل النسب المئوية نسب الملكية المباشرة." : "Percentages show direct shareholding."}</p>
      </div>
    </div>
  );
}
