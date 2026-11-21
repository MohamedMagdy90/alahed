import Image from "next/image";
import { Btn } from "@/components/site/primitives";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";

export function CareersCta({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  return (
    <section className="bg-pearl-50 py-24 md:py-32">
      <div className="container grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-pearl-200 lg:col-span-6">
          <Image src="/images/engineer.jpg" alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover object-[70%_30%]" />
        </div>
        <div className="lg:col-span-6 lg:ps-4">
          <p className="text-[0.95rem] font-medium text-leaf-700">{ar ? "الوظائف" : "Careers"}</p>
          <h2 className="mt-4 text-balance font-display text-display-lg font-normal text-ink">
            {ar ? "اعمل معنا في مواقع الطاقة في قطر." : "Work with us on Qatar’s energy sites."}
          </h2>
          <p className="mt-6 max-w-lg text-pretty text-[1.05rem] leading-relaxed text-haze">
            {ar
              ? "نوظّف مهندسين وفنيين ومتخصصين لأعمال التوريد والإنشاء والصيانة والفحص في شركاتنا الثلاث. ونبحث عن أشخاص يأخذون السلامة والجودة بجدية كما نفعل."
              : "We hire engineers, technicians and specialists for supply, construction, maintenance and inspection work across our three companies. We look for people who take safety and quality as seriously as we do."}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Btn href={href(locale, "/careers")} variant="dark">
              {ar ? "الوظائف والتقديم" : "Careers and applications"}
            </Btn>
            <Btn href={href(locale, "/contact")} variant="outline-dark">
              {ar ? "تواصل معنا" : "Contact us"}
            </Btn>
          </div>
        </div>
      </div>
    </section>
  );
}
