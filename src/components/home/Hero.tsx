import Image from "next/image";
import { LineReveal, Reveal } from "@/components/motion";
import { OrbitArcs } from "@/components/site/OrbitArcs";
import { Btn, Em } from "@/components/site/primitives";
import { companies, yearsSince } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";

export function Hero({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const years = yearsSince();
  // Orbit arcs: outer → PEMCO, middle → DOPET, inner (green) → Al-Ahed T&C
  const order = ["pemco", "dopet", "aatc"] as const;
  const labels = order.map((id) => {
    const c = companies.find((x) => x.id === id)!;
    return {
      index: c.index,
      name: c.name[locale],
      meta: ar ? `تأسست ${c.founded}` : `Est. ${c.founded}`,
      href: href(locale, `/companies/${c.slug}`),
    };
  });

  const stats = [
    { v: String(years), l: ar ? "عامًا في قطر" : "Years in Qatar" },
    { v: "03", l: ar ? "شركات تشغيلية" : "Operating companies" },
    { v: "13+", l: ar ? "شريكًا عالميًا" : "Global principals" },
  ];

  return (
    <section className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink-900 text-white">
      <Image
        src="/images/doha-night.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-30 animate-kenburns object-cover object-[50%_60%] opacity-60"
      />
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-ink-900 via-ink-900/40 to-ink-900/70" />
      <div className="absolute inset-0 -z-20 from-ink-900 via-ink-900/70 to-ink-900/10 ltr:bg-gradient-to-r rtl:bg-gradient-to-l" />
      <div className="grid-lines absolute inset-0 -z-10" />

      {/* Orbit */}
      <div className="pointer-events-none absolute -end-[38%] top-[18%] -z-10 w-[120vw] opacity-40 sm:-end-[20%] sm:w-[90vw] lg:pointer-events-auto lg:-end-[4%] lg:top-1/2 lg:w-[min(52vw,860px)] lg:-translate-y-[46%] lg:opacity-100 [&_.orbit-label]:hidden lg:[&_.orbit-label]:block">
        <OrbitArcs labels={labels} mirror={ar} delay={0.5} />
      </div>

      <div className="container relative flex flex-1 flex-col justify-center pb-16 pt-40 lg:pb-24">
        <div className="max-w-[46rem] lg:max-w-[52%]">
          <Reveal delay={0.1}>
            <p className="eyebrow mb-8 flex flex-wrap items-center gap-3 text-white/70">
              <span aria-hidden className="h-px w-7 bg-leaf" />
              <span className="text-leaf-300">{ar ? "العهد القابضة" : "Al-Ahed Holding"}</span>
              <span className="text-white/30">/</span>
              <span>{ar ? "منذ 1975" : "Est. 1975"}</span>
              <span className="text-white/30">/</span>
              <span>{ar ? "الدوحة، قطر" : "Doha, Qatar"}</span>
            </p>
          </Reveal>

          <h1 className="font-display text-[clamp(2.9rem,6.4vw,6.5rem)] font-normal leading-[0.98] tracking-[-0.035em]">
            <LineReveal delay={0.15}>{ar ? "خمسة عقود." : "Five decades."}</LineReveal>
            <LineReveal delay={0.27}>
              <span className="text-white/55">{ar ? "ثلاث شركات." : "Three companies."}</span>
            </LineReveal>
            <LineReveal delay={0.39}>
              {ar ? (
                <>
                  مجموعة <Em className="text-leaf">واحدة.</Em>
                </>
              ) : (
                <>
                  One <Em className="text-leaf">group.</Em>
                </>
              )}
            </LineReveal>
          </h1>

          <Reveal delay={0.55}>
            <p className="mt-9 max-w-xl text-pretty text-[1.08rem] leading-relaxed text-white/70 md:text-[1.15rem]">
              {ar
                ? "منذ عام 1975، تدعم العهد القابضة قطاعات النفط والغاز والبتروكيماويات في قطر من خلال ثلاث شركات متخصصة: تمثيل العلامات التجارية العالمية، ومشاريع الإنشاء والصيانة، والفحص المستقل."
                : "Since 1975, Al-Ahed Holding has supported Qatar's oil, gas and petrochemical industries through three specialist companies — global brand representation, EPIC and maintenance services, and independent inspection."}
            </p>
          </Reveal>

          <Reveal delay={0.68}>
            <div className="mt-11 flex flex-wrap gap-3">
              <Btn href={href(locale, "/about")}>{ar ? "اكتشف المجموعة" : "Discover the Group"}</Btn>
              <Btn href={href(locale, "/investors")} variant="outline-light">
                {ar ? "علاقات المستثمرين" : "Investor relations"}
              </Btn>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="relative border-t border-white/10 bg-ink-900/40 backdrop-blur-[2px]">
        <div className="container grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal
              key={s.l}
              delay={0.8 + i * 0.08}
              className="flex items-baseline gap-3 border-white/10 py-6 md:border-e md:py-7 md:ps-0 [&:not(:first-child)]:md:ps-8"
            >
              <span className="num font-display text-[1.9rem] leading-none text-white md:text-[2.2rem]">{s.v}</span>
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/50 rtl:font-arabic rtl:text-[0.8rem] rtl:normal-case rtl:tracking-normal">
                {s.l}
              </span>
            </Reveal>
          ))}
          <Reveal delay={1.05} className="hidden items-center justify-end gap-4 py-7 md:flex">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/50 rtl:font-arabic rtl:text-[0.8rem] rtl:normal-case rtl:tracking-normal">
              {ar ? "مرّر للأسفل" : "Scroll to explore"}
            </span>
            <span className="relative h-10 w-px overflow-hidden bg-white/15">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_cubic-bezier(0.76,0,0.24,1)_infinite] bg-leaf" />
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
