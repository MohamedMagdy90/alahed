import { notFound } from "next/navigation";
import { PostEditor, type PostFormState } from "@/components/admin/PostEditor";
import { type Locale, isLocale } from "@/i18n/config";
import { db } from "@/lib/db";

export default async function EditPostPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: raw, id } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const p = await db.post.findUnique({ where: { id } });
  if (!p) notFound();

  const initial: PostFormState = {
    id: p.id,
    slug: p.slug,
    type: (["news", "blog", "event", "press", "award"].includes(p.type) ? p.type : "news") as PostFormState["type"],
    company: (["holding", "aatc", "dopet", "pemco"].includes(p.company) ? p.company : "holding") as PostFormState["company"],
    status: p.status === "published" ? "published" : "draft",
    featured: p.featured,
    titleEn: p.titleEn,
    titleAr: p.titleAr,
    excerptEn: p.excerptEn,
    excerptAr: p.excerptAr,
    bodyEn: p.bodyEn,
    bodyAr: p.bodyAr,
    coverImage: p.coverImage,
    seoTitleEn: p.seoTitleEn,
    seoTitleAr: p.seoTitleAr,
    seoDescEn: p.seoDescEn,
    seoDescAr: p.seoDescAr,
    publishedAt: p.publishedAt.toISOString(),
  };

  return <PostEditor key={p.id} locale={locale} initial={initial} siteUrl={process.env.NEXT_PUBLIC_SITE_URL || "https://www.alahedholding.com"} />;
}
