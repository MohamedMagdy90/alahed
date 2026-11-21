import type { Prisma } from "@prisma/client";
import { InboxView, type MessageRow } from "@/components/admin/InboxView";
import { FilterChip, PageHeader, Pager } from "@/components/admin/ui";
import { getAdminDict, tx } from "@/i18n/admin";
import { type Locale, isLocale } from "@/i18n/config";
import { db } from "@/lib/db";

const PER_PAGE = 50;

export default async function InboxPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ filter?: string; open?: string; page?: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const sp = await searchParams;
  const d = getAdminDict(locale);
  const t = tx(locale);
  const base = `/${locale}/admin/inbox`;
  const filter = ["unread", "contact", "career"].includes(sp.filter || "") ? (sp.filter as string) : "all";
  const page = Math.max(1, Number.parseInt(sp.page || "1", 10) || 1);

  const where: Prisma.MessageWhereInput =
    filter === "unread" ? { read: false } : filter === "contact" ? { kind: "contact" } : filter === "career" ? { kind: "career" } : {};

  const [rows, total, cAll, cUnread, cContact, cCareer] = await Promise.all([
    db.message.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PER_PAGE, take: PER_PAGE }),
    db.message.count({ where }),
    db.message.count(),
    db.message.count({ where: { read: false } }),
    db.message.count({ where: { kind: "contact" } }),
    db.message.count({ where: { kind: "career" } }),
  ]);

  const messages: MessageRow[] = rows.map((m) => ({
    id: m.id,
    kind: m.kind === "career" ? "career" : "contact",
    name: m.name,
    email: m.email,
    phone: m.phone,
    company: m.company,
    subject: m.subject,
    position: m.position,
    message: m.message,
    attachment: m.attachment,
    locale: m.locale,
    read: m.read,
    createdAt: m.createdAt.toISOString(),
  }));

  const href = (f: string, p?: number) => {
    const s = new URLSearchParams();
    if (f !== "all") s.set("filter", f);
    if (p && p > 1) s.set("page", String(p));
    const q = s.toString();
    return q ? `${base}?${q}` : base;
  };

  return (
    <>
      <PageHeader
        eyebrow={d.groups.engagement}
        title={d.nav.inbox}
        description={t(
          "Messages sent through the Contact and Careers forms. CVs are stored privately and can only be downloaded here.",
          "الرسائل المرسلة عبر نموذجي التواصل والوظائف. تُحفظ السير الذاتية بشكل خاص ولا يمكن تنزيلها إلا من هنا.",
        )}
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <FilterChip href={href("all")} active={filter === "all"} count={cAll}>
          {d.all}
        </FilterChip>
        <FilterChip href={href("unread")} active={filter === "unread"} count={cUnread}>
          {t("Unread", "غير مقروءة")}
        </FilterChip>
        <FilterChip href={href("contact")} active={filter === "contact"} count={cContact}>
          {t("Enquiries", "الاستفسارات")}
        </FilterChip>
        <FilterChip href={href("career")} active={filter === "career"} count={cCareer}>
          {t("Applications", "طلبات التوظيف")}
        </FilterChip>
      </div>
      <InboxView key={`${filter}-${page}`} locale={locale} messages={messages} initialOpen={sp.open} />
      <div className="mt-3">
        <Pager page={page} pages={Math.max(1, Math.ceil(total / PER_PAGE))} hrefFor={(p) => href(filter, p)} labels={d} />
      </div>
    </>
  );
}
