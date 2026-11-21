import { Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion";
import { NewsCard } from "@/components/site/NewsCard";
import { PageHero } from "@/components/site/PageHero";
import { companyLabels, postTypes } from "@/content/site";
import { type Locale, isLocale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import { getPosts } from "@/lib/queries";
import { cn } from "@/lib/utils";

type P = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; company?: string; q?: string; page?: string }>;
};

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  const ar = locale === "ar";
  return {
    title: ar ? "المركز الإعلامي" : "Newsroom",
    description: ar ? "أخبار وفعاليات وبيانات صحفية من العهد القابضة وشركاتها." : "News, events and press releases from Al-Ahed Holding and its companies.",
    alternates: { languages: { en: "/en/news", ar: "/ar/news" } },
  };
}

export default async function NewsPage({ params, searchParams }: P) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const ar = locale === "ar";
  const sp = await searchParams;
  const type = sp.type && postTypes[sp.type] ? sp.type : undefined;
  const company = sp.company && companyLabels[sp.company] ? sp.company : undefined;
  const q = sp.q?.trim().slice(0, 80) || undefined;
  const page = Math.max(1, Number.parseInt(sp.page || "1", 10) || 1);
  const { items, pages, total } = await getPosts({ type, company, q, page, perPage: 9 });
  const filtered = !!(type || company || q);
  const showLead = page === 1 && !filtered && items.length > 0;
  const lead = showLead ? items[0] : null;
  const grid = showLead ? items.slice(1) : items;

  const qs = (over: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    const merged = { type, company, q, page: undefined as number | undefined, ...over };
    for (const [k, v] of Object.entries(merged)) if (v !== undefined && v !== "" && !(k === "page" && v === 1)) p.set(k, String(v));
    const s = p.toString();
    return href(locale, `/news${s ? `?${s}` : ""}`);
  };

  return (
    <>
      <PageHero
        locale={locale}
        size="sm"
        image="/images/doha-dusk.jpg"
        eyebrow={ar ? "المركز الإعلامي" : "Newsroom"}
        crumbs={[{ label: ar ? "المركز الإعلامي" : "Newsroom" }]}
        title={ar ? "أخبار المجموعة" : "News from the Group"}
        intro={
          ar
            ? "آخر الأخبار والفعاليات والجوائز والبيانات الصحفية من العهد القابضة وشركاتها."
            : "The latest news, events, awards and press releases from Al-Ahed Holding and its companies."
        }
      />

      {/* Filter bar */}
      <div className="sticky top-[76px] z-30 border-b border-ink/10 bg-white/95 backdrop-blur-xl">
        <div className="container flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
          <nav className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1" aria-label={ar ? "التصنيفات" : "Categories"}>
            {[undefined, ...Object.keys(postTypes)].map((t) => (
              <Link
                key={t ?? "all"}
                href={qs({ type: t, page: undefined })}
                scroll={false}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center rounded-full px-4 text-[0.88rem] transition-colors",
                  type === t ? "bg-ink text-white" : "text-ink/65 hover:bg-pearl-100 hover:text-ink",
                )}
              >
                {t ? postTypes[t][locale] : ar ? "الكل" : "All"}
              </Link>
            ))}
          </nav>
          <form action={href(locale, "/news")} method="get" className="flex gap-2">
            {type && <input type="hidden" name="type" value={type} />}
            <select
              name="company"
              defaultValue={company ?? ""}
              aria-label={ar ? "الشركة" : "Company"}
              className="h-10 rounded-[2px] border border-ink/15 bg-white px-3 text-[0.88rem] text-ink outline-none focus:border-leaf"
            >
              <option value="">{ar ? "جميع الشركات" : "All companies"}</option>
              {Object.entries(companyLabels).map(([k, v]) => (
                <option key={k} value={k}>
                  {v[locale]}
                </option>
              ))}
            </select>
            <div className="flex h-10 flex-1 items-center rounded-[2px] border border-ink/15 bg-white focus-within:border-leaf lg:w-72 lg:flex-none">
              <Search className="ms-3 h-4 w-4 shrink-0 text-haze" />
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder={ar ? "ابحث في الأخبار" : "Search news"}
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-[0.9rem] outline-none placeholder:text-haze-300"
              />
            </div>
            <button type="submit" className="h-10 rounded-[2px] bg-ink px-4 text-[0.88rem] font-medium text-white transition-colors hover:bg-navy">
              {ar ? "بحث" : "Go"}
            </button>
          </form>
        </div>
      </div>

      <section className="bg-pearl-50 py-16 md:py-20">
        <div className="container">
          {filtered && (
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
              <p className="text-[0.95rem] text-haze">
                <span className="num font-mono text-ink">{total}</span> {ar ? "نتيجة" : total === 1 ? "result" : "results"}
                {q && (
                  <>
                    {" "}
                    {ar ? "لـ" : "for"} “<span className="text-ink">{q}</span>”
                  </>
                )}
              </p>
              <Link href={href(locale, "/news")} className="text-[0.88rem] text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                {ar ? "مسح عوامل التصفية" : "Clear filters"}
              </Link>
            </div>
          )}

          {lead && (
            <Reveal className="mb-16">
              <NewsCard post={lead} locale={locale} variant="feature" priority />
            </Reveal>
          )}

          {grid.length > 0 ? (
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {grid.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 0.06}>
                  <NewsCard post={p} locale={locale} />
                </Reveal>
              ))}
            </div>
          ) : (
            !lead && (
              <div className="rounded-[2px] border border-dashed border-ink/20 bg-white px-8 py-16 text-center">
                <p className="font-display text-[1.4rem] text-ink">{ar ? "لا توجد أخبار مطابقة." : "No news matches your search."}</p>
                <p className="mt-2 text-[0.95rem] text-haze">{ar ? "جرّب تصنيفًا أو كلمة بحث مختلفة." : "Try a different category or search term."}</p>
              </div>
            )
          )}

          {pages > 1 && (
            <nav className="mt-16 flex items-center justify-center gap-2" aria-label={ar ? "الصفحات" : "Pagination"}>
              {page > 1 && (
                <Link href={qs({ page: page - 1 })} className="inline-flex h-10 items-center rounded-full border border-ink/15 px-4 text-[0.88rem] hover:border-ink">
                  {ar ? "السابق" : "Previous"}
                </Link>
              )}
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={qs({ page: n })}
                  aria-current={n === page ? "page" : undefined}
                  className={cn(
                    "num grid h-10 w-10 place-items-center rounded-full font-mono text-[0.85rem]",
                    n === page ? "bg-ink text-white" : "text-ink/70 hover:bg-white",
                  )}
                >
                  {n}
                </Link>
              ))}
              {page < pages && (
                <Link href={qs({ page: page + 1 })} className="inline-flex h-10 items-center rounded-full border border-ink/15 px-4 text-[0.88rem] hover:border-ink">
                  {ar ? "التالي" : "Next"}
                </Link>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
