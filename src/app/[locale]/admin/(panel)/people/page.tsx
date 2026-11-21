import { PeopleManager, type PersonRow } from "@/components/admin/PeopleManager";
import { PageHeader } from "@/components/admin/ui";
import { getAdminDict, tx } from "@/i18n/admin";
import { type Locale, isLocale } from "@/i18n/config";
import { db } from "@/lib/db";

export default async function PeoplePage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ new?: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const { new: isNew } = await searchParams;
  const d = getAdminDict(locale);
  const t = tx(locale);
  const rows = await db.person.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  const people: PersonRow[] = rows.map((p) => ({
    id: p.id,
    group: p.group === "management" ? "management" : "board",
    nameEn: p.nameEn,
    nameAr: p.nameAr,
    roleEn: p.roleEn,
    roleAr: p.roleAr,
    bioEn: p.bioEn,
    bioAr: p.bioAr,
    photo: p.photo,
    active: p.active,
  }));

  return (
    <>
      <PageHeader
        eyebrow={d.groups.content}
        title={d.nav.people}
        description={t(
          "Board members and executive management shown on the Leadership page. Use the arrows to set the display order.",
          "أعضاء مجلس الإدارة والإدارة التنفيذية المعروضون في صفحة القيادة. استخدم الأسهم لتحديد ترتيب العرض.",
        )}
      />
      <PeopleManager locale={locale} people={people} openNew={isNew === "1"} />
    </>
  );
}
