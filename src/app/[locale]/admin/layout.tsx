import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "إدارة المحتوى" : "Content management",
    robots: { index: false, follow: false, nocache: true },
  };
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-pearl-50 font-sans text-ink antialiased">{children}</div>;
}
