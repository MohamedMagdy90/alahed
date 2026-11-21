import { z } from "zod";
import { db } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { saveUpload } from "@/lib/storage";

import { CAREER_AREAS as AREAS } from "@/lib/forms";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  phone: z.string().trim().min(5).max(40),
  position: z.enum(AREAS),
  message: z.string().trim().max(5000).optional().default(""),
  locale: z.enum(["en", "ar"]).default("en"),
});

export async function POST(req: Request) {
  try {
    const form = await req.formData().catch(() => null);
    if (!form) return Response.json({ ok: false, error: "INVALID" }, { status: 400 });
    if (form.get("website")) return Response.json({ ok: true }); // honeypot
    const parsed = schema.safeParse(Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === "string")));
    if (!parsed.success) return Response.json({ ok: false, error: "INVALID" }, { status: 400 });
    const cv = form.get("cv");
    if (!(cv instanceof File) || cv.size === 0) return Response.json({ ok: false, error: "CV_REQUIRED" }, { status: 400 });
    if (!rateLimit(`careers:${clientIp(req)}`, 3)) return Response.json({ ok: false, error: "RATE_LIMIT" }, { status: 429 });

    let attachment: string;
    try {
      attachment = (await saveUpload(cv, "cv")).url;
    } catch (e) {
      const code = e instanceof Error ? e.message : "";
      if (code === "INVALID_TYPE" || code === "TOO_LARGE") return Response.json({ ok: false, error: code }, { status: 400 });
      throw e;
    }
    const { position, ...rest } = parsed.data;
    await db.message.create({ data: { kind: "career", subject: "Job application", position, attachment, ...rest } });
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[careers]", e);
    return Response.json({ ok: false, error: "SERVER" }, { status: 500 });
  }
}
