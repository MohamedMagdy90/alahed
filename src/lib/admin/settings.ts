"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { assertSession } from "@/lib/session";
import { SETTING_KEYS } from "@/lib/settings";
import { run } from "./result";

const num = z.number().finite().nullable();
const shareSchema = z.object({
  status: z.enum(["pre-listing", "listed"]),
  exchange: z.string().trim().max(40),
  ticker: z.string().trim().max(20),
  isin: z.string().trim().max(20),
  currency: z.string().trim().max(10),
  price: num,
  change: num,
  changePct: num,
  asOf: z.string().nullable(),
  noteEn: z.string().trim().max(1000),
  noteAr: z.string().trim().max(1000),
});
const irSchema = z.object({
  nameEn: z.string().trim().max(160),
  nameAr: z.string().trim().max(160),
  email: z.string().trim().email(),
  phone: z.string().trim().max(40),
});

async function put(key: string, value: unknown) {
  const v = JSON.stringify(value);
  await db.setting.upsert({ where: { key }, update: { value: v }, create: { key, value: v } });
}

export async function saveShareInfo(input: z.input<typeof shareSchema>) {
  return run(async () => {
    await assertSession("admin");
    await put(SETTING_KEYS.share, shareSchema.parse(input));
  });
}

export async function saveIrContact(input: z.input<typeof irSchema>) {
  return run(async () => {
    await assertSession("admin");
    await put(SETTING_KEYS.irContact, irSchema.parse(input));
  });
}
