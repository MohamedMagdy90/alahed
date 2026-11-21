"use server";
import { z } from "zod";
import { db } from "@/lib/db";
import { CAREER_AREAS, JOB_COMPANIES, JOB_EMPLOYMENT } from "@/lib/forms";
import { assertSession } from "@/lib/session";
import { run } from "./result";

const schema = z.object({
  id: z.string().optional(),
  company: z.enum(JOB_COMPANIES),
  area: z.enum(CAREER_AREAS),
  employment: z.enum(JOB_EMPLOYMENT),
  titleEn: z.string().trim().min(3, "TITLE_REQUIRED").max(160),
  titleAr: z.string().trim().max(160).default(""),
  locationEn: z.string().trim().max(120).default(""),
  locationAr: z.string().trim().max(120).default(""),
  summaryEn: z.string().trim().max(1500).default(""),
  summaryAr: z.string().trim().max(1500).default(""),
  open: z.boolean(),
  postedAt: z.string().datetime(),
});

export type JobInput = z.input<typeof schema>;

export async function saveJob(input: JobInput) {
  return run(async () => {
    await assertSession();
    const { id, postedAt, ...rest } = schema.parse(input);
    const data = { ...rest, postedAt: new Date(postedAt) };
    if (id) return (await db.job.update({ where: { id }, data })).id;
    return (await db.job.create({ data })).id;
  });
}

export async function setJobOpen(id: string, open: boolean) {
  return run(async () => {
    await assertSession();
    await db.job.update({ where: { id }, data: { open } });
  });
}

export async function deleteJob(id: string) {
  return run(async () => {
    await assertSession();
    await db.job.delete({ where: { id } });
  });
}
