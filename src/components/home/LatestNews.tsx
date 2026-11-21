import type { Post } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { TextLink } from "@/components/site/primitives";
import { companyLabels, postTypes } from "@/content/site";
import { type Locale, formatDate, pick } from "@/i18n/config";
import { href } from "@/i18n/dictionary";

export function LatestNews({ locale, posts }: { locale: Locale; posts: Post[] }) {
  const ar = locale === "ar";
  if (!posts.length) return null;
  const [lead, ...rest] = posts;
  const meta = (p: Post) => [postTypes[p.type]?.[locale] ?? p.type, companyLabels[p.company]?.[locale]].filter(Boolean).join(" · ");

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display text-display-lg font-normal text-ink">{ar ? "الأخبار" : "News"}</h2>
          <TextLink href={href(locale, "/news")}>{ar ? "جميع الأخبار" : "All news"}</TextLink>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
          <Link href={href(locale, `/news/${lead.slug}`)} className="group block lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2px] bg-pearl-100">
              <Image
                src={lead.coverImage || "/images/doha-dusk.jpg"}
                alt=""
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover transition-transform duration-1400 ease-out-expo group-hover:scale-[1.03]"
              />
            </div>
            <p className="mt-6 text-[0.88rem] text-haze">
              <time dateTime={new Date(lead.publishedAt).toISOString()}>{formatDate(lead.publishedAt, locale)}</time>
              <span className="text-leaf-700"> · {meta(lead)}</span>
            </p>
            <h3 className="mt-3 max-w-2xl text-balance font-display text-[clamp(1.6rem,2.4vw,2.25rem)] font-normal leading-[1.15] text-ink transition-colors group-hover:text-brand">
              {pick(lead, "title", locale)}
            </h3>
            {pick(lead, "excerpt", locale) && (
              <p className="mt-4 line-clamp-2 max-w-xl text-[1rem] leading-relaxed text-haze">{pick(lead, "excerpt", locale)}</p>
            )}
          </Link>

          <ul className="border-t border-ink/10 lg:col-span-5">
            {rest.slice(0, 4).map((p) => (
              <li key={p.id} className="border-b border-ink/10">
                <Link href={href(locale, `/news/${p.slug}`)} className="group grid grid-cols-[6.5rem_1fr] gap-5 py-6">
                  <time dateTime={new Date(p.publishedAt).toISOString()} className="pt-0.5 text-[0.85rem] leading-snug text-haze">
                    {formatDate(p.publishedAt, locale, { month: "short" })}
                  </time>
                  <span className="min-w-0">
                    <span className="block text-[0.82rem] text-leaf-700">{meta(p)}</span>
                    <span className="mt-1.5 block text-pretty font-display text-[1.15rem] leading-snug text-ink transition-colors group-hover:text-brand">
                      {pick(p, "title", locale)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
