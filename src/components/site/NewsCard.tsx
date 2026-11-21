import type { Post } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { companyLabels, postTypes } from "@/content/site";
import { type Locale, formatDate, pick } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import { cn } from "@/lib/utils";
import { Arrow } from "./primitives";

type Variant = "feature" | "default" | "row";

/**
 * Shared news card.
 * - `feature`: large image card with overlaid text (home / newsroom lead story)
 * - `default`: image on top, text below (grids)
 * - `row`: compact horizontal row (sidebars, related lists)
 */
export function NewsCard({
  post,
  locale,
  variant = "default",
  className,
  priority,
}: {
  post: Post;
  locale: Locale;
  variant?: Variant;
  className?: string;
  priority?: boolean;
}) {
  const title = pick(post, "title", locale);
  const excerpt = pick(post, "excerpt", locale);
  const type = postTypes[post.type]?.[locale] ?? post.type;
  const company = companyLabels[post.company]?.[locale] ?? "";
  const date = formatDate(post.publishedAt, locale);
  const link = href(locale, `/news/${post.slug}`);
  const cover = post.coverImage || "/images/doha-dusk.jpg";

  const meta = (tone: "light" | "dark") => (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] rtl:font-arabic rtl:text-[0.78rem] rtl:normal-case rtl:tracking-normal",
        tone === "light" ? "text-haze" : "text-white/60",
      )}
    >
      <span className={tone === "light" ? "text-leaf-700" : "text-leaf-300"}>{type}</span>
      <span aria-hidden className="h-px w-3 bg-current opacity-50" />
      <span>{company}</span>
      <span aria-hidden className="h-px w-3 bg-current opacity-50" />
      <time dateTime={new Date(post.publishedAt).toISOString()} className="num">
        {date}
      </time>
    </div>
  );

  if (variant === "feature") {
    return (
      <Link
        href={link}
        className={cn(
          "group relative isolate flex min-h-[460px] flex-col justify-end overflow-hidden rounded-[2px] bg-ink-900 p-7 text-white md:min-h-[560px] md:p-10",
          className,
        )}
      >
        <Image
          src={cover}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="-z-20 object-cover opacity-80 transition-transform duration-1600 ease-out-expo group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900 via-ink-900/55 to-transparent" />
        {meta("dark")}
        <h3 className="mt-5 max-w-2xl text-balance font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-normal leading-[1.1]">
          {title}
        </h3>
        {excerpt && <p className="mt-4 line-clamp-2 max-w-xl text-[0.98rem] leading-relaxed text-white/70">{excerpt}</p>}
        <span className="mt-8 inline-flex items-center gap-2 text-[0.9rem] font-medium">
          <span className="link-underline">{locale === "ar" ? "اقرأ الخبر" : "Read story"}</span>
          <Arrow className="text-leaf-300" />
        </span>
      </Link>
    );
  }

  if (variant === "row") {
    return (
      <Link href={link} className={cn("group grid grid-cols-[112px_1fr] gap-5 py-5 sm:grid-cols-[148px_1fr]", className)}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-pearl-200">
          <Image
            src={cover}
            alt=""
            fill
            sizes="160px"
            className="object-cover transition-transform duration-1200 ease-out-expo group-hover:scale-105"
          />
        </div>
        <div className="min-w-0">
          {meta("light")}
          <h3 className="mt-2.5 line-clamp-3 text-pretty font-display text-[1.08rem] leading-snug text-ink transition-colors group-hover:text-brand">
            {title}
          </h3>
        </div>
      </Link>
    );
  }

  return (
    <Link href={link} className={cn("group flex flex-col", className)}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[2px] bg-pearl-200">
        <Image
          src={cover}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-1400 ease-out-expo group-hover:scale-[1.05]"
        />
      </div>
      <div className="flex flex-1 flex-col pt-6">
        {meta("light")}
        <h3 className="mt-3 line-clamp-3 text-pretty font-display text-[1.3rem] leading-[1.25] text-ink transition-colors group-hover:text-brand">
          {title}
        </h3>
        {excerpt && <p className="mt-3 line-clamp-2 text-[0.95rem] leading-relaxed text-haze">{excerpt}</p>}
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[0.88rem] font-medium text-ink">
          <span className="link-underline">{locale === "ar" ? "اقرأ المزيد" : "Read more"}</span>
          <Arrow className="text-leaf-700" />
        </span>
      </div>
    </Link>
  );
}
