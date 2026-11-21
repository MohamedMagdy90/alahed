import { type DocumentRow, DocumentsManager } from "@/components/admin/DocumentsManager";
import { PageHeader } from "@/components/admin/ui";
import { documentCategories } from "@/content/site";
import { getAdminDict, tx } from "@/i18n/admin";
import { type Locale, isLocale } from "@/i18n/config";
import { db } from "@/lib/db";

export default async function DocumentsPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ new?: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const { new: isNew } = await searchParams;
  const d = getAdminDict(locale);
  const t = tx(locale);
  const rows = await db.document.findMany({ orderBy: [{ year: "desc" }, { publishedAt: "desc" }] });
  const docs: DocumentRow[] = rows.map((r) => ({
    id: r.id,
    category: (r.category in documentCategories ? r.category : "financial") as DocumentRow["category"],
    titleEn: r.titleEn,
    titleAr: r.titleAr,
    year: r.year,
    fileUrl: r.fileUrl,
    fileSize: r.fileSize,
    published: r.published,
    publishedAt: r.publishedAt.toISOString(),
  }));

  return (
    <>
      <PageHeader
        eyebrow={d.groups.content}
        title={d.nav.documents}
        description={t(
          "Financial statements, disclosures, governance documents and presentations for the Investors and Governance pages.",
          "القوائم المالية والإفصاحات ووثائق الحوكمة والعروض التقديمية لصفحتي المستثمرين والحوكمة.",
        )}
      />
      <DocumentsManager locale={locale} docs={docs} openNew={isNew === "1"} />
    </>
  );
}
