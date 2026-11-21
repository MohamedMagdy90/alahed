// Tiny in-memory sliding-window rate limiter (single-instance deployment).
type Bucket = number[];
const store: Map<string, Bucket> = ((globalThis as unknown as { __ahRate?: Map<string, Bucket> }).__ahRate ??= new Map());

export function clientIp(req: Request) {
  return (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "local").trim();
}

/** Returns true when the request is allowed. */
export function rateLimit(key: string, max = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const hits = (store.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    store.set(key, hits);
    return false;
  }
  hits.push(now);
  store.set(key, hits);
  if (store.size > 5000) for (const [k, v] of store) if (!v.some((t) => now - t < windowMs)) store.delete(k);
  return true;
}
