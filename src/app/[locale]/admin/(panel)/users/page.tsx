import { type UserRow, UsersManager } from "@/components/admin/UsersManager";
import { PageHeader } from "@/components/admin/ui";
import { getAdminDict, tx } from "@/i18n/admin";
import { type Locale, isLocale } from "@/i18n/config";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";

export default async function UsersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const session = await requireSession(locale, "admin");
  const d = getAdminDict(locale);
  const t = tx(locale);
  const rows = await db.user.findMany({ orderBy: [{ role: "asc" }, { createdAt: "asc" }] });
  const users: UserRow[] = rows.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role === "admin" ? "admin" : "editor",
    active: u.active,
    lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <>
      <PageHeader
        eyebrow={d.groups.admin}
        title={d.nav.users}
        description={t("People who can sign in to this content management system.", "الأشخاص المخوّلون بالدخول إلى نظام إدارة المحتوى.")}
      />
      <UsersManager locale={locale} users={users} currentId={session.uid} />
    </>
  );
}
