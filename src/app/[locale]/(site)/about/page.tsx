import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion";
import { Timeline } from "@/components/pages/about/Timeline";
import { ArcsMark } from "@/components/site/OrbitArcs";
import { CompanyLogo } from "@/components/site/CompanyLogo";
import { PageHero } from "@/components/site/PageHero";
import { Arrow, Btn, Em, SectionHeading } from "@/components/site/primitives";
import { companies, milestones, mission, values, vision, yearsSince } from "@/content/site";
import { type Locale, isLocale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  const ar = locale === "ar";
  return {
    title: ar ? "قصتنا" : "Our story",
    description: ar
      ? "مسيرة العهد القابضة منذ عام 1975: الرؤية والرسالة والقيم، وهيكل المجموعة وشركاتها الثلاث."
      : "The story of Al-Ahed Holding since 1975: our vision, mission and values, and the structure of the Group and its three companies.",
    alternates: { languages: { en: "/en/about", ar: "/ar/about" } },
  };
}

export default async function AboutPage({ params }: P) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const ar = locale === "ar";
  const years = yearsSince();
  const items = milestones.map((m) => ({
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
            ? `منذ ${years} عامًا، تعمل العهد جنبًا إلى جنب مع المشغّلين والمقاولين في قطر، وتنمو معهم من شركة توريد واحدة إلى مجموعة متكاملة من ثلاث شركات.`
            : `For ${years} years, Al-Ahed has worked alongside Qatar's operators and contractors — growing with them from a single supply business into an integrated group of three companies.`
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
                ? "بدأت قصتنا عام 1975 مع انطلاق صناعة النفط والغاز في قطر. واليوم، تجمع العهد القابضة ثلاث شركات متخصصة تحت مظلة استراتيجية واحدة، يوحّدها التزام راسخ بالجودة والسلامة والنزاهة."
                : "Our story began in 1975, as Qatar's oil and gas industry was taking shape. Today Al-Ahed Holding brings three specialist companies under one strategic umbrella — united by an enduring commitment to quality, safety and integrity."}
            </p>
            <div className="mt-16 grid gap-10 border-t border-ink/10 pt-12 md:grid-cols-2">
              <Reveal>
                <p className="text-pretty text-[1.02rem] leading-relaxed text-haze">{companies[0].about[locale][0]}</p>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="text-pretty text-[1.02rem] leading-relaxed text-haze">
                  {ar
                    ? "وفي عام 1981 تأسست دوبت لتضيف قدرات الهندسة والتوريد والإنشاء والصيانة، فيما تقدّم بمكو للفحص خدمات الفحص المستقل وضمان الجودة. وفي عام 2018 تأسست العهد القابضة شركةً أمًّا للمجموعة، استعدادًا لمرحلة جديدة من النمو والحوكمة."
                    : "In 1981 DOPET was founded, adding engineering, procurement, construction and maintenance capability, while PEMCO Inspection provides independent inspection and quality assurance. In 2018, Al-Ahed Holding was established as the Group's parent company, preparing for a new phase of growth and governance."}
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
            <li className="relative hidden overflow-hidden bg-ink p-8 text-white lg:block">
              <ArcsMark className="absolute -bottom-24 -end-24 h-72 w-72 opacity-40" />
              <p className="relative font-display text-[1.4rem] leading-tight">{ar ? "منذ 1975" : "Since 1975"}</p>
              <p className="relative mt-4 text-[0.92rem] leading-relaxed text-white/60">
                {ar ? "قيم راسخة تتوارثها الأجيال في المجموعة." : "Values carried across generations of the Group."}
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Group structure */}
      <section className="bg-white py-24 md:py-32">
        <div className="container">
          <SectionHeading
            eyebrow={ar ? "هيكل المجموعة" : "Group structure"}
            title={
              ar ? (
                <>
                  شركة أم واحدة، <Em className="text-brand">وثلاث شركات تشغيلية.</Em>
                </>
              ) : (
                <>
                  One parent company, <Em className="text-brand">three operating companies.</Em>
                </>
              )
            }
          />
          <Reveal className="mt-16">
            <div className="mx-auto flex max-w-sm flex-col items-center rounded-[2px] bg-ink-900 px-8 py-7 text-center text-white">
              <Image src="/brand/alahed-holding.png" alt="" width={366} height={100} className="h-auto w-44 [filter:brightness(0)_invert(1)]" />
              <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/50 rtl:font-arabic rtl:text-[0.8rem] rtl:normal-case rtl:tracking-normal">
                {ar ? "الشركة الأم · 2018" : "Parent company · 2018"}
              </p>
            </div>
            <div aria-hidden className="mx-auto h-10 w-px bg-ink/20" />
            <div aria-hidden className="mx-auto hidden h-px w-2/3 bg-ink/20 md:block" />
            <div className="grid gap-4 md:grid-cols-3">
              {companies.map((c) => (
                <div key={c.id} className="flex flex-col items-center">
                  <span aria-hidden className="hidden h-10 w-px bg-ink/20 md:block" />
                  <Link
                    href={href(locale, `/companies/${c.slug}`)}
                    className="group flex w-full flex-col items-center rounded-[2px] border border-ink/10 bg-pearl-50 p-7 text-center transition-colors hover:border-ink/30 hover:bg-white"
                  >
                    <span className="grid h-16 w-full place-items-center">
                      <CompanyLogo id={c.id} locale={locale} size={40} decorative />
                    </span>
                    <span className="mt-5 font-display text-[1.2rem] text-ink">{c.name[locale]}</span>
                    <span className="num mt-1 text-[0.85rem] text-haze">{ar ? `تأسست عام ${c.founded}` : `Established ${c.founded}`}</span>
                    <span className="mt-5 inline-flex items-center gap-2 text-[0.85rem] text-ink/70 group-hover:text-ink">
                      {ar ? "استكشف" : "Explore"} <Arrow className="text-leaf-700" />
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white pb-24 md:pb-32">
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
