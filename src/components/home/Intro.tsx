import Image from "next/image";
import { Reveal, WordReveal } from "@/components/motion";
import { Em, Eyebrow, TextLink } from "@/components/site/primitives";
import { vision } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";

export function Intro({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const statement = ar
    ? "على مدى أكثر من خمسة عقود، أسهمت العهد في بناء البنية التحتية التي تُشغّل قطر، من خلال تمثيل أبرز العلامات العالمية لمعدات العمليات، وتنفيذ أعمال الإنشاء والصيانة المعقّدة، والفحص المستقل لسلامة الأصول الحيوية."
    : "For more than five decades, Al-Ahed has helped build the infrastructure that powers Qatar — representing the world's leading process-equipment brands, delivering complex construction and maintenance work, and independently assuring the integrity of critical assets.";

  return (
    <section className="relative bg-pearl-50 py-24 md:py-36">
      <div className="grid-lines-dark pointer-events-none absolute inset-0" />
      <div className="container relative">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-4 lg:sticky lg:top-32">
              <span className="num font-mono text-xs text-haze">01</span>
              <Eyebrow>{ar ? "من نحن" : "Who we are"}</Eyebrow>
            </div>
          </div>
          <div className="lg:col-span-9">
            <WordReveal text={statement} className="font-display text-[clamp(1.6rem,3vw,2.75rem)] font-normal leading-[1.22] tracking-[-0.02em] text-ink" />

            <div className="mt-20 grid gap-12 border-t border-ink/10 pt-12 md:grid-cols-12">
              <Reveal className="md:col-span-6">
                <figure>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-pearl-200">
                    <Image src="/images/hq.png" alt={ar ? "مقر العهد القابضة في الدوحة" : "Al-Ahed Holding headquarters, Doha"} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
                  </div>
                  <figcaption className="mt-4 flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.14em] text-haze rtl:font-arabic rtl:text-[0.8rem] rtl:normal-case rtl:tracking-normal">
                    <span>{ar ? "المقر الرئيسي للمجموعة" : "Group headquarters"}</span>
                    <span>{ar ? "الدوحة، قطر" : "Doha, Qatar"}</span>
                  </figcaption>
                </figure>
              </Reveal>
              <Reveal delay={0.1} className="flex flex-col md:col-span-6">
                <p className="eyebrow text-haze">{ar ? "رؤيتنا" : "Our vision"}</p>
                <blockquote className="mt-5 text-pretty font-display text-[1.45rem] leading-snug text-ink md:text-[1.6rem]">
                  <span className="text-leaf-700">“</span>
                  {vision[locale]}
                  <span className="text-leaf-700">”</span>
                </blockquote>
                <p className="mt-6 text-pretty text-[1rem] leading-relaxed text-haze">
                  {ar ? (
                    <>
                      مجموعة عائلية قطرية تضم ثلاث شركات تشغيلية، تجمعها قيم <Em className="text-ink">النزاهة والتميّز</Em> وثقة عملائها على مدى أجيال.
                    </>
                  ) : (
                    <>
                      A Qatari family-owned group of three operating companies, united by <Em className="text-ink">integrity and excellence</Em> — and by the trust of clients built over generations.
                    </>
                  )}
                </p>
                <div className="mt-auto flex flex-wrap gap-x-8 gap-y-4 pt-10">
                  <TextLink href={href(locale, "/about")}>{ar ? "قصتنا" : "Our story"}</TextLink>
                  <TextLink href={href(locale, "/leadership")}>{ar ? "القيادة" : "Leadership"}</TextLink>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
