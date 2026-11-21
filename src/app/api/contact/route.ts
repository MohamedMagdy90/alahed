import { z } from "zod";
import { db } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

import { CONTACT_SUBJECTS as SUBJECTS } from "@/lib/forms";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  phone: z.string().trim().max(40).optional().default(""),
  company: z.string().trim().max(160).optional().default(""),
  subject: z.enum(SUBJECTS),
  message: z.string().trim().min(10).max(5000),
  locale: z.enum(["en", "ar"]).default("en"),
  website: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = schema.safeParse(json);
    if (!parsed.success) return Response.json({ ok: false, error: "INVALID" }, { status: 400 });
    const { website, ...data } = parsed.data;
    if (website) return Response.json({ ok: true }); // honeypot: silently accept
    if (!rateLimit(`contact:${clientIp(req)}`)) return Response.json({ ok: false, error: "RATE_LIMIT" }, { status: 429 });
    await db.message.create({ data: { kind: "contact", ...data } });
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[contact]", e);
    return Response.json({ ok: false, error: "SERVER" }, { status: 500 });
  }
}
