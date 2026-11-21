import { z } from "zod";
import { db } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { saveUpload } from "@/lib/storage";

import { CAREER_AREAS as AREAS, JOB_POSITION_PREFIX, areaLabels } from "@/lib/forms";
const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  phone: z.string().trim().min(5).max(40),
  // Either a general area ("engineering") or a listed role ("job:<id>").
  position: z.union([z.enum(AREAS), z.string().regex(/^job:[a-z0-9]{8,40}$/i)]),
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

    // Resolve the role first so a closed listing never leaves an orphaned CV on disk.
    const { position, ...rest } = parsed.data;
    let jobId: string | null = null;
    let label: string;
    let subject = "Job application";
    if (position.startsWith(JOB_POSITION_PREFIX)) {
      const job = await db.job.findFirst({ where: { id: position.slice(JOB_POSITION_PREFIX.length), open: true } });
      if (!job) return Response.json({ ok: false, error: "ROLE_CLOSED" }, { status: 400 });
      jobId = job.id;
      label = job.titleEn;
      subject = `Application: ${job.titleEn}`;
    } else {
      label = areaLabels[position as (typeof AREAS)[number]].en;
    }

    let attachment: string;
    try {
      attachment = (await saveUpload(cv, "cv")).url;
    } catch (e) {
      const code = e instanceof Error ? e.message : "";
      if (code === "INVALID_TYPE" || code === "TOO_LARGE") return Response.json({ ok: false, error: code }, { status: 400 });
      throw e;
    }
    await db.message.create({ data: { kind: "career", subject, position: label, jobId, attachment, ...rest } });
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[careers]", e);
    return Response.json({ ok: false, error: "SERVER" }, { status: 500 });
  }
}
