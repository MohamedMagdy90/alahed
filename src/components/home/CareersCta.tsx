import { Parallax, Reveal } from "@/components/motion";
import { Btn, Em } from "@/components/site/primitives";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import Image from "next/image";

export function CareersCta({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  return (
    <section className="bg-white pb-24 md:pb-32">
      <div className="container">
        <div className="relative isolate overflow-hidden rounded-[2px] bg-ink-900 text-white">
          <Parallax className="absolute inset-0 -z-20" amount={50}>
            <Image src="/images/engineer.jpg" alt="" fill sizes="100vw" className="object-cover object-[70%_30%]" />
          </Parallax>
          <div className="absolute inset-0 -z-10 from-ink-900 via-ink-900/85 to-ink-900/10 ltr:bg-gradient-to-r rtl:bg-gradient-to-l" />
          <div className="grid min-h-[480px] items-center gap-10 p-8 md:p-14 lg:grid-cols-12 lg:p-20">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow mb-6 flex items-center gap-3 text-leaf-300">
                  <span aria-hidden className="h-px w-7 bg-current" />
                  {ar ? "الوظائف" : "Careers"}
                </p>
                <h2 className="text-balance font-display text-display-lg font-normal">
                  {ar ? (
                    <>
                      ابنِ مسيرتك مع مجموعة <Em className="text-leaf-300">تبني قطر.</Em>
                    </>
                  ) : (
                    <>
                      Build your career with a group that <Em className="text-leaf-300">builds Qatar.</Em>
                    </>
                  )}
                </h2>
                <p className="mt-6 max-w-lg text-pretty text-[1.05rem] leading-relaxed text-white/70">
                  {ar
                    ? "نبحث عن مهندسين وفنيين ومتخصصين يشاركوننا الالتزام بالسلامة والجودة والتميّز."
                    : "We're looking for engineers, technicians and specialists who share our commitment to safety, quality and excellence."}
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Btn href={href(locale, "/careers")}>{ar ? "انضم إلى فريقنا" : "Join our team"}</Btn>
                  <Btn href={href(locale, "/contact")} variant="outline-light">
                    {ar ? "تواصل معنا" : "Contact us"}
                  </Btn>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
