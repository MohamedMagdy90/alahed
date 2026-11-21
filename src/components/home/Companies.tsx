import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion";
import { Arrow, Em, SectionHeading, TextLink } from "@/components/site/primitives";
import { companies } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";

export function Companies({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container">
        <SectionHeading
          index="02"
          eyebrow={ar ? "شركات المجموعة" : "Group companies"}
          title={
            ar ? (
              <>
                ثلاث شركات متخصصة. <Em className="text-brand">مجموعة واحدة متكاملة.</Em>
              </>
            ) : (
              <>
                Three specialist companies. <Em className="text-brand">One integrated group.</Em>
              </>
            )
          }
          intro={
            ar
              ? "من توريد المعدات الحيوية وصيانتها، إلى تنفيذ المشاريع والإيقاف الشامل، وصولًا إلى الفحص المستقل، تغطي شركاتنا دورة حياة الأصول بالكامل."
              : "From supplying and servicing critical equipment, to delivering projects and turnarounds, to independent inspection — our companies cover the full asset life cycle."
          }
          action={<TextLink href={href(locale, "/companies")}>{ar ? "جميع شركات المجموعة" : "All group companies"}</TextLink>}
        />

        <Reveal className="mt-14 md:mt-16">
          <div className="flex flex-col gap-3 lg:h-[680px] lg:flex-row">
            {companies.map((c) => (
              <Link
                key={c.id}
                href={href(locale, `/companies/${c.slug}`)}
                className="group relative isolate flex min-h-[520px] flex-col justify-between overflow-hidden rounded-[2px] bg-ink-900 p-7 text-white transition-[flex-grow] duration-700 ease-out-expo md:p-9 lg:min-h-0 lg:flex-1 lg:hover:flex-[1.75]"
              >
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="-z-20 object-cover opacity-55 transition-[transform,opacity] duration-1400 ease-out-expo group-hover:scale-105 group-hover:opacity-70"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900 via-ink-900/70 to-ink-900/20" />
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-700 ease-out-expo group-hover:scale-x-100 rtl:origin-right"
                  style={{ background: c.accent }}
                />

                <div className="flex items-start justify-between gap-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/60 rtl:font-arabic rtl:text-[0.8rem] rtl:normal-case rtl:tracking-normal">
                  <span className="num">{c.index}</span>
                  <span className="num">{ar ? `تأسست ${c.founded}` : `Est. ${c.founded}`}</span>
                </div>

                <div>
                  <div className="mb-7 inline-grid h-14 min-w-[96px] place-items-center rounded-[2px] bg-white px-4 py-2">
                    <Image src={c.logo} alt={c.name[locale]} width={140} height={56} className="h-9 w-auto max-w-[120px] object-contain" />
                  </div>
                  <h3 className="font-display text-[clamp(1.75rem,2.4vw,2.35rem)] font-normal leading-[1.08]">{c.name[locale]}</h3>
                  <p className="mt-3 max-w-md text-pretty text-[0.98rem] leading-relaxed text-white/70">{c.tagline[locale]}</p>

                  <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-out-expo lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <ul className="mt-6 space-y-2 border-t border-white/15 pt-6 lg:opacity-0 lg:transition-opacity lg:duration-500 lg:group-hover:opacity-100 lg:group-hover:delay-200">
                        {c.services[locale].slice(0, 4).map((s) => (
                          <li key={s} className="flex items-start gap-3 text-[0.9rem] text-white/80">
                            <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full" style={{ background: c.accent }} />
                            <span className="line-clamp-1">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <span className="mt-8 inline-flex items-center gap-2 text-[0.9rem] font-medium">
                    <span className="link-underline">{ar ? "استكشف الشركة" : "Explore company"}</span>
                    <Arrow className="text-leaf-300" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
