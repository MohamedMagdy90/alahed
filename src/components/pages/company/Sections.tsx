import { Check } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion";
import { ArcsMark } from "@/components/site/ArcsMark";
import { Btn, SectionHeading } from "@/components/site/primitives";
import type { Profile, ProjectRow, ProjectTable } from "@/content/profiles";
import type { Company } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import { cn } from "@/lib/utils";
import { DomainShow } from "./DomainShow";
import { Explorer } from "./Explorer";
import { Grow, ParallaxPhoto } from "./Live";
import { Rail } from "./Rail";
import { Register } from "./Register";

/*
 * Company page sections. Each section has its own composition (statement, photo band, ruled index, register,
 * showcase, rail, timeline, map...) so the page reads as one designed document rather than a stack of tile grids.
 * Every section renders only when the company's profile has the content for it.
 */

type Base = { c: Company; p: Profile; locale: Locale };
const fmt = (n: number, locale: Locale) => n.toLocaleString(locale === "ar" ? "ar-QA" : "en-US", { numberingSystem: "latn" } as Intl.NumberFormatOptions);
const pad = (n: number) => String(n).padStart(2, "0");
const ltr: CSSProperties = { unicodeBidi: "isolate" };

/** "1,152 m²" → large number with a small unit beside it; values without a leading number render as they are. */
function Metric({ value }: { value: string }) {
  const m = value.match(/^([\d.,]+)\s*(.+)$/);
  if (!m) return <>{value}</>;
  return (
    <>
      <span className="num">{m[1]}</span>
      <span className="ms-2 text-[0.4em] tracking-normal text-haze">{m[2]}</span>
    </>
  );
}

/* --------------------------------------------------------------- Principles: vision, mission, pillars over a photo */
export function Principles({ c, p, locale }: Base) {
  if (!p.pillars && !p.vision) return null;
  const ar = locale === "ar";
  const items = p.pillars?.items ?? [];
  const withBody = items.some((it) => it.body);
  const cols = items.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : items.length === 6 ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-3";
  return (
    <section className="grain relative isolate overflow-hidden bg-ink-900 text-white">
      <ParallaxPhoto src={p.photo ?? c.image} className="-z-10">
        <div className="absolute inset-0 bg-ink-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/35 to-ink-900/55" />
        <div className="absolute inset-0 from-ink-900/80 via-ink-900/20 to-transparent ltr:bg-gradient-to-r rtl:bg-gradient-to-l" />
      </ParallaxPhoto>
      <div className="container relative flex min-h-[86svh] flex-col justify-between gap-20 py-24 md:gap-28 md:py-32">
        <div className="max-w-4xl">
          {p.vision ? (
            <>
              <p className="eyebrow text-leaf-300">{ar ? "الرؤية" : "Vision"}</p>
              <Reveal>
                <p className="mt-6 text-balance font-display text-display-lg font-normal">{p.vision[locale]}</p>
              </Reveal>
              {p.mission && (
                <Reveal delay={0.1} className="mt-12 grid max-w-3xl gap-3 border-t border-white/15 pt-7 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-8">
                  <p className="eyebrow text-white/55">{ar ? "الرسالة" : "Mission"}</p>
                  <p className="text-pretty text-[1.15rem] leading-relaxed text-white/80">{p.mission[locale]}</p>
                </Reveal>
              )}
            </>
          ) : (
            p.pillars && (
              <>
                <p className="eyebrow text-leaf-300">{c.short[locale]}</p>
                <h2 className="mt-5 text-balance font-display text-display-xl font-normal">{p.pillars.title[locale]}</h2>
                {p.markets && (
                  <p className="mt-8 max-w-xl text-[1.05rem] leading-relaxed text-white/70">
                    {ar ? "نخدم قطاعات " : "Serving "}
                    {p.markets.map((m) => m[locale]).join(ar ? " و" : ", ")}
                    {ar ? "." : "."}
                  </p>
                )}
              </>
            )
          )}
        </div>

        {items.length > 0 && p.pillars && (
          <div>
            {p.vision && <h2 className="mb-8 text-[0.95rem] font-medium text-white/60">{p.pillars.title[locale]}</h2>}
            <ul className={cn("grid gap-x-10 gap-y-10", cols)}>
              {items.map((it, i) => (
                <Reveal as="li" key={it.title.en} delay={i * 0.05} className="relative pt-6">
                  <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-white/20" />
                  <Grow className="absolute inset-x-0 top-0 h-px bg-white" delay={0.15 + i * 0.12} duration={1.4} />
                  <p className={cn("font-display leading-snug", withBody ? "text-[1.35rem] md:text-[1.5rem]" : "text-[1.55rem] md:text-[1.9rem]")}>{it.title[locale]}</p>
                  {it.body && <p className="mt-3 text-pretty text-[0.95rem] leading-relaxed text-white/65">{it.body[locale]}</p>}
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Scope of supply (flat service list: AATC, DOPET S&T) */
export function Scope({ c, p, locale }: Base) {
  if (p.serviceGroups) return null;
  const ar = locale === "ar";
  const list = c.services[locale];
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow text-leaf-700">{c.id === "aatc" ? (ar ? "المنتجات والخدمات" : "Products & services") : ar ? "الخدمات" : "Services"}</p>
            <h2 className="mt-4 text-balance font-display text-display-lg font-normal text-ink">{ar ? "ما نقدّمه لعملائنا." : "What we deliver for our clients."}</h2>
          </div>
        </div>
        <ol className="border-t border-ink/10 lg:col-span-8">
          {list.map((s, i) => (
            <Reveal as="li" key={s} delay={(i % 4) * 0.03} className="group relative grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-4 border-b border-ink/10 py-6 md:grid-cols-[4rem_minmax(0,1fr)] md:py-7">
              <span
                aria-hidden
                className="absolute -bottom-px start-0 h-px w-full origin-left scale-x-0 transition-transform duration-700 ease-out-expo group-hover:scale-x-100 rtl:origin-right"
                style={{ background: c.accent }}
              />
              <span dir="ltr" className="num text-[0.85rem] text-haze-300 transition-colors duration-300 group-hover:text-ink rtl:text-right">
                {pad(i + 1)}
              </span>
              <p className="text-pretty font-display text-[1.3rem] leading-snug text-ink transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5 md:text-[1.6rem]">
                {s}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Grouped services (DOPET: index rows, PEMCO: explorer) */
export function ServiceGroups({ c, p, locale }: Base) {
  if (!p.serviceGroups) return null;
  const ar = locale === "ar";
  const groups = p.serviceGroups.groups;
  const withLists = groups.some((g) => g.items);
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container">
        <SectionHeading eyebrow={p.serviceGroups.title[locale]} title={ar ? "ما نقدّمه لعملائنا." : "What we deliver for our clients."} />
        <div className="mt-14 md:mt-16">
          {withLists ? (
            <Explorer
              accent={c.accent}
              groups={groups.map((g) => ({ id: g.title.en, title: g.title[locale], body: g.body?.[locale], items: g.items?.[locale] }))}
            />
          ) : (
            <ol className="border-t border-ink/10">
              {groups.map((g, i) => (
                <Reveal as="li" key={g.title.en} delay={(i % 3) * 0.04} className="group relative grid gap-3 border-b border-ink/10 py-8 md:grid-cols-12 md:gap-8 md:py-10">
                  <span
                    aria-hidden
                    className="absolute -bottom-px start-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-700 ease-out-expo group-hover:scale-x-100 rtl:origin-right"
                    style={{ background: c.accent }}
                  />
                  <span dir="ltr" className="num pt-2 text-[0.85rem] text-haze-300 rtl:text-right md:col-span-1">
                    {pad(i + 1)}
                  </span>
                  <h3 className="text-balance font-display text-[1.6rem] leading-tight text-ink transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5 md:col-span-5 md:text-[2.05rem]">
                    {g.title[locale]}
                  </h3>
                  {g.body && <p className="text-pretty text-[1.02rem] leading-relaxed text-haze md:col-span-6 md:pt-2.5">{g.body[locale]}</p>}
                </Reveal>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Portfolio register (AATC divisions, DOPET S&T agencies) */
export function Portfolio({ c, p, locale }: Base) {
  if (!p.portfolio) return null;
  const ar = locale === "ar";
  const total = p.portfolio.divisions.reduce((n, d) => n + d.brands.length, 0);
  return (
    <section className="bg-pearl-50 py-24 md:py-32">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-leaf-700">{p.portfolio.title[locale]}</p>
            <h2 className="mt-6 font-display font-normal text-ink">
              <span className="num block text-[clamp(5.5rem,13vw,11.5rem)] leading-[0.8] tracking-[-0.055em]">{total}</span>
              <span className="mt-5 block max-w-xl text-balance text-display-md">{ar ? "علامة تجارية عالمية نمثّلها في قطر." : "international brands, represented in Qatar."}</span>
            </h2>
          </div>
          <p className="text-pretty text-[1.05rem] leading-relaxed text-haze lg:col-span-5 lg:ps-8">{p.portfolio.intro[locale]}</p>
        </div>
        <div className="mt-16 md:mt-20">
          <Register
            accent={c.accent}
            label={p.portfolio.title[locale]}
            note={p.portfolio.note?.[locale]}
            divisions={p.portfolio.divisions.map((d) => ({
              id: d.id,
              title: d.title[locale],
              brands: d.brands.map((b) => {
                const [maker, line] = b.name.split(" · ");
                return { maker: line ? maker : undefined, name: line ?? maker, origin: b.origin, lines: b.lines[locale] };
              }),
            }))}
          />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- After-sales: service centres + showroom (AATC) */
export function AfterSales({ c, p, locale }: Base) {
  if (!p.showroom && !p.serviceCentres) return null;
  const ar = locale === "ar";
  return (
    <>
      {p.serviceCentres && (
        <section className="bg-white py-24 md:py-32">
          <div className="container">
            <div className="max-w-3xl">
              <p className="eyebrow text-leaf-700">{ar ? "مراكز الخدمة" : "Service centres"}</p>
              <h2 className="mt-4 text-balance font-display text-display-lg font-normal text-ink">{ar ? "خدمة ما بعد البيع داخل قطر، لا خارجها." : "After-sales service in Qatar, not overseas."}</h2>
            </div>
            <ol className="mt-16 grid gap-x-12 gap-y-16 md:mt-20 md:grid-cols-3">
              {p.serviceCentres.map((s, i) => (
                <Reveal as="li" key={s.title.en} delay={i * 0.06} className="relative flex flex-col pt-8">
                  <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-ink/15" />
                  <Grow className="absolute inset-x-0 top-0 h-[2px]" style={{ background: c.accent }} delay={0.1 + i * 0.15} duration={1.3} />
                  {s.metric && (
                    <>
                      <p className="font-display text-[clamp(2.7rem,4.4vw,4rem)] leading-none tracking-[-0.035em] text-ink">
                        <Metric value={s.metric.value[locale]} />
                      </p>
                      <p className="mt-3 text-[0.9rem] text-haze">{s.metric.label[locale]}</p>
                    </>
                  )}
                  <h3 className="mt-10 font-display text-[1.4rem] leading-snug text-ink">{s.title[locale]}</h3>
                  <p className="mt-2 text-pretty text-[0.98rem] leading-relaxed text-haze">{s.summary[locale]}</p>
                  <ul className="mt-6 space-y-3 border-t border-ink/10 pt-6">
                    {s.specs[locale].map((x) => (
                      <li key={x} className="flex gap-3 text-[0.95rem] leading-snug text-ink/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: c.accent }} />
                        {x}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}
      {p.showroom && (
        <section className="bg-pearl-50 py-24 md:py-32">
          <div className="container grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <p className="eyebrow text-leaf-700">{p.showroom.title[locale]}</p>
                <p className="mt-5 text-pretty font-display text-[clamp(1.5rem,2.3vw,2.1rem)] leading-[1.25] tracking-[-0.01em] text-ink">{p.showroom.intro[locale]}</p>
              </div>
            </div>
            <dl className="border-t border-ink/10 lg:col-span-7">
              {p.showroom.groups.map((g, i) => (
                <Reveal key={g.title.en} delay={(i % 4) * 0.03} className="group relative grid grid-cols-1 gap-1 border-b border-ink/10 py-5 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:items-baseline sm:gap-8 md:py-6">
                  <span
                    aria-hidden
                    className="absolute -bottom-px start-0 h-px w-full origin-left scale-x-0 transition-transform duration-700 ease-out-expo group-hover:scale-x-100 rtl:origin-right"
                    style={{ background: c.accent }}
                  />
                  <dt className="text-[0.92rem] text-haze">{g.title[locale]}</dt>
                  <dd dir="ltr" className="font-display text-[1.35rem] leading-snug text-ink rtl:text-right md:text-[1.6rem]">
                    {g.brands.join("  ·  ")}
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>
      )}
    </>
  );
}

/* --------------------------------------------------------------- Construction domains (DOPET) */
export function Domains({ c, p, locale }: Base) {
  if (!p.domains) return null;
  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 text-white md:py-32">
      <ArcsMark tone="white" className="pointer-events-none absolute -end-40 -top-40 h-[620px] w-[620px] opacity-[0.04]" />
      <div className="container relative">
        <SectionHeading
          tone="dark"
          eyebrow={p.domains.title[locale]}
          title={locale === "ar" ? "خمسة مجالات، من التصميم حتى التركيب." : "Five domains, from design to installation."}
          intro={p.domains.intro[locale]}
        />
        <div className="mt-14 md:mt-16">
          <DomainShow
            accent={c.accent}
            label={p.domains.title[locale]}
            items={p.domains.items.map((d) => ({ id: d.id, title: d.title[locale], body: d.body[locale], points: d.points[locale], image: d.image }))}
          />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Workshops rail + yards & camps (DOPET) */
export function Facilities({ c, p, locale }: Base) {
  if (!p.facilities) return null;
  const ar = locale === "ar";
  const yards = p.yards ?? [];
  const camps = p.camps ?? [];
  const yardTotal = yards.reduce((n, y) => n + y.area, 0);
  const yardMax = Math.max(1, ...yards.map((y) => y.area));
  const campTotal = camps.reduce((n, y) => n + y.capacity, 0);
  const count = p.facilities.items.length;
  return (
    <section className="overflow-hidden bg-pearl-50 py-24 md:py-32">
      <div className="container">
        <SectionHeading eyebrow={p.facilities.title[locale]} title={ar ? "ورشنا الخاصة تدعم كل موقع عمل." : "Our own shops support every site."} intro={p.facilities.intro[locale]} />
        <div className="mt-14 md:mt-16">
          <Rail label={p.facilities.title[locale]} prevLabel={ar ? "السابق" : "Previous"} nextLabel={ar ? "التالي" : "Next"}>
            {p.facilities.items.map((f, i) => (
              <article key={f.title.en} data-card className="group w-[84%] shrink-0 snap-start sm:w-[56%] lg:w-[calc((100%-2.5rem)/3)]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-ink-900">
                  {f.image ? (
                    <Image
                      src={f.image}
                      alt={f.title[locale]}
                      fill
                      sizes="(min-width: 1024px) 31vw, (min-width: 640px) 56vw, 84vw"
                      className="object-cover transition-transform duration-1400 ease-out-expo group-hover:scale-[1.05]"
                    />
                  ) : (
                    <ArcsMark tone="white" className="absolute -end-16 -top-16 h-72 w-72 opacity-[0.1]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
                  <p dir="ltr" className="num absolute bottom-4 start-5 text-[0.8rem] text-white/80 rtl:end-5 rtl:start-auto">
                    {pad(i + 1)} <span className="text-white/45">/ {pad(count)}</span>
                  </p>
                </div>
                <h3 className="mt-6 font-display text-[1.4rem] leading-snug text-ink">{f.title[locale]}</h3>
                <p className="mt-2 text-pretty text-[0.96rem] leading-relaxed text-haze">{f.summary[locale]}</p>
                <ul className="mt-5 space-y-2.5 border-t border-ink/10 pt-5">
                  {f.specs[locale].map((x) => (
                    <li key={x} className="flex gap-3 text-[0.9rem] leading-snug text-ink/80">
                      <span aria-hidden className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full" style={{ background: c.accent }} />
                      {x}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </Rail>
        </div>

        {(yards.length > 0 || camps.length > 0) && (
          <div className="mt-24 grid gap-16 md:mt-28 lg:grid-cols-12">
            {yards.length > 0 && (
              <div className="lg:col-span-8">
                <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink/10 pb-7">
                  <div>
                    <p className="eyebrow text-leaf-700">{ar ? "الساحات" : "Yards"}</p>
                    <p className="mt-4 font-display text-[clamp(2.8rem,5.2vw,4.6rem)] leading-none tracking-[-0.035em] text-ink">
                      <span className="num">{fmt(yardTotal, locale)}</span> <span className="text-[0.38em] tracking-normal text-haze">{ar ? "م²" : "m²"}</span>
                    </p>
                  </div>
                  <p className="text-[0.95rem] text-haze">{ar ? `${yards.length} ساحات في أنحاء قطر` : `${yards.length} yards across Qatar`}</p>
                </div>
                <ul className="mt-8 space-y-5">
                  {yards.map((y, i) => (
                    <li key={y.site.en} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-2 sm:grid-cols-[15rem_minmax(0,1fr)_6.5rem]">
                      <span className="text-[0.95rem] text-ink">{y.site[locale]}</span>
                      <span className="relative col-span-2 row-start-2 h-2 overflow-hidden rounded-full bg-ink/5 sm:col-span-1 sm:row-start-auto">
                        <Grow className="absolute inset-y-0 start-0 rounded-full" style={{ width: `${(y.area / yardMax) * 100}%`, background: c.accent }} delay={i * 0.08} duration={1.3} />
                      </span>
                      <span dir="ltr" className="num text-end text-[0.9rem] text-haze rtl:text-left">
                        {fmt(y.area, locale)} m²
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {camps.length > 0 && (
              <div className="lg:col-span-4">
                <div className="border-b border-ink/10 pb-7">
                  <p className="eyebrow text-leaf-700">{ar ? "مساكن العاملين" : "Accommodation camps"}</p>
                  <p className="mt-4 font-display text-[clamp(2.8rem,5.2vw,4.6rem)] leading-none tracking-[-0.035em] text-ink">
                    <span className="num">{fmt(campTotal, locale)}</span> <span className="text-[0.38em] tracking-normal text-haze">{ar ? "فرد" : "people"}</span>
                  </p>
                </div>
                <ul className="mt-3">
                  {camps.map((k) => (
                    <li key={k.site.en} className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-4">
                      <span className="text-[0.95rem] text-ink">{k.site[locale]}</span>
                      <span className="num font-display text-[1.25rem] text-ink">{fmt(k.capacity, locale)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Certifications, HSE & awards (DOPET) */
export function Standards({ c, p, locale }: Base) {
  if (!p.certifications && !p.awards) return null;
  const ar = locale === "ar";
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container">
        {p.certifications && (
          <>
            <SectionHeading
              eyebrow={p.certifications.title[locale]}
              title={ar ? "معتمدون وفق المعايير التي يطلبها عملاؤنا." : "Certified to the standards our clients specify."}
              intro={p.certifications.intro[locale]}
            />
            <ul className="mt-14 grid gap-x-16 md:mt-16 md:grid-cols-2">
              {p.certifications.items.map((x, i) => (
                <Reveal
                  as="li"
                  key={x.name}
                  delay={(i % 4) * 0.03}
                  className="group relative grid gap-1 border-b border-ink/10 py-5 first:border-t sm:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] sm:items-baseline sm:gap-6 md:py-6 md:[&:nth-child(2)]:border-t"
                >
                  <span
                    aria-hidden
                    className="absolute -bottom-px start-0 h-px w-full origin-left scale-x-0 transition-transform duration-700 ease-out-expo group-hover:scale-x-100 rtl:origin-right"
                    style={{ background: c.accent }}
                  />
                  <p dir="ltr" className="font-display text-[1.3rem] leading-tight text-ink rtl:text-right md:text-[1.45rem]">
                    {x.name}
                  </p>
                  <p className="text-[0.92rem] leading-snug text-haze sm:text-end">{x.body[locale]}</p>
                </Reveal>
              ))}
            </ul>
          </>
        )}
        {(p.hse || p.awards) && (
          <div className="mt-24 grid gap-16 md:mt-28 lg:grid-cols-12">
            {p.hse && (
              <div className="lg:col-span-5">
                <p className="eyebrow text-leaf-700">{ar ? "الصحة والسلامة والبيئة" : "Health, safety & environment"}</p>
                <p className="mt-5 text-pretty font-display text-[clamp(1.4rem,2vw,1.8rem)] leading-[1.3] text-ink">{p.hse.intro[locale]}</p>
                <ul className="mt-8 border-t border-ink/10">
                  {p.hse.items.map((x) => (
                    <li key={x.en} className="flex gap-3 border-b border-ink/10 py-3.5 text-[0.98rem] text-ink/85">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: c.accent }} />
                      {x[locale]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {p.awards && (
              <div className="lg:col-span-7">
                <p className="eyebrow text-leaf-700">{ar ? "الجوائز والتقدير" : "Awards & recognition"}</p>
                <ol className="mt-5 border-t border-ink/10">
                  {[...p.awards].sort((a, b) => Number(b.date.slice(-4)) - Number(a.date.slice(-4))).map((a, i) => (
                    <Reveal as="li" key={a.title.en} delay={i * 0.05} className="grid gap-3 border-b border-ink/10 py-7 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-8">
                      <p className="num font-display text-[2.6rem] leading-none tracking-[-0.03em] text-ink">{a.date.slice(-4)}</p>
                      <div>
                        <p dir="ltr" className="text-[0.88rem] text-haze rtl:text-right">
                          {a.org} · {a.date}
                        </p>
                        <p className="mt-2 text-pretty text-[1.05rem] leading-relaxed text-ink/85">{a.title[locale]}</p>
                      </div>
                    </Reveal>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Projects as a timeline (DOPET, PEMCO) */
type Span = { start: number; end: number | null };
/** "2021 – 2023" → 2021..2024 (exclusive end), "2023" → one year, "2023 –" → still running. */
function parsePeriod(period: string): Span | null {
  const m = period.match(/(\d{4})(?:\s*[–-]\s*(\d{4})?)?/);
  if (!m) return null;
  const start = Number(m[1]);
  if (m[2]) return { start, end: Number(m[2]) + 1 };
  return /[–-]/.test(period) ? { start, end: null } : { start, end: start + 1 };
}

type Axis = { min: number; max: number; now: number; x: (v: number) => number };

function TimelineRow({ r, axis, accent, locale, i }: { r: ProjectRow; axis: Axis; accent: string; locale: Locale; i: number }) {
  const ar = locale === "ar";
  const s = parsePeriod(r.period);
  const { x, now } = axis;
  const end = s ? (s.end ?? now) : 0;
  const solidEnd = s ? Math.min(end, now) : 0;
  const future = s?.end != null && s.end > now;
  return (
    <li className="group relative grid gap-x-8 gap-y-1.5 border-b border-ink/10 py-5 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] lg:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_minmax(0,21rem)]">
      <div>
        <p dir="ltr" className="font-display text-[1.05rem] leading-snug text-ink rtl:text-right">
          {r.client}
        </p>
        <p dir="ltr" className="num mt-1 text-[0.85rem] text-haze rtl:text-right">
          {r.period || (ar ? "منجز" : "Completed")}
        </p>
      </div>
      <div>
        <p className="text-pretty leading-snug text-ink">{r.title[locale]}</p>
        {r.scope && <p className="mt-1.5 text-pretty text-[0.9rem] leading-snug text-haze">{r.scope[locale]}</p>}
      </div>
      <div aria-hidden className="relative -my-5 hidden lg:block">
        {/* Today */}
        <span className="absolute inset-y-0 w-px border-s border-dashed" style={{ insetInlineStart: `${x(now)}%`, borderColor: accent, opacity: 0.45 }} />
        <span className="absolute inset-x-0 top-1/2 h-px bg-ink/[0.07]" />
        {s && (
          <>
            <Grow
              className="absolute h-[6px] rounded-full"
              style={{ insetInlineStart: `${x(s.start)}%`, width: `${Math.max(x(solidEnd) - x(s.start), 0.8)}%`, top: "calc(50% - 3px)", background: accent }}
              delay={Math.min(i, 8) * 0.06}
              duration={1.2}
            />
            {future && (
              <span
                className="absolute h-[6px] rounded-full opacity-50"
                style={{
                  insetInlineStart: `${x(now)}%`,
                  width: `${x(end) - x(now)}%`,
                  top: "calc(50% - 3px)",
                  background: `repeating-linear-gradient(90deg, ${accent} 0 5px, transparent 5px 9px)`,
                }}
              />
            )}
            {s.end == null && (
              <span className="absolute h-3 w-3" style={{ insetInlineStart: `calc(${x(now)}% - 6px)`, top: "calc(50% - 6px)" }}>
                <span className="absolute inset-0 animate-ping2 rounded-full" style={{ background: accent }} />
                <span className="absolute inset-0 rounded-full border-2 border-pearl-50" style={{ background: accent }} />
              </span>
            )}
          </>
        )}
      </div>
    </li>
  );
}

function Timeline({ t, axis, accent, locale }: { t: ProjectTable; axis: Axis; accent: string; locale: Locale }) {
  const ar = locale === "ar";
  const years: number[] = [];
  for (let y = axis.min; y < axis.max; y++) years.push(y);
  const every = years.length > 9 ? 2 : 1;
  return (
    <div>
      <h3 className="flex items-baseline gap-3 font-display text-[1.45rem] text-ink">
        {t.title[locale]}
        <span className="num text-[0.95rem] text-haze">{t.rows.length}</span>
      </h3>
      <div className="mt-6 hidden gap-x-8 border-b border-ink/15 pb-3 text-[0.82rem] text-haze lg:grid lg:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_minmax(0,21rem)]">
        <span>{ar ? "العميل" : "Client"}</span>
        <span>{ar ? "المشروع" : "Project"}</span>
        <span aria-hidden className="relative h-5">
          {years.map((y, k) =>
            k % every === 0 ? (
              <span key={y} className="num absolute top-0 -translate-x-1/2 rtl:translate-x-1/2" style={{ insetInlineStart: `${axis.x(y + 0.5)}%` }}>
                {String(y).slice(-2) === "00" ? y : `’${String(y).slice(-2)}`}
              </span>
            ) : null,
          )}
        </span>
      </div>
      <ol className="border-ink/10 max-lg:mt-6 max-lg:border-t">
        {t.rows.map((r, i) => (
          <TimelineRow key={r.title.en} r={r} axis={axis} accent={accent} locale={locale} i={i} />
        ))}
      </ol>
    </div>
  );
}

export function Projects({ c, p, locale }: Base) {
  if (!p.projectTables && !c.projects) return null;
  const ar = locale === "ar";
  const d = new Date();
  const now = d.getFullYear() + (d.getMonth() + d.getDate() / 31) / 12;
  const spans = (p.projectTables ?? []).flatMap((t) => t.rows.map((r) => parsePeriod(r.period))).filter((s): s is Span => !!s);
  const min = spans.length ? Math.min(...spans.map((s) => s.start)) : Math.floor(now);
  const max = Math.max(Math.ceil(now), ...spans.map((s) => s.end ?? 0));
  const axis: Axis = { min, max, now, x: (v) => ((v - min) / (max - min)) * 100 };
  return (
    <section className="bg-pearl-50 py-24 md:py-32">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-leaf-700">{ar ? "المشاريع" : "Projects"}</p>
            <h2 className="mt-4 text-balance font-display text-display-lg font-normal text-ink">{ar ? "خبرة مثبتة في مواقع الطاقة الرئيسية في قطر." : "Proven delivery at Qatar's key energy sites."}</h2>
          </div>
          {p.projectTables && (
            <p className="hidden items-center gap-3 text-[0.9rem] text-haze lg:col-span-5 lg:flex lg:justify-end">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inset-0 animate-ping2 rounded-full" style={{ background: c.accent }} />
                <span className="relative h-2.5 w-2.5 rounded-full" style={{ background: c.accent }} />
              </span>
              {ar ? "جارٍ حتى اليوم" : "Running today"}
              <span aria-hidden className="ms-4 h-[6px] w-8 rounded-full opacity-50" style={{ background: `repeating-linear-gradient(90deg, ${c.accent} 0 5px, transparent 5px 9px)` }} />
              {ar ? "المدة المتبقية من العقد" : "Remaining contract term"}
            </p>
          )}
        </div>
        <div className="mt-14 space-y-16 md:mt-16">
          {p.projectTables?.map((t) => (
            <Timeline key={t.id} t={t} axis={axis} accent={c.accent} locale={locale} />
          ))}
        </div>
        {c.projects && (
          <div className="mt-20 grid gap-10 lg:grid-cols-12">
            <h3 className="font-display text-[1.45rem] text-ink lg:col-span-4">{ar ? "مشاريع بارزة سابقة" : "Earlier landmark projects"}</h3>
            <ol className="border-t border-ink/10 lg:col-span-8">
              {c.projects[locale].map((x, i) => (
                <li key={x} className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-4 border-b border-ink/10 py-5">
                  <span dir="ltr" className="num text-[0.85rem] text-haze-300 rtl:text-right">
                    {pad(i + 1)}
                  </span>
                  <p className="text-pretty text-[1.02rem] leading-relaxed text-ink">{x}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
        {p.partnersNote && (
          <div className="mt-20 grid gap-12 md:grid-cols-2">
            {p.partnersNote.items.map((x) => (
              <div key={x.client.en} className="border-t border-ink/15 pt-6">
                <p className="text-[0.92rem] text-haze">
                  {p.partnersNote?.title[locale]} · {x.client[locale]}
                </p>
                <p className="mt-4 text-pretty font-display text-[1.3rem] leading-[1.45] text-ink">{x.work[locale]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Clients: an editorial credits line */
export function Clients({ c, p, locale }: Base) {
  if (!p.clients) return null;
  const ar = locale === "ar";
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="eyebrow text-leaf-700">{ar ? "عملاؤنا" : "Clients"}</p>
          <h2 className="mt-4 text-balance font-display text-display-md font-normal text-ink">{ar ? `شركاء ${c.short[locale]} في قطاع الطاقة.` : `Who ${c.short[locale]} works for.`}</h2>
          <p className="mt-5 text-[0.95rem] text-haze">{ar ? `${p.clients.length} عميلًا` : `${p.clients.length} clients`}</p>
        </div>
        <Reveal className="lg:col-span-8">
          <ul className="flex flex-wrap items-baseline gap-x-4 gap-y-2 md:gap-x-5" style={{ "--a": c.accent } as CSSProperties}>
            {p.clients.map((n, i) => (
              <li key={n} className="flex items-baseline gap-4 md:gap-5">
                <bdi className="font-display text-[clamp(1.5rem,2.75vw,2.6rem)] leading-[1.2] tracking-[-0.02em] text-ink transition-colors duration-300 hover:text-[color:var(--a)]" style={ltr}>
                  {n}
                </bdi>
                {i < (p.clients?.length ?? 0) - 1 && (
                  <span aria-hidden className="font-display text-[clamp(1.3rem,2.2vw,2rem)] text-haze-200">
                    /
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Partnership (AATC) */
export function Partnership({ c, p, locale }: Base) {
  if (!p.partnership) return null;
  const ar = locale === "ar";
  return (
    <section className="relative overflow-hidden bg-pearl-50 py-24 md:py-32">
      <ArcsMark tone="ink" className="pointer-events-none absolute -end-56 -top-72 h-[560px] w-[560px] opacity-[0.035]" />
      <div className="container relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <p className="eyebrow text-leaf-700">{ar ? "للشركات المصنّعة" : "For manufacturers"}</p>
          <h2 className="mt-4 text-balance font-display text-display-lg font-normal text-ink">{p.partnership.title[locale]}</h2>
          <p className="mt-6 max-w-lg text-pretty text-[1.05rem] leading-relaxed text-haze">{p.partnership.intro[locale]}</p>
          <div className="mt-10">
            <Btn href={href(locale, "/contact")}>{ar ? "ناقش شراكة" : "Discuss a partnership"}</Btn>
          </div>
        </div>
        <ul className="border-t border-ink/10 lg:col-span-6 lg:self-end">
          {p.partnership.points.map((x, i) => (
            <Reveal as="li" key={x.en} delay={i * 0.05} className="flex gap-4 border-b border-ink/10 py-6">
              <Check className="mt-1.5 h-5 w-5 shrink-0" style={{ color: c.accent }} />
              <p className="text-pretty font-display text-[1.2rem] leading-snug text-ink md:text-[1.35rem]">{x[locale]}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

