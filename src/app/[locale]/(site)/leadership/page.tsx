import type { Metadata } from "next";
import { Reveal } from "@/components/motion";
import { PersonCard, type PersonView } from "@/components/pages/leadership/PersonCard";
import { ArcsMark } from "@/components/site/OrbitArcs";
import { PageHero } from "@/components/site/PageHero";
import { Btn, Em, SectionHeading } from "@/components/site/primitives";
import { type Locale, dirOf, isLocale, pick } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import { getPeople } from "@/lib/queries";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  const ar = locale === "ar";
  return {
    title: ar ? "القيادة" : "Leadership",
    description: ar ? "مجلس الإدارة والإدارة التنفيذية في العهد القابضة." : "The Board of Directors and executive management of Al-Ahed Holding.",
    alternates: { languages: { en: "/en/leadership", ar: "/ar/leadership" } },
  };
}

export default async function LeadershipPage({ params }: P) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const ar = locale === "ar";
  const [board, management] = await Promise.all([getPeople("board"), getPeople("management")]);
  const view = (rows: typeof board): PersonView[] =>
    rows.map((r) => ({ id: r.id, name: pick(r, "name", locale), role: pick(r, "role", locale), bio: pick(r, "bio", locale), photo: r.photo }));

  const groups = [
    {
      key: "board",
      index: "01",
      eyebrow: ar ? "مجلس الإدارة" : "Board of Directors",
      title: ar ? (
        <>
          الإشراف الاستراتيجي <Em className="text-brand">والحوكمة.</Em>
        </>
      ) : (
        <>
          Strategic oversight <Em className="text-brand">and governance.</Em>
        </>
      ),
      people: view(board),
      bg: "bg-pearl-50",
    },
    {
      key: "management",
      index: "02",
      eyebrow: ar ? "الإدارة التنفيذية" : "Executive management",
      title: ar ? (
        <>
          قيادة الأداء <Em className="text-brand">اليومي للمجموعة.</Em>
        </>
      ) : (
        <>
          Leading the Group's <Em className="text-brand">day-to-day performance.</Em>
        </>
      ),
      people: view(management),
      bg: "bg-white",
    },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        image="/images/hq.png"
        eyebrow={ar ? "من نحن" : "Who we are"}
        crumbs={[{ label: ar ? "القيادة" : "Leadership" }]}
        title={
          ar ? (
            <>
              قيادة تجمع <Em className="text-leaf-300">الخبرة والرؤية.</Em>
            </>
          ) : (
            <>
              Leadership built on <Em className="text-leaf-300">experience and vision.</Em>
            </>
          )
        }
        intro={
          ar
            ? "يقود المجموعة مجلس إدارة وفريق تنفيذي يجمعان خبرة طويلة في قطاع الطاقة القطري والتزامًا بأعلى معايير الحوكمة."
            : "The Group is led by a Board and executive team combining long experience in Qatar's energy sector with a commitment to the highest standards of governance."
        }
      />

      {groups.map((g) => (
        <section key={g.key} className={`${g.bg} py-24 md:py-32`}>
          <div className="container">
            <SectionHeading index={g.index} eyebrow={g.eyebrow} title={g.title} />
            {g.people.length > 0 ? (
              <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {g.people.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 0.06}>
                    <PersonCard p={p} dir={dirOf(locale)} viewLabel={ar ? "عرض الملف" : "View profile"} closeLabel={ar ? "إغلاق" : "Close"} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <Reveal className="mt-14">
                <div className="relative overflow-hidden rounded-[2px] border border-dashed border-ink/20 bg-white/60 px-8 py-14 text-center">
                  <ArcsMark className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 opacity-[0.08]" />
                  <p className="font-display text-[1.4rem] text-ink">{ar ? "سيتم نشر الملفات التعريفية قريبًا." : "Profiles will be published soon."}</p>
                  <p className="mx-auto mt-3 max-w-md text-[0.95rem] text-haze">
                    {ar ? "نعمل على تحديث هذا القسم بالتزامن مع استعدادات المجموعة للإدراج." : "This section is being updated as part of the Group's listing preparations."}
                  </p>
                </div>
              </Reveal>
            )}
          </div>
        </section>
      ))}

      <section className="bg-white pb-24 md:pb-32">
        <div className="container">
          <div className="relative overflow-hidden rounded-[2px] bg-ink px-8 py-14 text-white md:px-14">
            <div className="grid-lines pointer-events-none absolute inset-0" />
            <div className="relative grid gap-8 md:grid-cols-12 md:items-center">
              <div className="md:col-span-8">
                <p className="eyebrow mb-4 text-leaf-300">{ar ? "الحوكمة المؤسسية" : "Corporate governance"}</p>
                <h2 className="text-balance font-display text-display-md font-normal">
                  {ar ? "إطار حوكمة يعزّز الشفافية والمساءلة." : "A governance framework built on transparency and accountability."}
                </h2>
              </div>
              <div className="md:col-span-4 md:text-end">
                <Btn href={href(locale, "/governance")}>{ar ? "الحوكمة والصحة والسلامة" : "Governance & HSE"}</Btn>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
