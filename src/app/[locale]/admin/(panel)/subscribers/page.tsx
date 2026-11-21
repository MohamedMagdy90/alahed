import type { Prisma } from "@prisma/client";
import { Download, Search } from "lucide-react";
import { SubscriberDelete } from "@/components/admin/SubscriberDelete";
import { Badge, Card, EmptyState, FilterChip, PageHeader, Pager, Table, aBtn, aInput } from "@/components/admin/ui";
import { getAdminDict, tx } from "@/i18n/admin";
import { type Locale, formatDate, isLocale } from "@/i18n/config";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

const PER_PAGE = 25;

export default async function SubscribersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ list?: string; q?: string; page?: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const sp = await searchParams;
  const d = getAdminDict(locale);
  const t = tx(locale);
  const base = `/${locale}/admin/subscribers`;
  const list = sp.list === "news" || sp.list === "ir" ? sp.list : undefined;
  const q = (sp.q || "").trim().toLowerCase();
  const page = Math.max(1, Number.parseInt(sp.page || "1", 10) || 1);

  const where: Prisma.SubscriberWhereInput = { ...(list ? { list } : {}), ...(q ? { email: { contains: q } } : {}) };
  const [rows, total, cAll, cNews, cIr] = await Promise.all([
    db.subscriber.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PER_PAGE, take: PER_PAGE }),
    db.subscriber.count({ where }),
    db.subscriber.count(),
    db.subscriber.count({ where: { list: "news" } }),
    db.subscriber.count({ where: { list: "ir" } }),
  ]);

  const href = (o: { list?: string; page?: number }) => {
    const s = new URLSearchParams();
    const l = "list" in o ? o.list : list;
    if (l) s.set("list", l);
    if (q) s.set("q", q);
    if (o.page && o.page > 1) s.set("page", String(o.page));
    const str = s.toString();
    return str ? `${base}?${str}` : base;
  };

  return (
    <>
      <PageHeader
        eyebrow={d.groups.engagement}
        title={d.nav.subscribers}
        description={t(
          "People who signed up for news updates or investor relations alerts on the website.",
          "الأشخاص الذين اشتركوا في تحديثات الأخبار أو تنبيهات علاقات المستثمرين عبر الموقع.",
        )}
        actions={
          <a href={`/api/admin/subscribers${list ? `?list=${list}` : ""}`} className={aBtn("outline")}>
            <Download />
            {t("Export CSV", "تصدير CSV")}
          </a>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <FilterChip href={href({ list: undefined })} active={!list} count={cAll}>
          {d.all}
        </FilterChip>
        <FilterChip href={href({ list: "news" })} active={list === "news"} count={cNews}>
          {t("News updates", "تحديثات الأخبار")}
        </FilterChip>
        <FilterChip href={href({ list: "ir" })} active={list === "ir"} count={cIr}>
          {t("Investor alerts", "تنبيهات المستثمرين")}
        </FilterChip>
      </div>

      <Card bodyClassName="p-0">
        <form method="get" action={base} className="flex gap-2 border-b border-ink/[0.07] p-3">
          {list && <input type="hidden" name="list" value={list} />}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-haze" />
            <input name="q" defaultValue={q} dir="ltr" placeholder={t("Search by email…", "ابحث بالبريد الإلكتروني…")} className={cn(aInput, "ps-9 rtl:text-right")} />
          </div>
          <button type="submit" className={aBtn("primary")}>
            {d.search}
          </button>
        </form>
        {rows.length === 0 ? (
          <EmptyState title={q ? t("No matching subscribers", "لا يوجد مشتركون مطابقون") : t("No subscribers yet", "لا يوجد مشتركون بعد")} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>{d.email}</th>
                <th>{t("List", "القائمة")}</th>
                <th>{d.language}</th>
                <th>{t("Subscribed", "تاريخ الاشتراك")}</th>
                <th className="w-px" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <a href={`mailto:${r.email}`} dir="ltr" className="text-ink hover:underline hover:underline-offset-4">
                      {r.email}
                    </a>
                  </td>
                  <td>
                    <Badge tone={r.list === "ir" ? "blue" : "neutral"}>{r.list === "ir" ? t("Investor alerts", "تنبيهات المستثمرين") : t("News", "الأخبار")}</Badge>
                  </td>
                  <td className="text-ink/70">{r.locale === "ar" ? "العربية" : "English"}</td>
                  <td className="num whitespace-nowrap text-ink/70">{formatDate(r.createdAt, locale, { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td>
                    <div className="flex justify-end">
                      <SubscriberDelete locale={locale} id={r.id} email={r.email} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Pager page={page} pages={Math.max(1, Math.ceil(total / PER_PAGE))} hrefFor={(p) => href({ page: p })} labels={d} />
      </Card>
    </>
  );
}
