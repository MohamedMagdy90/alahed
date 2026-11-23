import Image from "next/image";
import { TextLink } from "@/components/site/primitives";
import { aboutStatement, facts, sectorsSentence } from "@/content/pages/home";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";

export function Intro({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  return (
    <section className="bg-pearl-50 py-24 md:py-32">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-[0.95rem] font-medium text-leaf-700">{ar ? "عن المجموعة" : "About the Group"}</h2>
            <p className="mt-6 text-pretty font-display text-[clamp(1.5rem,2.45vw,2.3rem)] leading-[1.28] tracking-[-0.015em] text-ink">
              {aboutStatement[locale]}
            </p>
            <p className="mt-8 max-w-xl text-pretty text-[1.02rem] leading-relaxed text-haze">{sectorsSentence[locale]}</p>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              <TextLink href={href(locale, "/about")}>{ar ? "قصة المجموعة" : "Our story"}</TextLink>
              <TextLink href={href(locale, "/leadership")}>{ar ? "القيادة" : "Leadership"}</TextLink>
            </div>
          </div>
          <figure className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-pearl-200">
              <Image
                src="/images/hq.jpg"
                alt={ar ? "مقر العهد القابضة في الدوحة" : "Al-Ahed Holding headquarters, Doha"}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-[0.85rem] text-haze">{ar ? "المقر الرئيسي للمجموعة، الدوحة" : "Group headquarters, Doha"}</figcaption>
          </figure>
        </div>

        {/*
          The longest value ("171,500 m²") is ~4.4x its font size wide (Arabic digits are wider). Number and unit stay on
          one line, so: below lg the last fact spans the leftover cells (2 cols: its own row, 3 cols: beside the 4th),
          and in the 5-column row every value is capped to a fifth of the row (cqi of this <dl>), so all five stay the
          same size and only shrink when the columns get narrow.
        */}
        <dl className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-ink/10 pt-10 [container-type:inline-size] sm:grid-cols-3 lg:grid-cols-5">
          {facts.map((f, i) => (
            <div key={f.label.en} className={i === facts.length - 1 ? "col-span-2 flex flex-col-reverse justify-end lg:col-span-1" : "flex flex-col-reverse justify-end"}>
              <dt className="mt-3 max-w-[14rem] text-[0.92rem] leading-snug text-haze">{f.label[locale]}</dt>
              {/* Number and unit stay on one line; the unit is small beside it (as on About and the company pages). */}
              <dd className="num whitespace-nowrap font-display text-[clamp(2.4rem,3.6vw,3.4rem)] leading-none tracking-[-0.03em] text-ink lg:[font-size:min(clamp(2.4rem,3.6vw,3.4rem),calc((100cqi_-_6rem)/24))]">
                {f.value}
                {f.unit && <span className="ms-1.5 text-[0.4em] tracking-normal text-haze">{f.unit[locale]}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
