"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { assertSession } from "@/lib/session";
import { run } from "./result";

const schema = z.object({
  id: z.string().optional(),
  category: z.enum(["financial", "disclosure", "governance", "presentation", "agm", "sustainability"]),
  titleEn: z.string().trim().min(2, "TITLE_REQUIRED").max(220),
  titleAr: z.string().trim().max(220).default(""),
  year: z.number().int().min(1975).max(2100),
  fileUrl: z.string().min(1, "FILE_REQUIRED").max(500),
  fileSize: z.number().int().min(0).default(0),
  published: z.boolean(),
  publishedAt: z.string().min(1),
});
export type DocumentInput = z.input<typeof schema>;

export async function saveDocument(input: DocumentInput) {
  return run(async () => {
    await assertSession();
    const d = schema.parse(input);
    const data = { ...d, id: undefined, publishedAt: new Date(d.publishedAt) };
    if (d.id) return (await db.document.update({ where: { id: d.id }, data })).id;
    return (await db.document.create({ data })).id;
  });
}

export async function deleteDocument(id: string) {
  return run(async () => {
    await assertSession();
    await db.document.delete({ where: { id } });
  });
}
