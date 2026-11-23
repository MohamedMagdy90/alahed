import { z } from "zod";
import { db } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * Article view counter. Articles are served from the page cache, so the count can no longer be taken while the page
 * renders; the article sends one beacon per visit instead. One view per visitor IP and article every 30 minutes.
 */
const schema = z.object({ slug: z.string().trim().min(1).max(200) });

export async function POST(req: Request) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return new Response(null, { status: 400 });
    const { slug } = parsed.data;
    if (rateLimit(`view:${clientIp(req)}:${slug}`, 1, 30 * 60 * 1000)) {
      await db.post.updateMany({ where: { slug, status: "published" }, data: { views: { increment: 1 } } });
    }
    return new Response(null, { status: 204 });
  } catch (e) {
    console.error("[views]", e);
    return new Response(null, { status: 204 });
  }
}
