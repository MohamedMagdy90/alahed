import { MotionProvider } from "@/components/motion";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { PageTransitions } from "@/components/site/PageTransitions";
import { type Locale, isLocale } from "@/i18n/config";
import { getShareInfo } from "@/lib/queries";

// Public pages are cached. Admin saves refresh them at once; this 60 s background refresh only matters for things
// that change with time alone, such as a news item scheduled to publish at a set hour. Visitors never wait for it:
// the cached page is served while the new one renders.
export const revalidate = 60;

export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const share = await getShareInfo();
  return (
    <MotionProvider>
      <PageTransitions />
      <Header locale={locale} listing={share.visible === true} listed={share.status === "listed"} />
      <main id="main" className="relative">
        {children}
      </main>
      <Footer locale={locale} listing={share.visible === true} />
    </MotionProvider>
  );
}
