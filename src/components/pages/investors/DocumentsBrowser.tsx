"use client";

import type { Document } from "@prisma/client";
import { useMemo, useState } from "react";
import { DocumentRow } from "@/components/site/DocumentRow";
import { documentCategories } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function DocumentsBrowser({ docs, locale }: { docs: Document[]; locale: Locale }) {
  const ar = locale === "ar";
  const [cat, setCat] = useState<string>("all");
  const [year, setYear] = useState<string>("all");

  const cats = useMemo(() => Object.keys(documentCategories).filter((k) => docs.some((d) => d.category === k)), [docs]);
  const years = useMemo(() => [...new Set(docs.map((d) => d.year))].sort((a, b) => b - a), [docs]);
  const list = docs.filter((d) => (cat === "all" || d.category === cat) && (year === "all" || String(d.year) === year));

  if (!docs.length) {
    return (
      <div className="rounded-[2px] border border-dashed border-ink/20 bg-white px-8 py-14">
        <p className="font-display text-[1.4rem] text-ink">
          {ar ? "ستُنشر التقارير والإفصاحات هنا." : "Reports and disclosures will be published here."}
        </p>
        <p className="mt-3 max-w-xl text-[0.95rem] text-haze">
          {ar
            ? "ستتوفر القوائم المالية والإفصاحات الرسمية ووثائق الجمعية العامة في هذا القسم وفقًا لمتطلبات الإفصاح."
            : "Financial statements, official disclosures and general assembly documents will be made available in this section in line with disclosure requirements."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-ink/10 pb-5 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1" role="tablist">
          {["all", ...cats].map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={cat === k}
              onClick={() => setCat(k)}
              className={cn(
                "h-10 shrink-0 rounded-full px-4 text-[0.88rem] transition-colors",
                cat === k ? "bg-ink text-white" : "text-ink/65 hover:bg-white hover:text-ink",
              )}
            >
              {k === "all" ? (ar ? "الكل" : "All") : documentCategories[k][locale]}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3 text-[0.85rem] text-haze">
          {ar ? "السنة" : "Year"}
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="h-10 rounded-[2px] border border-ink/15 bg-white px-3 font-mono text-[0.85rem] text-ink outline-none focus:border-leaf"
          >
            <option value="all">{ar ? "جميع السنوات" : "All years"}</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>
      {list.length ? (
        list.map((d) => <DocumentRow key={d.id} doc={d} locale={locale} />)
      ) : (
        <p className="py-10 text-[0.95rem] text-haze">{ar ? "لا توجد وثائق مطابقة." : "No documents match these filters."}</p>
      )}
    </div>
  );
}
