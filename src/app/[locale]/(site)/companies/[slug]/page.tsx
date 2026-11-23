import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion";
import { Grow } from "@/components/pages/company/Live";
import { AfterSales, Clients, Domains, Facilities, Partnership, Portfolio, Principles, Projects, Scope, ServiceGroups, Standards } from "@/components/pages/company/Sections";
import { DohaTime, type MapSite, SiteMap } from "@/components/pages/company/SiteMap";
import { CompanyLogo } from "@/components/site/CompanyLogo";
import { NewsCard } from "@/components/site/NewsCard";
import { PageHero } from "@/components/site/PageHero";
import { Arrow, Btn, SectionHeading, TextLink } from "@/components/site/primitives";
import { siteDetails, siteGeo } from "@/content/pages/home";
import { profileOf } from "@/content/profiles";
import { type CompanyId, companies, companyById, getCompany, sites } from "@/content/site";
import { type Locale, isLocale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import { getLatestPosts } from "@/lib/queries";
import { cn } from "@/lib/utils";

type P = { params: Promise<{ locale: string; slug: string }> };

/** Where each company's head office is (the routes on its map start there). */
const HOME_SITE: Record<CompanyId, string> = { aatc: "doha", dopet: "salwa", dst: "salwa", pemco: "doha" };
/** Company colours lifted for dark surfaces (the same tints as the home page map). */
const TINT: Record<CompanyId, string> = { aatc: "#6CC951", dopet: "#EC4B43", dst: "#F59A8F", pemco: "#8EAAE0" };

const rad = (d: number) => (d * Math.PI) / 180;
function km(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lon - a.lon) / 2) ** 2;
  return Math.round(2 * 6371 * Math.asin(Math.sqrt(h)));
}

// Cached on first visit, never rendered at build time (see app/[locale]/layout.tsx).
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params;
  const c = getCompany(slug);
  if (!c) return {};
  const l: Locale = locale === "ar" ? "ar" : "en";
  return {
    title: c.name[l],
    description: c.summary[l],
    alternates: { languages: { en: `/en/companies/${slug}`, ar: `/ar/companies/${slug}` } },
    openGraph: { images: [c.image] },
  };
}

export default async function CompanyPage({ params }: P) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const ar = locale === "ar";
  const c = getCompany(slug);
  if (!c) notFound();
  const p = profileOf(c.id);
  const parent = c.parent ? companyById(c.parent) : undefined;
  const others = companies.filter((x) => x.id !== c.id);
  const posts = await getLatestPosts({ company: c.id, limit: 3 });
  const base = { c, p, locale };
  // The founding year is already in the hero panel, so the overview figures skip it.
  const figures = c.highlights.filter((h) => h.label.en !== "Established");

  // The company's own locations, head office first, then nearest to farthest, each with what happens there.
  const homeId = HOME_SITE[c.id];
  const mapSites: MapSite[] = sites
    .filter((s) => s.companies.includes(c.id))
    .map((s) => {
      const details = (siteDetails[s.id] ?? []).filter((d) => d.company === c.id).map((d) => d.text[locale]);
      const dist = km(siteGeo[homeId], siteGeo[s.id]);
      return {
        id: s.id,
        name: s.name[locale].split(/ — | – /)[0],
        details: details.length ? details : s.id === homeId ? [c.contact.address[locale]] : [],
        distance: s.id === homeId ? (ar ? "المكتب الرئيسي" : "Head office") : ar ? `${dist} كم من المكتب الرئيسي` : `${dist} km from the head office`,
        short: s.id === homeId ? (ar ? "المكتب الرئيسي" : "Head office") : ar ? `${dist} كم` : `${dist} km`,
        km: s.id === homeId ? -1 : dist,
      };
    })
    .filter((s) => s.details.length > 0)
    .sort((a, b) => a.km - b.km)
    .map(({ km: _km, ...s }) => s);

  return (
    <>
      <PageHero
        locale={locale}
        image={c.image}
        size="lg"
        eyebrow={ar ? "شركة تابعة للمجموعة" : "Group company"}
        crumbs={[{ label: ar ? "شركات المجموعة" : "Group companies", href: href(locale, "/companies") }, { label: c.short[locale] }]}
        title={c.name[locale]}
        intro={c.tagline[locale]}
        aside={
          <div className="rounded-[2px] border border-white/15 bg-ink-900/55 p-7 text-white backdrop-blur-md">
            <div className="flex h-16 items-center">
              <CompanyLogo id={c.id} locale={locale} tone="white" size={48} />
            </div>
            <dl className="mt-6 divide-y divide-white/10 border-t border-white/10 text-[0.9rem]">
              <div className="flex justify-between gap-4 py-3">
                <dt className="shrink-0 text-white/55">{ar ? "الاسم القانوني" : "Legal name"}</dt>
                <dd className="text-end">{c.legal[locale]}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-white/55">{ar ? "سنة التأسيس" : "Established"}</dt>
                <dd className="num">{c.founded}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="shrink-0 text-white/55">{ar ? "الملكية" : "Ownership"}</dt>
                <dd className="text-end">{ar ? "مملوكة بالكامل للعهد القابضة" : "Wholly owned by Al-Ahed Holding"}</dd>
              </div>
              {parent && (
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-white/55">{ar ? "تعمل ضمن" : "Works within"}</dt>
                  <dd className="text-end">
                    <Link href={href(locale, `/companies/${parent.slug}`)} className="link-underline">
                      {parent.short[locale]}
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
            {c.website && (
              <TextLink href={c.website} external tone="dark" className="mt-5">
                {c.website.replace(/^https?:\/\/(www\.)?/, "")}
              </TextLink>
            )}
          </div>
        }
      >
        <span aria-hidden className="mt-10 block h-[3px] w-24" style={{ background: c.accent }} />
      </PageHero>

      {/* Overview: the statement, beside the company's figures in a column that stays in view */}
      <section className="bg-pearl-50 py-24 md:py-32">
        <div className="container grid gap-16 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-7 xl:col-span-8">
            <h2 className="eyebrow text-leaf-700">{ar ? "نظرة عامة" : "Overview"}</h2>
            <Reveal>
              <p className="mt-6 text-pretty font-display text-[clamp(1.55rem,2.5vw,2.35rem)] leading-[1.25] tracking-[-0.015em] text-ink">{c.summary[locale]}</p>
            </Reveal>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {c.about[locale].map((t, i) => (
                <Reveal key={t.slice(0, 20)} delay={i * 0.08}>
                  <p className="text-pretty text-[1.02rem] leading-relaxed text-haze">{t}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-5 xl:col-span-4">
            <dl className="grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:sticky lg:top-28 lg:grid-cols-1">
              {figures.map((h, i) => (
                <div key={h.label.en} className="relative flex flex-col-reverse pb-8 pt-6 lg:pb-9 lg:pt-7">
                  <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-ink/10" />
                  <Grow className="absolute inset-x-0 top-0 h-[2px]" style={{ background: c.accent }} delay={0.1 + i * 0.15} duration={1.3} />
                  <dt className="mt-3 max-w-[16rem] text-[0.92rem] leading-snug text-haze">{h.label[locale]}</dt>
                  <dd className="num font-display text-[clamp(2.6rem,4.4vw,4.1rem)] leading-none tracking-[-0.035em] text-ink">{h.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <Principles {...base} />
      <Scope {...base} />
      <ServiceGroups {...base} />
      <Portfolio {...base} />
      <AfterSales {...base} />
      <Domains {...base} />
      <Facilities {...base} />
      <Standards {...base} />
      <Projects {...base} />
      <Clients {...base} />
      <Partnership {...base} />

      {/* Locations on a live map, then management + contact */}
      <section className="relative overflow-hidden bg-ink-900 py-24 text-white md:py-32">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="container relative">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow text-leaf-300">{ar ? "حضورنا في قطر" : "On the ground in Qatar"}</p>
              <h2 className="mt-4 text-balance font-display text-display-lg font-normal">{ar ? `أين تعمل ${c.short[locale]}` : `Where ${c.short[locale]} works`}</h2>
            </div>
            <div className="lg:col-span-4 lg:justify-self-end">
              <DohaTime ar={ar} />
            </div>
          </div>
          {mapSites.length > 0 && (
            <div className="mt-14">
              <SiteMap sites={mapSites} homeId={homeId} tint={TINT[c.id]} label={ar ? "مواقع الشركة" : "Company locations"} ar={ar} />
            </div>
          )}

          <div className="mt-20 grid gap-14 border-t border-white/10 pt-14 md:mt-24 lg:grid-cols-12 lg:gap-16">
            {p.people && (
              <div className="lg:col-span-6">
                <p className="eyebrow text-white/55">{ar ? "الإدارة" : "Management"}</p>
                <ul className="mt-6 border-t border-white/10">
                  {p.people.map((m) => (
                    <li key={m.name.en} className="flex flex-col gap-1 border-b border-white/10 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                      <p className="font-display text-[1.3rem] leading-snug">{m.name[locale]}</p>
                      <p className="text-[0.92rem] text-white/55 sm:text-end">{m.role[locale]}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Reveal className={cn(p.people ? "lg:col-span-6" : "lg:col-span-8")}>
              <p className="eyebrow text-white/55">{ar ? "تواصل مع الشركة" : "Contact the company"}</p>
              <p className="mt-5 font-display text-[1.7rem] leading-tight md:text-[2rem]">{c.name[locale]}</p>
              <dl className="mt-8 grid gap-x-8 gap-y-6 text-[0.95rem] sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="text-white/45">{ar ? "العنوان" : "Address"}</dt>
                  <dd className="mt-1 text-white/85">{c.contact.address[locale]}</dd>
                </div>
                <div>
                  <dt className="text-white/45">{ar ? "الهاتف" : "Phone"}</dt>
                  <dd className="mt-1">
                    <a href={`tel:${c.contact.phone.replace(/\s/g, "")}`} dir="ltr" className="num link-underline text-white/85 hover:text-white">
                      {c.contact.phone}
                    </a>
                  </dd>
                </div>
                {c.contact.fax && (
                  <div>
                    <dt className="text-white/45">{ar ? "الفاكس" : "Fax"}</dt>
                    <dd className="num mt-1 text-white/85" dir="ltr">
                      {c.contact.fax}
                    </dd>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <dt className="text-white/45">{ar ? "البريد الإلكتروني" : "Email"}</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${c.contact.email}`} className="link-underline break-all text-white/85 hover:text-white">
                      {c.contact.email}
                    </a>
                  </dd>
                </div>
              </dl>
              <div className="mt-10 flex flex-wrap gap-3">
                <Btn href={href(locale, "/contact")}>{ar ? "أرسل استفسارًا" : "Send an enquiry"}</Btn>
                {c.website && (
                  <Btn href={c.website} external variant="outline-light">
                    {ar ? "الموقع الإلكتروني" : "Website"}
                  </Btn>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Related news */}
      {posts.length > 0 && (
        <section className="bg-white py-24 md:py-32">
          <div className="container">
            <SectionHeading
              eyebrow={ar ? "آخر الأخبار" : "Latest news"}
              title={ar ? `أخبار ${c.short[locale]}` : `News from ${c.short[locale]}`}
              action={<TextLink href={href(locale, `/news?company=${c.id}`)}>{ar ? "جميع الأخبار" : "All news"}</TextLink>}
            />
            {/* Columns follow the number of posts so a company with one or two stories never shows an empty slot. */}
            {posts.length === 1 ? (
              <Reveal className="mt-14">
                <NewsCard post={posts[0]} locale={locale} variant="feature" />
              </Reveal>
            ) : (
              <div className={`mt-14 grid gap-10 md:grid-cols-2${posts.length >= 3 ? " lg:grid-cols-3" : " lg:gap-14"}`}>
                {posts.map((post, i) => (
                  <Reveal key={post.id} delay={i * 0.06}>
                    <NewsCard post={post} locale={locale} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Other companies */}
      <section className="bg-pearl-50 py-24">
        <div className="container">
          <p className="eyebrow mb-8 text-haze">{ar ? "شركات المجموعة الأخرى" : "Other group companies"}</p>
          <div className="grid gap-4 md:grid-cols-3">
            {others.map((o) => (
              <Link key={o.id} href={href(locale, `/companies/${o.slug}`)} className="group relative isolate flex min-h-[260px] flex-col justify-end overflow-hidden rounded-[2px] bg-ink-900 p-7 text-white">
                <div data-vt="media" className="absolute inset-0 -z-10 overflow-hidden">
                  <Image src={o.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/55 to-ink-900/10" />
                </div>
                <span className="flex items-center justify-between gap-4">
                  <span className="font-display text-[1.55rem] leading-tight">{o.name[locale]}</span>
                  <Arrow className="text-leaf-300" />
                </span>
                <span className="mt-2 text-[0.92rem] text-white/65">{o.tagline[locale]}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
