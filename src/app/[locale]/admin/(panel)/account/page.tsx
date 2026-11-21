import { AccountForm } from "@/components/admin/AccountForm";
import { PageHeader } from "@/components/admin/ui";
import { getAdminDict, tx } from "@/i18n/admin";
import { type Locale, isLocale } from "@/i18n/config";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const session = await requireSession(locale);
  const user = await db.user.findUniqueOrThrow({ where: { id: session.uid } });
  const d = getAdminDict(locale);
  const t = tx(locale);

  return (
    <>
      <PageHeader title={d.nav.account} description={t("Your profile and sign-in details.", "بيانات ملفك الشخصي وتسجيل الدخول.")} />
      <AccountForm locale={locale} name={user.name} email={user.email} role={user.role === "admin" ? "admin" : "editor"} />
    </>
  );
}
