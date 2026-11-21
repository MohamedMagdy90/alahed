"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { assertSession, createSessionCookie } from "@/lib/session";
import { run } from "./result";

const pwd = z.string().min(10, "PASSWORD_TOO_SHORT").max(200);

export async function createUser(input: { name: string; email: string; role: "admin" | "editor"; password: string }) {
  return run(
    async () => {
      await assertSession("admin");
      const d = z
        .object({ name: z.string().trim().min(2).max(120), email: z.string().trim().toLowerCase().email(), role: z.enum(["admin", "editor"]), password: pwd })
        .parse(input);
      if (await db.user.findUnique({ where: { email: d.email } })) throw new Error("EMAIL_TAKEN");
      await db.user.create({ data: { name: d.name, email: d.email, role: d.role, passwordHash: await bcrypt.hash(d.password, 12) } });
    },
    { revalidate: false },
  );
}

async function assertNotLastAdmin(id: string) {
  const u = await db.user.findUniqueOrThrow({ where: { id } });
  if (u.role !== "admin" || !u.active) return;
  const admins = await db.user.count({ where: { role: "admin", active: true } });
  if (admins <= 1) throw new Error("LAST_ADMIN");
}

export async function updateUser(input: { id: string; role: "admin" | "editor"; active: boolean }) {
  return run(
    async () => {
      const s = await assertSession("admin");
      const d = z.object({ id: z.string(), role: z.enum(["admin", "editor"]), active: z.boolean() }).parse(input);
      if (d.id === s.uid && (!d.active || d.role !== "admin")) throw new Error("SELF");
      if (d.role !== "admin" || !d.active) await assertNotLastAdmin(d.id);
      await db.user.update({ where: { id: d.id }, data: { role: d.role, active: d.active } });
    },
    { revalidate: false },
  );
}

export async function resetUserPassword(id: string, password: string) {
  return run(
    async () => {
      await assertSession("admin");
      await db.user.update({ where: { id }, data: { passwordHash: await bcrypt.hash(pwd.parse(password), 12) } });
    },
    { revalidate: false },
  );
}

export async function deleteUser(id: string) {
  return run(
    async () => {
      const s = await assertSession("admin");
      if (id === s.uid) throw new Error("SELF");
      await assertNotLastAdmin(id);
      await db.user.delete({ where: { id } });
    },
    { revalidate: false },
  );
}

export async function updateAccount(input: { name: string; currentPassword?: string; newPassword?: string }) {
  return run(
    async () => {
      const s = await assertSession();
      const d = z
        .object({ name: z.string().trim().min(2).max(120), currentPassword: z.string().optional(), newPassword: z.string().optional() })
        .parse(input);
      const user = await db.user.findUniqueOrThrow({ where: { id: s.uid } });
      const data: { name: string; passwordHash?: string } = { name: d.name };
      if (d.newPassword) {
        if (!d.currentPassword || !(await bcrypt.compare(d.currentPassword, user.passwordHash))) throw new Error("WRONG_PASSWORD");
        data.passwordHash = await bcrypt.hash(pwd.parse(d.newPassword), 12);
      }
      const u = await db.user.update({ where: { id: s.uid }, data });
      await createSessionCookie({ uid: u.id, role: u.role === "admin" ? "admin" : "editor", name: u.name, email: u.email });
    },
    { revalidate: false },
  );
}
