import "server-only";
import type { Post } from "@prisma/client";
import { cache } from "react";
import { db } from "./db";
import { type IrContact, type ShareInfo, SETTING_KEYS, defaultIrContact, defaultShare } from "./settings";

const published = () => ({ status: "published", publishedAt: { lte: new Date() } });

/**
 * Database errors are logged and passed on, never replaced by empty results. Public pages are cached: when a
 * background refresh fails, Next keeps serving the last good page and retries on the next visit, whereas an empty
 * result would have been cached as a page with missing news, people or settings. (In the admin, a failed read now
 * shows an error instead of a form filled with defaults that could be saved over the real data.)
 */
function failed(where: string, e: unknown): never {
  console.error(`[queries] ${where}`, e);
  throw e;
}

export async function getLatestPosts(opts: { limit?: number; type?: string; company?: string; featuredFirst?: boolean } = {}) {
  const { limit = 3, type, company, featuredFirst = false } = opts;
  try {
    return await db.post.findMany({
      where: { ...published(), ...(type ? { type } : {}), ...(company ? { company } : {}) },
      orderBy: featuredFirst ? [{ featured: "desc" }, { publishedAt: "desc" }] : [{ publishedAt: "desc" }],
      take: limit,
    });
  } catch (e) {
    failed("getLatestPosts", e);
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
    failed("getPosts", e);
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await db.post.findFirst({ where: { slug, ...published() } });
  } catch (e) {
    failed("getPostBySlug", e);
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
  } catch (e) {
    failed("getRelatedPosts", e);
  }
}

export async function getPeople(group?: "board" | "management") {
  try {
    return await db.person.findMany({
      where: { active: true, ...(group ? { group } : {}) },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  } catch (e) {
    failed("getPeople", e);
  }
}

export async function getDocuments(category?: string) {
  try {
    return await db.document.findMany({
      where: { published: true, ...(category ? { category } : {}) },
      orderBy: [{ year: "desc" }, { publishedAt: "desc" }],
    });
  } catch (e) {
    failed("getDocuments", e);
  }
}

/** Open roles for the Careers page and the home page (newest first). */
export async function getOpenJobs(limit?: number) {
  try {
    return await db.job.findMany({ where: { open: true }, orderBy: [{ postedAt: "desc" }], ...(limit ? { take: limit } : {}) });
  } catch (e) {
    failed("getOpenJobs", e);
  }
}

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  let row: { value: string } | null;
  try {
    row = await db.setting.findUnique({ where: { key } });
  } catch (e) {
    failed(`getSetting(${key})`, e);
  }
  // No row yet = never saved: the defaults apply. A row that cannot be parsed falls back to them as well.
  if (!row) return fallback;
  try {
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
