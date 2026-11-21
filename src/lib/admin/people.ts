"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { cleanHtml } from "@/lib/sanitize";
import { assertSession } from "@/lib/session";
import { run } from "./result";

const schema = z.object({
  id: z.string().optional(),
  group: z.enum(["board", "management"]),
  nameEn: z.string().trim().min(2, "NAME_REQUIRED").max(160),
  nameAr: z.string().trim().max(160).default(""),
  roleEn: z.string().trim().min(2, "ROLE_REQUIRED").max(200),
  roleAr: z.string().trim().max(200).default(""),
  bioEn: z.string().max(20_000).default(""),
  bioAr: z.string().max(20_000).default(""),
  photo: z.string().max(500).nullable().optional(),
  active: z.boolean(),
});
export type PersonInput = z.input<typeof schema>;

export async function savePerson(input: PersonInput) {
  return run(async () => {
    await assertSession();
    const d = schema.parse(input);
    const data = { ...d, id: undefined, bioEn: cleanHtml(d.bioEn), bioAr: cleanHtml(d.bioAr), photo: d.photo || null };
    if (d.id) return (await db.person.update({ where: { id: d.id }, data })).id;
    const max = await db.person.aggregate({ where: { group: d.group }, _max: { order: true } });
    return (await db.person.create({ data: { ...data, order: (max._max.order ?? 0) + 1 } })).id;
  });
}

export async function deletePerson(id: string) {
  return run(async () => {
    await assertSession();
    await db.person.delete({ where: { id } });
  });
}

export async function movePerson(id: string, dir: -1 | 1) {
  return run(async () => {
    await assertSession();
    const p = await db.person.findUniqueOrThrow({ where: { id } });
    const list = await db.person.findMany({ where: { group: p.group }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
    const i = list.findIndex((x) => x.id === id);
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    await db.$transaction(list.map((x, k) => db.person.update({ where: { id: x.id }, data: { order: k + 1 } })));
  });
}
