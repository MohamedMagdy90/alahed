"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { cleanHtml } from "@/lib/sanitize";
import { assertSession } from "@/lib/session";
import { SETTING_KEYS } from "@/lib/settings";
import { run } from "./result";

const item = z.object({
  id: z.string().trim().min(1).max(40),
  personId: z.string().trim().max(40).nullable(),
  titleEn: z.string().trim().min(3, "TITLE_REQUIRED").max(160),
  titleAr: z.string().trim().max(160).default(""),
  bodyEn: z.string().max(40_000).default(""),
  bodyAr: z.string().max(40_000).default(""),
  visible: z.boolean(),
});
const schema = z.array(item).max(12);

export type LeaderMessageInput = z.input<typeof item>;

/** Saves the whole (ordered) list of leadership messages. */
export async function saveLeaderMessages(input: LeaderMessageInput[]) {
  return run(async () => {
    await assertSession();
    const items = schema.parse(input).map((m) => ({
      ...m,
      personId: m.personId || null,
      bodyEn: cleanHtml(m.bodyEn),
      bodyAr: cleanHtml(m.bodyAr),
    }));
    const value = JSON.stringify({ items });
    await db.setting.upsert({ where: { key: SETTING_KEYS.messages }, update: { value }, create: { key: SETTING_KEYS.messages, value } });
  });
}
