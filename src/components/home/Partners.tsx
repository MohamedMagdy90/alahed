import { clients, companies } from "@/content/site";
import type { Locale } from "@/i18n/config";

function NameList({ names }: { names: string[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-8 border-t border-ink/10 sm:grid-cols-3">
      {names.map((n) => (
        <li key={n} className="border-b border-ink/10 py-5 font-display text-[1.12rem] leading-tight text-ink md:text-[1.2rem]" dir="ltr">
          <span className="block rtl:text-right">{n}</span>
        </li>
      ))}
    </ul>
  );
}

export function Partners({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const principals = companies.find((c) => c.id === "aatc")?.partners ?? [];

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container space-y-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="text-balance font-display text-display-md font-normal text-ink">{ar ? "شركات مصنّعة نمثّلها" : "Manufacturers we represent"}</h2>
            <p className="mt-4 max-w-sm text-pretty text-[1rem] leading-relaxed text-haze">
              {ar
                ? `من خلال العهد للتجارة والمقاولات، تمثّل المجموعة ${principals.length} شركة مصنّعة عالمية في قطر.`
                : `Through Al-Ahed T&C, the Group represents ${principals.length} international manufacturers in Qatar.`}
            </p>
          </div>
          <div className="lg:col-span-8">
            <NameList names={principals} />
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="text-balance font-display text-display-md font-normal text-ink">{ar ? "لمن نعمل" : "Who we work for"}</h2>
            <p className="mt-4 max-w-sm text-pretty text-[1rem] leading-relaxed text-haze">
              {ar ? "المشغّلون والحقول التي تخدمها شركات المجموعة." : "Operators and fields served by the Group’s companies."}
            </p>
          </div>
          <div className="lg:col-span-8">
            <NameList names={clients} />
          </div>
        </div>
      </div>
    </section>
  );
}
