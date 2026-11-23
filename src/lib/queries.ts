import "server-only";
import type { Post } from "@prisma/client";
import { cache } from "react";
import { db } from "./db";
import { type IrContact, type ShareInfo, SETTING_KEYS, defaultIrContact, defaultShare } from "./settings";

const published = () => ({ status: "published", publishedAt: { lte: new Date() } });

export async function getLatestPosts(opts: { limit?: number; type?: string; company?: string; featuredFirst?: boolean } = {}) {
  const { limit = 3, type, company, featuredFirst = false } = opts;
  try {
    return await db.post.findMany({
      where: { ...published(), ...(type ? { type } : {}), ...(company ? { company } : {}) },
      orderBy: featuredFirst ? [{ featured: "desc" }, { publishedAt: "desc" }] : [{ publishedAt: "desc" }],
      take: limit,
    });
  } catch (e) {
    console.error("[queries] getLatestPosts", e);
    return [] as Post[];
  }
}

export async function getPosts(opts: { type?: string; company?: string; page?: number; perPage?: number; q?: string } = {}) {
  const { type, company, page = 1, perPage = 9, q } = opts;
  const where = {
    ...published(),
    ...(type ? { type } : {}),
    ...(company ? { company } : {}),
    ...(q ? { OR: [{ titleEn: { contains: q } }, { titleAr: { contains: q } }] } : {}),
  };
  try {
    const [items, total] = await Promise.all([
      db.post.findMany({ where, orderBy: { publishedAt: "desc" }, skip: (page - 1) * perPage, take: perPage }),
      db.post.count({ where }),
    ]);
    return { items, total, pages: Math.max(1, Math.ceil(total / perPage)), page };
  } catch (e) {
    console.error("[queries] getPosts", e);
    return { items: [] as Post[], total: 0, pages: 1, page };
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await db.post.findFirst({ where: { slug, ...published() } });
  } catch (e) {
    console.error("[queries] getPostBySlug", e);
    return null;
  }
}

export async function getRelatedPosts(post: Pick<Post, "id" | "company" | "type">, limit = 3) {
  try {
    const items = await db.post.findMany({
      where: { ...published(), id: { not: post.id }, OR: [{ company: post.company }, { type: post.type }] },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
    if (items.length >= limit) return items;
    const more = await db.post.findMany({
      where: { ...published(), id: { notIn: [post.id, ...items.map((i) => i.id)] } },
      orderBy: { publishedAt: "desc" },
      take: limit - items.length,
    });
    return [...items, ...more];
  } catch {
    return [] as Post[];
  }
}

export async function getPeople(group?: "board" | "management") {
  try {
    return await db.person.findMany({
      where: { active: true, ...(group ? { group } : {}) },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  } catch (e) {
    console.error("[queries] getPeople", e);
    return [];
  }
}

export async function getDocuments(category?: string) {
  try {
    return await db.document.findMany({
      where: { published: true, ...(category ? { category } : {}) },
      orderBy: [{ year: "desc" }, { publishedAt: "desc" }],
    });
  } catch (e) {
    console.error("[queries] getDocuments", e);
    return [];
  }
}

/** Open roles for the Careers page and the home page (newest first). */
export async function getOpenJobs(limit?: number) {
  try {
    return await db.job.findMany({ where: { open: true }, orderBy: [{ postedAt: "desc" }], ...(limit ? { take: limit } : {}) });
  } catch (e) {
    console.error("[queries] getOpenJobs", e);
    return [];
  }
}

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const row = await db.setting.findUnique({ where: { key } });
    if (!row) return fallback;
    return { ...fallback, ...(JSON.parse(row.value) as Partial<T>) };
  } catch {
    return fallback;
  }
}

/** Cached per request: the layout and the page both read it. */
export const getShareInfo = cache(() => getSetting<ShareInfo>(SETTING_KEYS.share, defaultShare));
/** Whether anything about the listing (share information, Investors page, IR links) is shown on the website. */
export const getListingVisible = async () => (await getShareInfo()).visible === true;
export const getIrContact = () => getSetting<IrContact>(SETTING_KEYS.irContact, defaultIrContact);
