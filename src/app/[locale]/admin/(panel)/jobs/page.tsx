import { JobsManager, type JobRow } from "@/components/admin/JobsManager";
import { PageHeader } from "@/components/admin/ui";
import { getAdminDict, tx } from "@/i18n/admin";
import { type Locale, isLocale } from "@/i18n/config";
import { db } from "@/lib/db";
import { asCareerArea, asEmployment, asJobCompany } from "@/lib/forms";

export default async function JobsPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ new?: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const { new: isNew } = await searchParams;
  const d = getAdminDict(locale);
  const t = tx(locale);

  const [rows, counts] = await Promise.all([
    db.job.findMany({ orderBy: [{ open: "desc" }, { postedAt: "desc" }] }),
    db.message.groupBy({ by: ["jobId"], where: { kind: "career", jobId: { not: null } }, _count: { _all: true } }),
  ]);
  const byJob = new Map(counts.map((c) => [c.jobId, c._count._all]));

  const jobs: JobRow[] = rows.map((j) => ({
    id: j.id,
    company: asJobCompany(j.company),
    area: asCareerArea(j.area),
    employment: asEmployment(j.employment),
    titleEn: j.titleEn,
    titleAr: j.titleAr,
    locationEn: j.locationEn,
    locationAr: j.locationAr,
    summaryEn: j.summaryEn,
    summaryAr: j.summaryAr,
    open: j.open,
    postedAt: j.postedAt.toISOString(),
    applications: byJob.get(j.id) ?? 0,
  }));

  return (
    <>
      <PageHeader
        eyebrow={d.groups.content}
        title={d.nav.jobs}
        description={t(
          "Roles listed on the Careers page. Candidates apply to a specific role; their CV lands in the Inbox with the role title.",
          "الوظائف المعروضة في صفحة الوظائف. يتقدم المرشحون لوظيفة محددة، وتصل سيرهم الذاتية إلى صندوق الوارد مع اسم الوظيفة.",
        )}
      />
      <JobsManager locale={locale} jobs={jobs} openNew={isNew === "1"} />
    </>
  );
}
