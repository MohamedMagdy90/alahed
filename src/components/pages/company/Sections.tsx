import { Check } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/motion";
import { Btn, SectionHeading } from "@/components/site/primitives";
import type { Division, Domain, Facility, Profile, ProjectTable } from "@/content/profiles";
import type { Company } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import { cn } from "@/lib/utils";
import { Tabs } from "./Tabs";

type Base = { c: Company; p: Profile; locale: Locale };
const fmt = (n: number, locale: Locale) => n.toLocaleString(locale === "ar" ? "ar-QA" : "en-US", { numberingSystem: "latn" } as Intl.NumberFormatOptions);

/* --------------------------------------------------------------- Vision, mission & pillars */
export function Pillars({ c, p, locale }: Base) {
  if (!p.pillars && !p.vision) return null;
  const ar = locale === "ar";
  const items = p.pillars?.items ?? [];
  const cols = items.length === 3 ? "lg:grid-cols-3" : items.length === 6 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container">
        {p.vision && p.mission && (
          <div className="grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 md:grid-cols-2">
            {[
              { k: ar ? "الرؤية" : "Vision", v: p.vision[locale] },
              { k: ar ? "الرسالة" : "Mission", v: p.mission[locale] },
            ].map((x) => (
              <Reveal key={x.k} className="bg-pearl-50 p-8 md:p-12">
                <p className="text-[0.9rem] font-medium text-leaf-700">{x.k}</p>
                <p className="mt-5 text-pretty font-display text-[clamp(1.35rem,2vw,1.8rem)] leading-snug text-ink">{x.v}</p>
              </Reveal>
            ))}
          </div>
        )}
        {p.pillars && (
          <div className={cn(p.vision && "mt-20 md:mt-24")}>
            <h2 className="max-w-2xl text-balance font-display text-display-md font-normal text-ink">{p.pillars.title[locale]}</h2>
            <ul className={cn("mt-10 grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10", cols)}>
              {items.map((it, i) => (
                <Reveal as="li" key={it.title.en} delay={(i % 4) * 0.04} className="relative bg-white p-7 md:p-8">
                  <span aria-hidden className="block h-[3px] w-8" style={{ background: c.accent }} />
                  <p className="mt-6 font-display text-[1.25rem] leading-snug text-ink">{it.title[locale]}</p>
                  {it.body && <p className="mt-3 text-pretty text-[0.95rem] leading-relaxed text-haze">{it.body[locale]}</p>}
                </Reveal>
              ))}
            </ul>
          </div>
        )}
        {p.markets && (
          <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-3">
            <span className="me-2 text-[0.9rem] text-haze">{ar ? "القطاعات التي نخدمها" : "Sectors we serve"}</span>
            {p.markets.map((m) => (
              <span key={m.en} className="rounded-full border border-ink/15 px-4 py-1.5 text-[0.9rem] text-ink">
                {m[locale]}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Grouped services (DOPET, PEMCO) */
export function ServiceGroups({ c, p, locale }: Base) {
  if (!p.serviceGroups) return null;
  const ar = locale === "ar";
  const withLists = p.serviceGroups.groups.some((g) => g.items);
  return (
    <section className="bg-pearl-50 py-24 md:py-32">
      <div className="container">
        <SectionHeading eyebrow={p.serviceGroups.title[locale]} title={ar ? "ما نقدّمه لعملائنا." : "What we deliver for our clients."} />
        <div className={cn("mt-14 grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10", withLists ? "md:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3")}>
          {p.serviceGroups.groups.map((g, i) => (
            <Reveal key={g.title.en} delay={(i % 3) * 0.05} className="group relative bg-white p-7 md:p-9">
              <span aria-hidden className="absolute inset-y-0 start-0 w-[3px] origin-top scale-y-0 transition-transform duration-500 group-hover:scale-y-100" style={{ background: c.accent }} />
              <h3 className="font-display text-[1.3rem] leading-snug text-ink">{g.title[locale]}</h3>
              {g.body && <p className="mt-3 text-pretty text-[0.98rem] leading-relaxed text-haze">{g.body[locale]}</p>}
              {g.items && (
                <ul className="mt-5 space-y-2.5">
                  {g.items[locale].map((x) => (
                    <li key={x} className="flex gap-3 text-[0.95rem] leading-snug text-ink/80">
                      <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full" style={{ background: c.accent }} />
                      {x}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Portfolio (AATC divisions, DOPET S&T agencies) */
function DivisionPanel({ d, accent, locale }: { d: Division; accent: string; locale: Locale }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
      {d.brands.map((b) => (
        <li key={b.name} className="group relative flex flex-col bg-white p-6 md:p-7">
          <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 ease-out-expo group-hover:scale-x-100 rtl:origin-right" style={{ background: accent }} />
          {(() => {
            const [maker, line] = b.name.split(" · ");
            return (
              <p className="font-display text-[1.25rem] leading-tight text-ink" dir="ltr" style={{ textAlign: locale === "ar" ? "right" : "left" }}>
                {line && <span className="mb-1 block text-[0.82rem] text-haze">{maker}</span>}
                {line ?? maker}
              </p>
            );
          })()}
          {b.origin && (
            <p className="mt-2 text-[0.8rem] text-haze-300" dir="ltr" style={{ textAlign: locale === "ar" ? "right" : "left" }}>
              {b.origin}
            </p>
          )}
          <p className="mt-4 text-pretty text-[0.93rem] leading-relaxed text-haze">{b.lines[locale]}</p>
        </li>
      ))}
    </ul>
  );
}

export function Portfolio({ c, p, locale }: Base) {
  if (!p.portfolio) return null;
  const ar = locale === "ar";
  const total = p.portfolio.divisions.reduce((n, d) => n + d.brands.length, 0);
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container">
        <SectionHeading
          eyebrow={p.portfolio.title[locale]}
          title={ar ? `${total} علامة تجارية عالمية نمثّلها في قطر.` : `${total} international brands, represented in Qatar.`}
          intro={p.portfolio.intro[locale]}
        />
        <div className="mt-14">
          <Tabs
            label={p.portfolio.title[locale]}
            accent={c.accent}
            items={p.portfolio.divisions.map((d) => ({
              id: d.id,
              label: d.title[locale],
              meta: String(d.brands.length),
              panel: <DivisionPanel d={d} accent={c.accent} locale={locale} />,
            }))}
          />
        </div>
        {p.portfolio.note && <p className="mt-8 text-[0.92rem] text-haze">{p.portfolio.note[locale]}</p>}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Showroom + service centres (AATC) */
export function Showroom({ c, p, locale }: Base) {
  if (!p.showroom && !p.serviceCentres) return null;
  const ar = locale === "ar";
  return (
    <section className="border-t border-ink/10 bg-pearl-50 py-24 md:py-32">
      <div className="container grid gap-16 lg:grid-cols-12">
        {p.serviceCentres && (
          <div className="lg:col-span-7">
            <p className="mb-4 text-[0.9rem] font-medium text-leaf-700">{ar ? "مراكز الخدمة" : "Service centres"}</p>
            <h2 className="max-w-xl text-balance font-display text-display-md font-normal text-ink">
              {ar ? "خدمة ما بعد البيع داخل قطر، لا خارجها." : "After-sales service in Qatar, not overseas."}
            </h2>
            <ol className="mt-10 border-t border-ink/10">
              {p.serviceCentres.map((s, i) => (
                <Reveal as="li" key={s.title.en} delay={i * 0.05} className="grid gap-4 border-b border-ink/10 py-8 md:grid-cols-[1fr_1.1fr] md:gap-10">
                  <div>
                    <h3 className="font-display text-[1.35rem] leading-snug text-ink">{s.title[locale]}</h3>
                    <p className="mt-2 text-pretty text-[0.95rem] leading-relaxed text-haze">{s.summary[locale]}</p>
                  </div>
                  <ul className="space-y-2.5">
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
        )}
        {p.showroom && (
          <div className="lg:col-span-5">
            <div className="rounded-[2px] border border-ink/10 bg-white p-8 md:p-10 lg:sticky lg:top-28">
              <p className="text-[0.9rem] font-medium text-leaf-700">{p.showroom.title[locale]}</p>
              <p className="mt-4 text-pretty text-[0.98rem] leading-relaxed text-haze">{p.showroom.intro[locale]}</p>
              <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                {p.showroom.groups.map((g) => (
                  <div key={g.title.en} className="flex items-baseline justify-between gap-6 py-3.5">
                    <dt className="text-[0.92rem] text-haze">{g.title[locale]}</dt>
                    <dd className="text-end font-display text-[1.02rem] text-ink" dir="ltr">
                      {g.brands.join(" · ")}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Construction domains (DOPET) */
function DomainPanel({ d, accent, locale }: { d: Domain; accent: string; locale: Locale }) {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[2px] bg-ink-900 lg:col-span-7">
        <Image src={d.image} alt={d.title[locale]} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
      </div>
      <div className="lg:col-span-5">
        <p className="text-pretty font-display text-[clamp(1.3rem,1.9vw,1.65rem)] leading-snug text-white">{d.body[locale]}</p>
        <ul className="mt-8 space-y-3 border-t border-white/10 pt-6">
          {d.points[locale].map((x) => (
            <li key={x} className="flex gap-3 text-[0.98rem] leading-snug text-white/75">
              <span aria-hidden className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
              {x}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Domains({ c, p, locale }: Base) {
  if (!p.domains) return null;
  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 text-white md:py-32">
      <div className="container relative">
        <SectionHeading tone="dark" eyebrow={p.domains.title[locale]} title={locale === "ar" ? "خمسة مجالات، من التصميم حتى التركيب." : "Five domains, from design to installation."} intro={p.domains.intro[locale]} />
        <div className="mt-14">
          <Tabs
            tone="dark"
            label={p.domains.title[locale]}
            accent={c.accent}
            items={p.domains.items.map((d) => ({ id: d.id, label: d.title[locale], panel: <DomainPanel d={d} accent={c.accent} locale={locale} /> }))}
          />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Workshops, yards & camps (DOPET) */
function FacilityCard({ f, accent, locale }: { f: Facility; accent: string; locale: Locale }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2px] border border-ink/10 bg-white">
      {f.image ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-ink-900">
          <Image src={f.image} alt={f.title[locale]} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-1200 ease-out-expo group-hover:scale-[1.03]" />
        </div>
      ) : (
        <div aria-hidden className="h-[3px]" style={{ background: accent }} />
      )}
      <div className="flex flex-1 flex-col p-7">
        <h3 className="font-display text-[1.3rem] leading-snug text-ink">{f.title[locale]}</h3>
        <p className="mt-2 text-pretty text-[0.95rem] leading-relaxed text-haze">{f.summary[locale]}</p>
        <ul className="mt-5 space-y-2 border-t border-ink/10 pt-5">
          {f.specs[locale].map((x) => (
            <li key={x} className="flex gap-3 text-[0.9rem] leading-snug text-ink/80">
              <span aria-hidden className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full" style={{ background: accent }} />
              {x}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function Facilities({ c, p, locale }: Base) {
  if (!p.facilities) return null;
  const ar = locale === "ar";
  const yards = p.yards ?? [];
  const camps = p.camps ?? [];
  const yardTotal = yards.reduce((n, y) => n + y.area, 0);
  const yardMax = Math.max(1, ...yards.map((y) => y.area));
  const campTotal = camps.reduce((n, y) => n + y.capacity, 0);
  return (
    <section className="bg-pearl-50 py-24 md:py-32">
      <div className="container">
        <SectionHeading eyebrow={p.facilities.title[locale]} title={ar ? "ورشنا الخاصة تدعم كل موقع عمل." : "Our own shops support every site."} intro={p.facilities.intro[locale]} />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {p.facilities.items.map((f, i) => (
            <Reveal key={f.title.en} delay={(i % 3) * 0.05}>
              <FacilityCard f={f} accent={c.accent} locale={locale} />
            </Reveal>
          ))}
        </div>

        {(yards.length > 0 || camps.length > 0) && (
          <div className="mt-20 grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 lg:grid-cols-12">
            {yards.length > 0 && (
              <div className="bg-white p-8 md:p-10 lg:col-span-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-[0.9rem] font-medium text-leaf-700">{ar ? "الساحات" : "Yards"}</p>
                    <p className="mt-3 font-display text-[2.4rem] leading-none tracking-[-0.02em] text-ink">
                      <span className="num">{fmt(yardTotal, locale)}</span> <span className="text-[1.2rem] text-haze">m²</span>
                    </p>
                  </div>
                  <p className="text-[0.9rem] text-haze">{ar ? `${yards.length} ساحات في أنحاء قطر` : `${yards.length} yards across Qatar`}</p>
                </div>
                <ul className="mt-8 space-y-4">
                  {yards.map((y) => (
                    <li key={y.site.en} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-2 sm:grid-cols-[14rem_minmax(0,1fr)_auto]">
                      <span className="text-[0.92rem] text-ink">{y.site[locale]}</span>
                      <span aria-hidden className="col-span-2 row-start-2 h-1.5 overflow-hidden rounded-full bg-pearl-100 sm:col-span-1 sm:row-start-auto">
                        <span className="block h-full rounded-full" style={{ width: `${(y.area / yardMax) * 100}%`, background: c.accent }} />
                      </span>
                      <span className="num text-end text-[0.9rem] text-haze" dir="ltr">
                        {fmt(y.area, locale)} m²
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {camps.length > 0 && (
              <div className="bg-white p-8 md:p-10 lg:col-span-4">
                <p className="text-[0.9rem] font-medium text-leaf-700">{ar ? "مساكن العاملين" : "Accommodation camps"}</p>
                <p className="mt-3 font-display text-[2.4rem] leading-none tracking-[-0.02em] text-ink">
                  <span className="num">{fmt(campTotal, locale)}</span> <span className="text-[1.2rem] text-haze">{ar ? "فرد" : "people"}</span>
                </p>
                <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                  {camps.map((k) => (
                    <li key={k.site.en} className="flex items-baseline justify-between gap-4 py-3.5">
                      <span className="text-[0.92rem] text-ink">{k.site[locale]}</span>
                      <span className="num text-[0.9rem] text-haze">{fmt(k.capacity, locale)}</span>
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
            <SectionHeading eyebrow={p.certifications.title[locale]} title={ar ? "معتمدون وفق المعايير التي يطلبها عملاؤنا." : "Certified to the standards our clients specify."} intro={p.certifications.intro[locale]} />
            <ul className="mt-14 grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
              {p.certifications.items.map((x, i) => (
                <Reveal as="li" key={x.name} delay={(i % 4) * 0.04} className="bg-white p-7">
                  <p className="font-display text-[1.2rem] leading-tight text-ink" dir="ltr" style={{ textAlign: ar ? "right" : "left" }}>
                    {x.name}
                  </p>
                  <p className="mt-2 text-[0.92rem] leading-snug text-haze">{x.body[locale]}</p>
                </Reveal>
              ))}
            </ul>
          </>
        )}
        {(p.hse || p.awards) && (
          <div className="mt-20 grid gap-12 lg:grid-cols-12">
            {p.hse && (
              <div className="lg:col-span-5">
                <p className="text-[0.9rem] font-medium text-leaf-700">{ar ? "الصحة والسلامة والبيئة" : "Health, safety & environment"}</p>
                <p className="mt-4 text-pretty font-display text-[1.45rem] leading-snug text-ink">{p.hse.intro[locale]}</p>
                <ul className="mt-8 space-y-3">
                  {p.hse.items.map((x) => (
                    <li key={x.en} className="flex gap-3 text-[0.98rem] text-ink/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: c.accent }} />
                      {x[locale]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {p.awards && (
              <div className="lg:col-span-7">
                <p className="text-[0.9rem] font-medium text-leaf-700">{ar ? "الجوائز والتقدير" : "Awards & recognition"}</p>
                <ol className="mt-4 border-t border-ink/10">
                  {p.awards.map((a) => (
                    <li key={a.title.en} className="grid gap-2 border-b border-ink/10 py-6 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8">
                      <div>
                        <p className="font-display text-[1.05rem] text-ink" dir="ltr" style={{ textAlign: ar ? "right" : "left" }}>
                          {a.org}
                        </p>
                        <p className="num mt-1 text-[0.85rem] text-haze">{a.date}</p>
                      </div>
                      <p className="text-pretty text-[1rem] leading-relaxed text-ink/85">{a.title[locale]}</p>
                    </li>
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

/* --------------------------------------------------------------- Project tables (DOPET, PEMCO) */
function Table({ t, accent, locale }: { t: ProjectTable; accent: string; locale: Locale }) {
  const ar = locale === "ar";
  const hasScope = t.rows.some((r) => r.scope);
  return (
    <div>
      <h3 className="flex items-center gap-3 font-display text-[1.35rem] text-ink">
        <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: accent }} />
        {t.title[locale]}
        <span className="num text-[0.9rem] text-haze">{t.rows.length}</span>
      </h3>
      <div className="mt-6 overflow-hidden rounded-[2px] border border-ink/10 bg-white">
        <table className="w-full border-collapse text-start text-[0.95rem]">
          <thead className="hidden bg-pearl-50 text-[0.85rem] text-haze md:table-header-group">
            <tr>
              <th scope="col" className="w-[17%] px-6 py-3.5 text-start font-normal">{ar ? "العميل" : "Client"}</th>
              <th scope="col" className="px-6 py-3.5 text-start font-normal">{ar ? "المشروع" : "Project"}</th>
              <th scope="col" className="w-[13%] px-6 py-3.5 text-start font-normal">{ar ? "الفترة" : "Period"}</th>
            </tr>
          </thead>
          <tbody>
            {t.rows.map((r) => (
              <tr key={r.title.en} className="block border-t border-ink/10 px-6 py-5 first:border-t-0 md:table-row md:px-0 md:py-0 md:first:border-t">
                <td className="block align-top font-display text-[1rem] text-ink md:table-cell md:px-6 md:py-5" dir="ltr" style={{ textAlign: ar ? "right" : "left" }}>
                  {r.client}
                </td>
                <td className="mt-1 block align-top md:mt-0 md:table-cell md:px-6 md:py-5">
                  <p className="leading-snug text-ink">{r.title[locale]}</p>
                  {hasScope && r.scope && <p className="mt-1.5 text-[0.9rem] leading-snug text-haze">{r.scope[locale]}</p>}
                </td>
                <td className="num mt-2 block align-top text-[0.9rem] text-haze md:mt-0 md:table-cell md:whitespace-nowrap md:px-6 md:py-5" dir="ltr" style={{ textAlign: ar ? "right" : "left" }}>
                  {r.period || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Projects({ c, p, locale, tone = "pearl" }: Base & { tone?: "pearl" | "white" }) {
  if (!p.projectTables && !c.projects) return null;
  const ar = locale === "ar";
  return (
    <section className={cn("py-24 md:py-32", tone === "white" ? "bg-white" : "bg-pearl-50")}>
      <div className="container">
        <SectionHeading eyebrow={ar ? "المشاريع" : "Projects"} title={ar ? "خبرة مثبتة في مواقع الطاقة الرئيسية في قطر." : "Proven delivery at Qatar's key energy sites."} />
        <div className="mt-14 space-y-14">
          {p.projectTables?.map((t) => (
            <Table key={t.id} t={t} accent={c.accent} locale={locale} />
          ))}
        </div>
        {c.projects && (
          <div className="mt-16 grid gap-10 lg:grid-cols-12">
            <h3 className="font-display text-[1.35rem] text-ink lg:col-span-4">{ar ? "مشاريع بارزة سابقة" : "Earlier landmark projects"}</h3>
            <ol className="border-t border-ink/10 lg:col-span-8">
              {c.projects[locale].map((x) => (
                <li key={x} className="flex gap-4 border-b border-ink/10 py-5">
                  <span aria-hidden className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c.accent }} />
                  <p className="text-[1rem] leading-relaxed text-ink">{x}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
        {p.partnersNote && (
          <div className="mt-16 grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 md:grid-cols-2">
            {p.partnersNote.items.map((x) => (
              <div key={x.client.en} className="bg-white p-7 md:p-8">
                <p className="text-[0.9rem] font-medium text-leaf-700">
                  {p.partnersNote?.title[locale]} · {x.client[locale]}
                </p>
                <p className="mt-3 text-pretty text-[1rem] leading-relaxed text-ink/85">{x.work[locale]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Clients */
export function Clients({ c, p, locale }: Base) {
  if (!p.clients) return null;
  const ar = locale === "ar";
  return (
    <section className="border-t border-ink/10 bg-white py-20 md:py-24">
      <div className="container grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="mb-4 text-[0.9rem] font-medium text-leaf-700">{ar ? "عملاؤنا" : "Clients"}</p>
          <h2 className="text-balance font-display text-display-md font-normal text-ink">
            {ar ? `شركاء ${c.short[locale]} في قطاع الطاقة.` : `Who ${c.short[locale]} works for.`}
          </h2>
        </div>
        <ul className="grid grid-cols-2 border-s border-t border-ink/10 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-4">
          {p.clients.map((n) => (
            <li key={n} className="flex min-h-[76px] items-center border-b border-e border-ink/10 px-5 py-4 font-display text-[1.05rem] leading-tight text-ink/85">
              <bdi>{n}</bdi>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Partnership CTA (AATC) */
export function Partnership({ c, p, locale }: Base) {
  if (!p.partnership) return null;
  const ar = locale === "ar";
  return (
    <section className="bg-pearl-50 py-24 md:py-28">
      <div className="container">
        <div className="grid gap-10 rounded-[2px] border border-ink/10 bg-white p-8 md:p-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="text-[0.9rem] font-medium text-leaf-700">{ar ? "للشركات المصنّعة" : "For manufacturers"}</p>
            <h2 className="mt-4 text-balance font-display text-display-md font-normal text-ink">{p.partnership.title[locale]}</h2>
            <p className="mt-4 text-pretty text-[1rem] leading-relaxed text-haze">{p.partnership.intro[locale]}</p>
            <div className="mt-8">
              <Btn href={href(locale, "/contact")}>{ar ? "ناقش شراكة" : "Discuss a partnership"}</Btn>
            </div>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:col-span-7">
            {p.partnership.points.map((x) => (
              <li key={x.en} className="flex gap-3 bg-white p-6 text-[0.98rem] leading-snug text-ink/85">
                <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: c.accent }} />
                {x[locale]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
