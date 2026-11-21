import { Mail, MapPin, Phone, Printer } from "lucide-react";
import type { Metadata } from "next";
import { Reveal } from "@/components/motion";
import { ContactForm } from "@/components/pages/contact/ContactForm";
import { CompanyLogo } from "@/components/site/CompanyLogo";
import { PageHero } from "@/components/site/PageHero";
import { Btn, Em, TextLink } from "@/components/site/primitives";
import { companies, contact } from "@/content/site";
import { QATAR_PATH, QATAR_VIEWBOX, SITE_POINTS } from "@/content/qatar-map";
import { type Locale, isLocale } from "@/i18n/config";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  const ar = locale === "ar";
  return {
    title: ar ? "اتصل بنا" : "Contact",
    description: ar ? "تواصل مع العهد القابضة وشركاتها في الدوحة، قطر." : "Get in touch with Al-Ahed Holding and its companies in Doha, Qatar.",
    alternates: { languages: { en: "/en/contact", ar: "/ar/contact" } },
  };
}

const MAPS = "https://www.google.com/maps/search/?api=1&query=Al-Ahed+Holding+Doha+Qatar";

export default async function ContactPage({ params }: P) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const ar = locale === "ar";
  const h = contact.holding;
  const tel = (s: string) => `tel:${s.replace(/\s/g, "")}`;
  const [dx, dy] = SITE_POINTS.doha;

  return (
    <>
      <PageHero
        locale={locale}
        size="sm"
        image="/images/doha-dusk.jpg"
        eyebrow={ar ? "اتصل بنا" : "Contact"}
        crumbs={[{ label: ar ? "اتصل بنا" : "Contact" }]}
        title={
          ar ? (
            <>
              يسعدنا <Em className="text-leaf-300">التواصل معك.</Em>
            </>
          ) : (
            <>
              We'd like to <Em className="text-leaf-300">hear from you.</Em>
            </>
          )
        }
        intro={
          ar
            ? "للاستفسارات العامة أو علاقات المستثمرين أو الشراكات أو الإعلام، أرسل لنا رسالتك وسيتواصل معك الفريق المختص."
            : "For general enquiries, investor relations, partnerships or media, send us a message and the right team will respond."
        }
      />

      {/* Form + HQ */}
      <section className="bg-pearl-50 py-20 md:py-28">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="rounded-[2px] border border-ink/10 bg-white p-6 md:p-10 lg:col-span-8">
            <p className="eyebrow mb-3 text-leaf-700">{ar ? "أرسل رسالة" : "Send a message"}</p>
            <h2 className="mb-10 font-display text-display-md font-normal text-ink">{ar ? "كيف يمكننا مساعدتك؟" : "How can we help?"}</h2>
            <ContactForm locale={locale} />
          </div>

          <Reveal className="lg:col-span-4">
            <div className="h-full rounded-[2px] bg-ink-900 p-8 text-white md:p-10">
              <p className="eyebrow text-leaf-300">{ar ? "المقر الرئيسي للمجموعة" : "Group headquarters"}</p>
              <p className="mt-4 font-display text-[1.6rem] leading-tight">{h.name[locale]}</p>
              <ul className="mt-8 space-y-5 text-[0.95rem]">
                <li className="flex gap-4">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-leaf-300" />
                  <span className="text-white/80">{h.address[locale]}</span>
                </li>
                <li className="flex gap-4">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-leaf-300" />
                  <span className="flex flex-col gap-1">
                    <a href={tel(h.phone)} dir="ltr" className="num font-mono text-white/85 hover:text-white">
                      {h.phone}
                    </a>
                    <a href={tel(h.phoneAlt)} dir="ltr" className="num font-mono text-white/85 hover:text-white">
                      {h.phoneAlt}
                    </a>
                  </span>
                </li>
                <li className="flex gap-4">
                  <Printer className="mt-0.5 h-4 w-4 shrink-0 text-leaf-300" />
                  <span dir="ltr" className="num font-mono text-white/70">
                    {h.fax}
                  </span>
                </li>
                <li className="flex gap-4">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-leaf-300" />
                  <a href={`mailto:${h.email}`} className="break-all text-white/85 hover:text-white">
                    {h.email}
                  </a>
                </li>
              </ul>
              <div className="mt-10 border-t border-white/10 pt-8">
                <p className="eyebrow mb-4 text-white/40">{ar ? "تابعنا" : "Follow us"}</p>
                <div className="flex flex-wrap gap-2">
                  {contact.socials.map((s) => (
                    <a
                      key={s.id}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center rounded-full border border-white/15 px-4 text-[0.8rem] text-white/75 transition-colors hover:border-leaf hover:text-white"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Companies */}
      <section className="bg-white py-24 md:py-28">
        <div className="container">
          <div className="mb-12 flex items-center gap-4">
            <span className="num font-mono text-xs text-haze">02</span>
            <p className="eyebrow flex items-center gap-3 text-leaf-700">
              <span aria-hidden className="h-px w-7 bg-current" />
              {ar ? "شركات المجموعة" : "Group companies"}
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 md:grid-cols-3">
            {companies.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.06} className="flex flex-col bg-white p-7 md:p-8">
                <div className="flex h-14 items-center">
                  <CompanyLogo id={c.id} locale={locale} size={40} />
                </div>
                <p className="mt-6 font-display text-[1.3rem] text-ink">{c.name[locale]}</p>
                <ul className="mt-5 space-y-3 text-[0.92rem] text-ink/75">
                  <li className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: c.accent }} />
                    {c.contact.address[locale]}
                  </li>
                  <li className="flex gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0" style={{ color: c.accent }} />
                    <a href={tel(c.contact.phone)} dir="ltr" className="num font-mono hover:text-ink">
                      {c.contact.phone}
                    </a>
                  </li>
                  <li className="flex gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0" style={{ color: c.accent }} />
                    <a href={`mailto:${c.contact.email}`} className="break-all hover:text-ink">
                      {c.contact.email}
                    </a>
                  </li>
                </ul>
                {c.website && (
                  <TextLink href={c.website} external className="mt-auto pt-8">
                    {c.website.replace(/^https?:\/\/(www\.)?/, "")}
                  </TextLink>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-white pb-24 md:pb-32">
        <div className="container">
          <div className="relative grid overflow-hidden rounded-[2px] bg-ink-900 text-white lg:grid-cols-12">
            <div
              className="absolute inset-0 opacity-30"
              style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
            />
            <div className="relative p-8 md:p-14 lg:col-span-6">
              <p className="eyebrow text-leaf-300">{ar ? "موقعنا" : "Find us"}</p>
              <h2 className="mt-5 text-balance font-display text-display-md font-normal">{ar ? "في قلب الدوحة." : "In the heart of Doha."}</h2>
              <p className="mt-5 max-w-md text-[1rem] leading-relaxed text-white/65">{h.address[locale]}</p>
              <Btn href={MAPS} external className="mt-10">
                {ar ? "افتح في خرائط Google" : "Open in Google Maps"}
              </Btn>
            </div>
            <div className="relative flex items-center justify-center p-8 lg:col-span-6">
              <div className="relative aspect-[336/640] h-[380px]">
                <svg viewBox={QATAR_VIEWBOX} className="absolute inset-0 h-full w-full" aria-hidden>
                  <path d={QATAR_PATH} fill="rgba(31,79,168,0.25)" stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} strokeLinejoin="round" />
                  <circle cx={dx} cy={dy} r={7} fill="none" stroke="#5DB543">
                    <animate attributeName="r" values="7;22" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="0.9;0" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={dx} cy={dy} r={5.5} fill="#5DB543" />
                </svg>
                <span
                  className="absolute whitespace-nowrap rounded-[2px] bg-white/10 px-2 py-1 text-[0.8rem] backdrop-blur"
                  style={{ top: `${(dy / 640) * 100}%`, right: `calc(${100 - (dx / 336) * 100}% + 16px)`, transform: "translateY(-50%)" }}
                >
                  {ar ? "الدوحة · المقر الرئيسي" : "Doha · HQ"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
