import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/PageHero";
import { LEGAL_UPDATED, legal } from "@/content/legal";
import { type Locale, formatDate, isLocale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import { cn } from "@/lib/utils";

type P = { params: Promise<{ locale: string; slug: string }> };
const isDoc = (s: string): s is keyof typeof legal => s in legal;

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isDoc(slug)) return {};
  const l: Locale = locale === "ar" ? "ar" : "en";
  return {
    title: legal[slug].title[l],
    description: legal[slug].intro[l],
    alternates: { languages: { en: `/en/legal/${slug}`, ar: `/ar/legal/${slug}` } },
  };
}

export default async function LegalPage({ params }: P) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const ar = locale === "ar";
  if (!isDoc(slug)) notFound();
  const doc = legal[slug];

  return (
    <>
      <PageHero
        locale={locale}
        size="sm"
        eyebrow={ar ? "معلومات قانونية" : "Legal"}
        crumbs={[{ label: doc.title[locale] }]}
        title={doc.title[locale]}
        intro={doc.intro[locale]}
      />
      <section className="bg-pearl-50 py-20 md:py-28">
        <div className="container grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow mb-5 text-haze">{ar ? "المحتويات" : "Contents"}</p>
              <ol className="space-y-3 border-s border-ink/10 ps-5 text-[0.92rem]">
                {doc.sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-ink/70 transition-colors hover:text-ink">
                      <span className="num me-2 font-mono text-xs text-haze">{String(i + 1).padStart(2, "0")}</span>
                      {s.title[locale]}
                    </a>
                  </li>
                ))}
              </ol>
              <div className="mt-10 border-t border-ink/10 pt-6">
                <p className="eyebrow mb-4 text-haze">{ar ? "صفحات قانونية" : "Legal pages"}</p>
                <ul className="space-y-2 text-[0.92rem]">
                  {(Object.keys(legal) as (keyof typeof legal)[]).map((k) => (
                    <li key={k}>
                      <Link href={href(locale, `/legal/${k}`)} className={cn("hover:text-ink", k === slug ? "font-medium text-ink" : "text-ink/60")}>
                        {legal[k].title[locale]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
          <div className="lg:col-span-8 lg:col-start-5">
            <p className="mb-10 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-haze rtl:font-arabic rtl:text-[0.82rem] rtl:normal-case rtl:tracking-normal">
              {ar ? "آخر تحديث:" : "Last updated:"} <span className="num">{formatDate(LEGAL_UPDATED, locale)}</span>
            </p>
            <div className="prose-ah max-w-3xl">
              {doc.sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-32">
                  <h2>
                    <span className="num me-3 font-mono text-sm text-leaf-700">{String(i + 1).padStart(2, "0")}</span>
                    {s.title[locale]}
                  </h2>
                  {s.body[locale].map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
