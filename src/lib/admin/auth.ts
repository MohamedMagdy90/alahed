"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { clearSessionCookie, createSessionCookie } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

const schema = z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1).max(200) });

export async function login(input: { email: string; password: string }): Promise<{ ok: boolean; error?: string }> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "INVALID" };
  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] || "local").trim();
  if (!rateLimit(`login:${ip}`, 10, 15 * 60 * 1000)) return { ok: false, error: "RATE_LIMIT" };
  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  // Constant-ish time: always run a bcrypt comparison.
  const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv");
  if (!user || !user.active || !ok) return { ok: false, error: "INVALID" };
  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await createSessionCookie({ uid: user.id, role: user.role === "admin" ? "admin" : "editor", name: user.name, email: user.email });
  return { ok: true };
}

export async function logout() {
  await clearSessionCookie();
  return { ok: true };
}
