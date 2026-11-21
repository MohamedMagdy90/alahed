import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

const esc = (v: string) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

/** CSV export of subscribers (UTF-8 with BOM so Excel opens Arabic correctly). ?list=news|ir */
export async function GET(req: Request) {
  if (!(await getSession())) return new Response("Unauthorized", { status: 401 });
  const list = new URL(req.url).searchParams.get("list");
  const rows = await db.subscriber.findMany({
    where: list === "news" || list === "ir" ? { list } : {},
    orderBy: { createdAt: "desc" },
  });
  const lines = [
    "email,list,language,subscribed_at",
    ...rows.map((r) => [r.email, r.list, r.locale, r.createdAt.toISOString()].map(esc).join(",")),
  ];
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(`\uFEFF${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="alahed-subscribers-${list || "all"}-${stamp}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
