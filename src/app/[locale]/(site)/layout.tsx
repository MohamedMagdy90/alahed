import { MotionProvider } from "@/components/motion";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { type Locale, isLocale } from "@/i18n/config";
import { getShareInfo } from "@/lib/queries";

// Public pages read live data (news, people, documents, settings) — always render fresh.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const share = await getShareInfo();
  return (
    <MotionProvider>
      <Header locale={locale} listed={share.status === "listed"} />
      <main id="main" className="relative">
        {children}
      </main>
      <Footer locale={locale} />
    </MotionProvider>
  );
}
