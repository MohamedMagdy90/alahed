import { CareersCta } from "@/components/home/CareersCta";
import { Companies } from "@/components/home/Companies";
import { Footprint } from "@/components/home/Footprint";
import { Hero, type HeroLatest } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { InvestorTeaser } from "@/components/home/InvestorTeaser";
import { LatestNews } from "@/components/home/LatestNews";
import { Partners } from "@/components/home/Partners";
import { postTypes } from "@/content/site";
import { type Locale, formatDate, isLocale, pick } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import { getLatestPosts, getShareInfo } from "@/lib/queries";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const [posts, share] = await Promise.all([getLatestPosts({ limit: 5, featuredFirst: false }), getShareInfo()]);

  // The hero's live strip shows the newest newsroom item, so the page visibly changes whenever the team publishes.
  const first = posts[0];
  const latest: HeroLatest = first
    ? {
        title: pick(first, "title", locale),
        date: formatDate(first.publishedAt, locale),
        href: href(locale, `/news/${first.slug}`),
        label: postTypes[first.type]?.[locale] ?? first.type,
      }
    : null;

  return (
    <>
      <Hero locale={locale} latest={latest} />
      <Intro locale={locale} />
      <Companies locale={locale} />
      <Footprint locale={locale} />
      <Partners locale={locale} />
      <InvestorTeaser locale={locale} share={share} />
      <LatestNews locale={locale} posts={posts} />
      <CareersCta locale={locale} />
    </>
  );
}
