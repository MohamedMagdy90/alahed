import type { Metadata, Viewport } from "next";
import { Funnel_Display, Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { dirOf, isLocale } from "@/i18n/config";

// Only the two Latin UI families are preloaded on every page; the serif and the mono are fetched on demand.
// IBM Plex Sans Arabic is self-hosted (@font-face in globals.css, files in /public/fonts) so that only Arabic pages
// preload it: English pages no longer download ~12 Arabic files, and Arabic text no longer swaps in late.
const display = Funnel_Display({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic", "normal"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
});
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", preload: false });
// The weights an Arabic page renders on its first screen (body 400, navigation and buttons 500).
const ARABIC_PRELOAD = ["400-arabic", "500-arabic", "400-latin", "500-latin"].map((f) => `/fonts/plex-arabic-${f}.woff2`);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.alahedholding.com";

// Pages are cached (ISR), not rebuilt on every visit. Nothing is rendered at build time (the build machine has no
// database): each page is rendered on its first visit after a deploy, then served from the cache. Admin saves purge
// the cache (revalidatePath in lib/admin/result.ts) and public pages also refresh in the background every 60 s
// (see (site)/layout.tsx). The admin area stays fully dynamic (admin/layout.tsx).
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const ar = locale === "ar";
  const name = ar ? "العهد القابضة" : "Al-Ahed Holding";
  const description = ar
    ? "العهد القابضة مجموعة قطرية تأسست عام 1975، تضم العهد للتجارة والمقاولات ودوبت وبمكو للفحص، وتخدم قطاعات النفط والغاز والبتروكيماويات."
    : "Al-Ahed Holding is a Qatari group established in 1975, bringing together Al-Ahed Trading & Contracting, DOPET and PEMCO Inspection to serve the oil, gas and petrochemical industries.";
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${name} — ${ar ? "منذ 1975" : "Since 1975"}`, template: `%s · ${name}` },
    description,
    alternates: { languages: { en: "/en", ar: "/ar" } },
    openGraph: { type: "website", siteName: name, locale: ar ? "ar_QA" : "en_GB", images: ["/images/doha-night.jpg"] },
    icons: { icon: "/brand/icon.png" },
  };
}

export const viewport: Viewport = { themeColor: "#060D22", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      className={`${display.variable} ${sans.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {locale === "ar" &&
          ARABIC_PRELOAD.map((f) => <link key={f} rel="preload" href={f} as="font" type="font/woff2" crossOrigin="anonymous" />)}
        {process.env.NODE_ENV === "development" && (
          <Script crossOrigin="anonymous" src="//unpkg.com/same-runtime/dist/index.global.js" />
        )}
      </head>
      <body suppressHydrationWarning>
        {children}
        <Toaster position={locale === "ar" ? "bottom-left" : "bottom-right"} dir={dirOf(locale)} />
      </body>
    </html>
  );
}
