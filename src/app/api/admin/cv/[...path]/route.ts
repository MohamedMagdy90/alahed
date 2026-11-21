import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { getSession } from "@/lib/session";
import { MIME_BY_EXT, PRIVATE_DIR } from "@/lib/storage";

export const runtime = "nodejs";

/** Streams a privately stored CV (only for signed-in admin users). URL: /api/admin/cv/<yyyy>/<mm>/<file> */
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  if (!(await getSession())) return new Response("Unauthorized", { status: 401 });
  const { path: parts } = await params;
  const root = path.join(PRIVATE_DIR, "cv");
  const target = path.resolve(root, ...parts);
  if (!target.startsWith(root + path.sep)) return new Response("Not found", { status: 404 });
  try {
    const info = await stat(target);
    if (!info.isFile()) return new Response("Not found", { status: 404 });
    const data = await readFile(target);
    const ext = path.extname(target).toLowerCase();
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": MIME_BY_EXT[ext] || "application/octet-stream",
        "Content-Length": String(info.size),
        "Content-Disposition": `attachment; filename="${path.basename(target).replace(/"/g, "")}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
