import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_MAX_AGE, type SessionPayload, signSession, verifySession } from "./auth";
import { db } from "./db";

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

/** For admin pages: redirects to login (or the dashboard) instead of throwing. Uses the live DB role. */
export async function requireSession(locale = "en", role?: "admin"): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect(`/${locale}/admin/login`);
  const user = await db.user.findUnique({ where: { id: session.uid }, select: { role: true, active: true } });
  if (!user || !user.active) redirect(`/${locale}/admin/login`);
  const current: SessionPayload = { ...session, role: user.role === "admin" ? "admin" : "editor" };
  if (role === "admin" && current.role !== "admin") redirect(`/${locale}/admin`);
  return current;
}

/**
 * For server actions / route handlers: throws instead of redirecting.
 * Re-reads the user so deactivation and role changes apply immediately (not only when the cookie expires).
 */
export async function assertSession(role?: "admin"): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  const user = await db.user.findUnique({ where: { id: session.uid }, select: { role: true, active: true } });
  if (!user || !user.active) throw new Error("UNAUTHORIZED");
  const current: SessionPayload = { ...session, role: user.role === "admin" ? "admin" : "editor" };
  if (role === "admin" && current.role !== "admin") throw new Error("FORBIDDEN");
  return current;
}

export async function createSessionCookie(payload: SessionPayload) {
  const token = await signSession(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
