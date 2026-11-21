import { siteGeo } from "@/content/pages/home";

/**
 * Live local conditions at each Group location, for the home page map.
 * Source: MET Norway Locationforecast 2.0 (free, CC BY 4.0 — attribution shown on the page). Their terms require
 * an identifying User-Agent and sensible caching, so results are kept in memory for 30 minutes and every visitor
 * shares them. Any failure simply returns { ok: false } and the page hides the conditions.
 */
export const dynamic = "force-dynamic";

type Now = { t: number; wind: number; dir: number; rh: number; symbol: string | null; time: string };
type Payload = { ok: true; updated: string; sites: Record<string, Now | null> };

const TTL = 30 * 60 * 1000;
const UA = "AlAhedHolding/1.0 (+https://www.alahedholding.com; admin@alahed.com.qa)";
let cache: { at: number; body: Payload } | null = null;
let inflight: Promise<Payload | null> | null = null;

type MetEntry = {
  time: string;
  data: {
    instant: { details: Record<string, number> };
    next_1_hours?: { summary?: { symbol_code?: string } };
    next_6_hours?: { summary?: { symbol_code?: string } };
  };
};

async function site(lat: number, lon: number): Promise<Now | null> {
  try {
    const res = await fetch(
      `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`,
      { headers: { "User-Agent": UA, Accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(7000) },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { properties?: { timeseries?: MetEntry[] } };
    const series = json.properties?.timeseries ?? [];
    if (!series.length) return null;
    const now = Date.now();
    // The entry closest to the current time.
    const e = series.reduce((best, cur) =>
      Math.abs(Date.parse(cur.time) - now) < Math.abs(Date.parse(best.time) - now) ? cur : best,
    );
    const d = e.data.instant.details;
    if (typeof d.air_temperature !== "number") return null;
    return {
      t: d.air_temperature,
      wind: d.wind_speed ?? 0,
      dir: d.wind_from_direction ?? 0,
      rh: d.relative_humidity ?? 0,
      symbol: e.data.next_1_hours?.summary?.symbol_code ?? e.data.next_6_hours?.summary?.symbol_code ?? null,
      time: e.time,
    };
  } catch {
    return null;
  }
}

async function refresh(): Promise<Payload | null> {
  const entries = await Promise.all(Object.entries(siteGeo).map(async ([id, g]) => [id, await site(g.lat, g.lon)] as const));
  const sites = Object.fromEntries(entries);
  if (!Object.values(sites).some(Boolean)) return null;
  const body: Payload = { ok: true, updated: new Date().toISOString(), sites };
  cache = { at: Date.now(), body };
  return body;
}

export async function GET() {
  let body = cache && Date.now() - cache.at < TTL ? cache.body : null;
  if (!body) {
    inflight ??= refresh().finally(() => {
      inflight = null;
    });
    body = (await inflight) ?? cache?.body ?? null;
  }
  if (!body) return Response.json({ ok: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
  return Response.json(body, { headers: { "Cache-Control": "public, max-age=300" } });
}
