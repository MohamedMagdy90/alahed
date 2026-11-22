import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion";
import { ShareButtons } from "@/components/pages/news/ShareButtons";
import { NewsCard } from "@/components/site/NewsCard";
import { Arrow, SectionHeading, TextLink } from "@/components/site/primitives";
import { companyLabels, postTypes } from "@/content/site";
import { type Locale, formatDate, isLocale, pick } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import { db } from "@/lib/db";
import { getPostBySlug, getRelatedPosts } from "@/lib/queries";
import { cleanHtml, readingMinutes } from "@/lib/sanitize";

type P = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const title = pick(post, "seoTitle", locale) || pick(post, "title", locale);
  const description = pick(post, "seoDesc", locale) || pick(post, "excerpt", locale);
  return {
    title,
    description,
    alternates: { languages: { en: `/en/news/${slug}`, ar: `/ar/news/${slug}` } },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: new Date(post.publishedAt).toISOString(),
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: P) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const ar = locale === "ar";
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  db.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const title = pick(post, "title", locale);
  const excerpt = pick(post, "excerpt", locale);
  const body = pick(post, "body", locale);
  const fellBack = ar && !post.bodyAr.trim();
  const type = postTypes[post.type]?.[locale] ?? post.type;
  const company = companyLabels[post.company]?.[locale] ?? "";
  const related = await getRelatedPosts(post, 3);

  return (
    <article>
      {/* Header */}
      <header className="grain relative isolate overflow-hidden bg-ink-900 pb-40 pt-44 text-white md:pb-48">
        <div className="container">
          <nav aria-label="Breadcrumb" className="mb-10 text-[0.85rem] text-white/55">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href={href(locale)} className="hover:text-white">
                  {ar ? "الرئيسية" : "Home"}
                </Link>
              </li>
              <li className="text-white/25">/</li>
              <li>
                <Link href={href(locale, "/news")} className="hover:text-white">
                  {ar ? "المركز الإعلامي" : "Newsroom"}
                </Link>
              </li>
              <li className="text-white/25">/</li>
              <li>
                <Link href={href(locale, `/news?type=${post.type}`)} className="text-white/80 hover:text-white">
                  {type}
                </Link>
              </li>
            </ol>
          </nav>
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.9rem] text-white/65">
              <span className="font-medium text-leaf-300">{type}</span>
              <span aria-hidden className="text-white/30">·</span>
              <span>{company}</span>
              <span aria-hidden className="text-white/30">·</span>
              <time className="num" dateTime={new Date(post.publishedAt).toISOString()}>
                {formatDate(post.publishedAt, locale)}
              </time>
              <span aria-hidden className="text-white/30">·</span>
              <span className="num">
                {readingMinutes(body)} {ar ? "دقائق قراءة" : "min read"}
              </span>
            </div>
            <h1 className="mt-8 text-balance font-display text-[clamp(2.1rem,4.4vw,4rem)] font-normal leading-[1.06] tracking-[-0.03em]">{title}</h1>
            {excerpt && <p className="mt-8 max-w-2xl text-pretty text-[1.15rem] leading-relaxed text-white/70">{excerpt}</p>}
          </div>
        </div>
      </header>

      {/* Cover */}
      {post.coverImage && (
        <div className="container relative z-10 -mt-28 md:-mt-36">
          {/* Not wrapped in a reveal: the cover is the target of the card → article morph. */}
          <div
            data-vt-hero="media"
            className="relative aspect-[16/8] overflow-hidden rounded-[2px] bg-ink shadow-[0_40px_80px_-40px_rgba(6,13,34,0.5)]"
          >
            <Image src={post.coverImage} alt="" fill priority sizes="(min-width: 1440px) 1360px, 100vw" className="object-cover" />
          </div>
        </div>
      )}

      {/* Body */}
      <div className={`bg-pearl-50 ${post.coverImage ? "pt-16" : "pt-20"} pb-24 md:pb-32`}>
        <div className="container grid gap-12 lg:grid-cols-12">
          <aside className="order-2 lg:order-1 lg:col-span-3">
            <div className="flex flex-col gap-8 lg:sticky lg:top-32">
              <ShareButtons title={title} label={ar ? "مشاركة" : "Share"} copiedLabel={ar ? "تم النسخ" : "Copied"} className="flex-wrap" />
              <TextLink href={href(locale, "/news")}>{ar ? "العودة إلى المركز الإعلامي" : "Back to newsroom"}</TextLink>
            </div>
          </aside>
          <div className="order-1 lg:order-2 lg:col-span-8 lg:col-start-5">
            <div
              className="prose-ah max-w-[720px]"
              {...(fellBack ? { dir: "ltr", lang: "en" } : {})}
              dangerouslySetInnerHTML={{ __html: cleanHtml(body) }}
            />
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-white py-24 md:py-28">
          <div className="container">
            <SectionHeading
              eyebrow={ar ? "أخبار ذات صلة" : "Related news"}
              title={ar ? "اقرأ أيضًا" : "Read next"}
              action={
                <Link href={href(locale, "/news")} className="group inline-flex items-center gap-2 text-[0.92rem] font-medium text-ink">
                  <span className="link-underline">{ar ? "جميع الأخبار" : "All news"}</span>
                  <Arrow className="text-leaf-700" />
                </Link>
              }
            />
            <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.06}>
                  <NewsCard post={p} locale={locale} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
