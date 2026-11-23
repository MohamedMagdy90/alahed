import { MessagesManager } from "@/components/admin/MessagesManager";
import { PeopleManager, type PersonRow } from "@/components/admin/PeopleManager";
import { PageHeader } from "@/components/admin/ui";
import { getAdminDict, tx } from "@/i18n/admin";
import { type Locale, isLocale } from "@/i18n/config";
import { db } from "@/lib/db";
import { getSetting } from "@/lib/queries";
import { type LeaderMessages, SETTING_KEYS, defaultLeaderMessages } from "@/lib/settings";

export default async function PeoplePage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ new?: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const { new: isNew } = await searchParams;
  const d = getAdminDict(locale);
  const t = tx(locale);
  const [rows, stored] = await Promise.all([
    db.person.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
    getSetting<LeaderMessages>(SETTING_KEYS.messages, defaultLeaderMessages),
  ]);
  const messages = Array.isArray(stored.items) ? stored.items : [];
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
          "Leadership messages, board members and executive management shown on the Leadership page. Use the arrows to set the display order.",
          "كلمات القيادة وأعضاء مجلس الإدارة والإدارة التنفيذية المعروضون في صفحة القيادة. استخدم الأسهم لتحديد ترتيب العرض.",
        )}
      />
      <MessagesManager locale={locale} messages={messages} people={people} />
      <PeopleManager locale={locale} people={people} openNew={isNew === "1"} />
    </>
  );
}
