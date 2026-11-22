import { MapPin } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion";
import { NewsCard } from "@/components/site/NewsCard";
import { CompanyLogo } from "@/components/site/CompanyLogo";
import { PageHero } from "@/components/site/PageHero";
import { Arrow, Btn, Em, SectionHeading, TextLink } from "@/components/site/primitives";
import { companies, getCompany } from "@/content/site";
import { type Locale, isLocale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import { getLatestPosts } from "@/lib/queries";

type P = { params: Promise<{ locale: string; slug: string }> };

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
  const others = companies.filter((x) => x.id !== c.id);
  const posts = await getLatestPosts({ company: c.id, limit: 3 });

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
                <dt className="text-white/55">{ar ? "الاسم القانوني" : "Legal name"}</dt>
                <dd className="text-end">{c.legal[locale]}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-white/55">{ar ? "سنة التأسيس" : "Established"}</dt>
                <dd className="num">{c.founded}</dd>
              </div>
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

      {/* Overview */}
      <section className="bg-pearl-50 py-24 md:py-32">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4">
              <p className="eyebrow flex items-center gap-3 text-leaf-700">
                {ar ? "نظرة عامة" : "Overview"}
              </p>
            </div>
          </div>
          <div className="lg:col-span-8">
            <Reveal>
              <p className="text-pretty font-display text-[clamp(1.5rem,2.4vw,2.2rem)] leading-[1.25] text-ink">{c.summary[locale]}</p>
            </Reveal>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {c.about[locale].map((p, i) => (
                <Reveal key={p.slice(0, 20)} delay={i * 0.08}>
                  <p className="text-pretty text-[1.02rem] leading-relaxed text-haze">{p}</p>
                </Reveal>
              ))}
            </div>
            <div className="mt-14 grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 sm:grid-cols-3">
              {c.highlights.map((h) => (
                <div key={h.label.en} className="bg-white p-7">
                  <p className="num font-display text-[2.6rem] leading-none tracking-[-0.03em] text-ink">{h.value}</p>
                  <p className="mt-3 text-[0.9rem] text-haze">{h.label[locale]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-24 md:py-32">
        <div className="container">
          <SectionHeading
            eyebrow={c.id === "aatc" ? (ar ? "المنتجات والخدمات" : "Products & services") : ar ? "الخدمات" : "Services"}
            title={
              ar ? (
                <>
                  ما نقدّمه <Em className="text-brand">لعملائنا.</Em>
                </>
              ) : (
                <>
                  What we deliver <Em className="text-brand">for our clients.</Em>
                </>
              )
            }
          />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {c.services[locale].map((s, i) => (
              <Reveal as="li" key={s} delay={(i % 3) * 0.05} className="group relative bg-white p-7 transition-colors duration-500 hover:bg-pearl-50 md:p-8">
                <span aria-hidden className="absolute inset-y-0 start-0 w-[3px] origin-top scale-y-0 transition-transform duration-500 group-hover:scale-y-100" style={{ background: c.accent }} />
                <p className="mt-6 font-display text-[1.2rem] leading-snug text-ink">{s}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Principals (AATC) */}
      {c.partners && (
        <section className="border-y border-ink/10 bg-pearl-50 py-20 md:py-24">
          <div className="container grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow mb-4 text-leaf-700">{ar ? "الشركاء العالميون" : "Global principals"}</p>
              <h2 className="text-balance font-display text-display-md font-normal text-ink">
                {ar ? `${c.partners.length} شركة مصنّعة نمثّلها في قطر.` : `${c.partners.length} manufacturers we represent in Qatar.`}
              </h2>
            </div>
            {/* Static, scannable list: the live network on the home page carries the motion. */}
            <ul className="grid grid-cols-2 border-s border-t border-ink/10 sm:grid-cols-3 lg:col-span-8">
              {c.partners.map((p) => (
                <li key={p} className="flex min-h-[84px] items-center border-b border-e border-ink/10 px-5 py-4 font-display text-[1.15rem] leading-tight text-ink/85">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Projects (DOPET) */}
      {c.projects && (
        <section className="bg-pearl-50 py-24 md:py-32">
          <div className="container grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="mb-6 flex items-center gap-4">
                <p className="eyebrow flex items-center gap-3 text-leaf-700">
                  {ar ? "مشاريع مختارة" : "Selected projects"}
                </p>
              </div>
              <h2 className="text-balance font-display text-display-md font-normal text-ink">
                {ar ? "خبرة مثبتة في مواقع الطاقة الرئيسية في قطر." : "Proven delivery at Qatar's key energy sites."}
              </h2>
            </div>
            <ol className="border-t border-ink/10 lg:col-span-8">
              {c.projects[locale].map((p, i) => (
                <Reveal as="li" key={p} delay={i * 0.04} className="flex gap-4 border-b border-ink/10 py-6">
                  <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c.accent }} />
                  <p className="text-[1.05rem] leading-relaxed text-ink">{p}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Facilities + contact */}
      <section className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
        <div className="container relative grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-6 flex items-center gap-4">
              <p className="eyebrow flex items-center gap-3 text-leaf-300">
                {ar ? "المرافق" : "Facilities"}
              </p>
            </div>
            <ul className="border-t border-white/10">
              {c.facilities[locale].map((f) => (
                <li key={f} className="flex items-start gap-4 border-b border-white/10 py-6">
                  <MapPin className="mt-1 h-4 w-4 shrink-0" style={{ color: c.accent }} />
                  <span className="font-display text-[1.3rem] leading-snug">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <Reveal className="lg:col-span-5">
            <div className="rounded-[2px] border border-white/15 bg-white/[0.04] p-8">
              <p className="eyebrow text-white/50">{ar ? "تواصل مع الشركة" : "Contact the company"}</p>
              <p className="mt-4 font-display text-2xl">{c.name[locale]}</p>
              <dl className="mt-6 space-y-4 text-[0.95rem]">
                <div>
                  <dt className="text-white/45">{ar ? "العنوان" : "Address"}</dt>
                  <dd className="mt-1 text-white/85">{c.contact.address[locale]}</dd>
                </div>
                <div>
                  <dt className="text-white/45">{ar ? "الهاتف" : "Phone"}</dt>
                  <dd className="mt-1">
                    <a href={`tel:${c.contact.phone.replace(/\s/g, "")}`} dir="ltr" className="num font-mono text-white/85 hover:text-white">
                      {c.contact.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-white/45">{ar ? "البريد الإلكتروني" : "Email"}</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${c.contact.email}`} className="text-white/85 hover:text-white">
                      {c.contact.email}
                    </a>
                  </dd>
                </div>
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <Btn href={href(locale, "/contact")}>{ar ? "أرسل استفسارًا" : "Send an enquiry"}</Btn>
                {c.website && (
                  <Btn href={c.website} external variant="outline-light">
                    {ar ? "الموقع الإلكتروني" : "Website"}
                  </Btn>
                )}
              </div>
            </div>
          </Reveal>
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
            <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.06}>
                  <NewsCard post={p} locale={locale} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other companies */}
      <section className="bg-pearl-50 py-24">
        <div className="container">
          <p className="eyebrow mb-8 text-haze">{ar ? "شركات المجموعة الأخرى" : "Other group companies"}</p>
          <div className="grid gap-4 md:grid-cols-2">
            {others.map((o) => (
              <Link key={o.id} href={href(locale, `/companies/${o.slug}`)} className="group relative isolate flex min-h-[260px] flex-col justify-end overflow-hidden rounded-[2px] bg-ink-900 p-8 text-white">
                <div data-vt="media" className="absolute inset-0 -z-10 overflow-hidden">
                  <Image src={o.image} alt="" fill sizes="50vw" className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/55 to-ink-900/10" />
                </div>
                <span className="mt-3 flex items-center justify-between gap-4">
                  <span className="font-display text-[1.8rem] leading-tight">{o.name[locale]}</span>
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
