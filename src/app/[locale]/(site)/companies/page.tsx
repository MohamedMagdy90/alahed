import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Parallax, Reveal } from "@/components/motion";
import { PageHero } from "@/components/site/PageHero";
import { Arrow, Btn, Em, SectionHeading, TextLink } from "@/components/site/primitives";
import { companies, sectors } from "@/content/site";
import { type Locale, isLocale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  const ar = locale === "ar";
  return {
    title: ar ? "شركات المجموعة" : "Group companies",
    description: ar
      ? "العهد للتجارة والمقاولات ودوبت وبمكو للفحص: ثلاث شركات متخصصة تغطي دورة حياة الأصول في قطاع الطاقة القطري."
      : "Al-Ahed Trading & Contracting, DOPET and PEMCO Inspection: three specialist companies covering the asset life cycle in Qatar's energy sector.",
    alternates: { languages: { en: "/en/companies", ar: "/ar/companies" } },
  };
}

const CHAIN = [
  { id: "aatc", en: "Supply & service", ar: "التوريد والخدمة", den: "Critical process equipment from global principals, with certified local service and repair.", dar: "معدات العمليات الحيوية من الشركاء العالميين، مع خدمات صيانة وإصلاح محلية معتمدة." },
  { id: "dopet", en: "Build & maintain", ar: "الإنشاء والصيانة", den: "EPIC projects, construction, shutdowns and turnarounds, fabrication and skilled manpower.", dar: "مشاريع الهندسة والتوريد والإنشاء، وأعمال الإنشاء والإيقاف والصيانة الشاملة، والتصنيع والقوى العاملة الماهرة." },
  { id: "pemco", en: "Inspect & assure", ar: "الفحص والضمان", den: "Independent inspection, NDT and quality assurance that protect asset integrity.", dar: "فحص مستقل واختبارات غير إتلافية وضمان جودة يحمي سلامة الأصول." },
] as const;

export default async function CompaniesPage({ params }: P) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const ar = locale === "ar";

  return (
    <>
      <PageHero
        locale={locale}
        image="/images/refinery-towers.jpg"
        eyebrow={ar ? "شركات المجموعة" : "Group companies"}
        crumbs={[{ label: ar ? "شركات المجموعة" : "Group companies" }]}
        title={
          ar ? (
            <>
              ثلاث شركات متخصصة. <Em className="text-leaf-300">مجموعة واحدة.</Em>
            </>
          ) : (
            <>
              Three specialist companies. <Em className="text-leaf-300">One group.</Em>
            </>
          )
        }
        intro={
          ar
            ? "تجمع العهد القابضة ثلاث شركات تشغيلية تكمل بعضها بعضًا، وتخدم معًا المشغّلين والمقاولين في قطاعات النفط والغاز والبتروكيماويات في قطر."
            : "Al-Ahed Holding brings together three complementary operating companies that together serve operators and contractors across Qatar's oil, gas and petrochemical industries."
        }
        aside={
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[2px] border border-white/15 bg-white/10">
            {companies.map((c) => (
              <div key={c.id} className="bg-ink-900/60 p-5 backdrop-blur">
                <p className="num font-display text-3xl">{c.founded}</p>
                <p className="mt-2 text-[0.8rem] leading-snug text-white/60">{c.short[locale]}</p>
              </div>
            ))}
          </div>
        }
      />

      {/* Companies as editorial rows */}
      <section className="bg-pearl-50 py-24 md:py-32">
        <div className="container space-y-24 md:space-y-32">
          {companies.map((c, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={c.id} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                <Reveal className={flip ? "lg:order-2 lg:col-span-6" : "lg:col-span-6"}>
                  <Link href={href(locale, `/companies/${c.slug}`)} className="group block">
                    <Parallax className="aspect-[4/3] rounded-[2px] bg-ink" amount={40}>
                      <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-1400 ease-out-expo group-hover:scale-105" />
                    </Parallax>
                  </Link>
                </Reveal>
                <Reveal delay={0.1} className={flip ? "lg:order-1 lg:col-span-6" : "lg:col-span-6"}>
                  <div className="flex items-center gap-4">
                    <span className="num font-mono text-xs text-haze">{c.index}</span>
                    <span className="h-px w-10" style={{ background: c.accent }} />
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-haze rtl:font-arabic rtl:text-[0.8rem] rtl:normal-case rtl:tracking-normal">
                      {ar ? `تأسست ${c.founded}` : `Est. ${c.founded}`}
                    </span>
                  </div>
                  <div className="mt-8 inline-grid h-16 place-items-center rounded-[2px] border border-ink/10 bg-white px-5">
                    <Image src={c.logo} alt={c.name[locale]} width={160} height={64} className="h-10 w-auto max-w-[150px] object-contain" />
                  </div>
                  <h2 className="mt-8 font-display text-display-md font-normal text-ink">{c.name[locale]}</h2>
                  <p className="mt-2 text-[0.92rem] text-haze">{c.legal[locale]}</p>
                  <p className="mt-6 text-pretty text-[1.05rem] leading-relaxed text-ink/75">{c.summary[locale]}</p>
                  <ul className="mt-8 grid gap-x-8 gap-y-3 border-t border-ink/10 pt-8 sm:grid-cols-2">
                    {c.services[locale].slice(0, 6).map((s) => (
                      <li key={s} className="flex items-start gap-3 text-[0.92rem] text-ink/75">
                        <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full" style={{ background: c.accent }} />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <Btn href={href(locale, `/companies/${c.slug}`)} variant="dark">
                      {ar ? "استكشف الشركة" : "Explore company"}
                    </Btn>
                    {c.website && (
                      <TextLink href={c.website} external>
                        {ar ? "زيارة الموقع" : "Visit website"}
                      </TextLink>
                    )}
                  </div>
                </Reveal>
              </article>
            );
          })}
        </div>
      </section>

      {/* Value chain */}
      <section className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
        <div className="grid-lines pointer-events-none absolute inset-0" />
        <div className="container relative">
          <SectionHeading
            tone="dark"
            index="02"
            eyebrow={ar ? "كيف نعمل معًا" : "How we work together"}
            title={
              ar ? (
                <>
                  نموذج متكامل <Em className="text-leaf-300">عبر دورة حياة الأصول.</Em>
                </>
              ) : (
                <>
                  An integrated model <Em className="text-leaf-300">across the asset life cycle.</Em>
                </>
              )
            }
            intro={
              ar
                ? "يمكن لعملائنا الاستعانة بشركة واحدة أو بالمجموعة كاملة، من توريد المعدات إلى التنفيذ ثم الفحص المستقل."
                : "Clients can engage a single company or the whole Group — from equipment supply, to execution, to independent assurance."
            }
          />
          <ol className="relative mt-16 grid gap-px overflow-hidden rounded-[2px] border border-white/10 bg-white/10 lg:grid-cols-3">
            {CHAIN.map((s, i) => {
              const c = companies.find((x) => x.id === s.id)!;
              return (
                <Reveal as="li" key={s.id} delay={i * 0.1} className="group relative bg-ink p-8 md:p-10">
                  <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: c.accent }} />
                  <div className="flex items-center justify-between">
                    <span className="num font-mono text-xs text-white/40">{String(i + 1).padStart(2, "0")}</span>
                    {i < CHAIN.length - 1 && <Arrow className="hidden text-white/30 lg:block" />}
                  </div>
                  <p className="mt-10 font-display text-[1.9rem] leading-tight">{ar ? s.ar : s.en}</p>
                  <p className="mt-4 text-[0.98rem] leading-relaxed text-white/60">{ar ? s.dar : s.den}</p>
                  <Link href={href(locale, `/companies/${c.slug}`)} className="mt-10 inline-flex items-center gap-2 text-[0.9rem] text-white">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.accent }} />
                    <span className="link-underline">{c.name[locale]}</span>
                  </Link>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Sectors + CTA */}
      <section className="bg-white py-24 md:py-32">
        <div className="container grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="mb-6 flex items-center gap-4">
              <span className="num font-mono text-xs text-haze">03</span>
              <p className="eyebrow flex items-center gap-3 text-leaf-700">
                <span aria-hidden className="h-px w-7 bg-current" />
                {ar ? "القطاعات التي نخدمها" : "Sectors we serve"}
              </p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {sectors.map((s) => (
                <li key={s.en} className="inline-flex h-12 items-center rounded-full border border-ink/10 bg-pearl-50 px-6 font-display text-[1.1rem] text-ink">
                  {s[locale]}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5 lg:ps-8">
            <p className="text-pretty text-[1.05rem] leading-relaxed text-haze">
              {ar ? "هل تبحث عن شريك لمشروعك القادم؟ فريقنا جاهز لمناقشة متطلباتك." : "Looking for a partner for your next project? Our team is ready to discuss your requirements."}
            </p>
            <Btn href={href(locale, "/contact")} className="mt-8">
              {ar ? "تواصل معنا" : "Contact us"}
            </Btn>
          </div>
        </div>
      </section>
    </>
  );
}
