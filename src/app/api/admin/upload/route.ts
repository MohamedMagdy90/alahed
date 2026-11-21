import { assertSession } from "@/lib/session";
import { saveUpload } from "@/lib/storage";

export const runtime = "nodejs";

/** Authenticated upload for the admin panel. Body: multipart { file, kind: "image" | "document" }. */
export async function POST(req: Request) {
  try {
    await assertSession();
  } catch {
    return Response.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ ok: false, error: "INVALID" }, { status: 400 });
  }
  const file = form.get("file");
  const kind = form.get("kind");
  if (!(file instanceof File) || file.size === 0) return Response.json({ ok: false, error: "FILE_REQUIRED" }, { status: 400 });
  if (kind !== "image" && kind !== "document") return Response.json({ ok: false, error: "INVALID" }, { status: 400 });
  try {
    const saved = await saveUpload(file, kind);
    return Response.json({ ok: true, ...saved, name: file.name });
  } catch (e) {
    const code = e instanceof Error && ["INVALID_TYPE", "TOO_LARGE"].includes(e.message) ? e.message : "ERROR";
    if (code === "ERROR") console.error("[upload]", e);
    return Response.json({ ok: false, error: code }, { status: 400 });
  }
}
