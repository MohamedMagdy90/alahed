"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { cleanHtml, slugify } from "@/lib/sanitize";
import { assertSession } from "@/lib/session";
import { run } from "./result";

const schema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().max(100).optional().default(""),
  type: z.enum(["news", "blog", "event", "press", "award"]),
  company: z.enum(["holding", "aatc", "dopet", "pemco", "dst"]),
  status: z.enum(["draft", "published"]),
  featured: z.boolean(),
  titleEn: z.string().trim().min(3, "TITLE_REQUIRED").max(220),
  titleAr: z.string().trim().max(220).default(""),
  excerptEn: z.string().trim().max(600).default(""),
  excerptAr: z.string().trim().max(600).default(""),
  bodyEn: z.string().max(200_000).default(""),
  bodyAr: z.string().max(200_000).default(""),
  coverImage: z.string().max(500).nullable().optional(),
  seoTitleEn: z.string().trim().max(120).default(""),
  seoTitleAr: z.string().trim().max(120).default(""),
  seoDescEn: z.string().trim().max(320).default(""),
  seoDescAr: z.string().trim().max(320).default(""),
  publishedAt: z.string().min(1),
});
export type PostInput = z.input<typeof schema>;

async function uniqueSlug(base: string, id?: string) {
  const root = slugify(base) || `post-${Date.now().toString(36)}`;
  let slug = root;
  for (let i = 2; i < 100; i++) {
    const hit = await db.post.findFirst({ where: { slug, ...(id ? { id: { not: id } } : {}) }, select: { id: true } });
    if (!hit) return slug;
    slug = `${root}-${i}`;
  }
  return `${root}-${Date.now().toString(36)}`;
}

export async function savePost(input: PostInput) {
  return run(async () => {
    const s = await assertSession();
    const d = schema.parse(input);
    const publishedAt = new Date(d.publishedAt);
    if (Number.isNaN(publishedAt.getTime())) throw new Error("INVALID_DATE");
    const slug = await uniqueSlug(d.slug || d.titleEn, d.id);
    const data = {
      ...d,
      id: undefined,
      slug,
      publishedAt,
      bodyEn: cleanHtml(d.bodyEn),
      bodyAr: cleanHtml(d.bodyAr),
      coverImage: d.coverImage || null,
    };
    const post = d.id
      ? await db.post.update({ where: { id: d.id }, data })
      : await db.post.create({ data: { ...data, authorId: s.uid } });
    return { id: post.id, slug: post.slug };
  });
}

export async function deletePost(id: string) {
  return run(async () => {
    await assertSession();
    await db.post.delete({ where: { id } });
  });
}

export async function togglePostFeatured(id: string, featured: boolean) {
  return run(async () => {
    await assertSession();
    await db.post.update({ where: { id }, data: { featured } });
  });
}
