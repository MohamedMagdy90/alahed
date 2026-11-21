import type { Post } from "@prisma/client";
import { Reveal } from "@/components/motion";
import { NewsCard } from "@/components/site/NewsCard";
import { Em, SectionHeading, TextLink } from "@/components/site/primitives";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";

export function LatestNews({ locale, posts }: { locale: Locale; posts: Post[] }) {
  const ar = locale === "ar";
  if (!posts.length) return null;
  const [lead, ...rest] = posts;

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container">
        <SectionHeading
          index="08"
          eyebrow={ar ? "المركز الإعلامي" : "Newsroom"}
          title={
            ar ? (
              <>
                آخر الأخبار <Em className="text-brand">من المجموعة.</Em>
              </>
            ) : (
              <>
                Latest from <Em className="text-brand">the Group.</Em>
              </>
            )
          }
          action={<TextLink href={href(locale, "/news")}>{ar ? "جميع الأخبار" : "All news"}</TextLink>}
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <NewsCard post={lead} locale={locale} variant="feature" className="h-full" />
          </Reveal>
          <div className="flex flex-col divide-y divide-ink/10 border-y border-ink/10 lg:col-span-5">
            {rest.slice(0, 4).map((p, i) => (
              <Reveal key={p.id} delay={0.05 * (i + 1)}>
                <NewsCard post={p} locale={locale} variant="row" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
