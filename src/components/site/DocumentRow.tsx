import type { Document } from "@prisma/client";
import { Download, FileText } from "lucide-react";
import { documentCategories } from "@/content/site";
import { type Locale, pick } from "@/i18n/config";
import { formatBytes } from "@/lib/format";

/** A downloadable document row (IR reports, governance documents). */
export function DocumentRow({ doc, locale, showCategory = true }: { doc: Document; locale: Locale; showCategory?: boolean }) {
  const ar = locale === "ar";
  return (
    <a
      href={doc.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-ink/10 py-5 transition-colors hover:bg-white md:grid-cols-[4.5rem_auto_1fr_auto_auto] md:gap-6 md:px-4"
    >
      <span className="num hidden font-mono text-sm text-haze md:block">{doc.year}</span>
      <span className="grid h-11 w-11 place-items-center rounded-[2px] bg-pearl-100 text-ink transition-colors group-hover:bg-ink group-hover:text-white">
        <FileText className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0">
        <span className="block text-pretty font-display text-[1.08rem] leading-snug text-ink">{pick(doc, "title", locale)}</span>
        <span className="mt-1 flex flex-wrap items-center gap-x-3 text-[0.85rem] text-haze">
          <span className="num md:hidden">{doc.year}</span>
          {showCategory && <span>{documentCategories[doc.category]?.[locale] ?? doc.category}</span>}
          <span>PDF{doc.fileSize ? ` · ${formatBytes(doc.fileSize, locale)}` : ""}</span>
        </span>
      </span>
      <span className="hidden text-[0.85rem] text-ink/70 md:block">{ar ? "تحميل" : "Download"}</span>
      <span className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 text-ink transition-colors group-hover:border-leaf group-hover:bg-leaf">
        <Download className="h-4 w-4" />
      </span>
    </a>
  );
}
