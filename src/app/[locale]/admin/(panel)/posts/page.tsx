import type { Prisma } from "@prisma/client";
import { Plus, Search, Star } from "lucide-react";
import Link from "next/link";
import { ALink, Badge, Card, EmptyState, FilterChip, PageHeader, Pager, SelectBox, Table, aBtn, aInput } from "@/components/admin/ui";
import { companyLabels, postTypes } from "@/content/site";
import { getAdminDict, tx } from "@/i18n/admin";
import { type Locale, formatDate, isLocale } from "@/i18n/config";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

const PER_PAGE = 15;
type SP = { q?: string; status?: string; type?: string; company?: string; ar?: string; page?: string };

export default async function PostsPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<SP> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const sp = await searchParams;
  const d = getAdminDict(locale);
  const t = tx(locale);
  const base = `/${locale}/admin/posts`;

  const q = (sp.q || "").trim();
  const status = sp.status === "published" || sp.status === "draft" ? sp.status : undefined;
  const type = sp.type && postTypes[sp.type] ? sp.type : undefined;
  const company = sp.company && companyLabels[sp.company] ? sp.company : undefined;
  const arMissing = sp.ar === "missing";
  const page = Math.max(1, Number.parseInt(sp.page || "1", 10) || 1);

  const filters: Prisma.PostWhereInput[] = [];
  if (q) filters.push({ OR: [{ titleEn: { contains: q } }, { titleAr: { contains: q } }, { slug: { contains: q } }] });
  if (type) filters.push({ type });
  if (company) filters.push({ company });
  if (arMissing) filters.push({ OR: [{ titleAr: "" }, { bodyAr: "" }] });
  const where: Prisma.PostWhereInput = { AND: [...filters, ...(status ? [{ status }] : [])] };
  const whereNoStatus: Prisma.PostWhereInput = { AND: filters };

  const [posts, total, countAll, countPub, countDraft] = await Promise.all([
    db.post.findMany({ where, orderBy: { publishedAt: "desc" }, skip: (page - 1) * PER_PAGE, take: PER_PAGE }),
    db.post.count({ where }),
    db.post.count({ where: whereNoStatus }),
    db.post.count({ where: { AND: [...filters, { status: "published" }] } }),
    db.post.count({ where: { AND: [...filters, { status: "draft" }] } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));

  const href = (o: Partial<SP>) => {
    const next = { q: q || undefined, status, type, company, ar: arMissing ? "missing" : undefined, ...o };
    const s = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) if (v) s.set(k, String(v));
    const str = s.toString();
    return str ? `${base}?${str}` : base;
  };

  return (
    <>
      <PageHeader
        eyebrow={d.groups.content}
        title={d.nav.posts}
        description={t(
          "News, press releases, events and insights. Published articles appear in the Newsroom and on the home page.",
          "الأخبار والبيانات الصحفية والفعاليات والمقالات. تظهر المقالات المنشورة في المركز الإعلامي والصفحة الرئيسية.",
        )}
        actions={
          <ALink href={`${base}/new`} variant="accent">
            <Plus />
            {t("New article", "مقال جديد")}
          </ALink>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FilterChip href={href({ status: undefined, page: undefined })} active={!status} count={countAll}>
          {d.all}
        </FilterChip>
        <FilterChip href={href({ status: "published", page: undefined })} active={status === "published"} count={countPub}>
          {d.published}
        </FilterChip>
        <FilterChip href={href({ status: "draft", page: undefined })} active={status === "draft"} count={countDraft}>
          {d.draft}
        </FilterChip>
        <span className="mx-1 h-5 w-px bg-ink/10" aria-hidden />
        <FilterChip href={href({ ar: arMissing ? undefined : "missing", page: undefined })} active={arMissing}>
          {d.missingAr}
        </FilterChip>
      </div>

      <Card bodyClassName="p-0">
        <form method="get" action={base} className="flex flex-col gap-2 border-b border-ink/[0.07] p-3 md:flex-row md:items-center">
          {status && <input type="hidden" name="status" value={status} />}
          {arMissing && <input type="hidden" name="ar" value="missing" />}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-haze" />
            <input name="q" defaultValue={q} placeholder={t("Search by title or slug…", "ابحث بالعنوان أو الرابط…")} className={cn(aInput, "ps-9")} />
          </div>
          <SelectBox name="type" defaultValue={type || ""} className="md:w-44" aria-label={d.type}>
            <option value="">{`${d.type}: ${d.all}`}</option>
            {Object.entries(postTypes).map(([k, v]) => (
              <option key={k} value={k}>
                {v[locale]}
              </option>
            ))}
          </SelectBox>
          <SelectBox name="company" defaultValue={company || ""} className="md:w-52" aria-label={d.company}>
            <option value="">{`${d.company}: ${d.all}`}</option>
            {Object.entries(companyLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v[locale]}
              </option>
            ))}
          </SelectBox>
          <button type="submit" className={aBtn("primary")}>
            {d.filter}
          </button>
          {(q || type || company) && (
            <Link href={href({ q: undefined, type: undefined, company: undefined, page: undefined })} className={aBtn("ghost")}>
              {t("Clear", "مسح")}
            </Link>
          )}
        </form>

        {posts.length === 0 ? (
          <EmptyState
            title={q || type || company || status || arMissing ? t("No matching articles", "لا توجد مقالات مطابقة") : t("No articles yet", "لا توجد مقالات بعد")}
            body={t("Try a different filter, or write the first article.", "جرّب تصفية مختلفة أو اكتب أول مقال.")}
            action={
              <ALink href={`${base}/new`} variant="primary">
                <Plus />
                {t("New article", "مقال جديد")}
              </ALink>
            }
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>{d.title}</th>
                <th>{d.type}</th>
                <th>{d.status}</th>
                <th>{d.date}</th>
                <th className="w-px" />
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => {
                const noAr = !p.titleAr || !p.bodyAr;
                return (
                  <tr key={p.id}>
                    <td className="max-w-[460px]">
                      <Link href={`${base}/${p.id}`} className="group flex items-center gap-3.5">
                        <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded-[2px] bg-pearl-100">
                          {p.coverImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.coverImage} alt="" className="h-full w-full object-cover" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-1.5">
                            {p.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" aria-label={d.featured} />}
                            <span className="truncate font-medium text-ink group-hover:underline group-hover:decoration-ink/25 group-hover:underline-offset-4">
                              {p.titleEn}
                            </span>
                          </span>
                          <span className={cn("mt-0.5 block truncate font-arabic text-[0.8rem]", noAr ? "text-amber-700" : "text-haze")} dir="rtl">
                            {p.titleAr || d.missingAr}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td>
                      <span className="block text-ink/80">{postTypes[p.type]?.[locale]}</span>
                      <span className="block text-[0.75rem] text-haze">{companyLabels[p.company]?.[locale]}</span>
                    </td>
                    <td>
                      <Badge tone={p.status === "published" ? (p.publishedAt > new Date() ? "blue" : "green") : "neutral"} dot>
                        {p.status === "published" ? (p.publishedAt > new Date() ? t("Scheduled", "مجدول") : d.published) : d.draft}
                      </Badge>
                    </td>
                    <td className="num whitespace-nowrap text-ink/70">{formatDate(p.publishedAt, locale, { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td>
                      <div className="flex justify-end gap-1">
                        {p.status === "published" && (
                          <a href={`/${locale}/news/${p.slug}`} target="_blank" rel="noreferrer" className={aBtn("ghost", "sm")}>
                            {d.view}
                          </a>
                        )}
                        <ALink href={`${base}/${p.id}`} size="sm">
                          {d.edit}
                        </ALink>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
        <Pager page={page} pages={pages} hrefFor={(p) => href({ page: String(p) })} labels={d} />
      </Card>
    </>
  );
}
