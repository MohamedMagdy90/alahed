import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/Shell";
import { type Locale, isLocale } from "@/i18n/config";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";

export default async function PanelLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const session = await requireSession(locale);
  // Re-check the account on every request so deactivated users lose access immediately.
  const user = await db.user.findUnique({ where: { id: session.uid }, select: { name: true, email: true, role: true, active: true } });
  if (!user || !user.active) redirect(`/${locale}/admin/login`);
  const unread = await db.message.count({ where: { read: false } });

  return (
    <AdminShell locale={locale} user={{ name: user.name, email: user.email, role: user.role === "admin" ? "admin" : "editor" }} unread={unread}>
      {children}
    </AdminShell>
  );
}
