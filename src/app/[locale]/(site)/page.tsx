import { Capabilities } from "@/components/home/Capabilities";
import { CareersCta } from "@/components/home/CareersCta";
import { Companies } from "@/components/home/Companies";
import { Figures } from "@/components/home/Figures";
import { Footprint } from "@/components/home/Footprint";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { InvestorTeaser } from "@/components/home/InvestorTeaser";
import { LatestNews } from "@/components/home/LatestNews";
import { Partners } from "@/components/home/Partners";
import { type Locale, isLocale } from "@/i18n/config";
import { getLatestPosts, getShareInfo } from "@/lib/queries";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const [posts, share] = await Promise.all([getLatestPosts({ limit: 5, featuredFirst: false }), getShareInfo()]);

  return (
    <>
      <Hero locale={locale} />
      <Intro locale={locale} />
      <Companies locale={locale} />
      <Figures locale={locale} />
      <Capabilities locale={locale} />
      <Footprint locale={locale} />
      <Partners locale={locale} />
      <InvestorTeaser locale={locale} share={share} />
      <LatestNews locale={locale} posts={posts} />
      <CareersCta locale={locale} />
    </>
  );
}
