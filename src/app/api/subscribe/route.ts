import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  list: z.enum(["news", "ir"]).default("news"),
  locale: z.enum(["en", "ar"]).default("en"),
});

export async function POST(req: Request) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return Response.json({ ok: false, error: "INVALID" }, { status: 400 });
    const { email, list, locale } = parsed.data;
    await db.subscriber.upsert({ where: { email }, update: { list, locale }, create: { email, list, locale } });
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[subscribe]", e);
    return Response.json({ ok: false }, { status: 500 });
  }
}
