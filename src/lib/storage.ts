import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const UPLOAD_DIR = path.resolve(process.cwd(), process.env.UPLOAD_DIR || "./storage/uploads");
export const PRIVATE_DIR = path.resolve(process.cwd(), process.env.PRIVATE_DIR || "./storage/private");

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/avif"];
const DOC_TYPES = ["application/pdf"];
const CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function safeName(original: string) {
  const ext = path.extname(original).toLowerCase().replace(/[^.a-z0-9]/g, "") || ".bin";
  const base = path
    .basename(original, path.extname(original))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const rand = Math.random().toString(36).slice(2, 8) + Date.now().toString(36);
  return `${base || "file"}-${rand}${ext}`;
}

export type UploadKind = "image" | "document" | "cv";

export async function saveUpload(file: File, kind: UploadKind) {
  const allowed = kind === "image" ? IMAGE_TYPES : kind === "document" ? DOC_TYPES : CV_TYPES;
  const maxBytes = kind === "image" ? 8 * 1024 * 1024 : 20 * 1024 * 1024;
  if (!allowed.includes(file.type)) throw new Error("INVALID_TYPE");
  if (file.size > maxBytes) throw new Error("TOO_LARGE");

  const now = new Date();
  const sub = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
  const root = kind === "cv" ? path.join(PRIVATE_DIR, "cv") : UPLOAD_DIR;
  const dir = path.join(root, sub);
  await mkdir(dir, { recursive: true });
  const name = safeName(file.name);
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), buf);

  return {
    url: kind === "cv" ? `cv/${sub}/${name}` : `/media/${sub}/${name}`,
    size: file.size,
  };
}
