import { Marquee } from "@/components/site/Marquee";
import { clients, companies } from "@/content/site";
import type { Locale } from "@/i18n/config";

function Dot() {
  return (
    <svg viewBox="0 0 24 24" className="mx-8 h-4 w-4 shrink-0 md:mx-12" aria-hidden>
      <path d="M20 6 A10 10 0 1 0 20 18" fill="none" stroke="#5DB543" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16.5 8.5 A5.5 5.5 0 1 0 16.5 15.5" fill="none" stroke="#1F4FA8" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Partners({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const principals = companies.find((c) => c.id === "aatc")?.partners ?? [];

  return (
    <section className="overflow-hidden border-y border-ink/10 bg-pearl-50 py-20 md:py-28">
      <div className="container mb-12 grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <div className="mb-5 flex items-center gap-4">
            <span className="num font-mono text-xs text-haze">06</span>
            <p className="eyebrow flex items-center gap-3 text-leaf-700">
              <span aria-hidden className="h-px w-7 bg-current" />
              {ar ? "شركاء وعملاء" : "Partners & clients"}
            </p>
          </div>
          <h2 className="text-balance font-display text-display-md font-normal text-ink">
            {ar ? "موثوقون من المشغّلين، ومدعومون من شركاء عالميين." : "Trusted by operators. Backed by global principals."}
          </h2>
        </div>
        <p className="text-pretty text-[1rem] leading-relaxed text-haze md:col-span-5 md:ps-8">
          {ar
            ? "علاقات تمتد لعقود مع كبرى الشركات المصنّعة في العالم ومع المشغّلين الرئيسيين في قطاع الطاقة القطري."
            : "Decades-long relationships with world-leading manufacturers and the principal operators of Qatar's energy sector."}
        </p>
      </div>

      <div className="space-y-6">
        <div className="container flex items-center gap-4">
          <span className="eyebrow text-haze">{ar ? "الشركاء العالميون" : "Global principals"}</span>
          <span className="h-px flex-1 bg-ink/10" />
        </div>
        <Marquee>
          {principals.map((p) => (
            <span key={p} className="flex items-center">
              <span className="whitespace-nowrap font-display text-[clamp(1.8rem,3.4vw,3rem)] font-normal tracking-[-0.02em] text-ink/80 transition-colors hover:text-ink">
                {p}
              </span>
              <Dot />
            </span>
          ))}
        </Marquee>

        <div className="container flex items-center gap-4 pt-6">
          <span className="eyebrow text-haze">{ar ? "عملاؤنا" : "Clients we serve"}</span>
          <span className="h-px flex-1 bg-ink/10" />
        </div>
        <Marquee reverse>
          {clients.map((c) => (
            <span key={c} className="flex items-center">
              <span className="whitespace-nowrap font-display text-[clamp(1.8rem,3.4vw,3rem)] font-normal tracking-[-0.02em] text-transparent [-webkit-text-stroke:1px_rgba(10,20,48,0.45)] transition-colors hover:text-ink">
                {c}
              </span>
              <Dot />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
