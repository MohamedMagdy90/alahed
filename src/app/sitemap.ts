import type { MetadataRoute } from "next";
import { companies } from "@/content/site";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.alahedholding.com").replace(/\/$/, "");
const STATIC = [
  "",
  "/about",
  "/leadership",
  "/governance",
  "/companies",
  ...companies.map((c) => `/companies/${c.slug}`),
  "/investors",
  "/news",
  "/careers",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
  "/legal/disclaimer",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entry = (path: string, lastModified?: Date): MetadataRoute.Sitemap =>
    (["en", "ar"] as const).map((l) => ({
      url: `${BASE}/${l}${path}`,
      lastModified: lastModified ?? new Date(),
      alternates: { languages: { en: `${BASE}/en${path}`, ar: `${BASE}/ar${path}` } },
    }));

  let posts: { slug: string; updatedAt: Date }[] = [];
  try {
    posts = await db.post.findMany({
      where: { status: "published", publishedAt: { lte: new Date() } },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    /* database unavailable: static routes only */
  }
  return [...STATIC.flatMap((p) => entry(p)), ...posts.flatMap((p) => entry(`/news/${p.slug}`, p.updatedAt))];
}
