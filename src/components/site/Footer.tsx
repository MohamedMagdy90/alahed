import Link from "next/link";
import { companies, contact } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { getDict, href } from "@/i18n/dictionary";
import { Logo } from "./Logo";
import { ArcsMark } from "./OrbitArcs";
import { Arrow, Btn } from "./primitives";
import { SubscribeForm } from "./SubscribeForm";

export function Footer({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const year = new Date().getFullYear();
  const ar = locale === "ar";

  const cols = [
    {
      title: t.footer.group,
      links: [
        { href: "/about", label: t.nav.story },
        { href: "/leadership", label: t.nav.leadership },
        { href: "/governance", label: t.nav.governance },
        { href: "/news", label: t.nav.news },
        { href: "/careers", label: t.nav.careers },
        { href: "/contact", label: t.nav.contact },
      ],
    },
    {
      title: t.footer.companies,
      links: [
        { href: "/companies", label: t.nav.allCompanies },
        ...companies.map((c) => ({ href: `/companies/${c.slug}`, label: c.name[locale] })),
      ],
    },
    {
      title: t.footer.investors,
      links: [
        { href: "/investors", label: t.footer.ir },
        { href: "/investors#reports", label: t.footer.reports },
        { href: "/governance", label: t.footer.governance },
        { href: "/investors#contact", label: t.footer.irContact },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink-900 text-white">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" />
      <ArcsMark className="pointer-events-none absolute -end-40 -top-40 h-[640px] w-[640px] opacity-[0.07]" />

      {/* CTA row */}
      <div className="container relative grid gap-12 border-b border-white/10 py-20 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-6 text-leaf-300">{ar ? "لنعمل معًا" : "Work with us"}</p>
          <h2 className="max-w-2xl text-balance font-display text-display-md font-normal leading-[1.08]">
            {ar ? "شريك قطري موثوق لمشاريع الطاقة الأكثر أهمية." : "A trusted Qatari partner for the energy sector's most critical work."}
          </h2>
          <div className="mt-10 flex flex-wrap gap-3">
            <Btn href={href(locale, "/contact")}>{t.contactUs}</Btn>
            <Btn href={href(locale, "/companies")} variant="outline-light">
              {t.nav.companies}
            </Btn>
          </div>
        </div>
        <div className="lg:col-span-5 lg:ps-10">
          <p className="font-display text-xl">{t.footer.stayInformed}</p>
          <p className="mb-6 mt-2 text-[0.95rem] text-white/60">{t.footer.stayInformedBody}</p>
          <SubscribeForm locale={locale} />
        </div>
      </div>

      {/* Link columns */}
      <div className="container relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo variant="white" className="w-[190px] md:w-[200px]" />
          <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-white/60">{t.footer.tagline}</p>
          <div className="mt-8 flex gap-2">
            {contact.socials.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center rounded-full border border-white/15 px-4 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-white/70 transition-colors hover:border-leaf hover:text-white"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
        {cols.map((col) => (
          <div key={col.title} className="lg:col-span-2">
            <p className="eyebrow mb-5 text-white/40">{col.title}</p>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={href(locale, l.href)} className="text-[0.92rem] text-white/75 transition-colors hover:text-white">
                    <span className="link-underline">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="lg:col-span-2">
          <p className="eyebrow mb-5 text-white/40">{t.footer.headquarters}</p>
          <address className="space-y-3 text-[0.92rem] not-italic text-white/75">
            <p>{contact.holding.address[locale]}</p>
            <p className="num font-mono text-[0.85rem]" dir="ltr">
              <a href={`tel:${contact.holding.phone.replace(/\s/g, "")}`} className="hover:text-white">
                {contact.holding.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${contact.holding.email}`} className="break-all hover:text-white">
                {contact.holding.email}
              </a>
            </p>
          </address>
        </div>
      </div>

      {/* Wordmark */}
      <div className="container relative select-none" aria-hidden>
        <div className="flex items-end justify-between gap-6 border-t border-white/10 pt-8">
          <span className="block bg-gradient-to-b from-white/[0.16] to-white/[0.02] bg-clip-text font-display text-[18vw] font-medium leading-[0.78] tracking-[-0.05em] text-transparent lg:text-[15rem]">
            AL-AHED
          </span>
          <span className="hidden bg-gradient-to-b from-leaf/40 to-leaf/[0.04] bg-clip-text pb-2 font-arabic text-[9vw] font-bold leading-none text-transparent md:block lg:text-[8rem]">
            العهد
          </span>
        </div>
      </div>

      {/* Legal */}
      <div className="relative border-t border-white/10">
        <div className="container flex flex-col gap-4 py-6 text-[0.8rem] text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {contact.holding.name[locale]} {t.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href={href(locale, "/legal/privacy")} className="hover:text-white">
              {t.footer.privacy}
            </Link>
            <Link href={href(locale, "/legal/terms")} className="hover:text-white">
              {t.footer.terms}
            </Link>
            <Link href={href(locale, "/legal/disclaimer")} className="hover:text-white">
              {t.footer.disclaimer}
            </Link>
            <a href="#main" className="group inline-flex items-center gap-2 text-white/70 hover:text-white">
              {t.footer.backToTop}
              <Arrow className="-rotate-90 rtl:rotate-90" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
