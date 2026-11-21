import { ALink, EmptyState } from "@/components/admin/ui";
import { getAdminDict, tx } from "@/i18n/admin";
import { type Locale, isLocale } from "@/i18n/config";

export default async function AdminNotFound({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const d = getAdminDict(locale);
  const t = tx(locale);
  return (
    <div className="mt-10 rounded-[2px] border border-ink/10 bg-white">
      <EmptyState
        title={t("Page not found", "الصفحة غير موجودة")}
        body={t("This admin page doesn't exist or has moved.", "صفحة الإدارة هذه غير موجودة أو تم نقلها.")}
        action={
          <ALink href={`/${locale}/admin`} variant="primary">
            {d.nav.dashboard}
          </ALink>
        }
      />
    </div>
  );
}
