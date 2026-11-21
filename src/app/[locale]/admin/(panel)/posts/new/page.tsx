import { PostEditor } from "@/components/admin/PostEditor";
import { type Locale, isLocale } from "@/i18n/config";

export default async function NewPostPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const today = new Date().toISOString().slice(0, 10);
  return (
    <PostEditor
      locale={locale}
      siteUrl={process.env.NEXT_PUBLIC_SITE_URL || "https://www.alahedholding.com"}
      initial={{
        slug: "",
        type: "news",
        company: "holding",
        status: "draft",
        featured: false,
        titleEn: "",
        titleAr: "",
        excerptEn: "",
        excerptAr: "",
        bodyEn: "",
        bodyAr: "",
        coverImage: null,
        seoTitleEn: "",
        seoTitleAr: "",
        seoDescEn: "",
        seoDescAr: "",
        publishedAt: `${today}T12:00:00.000Z`,
      }}
    />
  );
}
