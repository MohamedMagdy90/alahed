import type { Metadata, Viewport } from "next";
import { Funnel_Display, IBM_Plex_Sans_Arabic, Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { dirOf, isLocale } from "@/i18n/config";

const display = Funnel_Display({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["italic", "normal"], variable: "--font-serif", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.alahedholding.com";

// All pages read live data (news, people, IR documents, share info) from the database.
export const dynamic = "force-dynamic";

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
      className={`${display.variable} ${sans.variable} ${serif.variable} ${mono.variable} ${arabic.variable}`}
      suppressHydrationWarning
    >
      <head>
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
