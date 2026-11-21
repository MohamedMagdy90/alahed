import { ArrowUpRight, FilePlus2, FileUp, Plus, TrendingUp, UserPlus } from "lucide-react";
import Link from "next/link";
import { ALink, Badge, Card, EmptyState, PageHeader, monoLabel } from "@/components/admin/ui";
import { companyLabels, postTypes } from "@/content/site";
import { getAdminDict, tx } from "@/i18n/admin";
import { type Locale, formatDate, isLocale } from "@/i18n/config";
import { db } from "@/lib/db";
import { getShareInfo } from "@/lib/queries";
import { requireSession } from "@/lib/session";
import { cn } from "@/lib/utils";

export default async function Dashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const session = await requireSession(locale);
  const d = getAdminDict(locale);
  const t = tx(locale);
  const base = `/${locale}/admin`;

  const [published, drafts, unread, subsNews, subsIr, docs, people, recentPosts, recentMessages, postsNoAr, peopleNoAr, docsNoAr, share] =
    await Promise.all([
      db.post.count({ where: { status: "published" } }),
      db.post.count({ where: { status: "draft" } }),
      db.message.count({ where: { read: false } }),
      db.subscriber.count({ where: { list: "news" } }),
      db.subscriber.count({ where: { list: "ir" } }),
      db.document.count({ where: { published: true } }),
      db.person.count({ where: { active: true } }),
      db.post.findMany({ orderBy: { updatedAt: "desc" }, take: 6 }),
      db.message.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      db.post.count({ where: { OR: [{ titleAr: "" }, { bodyAr: "" }] } }),
      db.person.count({ where: { OR: [{ nameAr: "" }, { roleAr: "" }] } }),
      db.document.count({ where: { titleAr: "" } }),
      getShareInfo(),
    ]);
  const totalPosts = published + drafts;
  const totalPeople = await db.person.count();
  const totalDocs = await db.document.count();

  const stats = [
    { label: t("Published articles", "مقالات منشورة"), value: published, href: `${base}/posts?status=published` },
    { label: t("Drafts", "مسودات"), value: drafts, href: `${base}/posts?status=draft` },
    { label: t("Unread messages", "رسائل غير مقروءة"), value: unread, href: `${base}/inbox?filter=unread`, accent: unread > 0 },
    { label: t("Subscribers", "المشتركون"), value: subsNews + subsIr, href: `${base}/subscribers`, sub: `${t("News", "الأخبار")} ${subsNews} · IR ${subsIr}` },
  ];

  const coverage = [
    { label: d.nav.posts, missing: postsNoAr, total: totalPosts, href: `${base}/posts?ar=missing` },
    { label: d.nav.people, missing: peopleNoAr, total: totalPeople, href: `${base}/people` },
    { label: d.nav.documents, missing: docsNoAr, total: totalDocs, href: `${base}/documents` },
  ];

  const firstName = session.name.split(" ")[0];

  return (
    <>
      <PageHeader
        eyebrow={formatDate(new Date(), locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        title={
          <>
            {t("Welcome", "مرحبًا")}, <span className="text-haze">{firstName}</span>
          </>
        }
        description={t(
          "Here is what is happening across the Al-Ahed Holding website.",
          "نظرة عامة على آخر المستجدات في موقع العهد القابضة.",
        )}
        actions={
          <ALink href={`${base}/posts/new`} variant="accent">
            <Plus />
            {t("New article", "مقال جديد")}
          </ALink>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 xl:grid-cols-4">
        {stats.map((s, i) => (
          <Link key={s.label} href={s.href} className="group relative bg-white p-5 transition-colors hover:bg-pearl-50 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <span className={monoLabel}>
                <span className="num me-2 text-ink/30">{String(i + 1).padStart(2, "0")}</span>
                {s.label}
              </span>
              <ArrowUpRight className="h-4 w-4 text-ink/20 transition-all group-hover:-translate-y-0.5 group-hover:text-ink rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5 ltr:group-hover:translate-x-0.5" />
            </div>
            <div className="mt-6 flex items-baseline gap-3">
              <span className={cn("num font-display text-[2.6rem] leading-none tracking-[-0.03em]", s.accent ? "text-leaf-700" : "text-ink")}>
                {s.value}
              </span>
              {s.accent && <span className="h-2 w-2 animate-pulse rounded-full bg-leaf" aria-hidden />}
            </div>
            {s.sub && <p className="num mt-2 text-[0.75rem] text-haze">{s.sub}</p>}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-12">
        {/* Recent posts */}
        <Card
          className="xl:col-span-7"
          title={t("Recently updated", "آخر التحديثات")}
          actions={
            <ALink href={`${base}/posts`} variant="ghost" size="sm">
              {t("All articles", "كل المقالات")}
            </ALink>
          }
          bodyClassName="p-0"
        >
          {recentPosts.length === 0 ? (
            <EmptyState title={d.empty} />
          ) : (
            <ul>
              {recentPosts.map((p) => (
                <li key={p.id} className="border-b border-ink/[0.07] last:border-0">
                  <Link href={`${base}/posts/${p.id}`} className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-pearl-50/70">
                    <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-[2px] bg-pearl-100">
                      {p.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.coverImage} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.9rem] text-ink group-hover:underline group-hover:decoration-ink/20 group-hover:underline-offset-4">
                        {locale === "ar" && p.titleAr ? p.titleAr : p.titleEn}
                      </p>
                      <p className="mt-0.5 truncate text-[0.75rem] text-haze">
                        {postTypes[p.type]?.[locale]} · {companyLabels[p.company]?.[locale]} ·{" "}
                        <span className="num">{formatDate(p.updatedAt, locale, { day: "numeric", month: "short", year: "numeric" })}</span>
                      </p>
                    </div>
                    <div className="hidden shrink-0 items-center gap-2 sm:flex">
                      {(!p.titleAr || !p.bodyAr) && <Badge tone="amber">{d.missingAr}</Badge>}
                      <Badge tone={p.status === "published" ? "green" : "neutral"} dot>
                        {p.status === "published" ? d.published : d.draft}
                      </Badge>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Inbox */}
        <Card
          className="xl:col-span-5"
          title={d.nav.inbox}
          description={unread ? t(`${unread} unread`, `${unread} غير مقروءة`) : t("You're all caught up.", "لا توجد رسائل جديدة.")}
          actions={
            <ALink href={`${base}/inbox`} variant="ghost" size="sm">
              {t("Open inbox", "فتح الوارد")}
            </ALink>
          }
          bodyClassName="p-0"
        >
          {recentMessages.length === 0 ? (
            <EmptyState title={t("No messages yet", "لا توجد رسائل بعد")} body={t("Enquiries and job applications from the website will appear here.", "ستظهر هنا الاستفسارات وطلبات التوظيف الواردة من الموقع.")} />
          ) : (
            <ul>
              {recentMessages.map((m) => (
                <li key={m.id} className="border-b border-ink/[0.07] last:border-0">
                  <Link href={`${base}/inbox?open=${m.id}`} className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-pearl-50/70">
                    <span className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", m.read ? "bg-transparent" : "bg-leaf")} aria-hidden />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className={cn("truncate text-[0.88rem]", m.read ? "text-ink/70" : "font-medium text-ink")}>{m.name}</p>
                        <span className="num shrink-0 text-[0.72rem] text-haze">
                          {formatDate(m.createdAt, locale, { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[0.78rem] text-haze">
                        {m.kind === "career" ? t("Job application", "طلب توظيف") : m.subject || t("Enquiry", "استفسار")}
                        {m.message ? ` — ${m.message.slice(0, 80)}` : ""}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Quick actions */}
        <div className="grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 sm:grid-cols-3 lg:col-span-7">
          {[
            { href: `${base}/posts/new`, icon: FilePlus2, title: t("Write an article", "كتابة مقال"), body: t("News, press releases, events or insights.", "أخبار أو بيانات صحفية أو فعاليات أو مقالات.") },
            { href: `${base}/people?new=1`, icon: UserPlus, title: t("Add a profile", "إضافة ملف تعريفي"), body: t("Board members and executive management.", "أعضاء مجلس الإدارة والإدارة التنفيذية.") },
            { href: `${base}/documents?new=1`, icon: FileUp, title: t("Upload a document", "رفع وثيقة"), body: t("Reports, disclosures and presentations.", "التقارير والإفصاحات والعروض التقديمية.") },
          ].map((a) => (
            <Link key={a.href} href={a.href} className="group flex flex-col bg-white p-5 transition-colors hover:bg-ink hover:text-white">
              <a.icon className="h-5 w-5 text-leaf-700 transition-colors group-hover:text-leaf-300" strokeWidth={1.5} />
              <span className="mt-8 font-display text-[1.05rem]">{a.title}</span>
              <span className="mt-1 text-[0.78rem] leading-relaxed text-haze group-hover:text-white/55">{a.body}</span>
            </Link>
          ))}
        </div>

        {/* Arabic coverage + listing */}
        <div className="grid gap-6 lg:col-span-5">
          <Card title={t("Arabic coverage", "اكتمال المحتوى العربي")} description={t("Items still missing their Arabic version.", "العناصر التي تنقصها النسخة العربية.")}>
            <ul className="space-y-4">
              {coverage.map((c) => {
                const pct = c.total ? Math.round(((c.total - c.missing) / c.total) * 100) : 100;
                return (
                  <li key={c.label}>
                    <Link href={c.href} className="group block">
                      <div className="mb-1.5 flex items-baseline justify-between text-[0.82rem]">
                        <span className="text-ink group-hover:underline group-hover:underline-offset-4">{c.label}</span>
                        <span className="num text-haze">
                          {c.missing > 0 ? t(`${c.missing} missing`, `${c.missing} ناقصة`) : t("Complete", "مكتمل")} · {pct}%
                        </span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-ink/[0.07]">
                        <div className={cn("h-full rounded-full", pct === 100 ? "bg-leaf" : "bg-amber-500")} style={{ width: `${pct}%` }} />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>

          <div className="relative overflow-hidden rounded-[2px] bg-ink p-5 text-white">
            <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className={cn(monoLabel, "text-white/45")}>{t("Share information", "معلومات السهم")}</p>
                <p className="mt-3 font-display text-[1.25rem]">
                  {share.status === "listed" ? `${share.exchange}: ${share.ticker || "—"}` : t("Pre-listing", "ما قبل الإدراج")}
                </p>
                <p className="mt-1 text-[0.78rem] text-white/50">
                  {docs} {t("published documents", "وثيقة منشورة")} · {people} {t("active profiles", "ملف نشط")}
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-leaf-300" strokeWidth={1.5} />
            </div>
            {session.role === "admin" && (
              <Link href={`${base}/settings`} className="relative mt-5 inline-flex items-center gap-1.5 text-[0.8rem] text-leaf-300 hover:text-white">
                {t("Update listing status", "تحديث حالة الإدراج")}
                <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
