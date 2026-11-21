import "server-only";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

export type Result<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

/** Wrap a server action body: maps auth/validation errors to a typed result and refreshes public pages. */
export async function run<T>(fn: () => Promise<T>, opts: { revalidate?: boolean } = { revalidate: true }): Promise<Result<T>> {
  try {
    const data = await fn();
    if (opts.revalidate !== false) revalidatePath("/", "layout");
    return { ok: true, data };
  } catch (e) {
    if (e instanceof ZodError) return { ok: false, error: e.issues[0]?.message || "INVALID" };
    const msg = e instanceof Error ? e.message : "ERROR";
    if (["UNAUTHORIZED", "FORBIDDEN"].includes(msg) || /^[A-Z_]+$/.test(msg)) return { ok: false, error: msg };
    console.error("[admin action]", e);
    return { ok: false, error: "ERROR" };
  }
}
