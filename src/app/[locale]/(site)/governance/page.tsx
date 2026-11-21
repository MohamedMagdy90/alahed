import { HardHat, Leaf, Scale, ShieldCheck, Users } from "lucide-react";
import type { Metadata } from "next";
import { Counter, Reveal } from "@/components/motion";
import { DocumentRow } from "@/components/site/DocumentRow";
import { ArcsMark } from "@/components/site/OrbitArcs";
import { PageHero } from "@/components/site/PageHero";
import { Btn, Em, SectionHeading } from "@/components/site/primitives";
import { contact, governancePrinciples } from "@/content/site";
import { type Locale, isLocale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import { getDocuments } from "@/lib/queries";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  const ar = locale === "ar";
  return {
    title: ar ? "الحوكمة والصحة والسلامة" : "Governance & HSE",
    description: ar
      ? "مبادئ الحوكمة المؤسسية وإطار الرقابة والصحة والسلامة والبيئة والاستدامة في العهد القابضة."
      : "Corporate governance principles, control framework, health, safety, environment and sustainability at Al-Ahed Holding.",
    alternates: { languages: { en: "/en/governance", ar: "/ar/governance" } },
  };
}

export default async function GovernancePage({ params }: P) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const ar = locale === "ar";
  const docs = await getDocuments("governance");

  const framework = [
    { en: "Board of Directors", ar: "مجلس الإدارة", den: "Sets strategy, oversees performance and risk, and is accountable to shareholders.", dar: "يضع الاستراتيجية ويشرف على الأداء والمخاطر، ويخضع للمساءلة أمام المساهمين." },
    { en: "Board committees", ar: "لجان المجلس", den: "Dedicated committees support the Board in audit, risk, nomination and remuneration matters.", dar: "لجان متخصصة تدعم المجلس في شؤون التدقيق والمخاطر والترشيحات والمكافآت." },
    { en: "Internal control", ar: "الرقابة الداخلية", den: "Policies, delegated authorities and procedures that safeguard assets and reliable reporting.", dar: "سياسات وصلاحيات مفوّضة وإجراءات تحمي الأصول وتضمن موثوقية التقارير." },
    { en: "Risk management", ar: "إدارة المخاطر", den: "Structured identification, assessment and mitigation of strategic and operational risks.", dar: "تحديد المخاطر الاستراتيجية والتشغيلية وتقييمها والحد منها بشكل منهجي." },
    { en: "Internal audit", ar: "التدقيق الداخلي", den: "Independent assurance on the effectiveness of governance, risk and control processes.", dar: "ضمان مستقل لفعالية عمليات الحوكمة وإدارة المخاطر والرقابة." },
    { en: "External audit", ar: "التدقيق الخارجي", den: "Independent audit of financial statements in line with international standards.", dar: "تدقيق مستقل للقوائم المالية وفق المعايير الدولية." },
  ];

  const esg = [
    { icon: Leaf, en: "Environment", ar: "البيئة", den: "Reducing the environmental footprint of our operations and supporting cleaner energy practices.", dar: "الحد من الأثر البيئي لعملياتنا ودعم ممارسات الطاقة الأنظف." },
    { icon: Users, en: "People & communities", ar: "الأفراد والمجتمع", den: "Developing Qatari and international talent, and contributing to the communities where we work.", dar: "تطوير الكفاءات القطرية والدولية، والمساهمة في المجتمعات التي نعمل فيها." },
    { icon: Scale, en: "Governance", ar: "الحوكمة", den: "Ethical conduct, transparency and accountability in every decision.", dar: "السلوك الأخلاقي والشفافية والمساءلة في كل قرار." },
    { icon: ShieldCheck, en: "Qatar National Vision 2030", ar: "رؤية قطر الوطنية 2030", den: "Supporting the economic, human, social and environmental pillars of the national vision.", dar: "دعم الركائز الاقتصادية والبشرية والاجتماعية والبيئية للرؤية الوطنية." },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        image="/images/refinery-pipes.jpg"
        eyebrow={ar ? "الحوكمة والصحة والسلامة" : "Governance & HSE"}
        crumbs={[{ label: ar ? "الحوكمة والصحة والسلامة" : "Governance & HSE" }]}
        title={
          ar ? (
            <>
              الثقة تُبنى <Em className="text-leaf-300">بالشفافية والانضباط.</Em>
            </>
          ) : (
            <>
              Trust built on <Em className="text-leaf-300">transparency and discipline.</Em>
            </>
          )
        }
        intro={
          ar
            ? "نلتزم بممارسات حوكمة سليمة تتماشى مع متطلبات هيئة قطر للأسواق المالية، وبأعلى معايير الصحة والسلامة والبيئة في جميع عملياتنا."
            : "We are committed to sound governance practices aligned with the requirements of the Qatar Financial Markets Authority, and to the highest standards of health, safety and environment across our operations."
        }
      />

      {/* Principles */}
      <section className="bg-pearl-50 py-24 md:py-32">
        <div className="container">
          <SectionHeading
            eyebrow={ar ? "مبادئ الحوكمة" : "Governance principles"}
            title={
              ar ? (
                <>
                  ثمانية مبادئ <Em className="text-brand">نلتزم بها.</Em>
                </>
              ) : (
                <>
                  Eight principles <Em className="text-brand">we hold ourselves to.</Em>
                </>
              )
            }
            intro={
              ar
                ? "تشكّل هذه المبادئ أساس طريقة إدارتنا للمجموعة وعلاقتنا بالمساهمين والعملاء والشركاء."
                : "These principles underpin how we run the Group and how we work with shareholders, clients and partners."
            }
          />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {governancePrinciples.map((g, i) => (
              <Reveal as="li" key={g.en} delay={(i % 4) * 0.05} className="bg-white p-7 md:p-8">
                <span className="num font-mono text-xs text-leaf-700">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-8 text-pretty font-display text-[1.25rem] leading-snug text-ink">{g[locale]}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Framework */}
      <section className="bg-white py-24 md:py-32">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <div className="mb-6 flex items-center gap-4">
                <span className="num font-mono text-xs text-haze">02</span>
                <p className="eyebrow flex items-center gap-3 text-leaf-700">
                  {ar ? "إطار الحوكمة" : "Governance framework"}
                </p>
              </div>
              <h2 className="text-balance font-display text-display-lg font-normal text-ink">
                {ar ? (
                  <>
                    إطار يتعزّز <Em className="text-brand">استعدادًا للإدراج.</Em>
                  </>
                ) : (
                  <>
                    A framework strengthened <Em className="text-brand">ahead of listing.</Em>
                  </>
                )}
              </h2>
              <p className="mt-6 text-pretty text-[1.02rem] leading-relaxed text-haze">
                {ar
                  ? "تواصل المجموعة تطوير هيكل حوكمتها وسياساتها وضوابطها بما يتوافق مع متطلبات الشركات المدرجة في دولة قطر."
                  : "The Group continues to develop its governance structure, policies and controls in line with the requirements for listed companies in the State of Qatar."}
              </p>
            </div>
          </div>
          <ol className="border-t border-ink/10 lg:col-span-7">
            {framework.map((f, i) => (
              <Reveal as="li" key={f.en} delay={i * 0.04} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-ink/10 py-7">
                <span className="num pt-1.5 font-mono text-xs text-haze">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-display text-[1.45rem] leading-tight text-ink">{ar ? f.ar : f.en}</p>
                  <p className="mt-2 text-[0.98rem] leading-relaxed text-haze">{ar ? f.dar : f.den}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* HSE */}
      <section className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
        <ArcsMark className="pointer-events-none absolute -end-48 -top-48 h-[640px] w-[640px] opacity-[0.08]" />
        <div className="container relative">
          <SectionHeading
            tone="dark"
            eyebrow={ar ? "الصحة والسلامة والبيئة" : "Health, safety & environment"}
            title={
              ar ? (
                <>
                  السلامة أولًا، <Em className="text-leaf-300">في كل موقع.</Em>
                </>
              ) : (
                <>
                  Safety first, <Em className="text-leaf-300">at every site.</Em>
                </>
              )
            }
            intro={
              ar
                ? "تُدار عملياتنا وفق أنظمة متكاملة للصحة والسلامة والجودة والبيئة، بهدف إعادة كل فرد إلى منزله سالمًا كل يوم."
                : "Our operations are managed through integrated health, safety, quality and environmental systems — with the goal of every person returning home safely, every day."
            }
          />
          <div className="mt-16 grid gap-px overflow-hidden rounded-[2px] border border-white/10 bg-white/10 md:grid-cols-3">
            <div className="bg-ink p-8 md:p-10">
              <HardHat className="h-5 w-5 text-leaf-300" />
              <p className="mt-8 font-display text-[clamp(3rem,5vw,4.5rem)] leading-none tracking-[-0.04em]">
                <span className="text-white/60">{"<"}</span>
                <Counter value={1} />
              </p>
              <p className="mt-4 text-[0.95rem] text-white/60">{ar ? "معدل تكرار الحوادث" : "Accident frequency rate"}</p>
            </div>
            <div className="bg-ink p-8 md:p-10">
              <ShieldCheck className="h-5 w-5 text-leaf-300" />
              <p className="mt-8 font-display text-[clamp(3rem,5vw,4.5rem)] leading-none tracking-[-0.04em]">
                <Counter value={95} />
                <span className="text-leaf">%</span>
              </p>
              <p className="mt-4 text-[0.95rem] text-white/60">{ar ? "تسليم في الوقت المحدد وبالكامل" : "On-time in-full delivery"}</p>
            </div>
            <div className="bg-ink p-8 md:p-10">
              <Leaf className="h-5 w-5 text-leaf-300" />
              <p className="num mt-8 font-display text-[clamp(3rem,5vw,4.5rem)] leading-none tracking-[-0.04em]">
                <span className="me-2 text-[0.45em] tracking-normal text-white/60">ISO</span>14001
              </p>
              <p className="mt-4 text-[0.95rem] text-white/60">{ar ? "مواقع صناعية معتمدة" : "Certified industrial sites"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ESG */}
      <section className="bg-pearl-50 py-24 md:py-32">
        <div className="container">
          <SectionHeading
            eyebrow={ar ? "الاستدامة" : "Sustainability"}
            title={
              ar ? (
                <>
                  نمو مسؤول <Em className="text-brand">يخدم الأجيال القادمة.</Em>
                </>
              ) : (
                <>
                  Responsible growth <Em className="text-brand">for future generations.</Em>
                </>
              )
            }
          />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {esg.map((e, i) => (
              <Reveal as="li" key={e.en} delay={i * 0.05} className="bg-white p-7 md:p-8">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-leaf-50 text-leaf-700">
                  <e.icon className="h-5 w-5" />
                </span>
                <p className="mt-8 font-display text-[1.3rem] leading-tight text-ink">{ar ? e.ar : e.en}</p>
                <p className="mt-3 text-[0.94rem] leading-relaxed text-haze">{ar ? e.dar : e.den}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Documents + ethics */}
      <section className="bg-white py-24 md:py-32">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-8 flex items-center gap-4">
              <span className="num font-mono text-xs text-haze">05</span>
              <p className="eyebrow flex items-center gap-3 text-leaf-700">
                {ar ? "وثائق الحوكمة" : "Governance documents"}
              </p>
            </div>
            {docs.length > 0 ? (
              <div className="border-t border-ink/10">
                {docs.map((d) => (
                  <DocumentRow key={d.id} doc={d} locale={locale} showCategory={false} />
                ))}
              </div>
            ) : (
              <div className="rounded-[2px] border border-dashed border-ink/20 bg-pearl-50 px-8 py-12">
                <p className="font-display text-[1.3rem] text-ink">{ar ? "سيتم نشر الوثائق هنا." : "Documents will be published here."}</p>
                <p className="mt-2 max-w-lg text-[0.95rem] text-haze">
                  {ar ? "ستتوفر هنا سياسات الحوكمة واللوائح الداخلية عند نشرها." : "Governance policies and charters will be available here once published."}
                </p>
              </div>
            )}
          </div>
          <Reveal className="lg:col-span-4">
            <div className="rounded-[2px] bg-ink p-8 text-white">
              <p className="eyebrow text-leaf-300">{ar ? "الأخلاقيات والإبلاغ" : "Ethics & reporting"}</p>
              <p className="mt-5 font-display text-[1.4rem] leading-snug">
                {ar ? "عدم التسامح مطلقًا مع الاحتيال والفساد." : "Zero tolerance for fraud and corruption."}
              </p>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-white/65">
                {ar
                  ? "يمكن الإبلاغ عن أي مخاوف تتعلق بالسلوك المهني أو الامتثال بسرية تامة عبر البريد الإلكتروني للمجموعة."
                  : "Concerns about conduct or compliance can be raised in confidence through the Group's email."}
              </p>
              <a href={`mailto:${contact.holding.email}`} className="mt-6 inline-block break-all font-mono text-[0.9rem] text-leaf-300 hover:text-white">
                {contact.holding.email}
              </a>
              <div className="mt-8">
                <Btn href={href(locale, "/investors")} variant="outline-light">
                  {ar ? "علاقات المستثمرين" : "Investor relations"}
                </Btn>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
