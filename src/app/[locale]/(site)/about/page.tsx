import type { Metadata } from "next";
import { Reveal } from "@/components/motion";
import { GroupStructure } from "@/components/pages/about/GroupStructure";
import { Timeline } from "@/components/pages/about/Timeline";
import { ArcsMark } from "@/components/site/ArcsMark";
import { PageHero } from "@/components/site/PageHero";
import { Btn, Em, SectionHeading } from "@/components/site/primitives";
import { footprint, holdingAbout, oemCentres, oemNote, properties, shareholders, workshops, workshopsNote } from "@/content/group";
import { companies, milestones, mission, values, vision, yearsSince } from "@/content/site";
import { type Locale, isLocale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import { getListingVisible } from "@/lib/queries";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  const ar = locale === "ar";
  return {
    title: ar ? "قصتنا" : "Our story",
    description: ar
      ? "مسيرة العهد القابضة منذ عام 1975: الرؤية والرسالة والقيم، وهيكل المجموعة وشركاتها الأربع."
      : "The story of Al-Ahed Holding since 1975: our vision, mission and values, and the structure of the Group and its four companies.",
    alternates: { languages: { en: "/en/about", ar: "/ar/about" } },
  };
}

export default async function AboutPage({ params }: P) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const ar = locale === "ar";
  const years = yearsSince();
  const listing = await getListingVisible();
  const items = milestones.filter((m) => listing || !m.listing).map((m) => ({
    year: m.year === "Next" ? (ar ? "القادم" : "Next") : ar && m.year === "2000s" ? "2000+" : m.year,
    title: m.title[locale],
    body: m.body[locale],
  }));

  return (
    <>
      <PageHero
        locale={locale}
        image="/images/doha-dusk.jpg"
        size="lg"
        eyebrow={ar ? "من نحن" : "Who we are"}
        crumbs={[{ label: ar ? "قصتنا" : "Our story" }]}
        title={
          ar ? (
            <>
              خمسة عقود في بناء <Em className="text-leaf-300">قطاع الطاقة في قطر.</Em>
            </>
          ) : (
            <>
              Five decades building <Em className="text-leaf-300">Qatar's energy sector.</Em>
            </>
          )
        }
        intro={
          ar
            ? `منذ ${years} عامًا، تعمل العهد جنبًا إلى جنب مع المشغّلين والمقاولين في قطر، وتنمو معهم من شركة توريد واحدة إلى مجموعة متكاملة من أربع شركات.`
            : `For ${years} years, Al-Ahed has worked alongside Qatar's operators and contractors — growing with them from a single supply business into an integrated group of four companies.`
        }
      />

      {/* Story */}
      <section className="bg-pearl-50 py-24 md:py-32">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-4 lg:sticky lg:top-32">
              <p className="eyebrow flex items-center gap-3 text-leaf-700">
                {ar ? "قصتنا" : "Our story"}
              </p>
            </div>
          </div>
          <div className="lg:col-span-9">
            <p className="text-pretty font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.22] tracking-[-0.02em] text-ink">
              {ar
                ? "بدأت قصتنا عام 1975 مع انطلاق صناعة النفط والغاز في قطر. واليوم، تجمع العهد القابضة أربع شركات متخصصة تحت مظلة استراتيجية واحدة، يوحّدها التزام راسخ بالجودة والسلامة والنزاهة."
                : "Our story began in 1975, as Qatar's oil and gas industry was taking shape. Today Al-Ahed Holding brings four specialist companies under one strategic umbrella — united by an enduring commitment to quality, safety and integrity."}
            </p>
            <div className="mt-16 grid gap-10 border-t border-ink/10 pt-12 md:grid-cols-2">
              <Reveal>
                <p className="text-pretty text-[1.02rem] leading-relaxed text-haze">{companies[0].about[locale][0]}</p>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="text-pretty text-[1.02rem] leading-relaxed text-haze">
                  {ar
                    ? "وفي عام 1981 تأسست دوبت لتضيف قدرات الهندسة والتوريد والإنشاء والصيانة، ثم تأسست بمكو للفحص عام 1987 لتقدّم الاختبارات غير الإتلافية والفحص المستقل. وفي عام 2000 أنشأت دوبت قسم المبيعات والتكنولوجيا الذي أصبح عام 2019 شركة دوبت للمبيعات والتكنولوجيا. وفي عام 2018 تأسست العهد القابضة شركةً أمًّا للمجموعة، استعدادًا لمرحلة جديدة من النمو والحوكمة."
                    : "DOPET followed in 1981, adding engineering, procurement, construction and maintenance capability, and PEMCO Inspection in 1987, bringing non-destructive testing and independent inspection. DOPET's Sales & Technology Division, formed in 2000, became DOPET Sales & Technologies in 2019. In 2018, Al-Ahed Holding was established as the Group's parent company, preparing for a new phase of growth and governance."}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative overflow-hidden bg-ink-900 py-24 text-white md:py-32">
        <div className="container relative">
          <SectionHeading
            tone="dark"
            eyebrow={ar ? "محطات بارزة" : "Milestones"}
            title={
              ar ? (
                <>
                  من 1975 <Em className="text-leaf-300">إلى الفصل القادم.</Em>
                </>
              ) : (
                <>
                  From 1975 <Em className="text-leaf-300">to the next chapter.</Em>
                </>
              )
            }
          />
          <div className="mt-16">
            <Timeline items={items} locale={locale} />
          </div>
        </div>
      </section>

      {/* Vision & mission */}
      <section className="bg-white py-24 md:py-32">
        <div className="container grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="mb-8 flex items-center gap-4">
              <p className="eyebrow flex items-center gap-3 text-leaf-700">
                {ar ? "رؤيتنا" : "Our vision"}
              </p>
            </div>
            <Reveal>
              <blockquote className="relative text-pretty font-display text-[clamp(1.7rem,2.8vw,2.6rem)] leading-[1.2] text-ink">
                <span aria-hidden className="absolute -start-2 -top-8 font-serif text-[6rem] leading-none text-leaf/30 rtl:hidden">
                  “
                </span>
                {vision[locale]}
              </blockquote>
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="mb-8 flex items-center gap-4">
              <p className="eyebrow flex items-center gap-3 text-leaf-700">
                {ar ? "رسالتنا" : "Our mission"}
              </p>
            </div>
            <div className="space-y-6 border-s-2 border-leaf ps-6">
              {mission[locale].map((m, i) => (
                <Reveal key={m.slice(0, 16)} delay={i * 0.08}>
                  <p className="text-pretty text-[1.02rem] leading-relaxed text-ink/75">{m}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-pearl-50 py-24 md:py-32">
        <div className="container">
          <SectionHeading
            eyebrow={ar ? "قيمنا" : "Our values"}
            title={
              ar ? (
                <>
                  سبع قيم <Em className="text-brand">توجّه كل ما نقوم به.</Em>
                </>
              ) : (
                <>
                  Seven values that <Em className="text-brand">guide everything we do.</Em>
                </>
              )
            }
          />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title.en} delay={(i % 4) * 0.05} className="group relative bg-white p-7 transition-colors duration-500 hover:bg-ink hover:text-white md:p-8">
                <p className="mt-10 font-display text-[1.4rem] leading-tight">{v.title[locale]}</p>
                <p className="mt-4 text-[0.92rem] leading-relaxed text-haze group-hover:text-white/65">{v.body[locale]}</p>
              </Reveal>
            ))}
            {/* 7 values + this tile = complete rows in both the 2- and 4-column layouts */}
            <li className="relative hidden overflow-hidden bg-ink p-8 text-white sm:block">
              <ArcsMark className="absolute -bottom-24 -end-24 h-72 w-72 opacity-40" />
              <p className="relative font-display text-[1.4rem] leading-tight">{ar ? "منذ 1975" : "Since 1975"}</p>
              <p className="relative mt-4 text-[0.92rem] leading-relaxed text-white/60">
                {ar ? "قيم راسخة تتوارثها الأجيال في المجموعة." : "Values carried across generations of the Group."}
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Group structure: shareholders → holding → four wholly owned companies */}
      <section className="bg-white py-24 md:py-32">
        <div className="container">
          <SectionHeading
            eyebrow={ar ? "هيكل المجموعة" : "Group structure"}
            title={ar ? "شركة أم واحدة، وأربع شركات مملوكة لها بالكامل." : "One parent company, four wholly owned operating companies."}
            intro={holdingAbout[locale][1]}
          />
          <div className="mt-16 md:mt-20">
            <GroupStructure
              locale={locale}
              shareholders={shareholders.map((s) => ({ name: s.name[locale], rep: s.rep[locale], stake: s.stake }))}
              companies={companies.map((c) => ({
                id: c.id,
                href: href(locale, `/companies/${c.slug}`),
                name: c.name[locale],
                tagline: c.tagline[locale],
                founded: c.founded,
                within: c.parent ? companies.find((x) => x.id === c.parent)?.short[locale] : undefined,
                accent: c.accent,
              }))}
            />
          </div>
        </div>
      </section>

      {/* Property portfolio, operating footprint, workshops and OEM service centres */}
      <section className="relative overflow-hidden bg-ink-900 py-24 text-white md:py-32">
        <div className="container relative">
          <SectionHeading
            tone="dark"
            eyebrow={ar ? "الأصول والمرافق" : "Property & facilities"}
            title={ar ? "قاعدة تشغيلية تمتد في أنحاء قطر." : "An operating base that spans Qatar."}
            intro={footprint.intro[locale]}
          />

          <div className="mt-16 grid gap-px overflow-hidden rounded-[2px] border border-white/10 bg-white/10 lg:grid-cols-12">
            <div className="bg-ink-900 p-8 md:p-10 lg:col-span-5">
              <p className="num font-display text-[clamp(2.8rem,5vw,4.2rem)] leading-none tracking-[-0.03em]">
                {footprint.area.toLocaleString("en-US")} <span className="text-[0.45em] text-white/55">m²</span>
              </p>
              <p className="mt-4 max-w-xs text-[0.95rem] text-white/60">{footprint.label[locale]}</p>
              <p className="num mt-10 font-display text-[2.6rem] leading-none">{footprint.locations}</p>
              <p className="mt-3 text-[0.95rem] text-white/60">{ar ? "مواقع صناعية" : "Industrial locations"}</p>
            </div>
            <ul className="grid bg-ink-900 sm:grid-cols-2 lg:col-span-7">
              {footprint.places.map((pl, i) => (
                <li key={pl.en} className="flex items-center gap-4 border-b border-white/10 px-8 py-5 sm:odd:border-e">
                  <span className="num text-[0.8rem] text-white/35">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[1.1rem]">{pl[locale]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-[0.9rem] font-medium text-leaf-300">{ar ? "المحفظة العقارية" : "Corporate & commercial property"}</p>
              <ul className="mt-6 border-t border-white/10">
                {properties.map((pr) => (
                  <li key={pr.name.en} className="border-b border-white/10 py-5">
                    <p className="font-display text-[1.25rem]">{pr.name[locale]}</p>
                    <p className="mt-1 text-[0.92rem] text-white/60">{pr.address[locale]}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[0.9rem] font-medium text-leaf-300">{ar ? "قدرات الورش المتكاملة" : "Integrated workshop capabilities"}</p>
              <ul className="mt-6 grid gap-px overflow-hidden rounded-[2px] border border-white/10 bg-white/10 sm:grid-cols-2">
                {workshops.map((w) => (
                  <li key={w.title.en} className="bg-ink-900 p-6">
                    <p className="num font-display text-[1.9rem] leading-none" dir="ltr" style={{ textAlign: ar ? "right" : "left" }}>
                      {w.value}
                    </p>
                    <p className="mt-3 font-display text-[1.1rem]">{w.title[locale]}</p>
                    <p className="mt-1 text-[0.9rem] leading-snug text-white/55">{w.body[locale]}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[0.9rem] text-white/50">{workshopsNote[locale]}</p>
            </div>
          </div>

          <div className="mt-16">
            <p className="text-[0.9rem] font-medium text-leaf-300">{ar ? "مراكز خدمة مرتبطة بالمصنّعين" : "OEM-linked service centres"}</p>
            <ul className="mt-6 grid gap-px overflow-hidden rounded-[2px] border border-white/10 bg-white/10 md:grid-cols-3">
              {oemCentres.map((o) => {
                const co = companies.find((x) => x.id === o.company);
                return (
                  <li key={o.name} className="relative bg-ink-900 p-7">
                    <span aria-hidden className="absolute inset-x-0 top-0 h-[2px]" style={{ background: co?.accent }} />
                    <p className="font-display text-[1.4rem]">{ar ? `مركز خدمة ${o.name}` : `${o.name} Service Centre`}</p>
                    <p className="mt-2 text-[0.92rem] text-white/65">{o.place[locale]}</p>
                    <p className="num mt-1 text-[0.92rem] text-white/45">{o.area[locale]}</p>
                    {co && <p className="mt-5 text-[0.85rem] text-white/50">{co.short[locale]}</p>}
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-[0.9rem] text-white/50">{oemNote[locale]}</p>
          </div>
        </div>
      </section>
      {/* CTA — follows a dark section, so it needs its own top spacing (bottom-only padding glued it to the section above) */}
      <section className="bg-white py-24 md:py-32">
        <div className="container">
          <div className="relative overflow-hidden rounded-[2px] bg-ink px-8 py-14 text-white md:px-14">
            <ArcsMark className="pointer-events-none absolute -end-20 -top-20 h-80 w-80 opacity-20" />
            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <h2 className="max-w-xl text-balance font-display text-display-md font-normal">
                {ar ? "تعرّف على القيادة التي توجّه المجموعة." : "Meet the leadership guiding the Group."}
              </h2>
              <div className="flex flex-wrap gap-3">
                <Btn href={href(locale, "/leadership")}>{ar ? "القيادة" : "Leadership"}</Btn>
                <Btn href={href(locale, "/governance")} variant="outline-light">
                  {ar ? "الحوكمة" : "Governance"}
                </Btn>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
