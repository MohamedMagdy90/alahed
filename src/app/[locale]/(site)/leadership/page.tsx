import type { Metadata } from "next";
import { ArrowDown } from "lucide-react";
import { Reveal } from "@/components/motion";
import { LeaderMessages } from "@/components/pages/leadership/LeaderMessages";
import { BoardList, type CompanyLeadView, CompanyLeaders, ExecutiveGrid, type PersonView } from "@/components/pages/leadership/People";
import { ArcsMark } from "@/components/site/ArcsMark";
import { PageHero } from "@/components/site/PageHero";
import { Btn, Em, SectionHeading } from "@/components/site/primitives";
import { type CompanyId, companyById, companyRank } from "@/content/site";
import { type Locale, isLocale, pick } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import { getLeaderMessages, getListingVisible, getPeople } from "@/lib/queries";

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

/**
 * Which operating company a manager leads, read from the role text (English first, then Arabic). DOPET Sales &
 * Technologies is tested before DOPET. No match = a Group executive.
 */
const COMPANY_IN_ROLE: [CompanyId, RegExp][] = [
  ["dst", /DOPET Sales|دوبت للمبيعات/i],
  ["aatc", /Al[- ]Ahed Trading|العهد للتجارة/i],
  ["pemco", /PEMCO|بمكو/i],
  ["dopet", /DOPET|Doha Petroleum|دوبت/i],
];

/** "General Manager, PEMCO Inspection Company" → "General Manager": the tile names the company itself. */
function jobTitle(role: string, company: RegExp) {
  let out = role.trim();
  for (;;) {
    const cut = Math.max(out.lastIndexOf(","), out.lastIndexOf("،"));
    if (cut <= 0 || !company.test(out.slice(cut + 1))) return out;
    out = out.slice(0, cut).trim();
  }
}

export default async function LeadershipPage({ params }: P) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const ar = locale === "ar";
  const [board, management, listing, messages] = await Promise.all([
    getPeople("board"),
    getPeople("management"),
    getListingVisible(),
    getLeaderMessages(),
  ]);
  type Row = (typeof board)[number];
  const view = (r: Row): PersonView => ({ id: r.id, name: pick(r, "name", locale), role: pick(r, "role", locale), bio: pick(r, "bio", locale), photo: r.photo });

  const directors = board.map(view);
  const executives: PersonView[] = [];
  const companyLeads: CompanyLeadView[] = [];
  for (const r of management) {
    const match = COMPANY_IN_ROLE.find(([, re]) => re.test(r.roleEn) || re.test(r.roleAr));
    const c = match ? companyById(match[0]) : undefined;
    if (match && c) {
      const v = view(r);
      companyLeads.push({
        ...v,
        role: jobTitle(v.role, match[1]),
        company: match[0],
        companyName: c.name[locale],
        companyHref: href(locale, `/companies/${c.slug}`),
      });
    } else executives.push(view(r));
  }
  // Same order as everywhere else on the site: companies by founding year (admin order breaks ties).
  companyLeads.sort((a, b) => companyRank(a.company) - companyRank(b.company));

  const index = [
    { id: "messages", label: ar ? "كلمات القيادة" : "Leadership messages", count: messages.length },
    { id: "board", label: ar ? "مجلس الإدارة" : "Board of Directors", count: directors.length },
    { id: "management", label: ar ? "الإدارة التنفيذية" : "Executive management", count: management.length },
  ].filter((x) => x.count > 0);

  const empty = (
    <Reveal className="mt-14">
      <div className="relative overflow-hidden rounded-[2px] border border-dashed border-ink/20 bg-white/60 px-8 py-14 text-center">
        <ArcsMark className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 opacity-[0.08]" />
        <p className="font-display text-[1.4rem] text-ink">{ar ? "سيتم نشر الملفات التعريفية قريبًا." : "Profiles will be published soon."}</p>
        <p className="mx-auto mt-3 max-w-md text-[0.95rem] text-haze">
          {listing
            ? ar
              ? "نعمل على تحديث هذا القسم بالتزامن مع استعدادات المجموعة للإدراج."
              : "This section is being updated as part of the Group's listing preparations."
            : ar
              ? "نعمل حاليًا على تحديث هذا القسم."
              : "This section is currently being updated."}
        </p>
      </div>
    </Reveal>
  );

  return (
    <>
      <PageHero
        locale={locale}
        image="/images/hq.jpg"
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
        aside={
          index.length > 1 && (
            <nav aria-label={ar ? "في هذه الصفحة" : "On this page"} className="border-t border-white/15">
              {index.map((x) => (
                <a key={x.id} href={`#${x.id}`} className="group flex items-center gap-4 border-b border-white/15 py-4 text-white/80 transition-colors hover:text-white">
                  <span className="flex-1 text-[0.98rem]">{x.label}</span>
                  <span className="num font-display text-[1.25rem] leading-none text-white">{x.count}</span>
                  <ArrowDown aria-hidden className="h-4 w-4 text-leaf-300 transition-transform duration-500 ease-out-expo group-hover:translate-y-0.5" />
                </a>
              ))}
            </nav>
          )
        }
      />

      <LeaderMessages locale={locale} messages={messages} />

      <section id="board" className="scroll-mt-24 bg-pearl-50 py-24 md:py-32">
        <div className="container">
          <SectionHeading
            eyebrow={ar ? "مجلس الإدارة" : "Board of Directors"}
            title={
              ar ? (
                <>
                  الإشراف الاستراتيجي <Em className="text-brand">والحوكمة.</Em>
                </>
              ) : (
                <>
                  Strategic oversight <Em className="text-brand">and governance.</Em>
                </>
              )
            }
            intro={
              ar
                ? "يضع مجلس الإدارة الاستراتيجية ويشرف على الأداء والمخاطر، ويخضع للمساءلة أمام المساهمين."
                : "The Board sets strategy, oversees performance and risk, and is accountable to shareholders."
            }
          />
          {directors.length > 0 ? <BoardList people={directors} /> : empty}
        </div>
      </section>

      <section id="management" className="scroll-mt-24 bg-white py-24 md:py-32">
        <div className="container">
          <SectionHeading
            eyebrow={ar ? "الإدارة التنفيذية" : "Executive management"}
            title={
              ar ? (
                <>
                  قيادة الأداء <Em className="text-brand">اليومي للمجموعة.</Em>
                </>
              ) : (
                <>
                  Leading the Group's <Em className="text-brand">day-to-day performance.</Em>
                </>
              )
            }
            intro={
              ar
                ? "التنفيذيون في الشركة القابضة، وقادة الشركات التابعة للمجموعة."
                : "The holding company's executives, and the leaders of the Group's operating companies."
            }
          />
          {management.length === 0 && empty}
          {executives.length > 0 && (
            <>
              <h3 className="mt-14 text-[0.95rem] font-medium text-ink">{ar ? "الإدارة التنفيذية للمجموعة" : "Group executives"}</h3>
              <ExecutiveGrid people={executives} />
            </>
          )}
          {companyLeads.length > 0 && (
            <>
              <h3 className="mt-16 text-[0.95rem] font-medium text-ink">{ar ? "قيادة الشركات التابعة" : "Operating company leadership"}</h3>
              <CompanyLeaders people={companyLeads} locale={locale} />
            </>
          )}
        </div>
      </section>

      <section className="bg-white pb-24 md:pb-32">
        <div className="container">
          <div className="relative overflow-hidden rounded-[2px] bg-ink px-8 py-14 text-white md:px-14">
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
