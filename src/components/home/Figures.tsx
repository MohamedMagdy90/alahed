import { Counter, Reveal } from "@/components/motion";
import { ArcsMark } from "@/components/site/OrbitArcs";
import { Em, SectionHeading } from "@/components/site/primitives";
import { figures } from "@/content/site";
import type { Locale } from "@/i18n/config";

export function Figures({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
      <div className="grid-lines pointer-events-none absolute inset-0" />
      <ArcsMark className="pointer-events-none absolute -bottom-64 -start-64 h-[760px] w-[760px] opacity-[0.08]" />
      <div className="container relative">
        <SectionHeading
          tone="dark"
          index="03"
          eyebrow={ar ? "بالأرقام" : "By the numbers"}
          title={
            ar ? (
              <>
                سجلّ حافل <Em className="text-leaf-300">يُقاس بالعقود.</Em>
              </>
            ) : (
              <>
                A track record <Em className="text-leaf-300">measured in decades.</Em>
              </>
            )
          }
          intro={
            ar
              ? "أداء تشغيلي وسلامة والتزام بالجودة تشهد عليه شراكات طويلة الأمد مع كبرى شركات الطاقة في قطر."
              : "Operational performance, safety and quality — reflected in long-standing relationships with Qatar's leading energy operators."
          }
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-[2px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {figures.map((f, i) => {
            const isStatic = f.prefix === "ISO ";
            return (
              <Reveal key={f.label.en} delay={i * 0.06} className="group relative bg-ink p-8 transition-colors duration-500 hover:bg-ink-800 md:p-10">
                <div className="flex items-center justify-between">
                  <span className="num font-mono text-[0.68rem] text-white/35">{String(i + 1).padStart(2, "0")}</span>
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-leaf opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <p className="mt-10 font-display text-[clamp(3rem,5.2vw,4.75rem)] font-normal leading-none tracking-[-0.04em]">
                  {isStatic ? (
                    <span className="num">
                      <span className="me-2 text-[0.45em] tracking-normal text-white/60">ISO</span>14001
                    </span>
                  ) : (
                    <>
                      {f.prefix && <span className="text-white/60">{f.prefix}</span>}
                      <Counter value={f.value} duration={f.format === "year" ? 2.2 : 1.6} />
                      {f.suffix && <span className="text-leaf">{f.suffix}</span>}
                    </>
                  )}
                </p>
                <p className="mt-5 text-[0.95rem] text-white/60">{f.label[locale]}</p>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/35 rtl:font-arabic rtl:text-[0.78rem] rtl:normal-case rtl:tracking-normal">
          {ar ? "المصدر: بيانات شركات المجموعة." : "Source: Group company data."}
        </p>
      </div>
    </section>
  );
}
