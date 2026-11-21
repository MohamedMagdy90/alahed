import { SettingsForm } from "@/components/admin/SettingsForm";
import { PageHeader } from "@/components/admin/ui";
import { getAdminDict, tx } from "@/i18n/admin";
import { type Locale, isLocale } from "@/i18n/config";
import { getIrContact, getShareInfo } from "@/lib/queries";
import { requireSession } from "@/lib/session";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  await requireSession(locale, "admin");
  const d = getAdminDict(locale);
  const t = tx(locale);
  const [share, ir] = await Promise.all([getShareInfo(), getIrContact()]);

  return (
    <>
      <PageHeader
        eyebrow={d.groups.admin}
        title={d.nav.settings}
        description={t("Group-wide information used across the public website.", "معلومات عامة للمجموعة تُستخدم في أنحاء الموقع.")}
      />
      <SettingsForm locale={locale} share={share} ir={ir} />
    </>
  );
}
