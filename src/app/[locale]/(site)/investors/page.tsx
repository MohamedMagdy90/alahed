import { CalendarDays, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion";
import { DocumentsBrowser } from "@/components/pages/investors/DocumentsBrowser";
import { ArcsMark } from "@/components/site/OrbitArcs";
import { PageHero } from "@/components/site/PageHero";
import { Btn, Em, SectionHeading } from "@/components/site/primitives";
import { SubscribeForm } from "@/components/site/SubscribeForm";
import { companies } from "@/content/site";
import { type Locale, formatDate, isLocale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import { getDocuments, getIrContact, getShareInfo } from "@/lib/queries";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  const ar = locale === "ar";
  return {
    title: ar ? "علاقات المستثمرين" : "Investor relations",
    description: ar
      ? "معلومات السهم والتقارير والإفصاحات والتواصل مع علاقات المستثمرين في العهد القابضة."
      : "Share information, reports and disclosures, and investor relations contacts for Al-Ahed Holding.",
    alternates: { languages: { en: "/en/investors", ar: "/ar/investors" } },
  };
}

export default async function InvestorsPage({ params }: P) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const ar = locale === "ar";
  const [share, ir, docs] = await Promise.all([getShareInfo(), getIrContact(), getDocuments()]);
  const listed = share.status === "listed";
  const tba = ar ? "يُعلن لاحقًا" : "To be announced";
  const principals = companies.find((c) => c.id === "aatc")?.partners?.length ?? 0;

  const highlights = [
    { en: "Heritage since 1975", ar: "إرث منذ عام 1975", den: "Five decades serving Qatar's energy sector, through every phase of its growth.", dar: "خمسة عقود في خدمة قطاع الطاقة القطري عبر جميع مراحل نموه." },
    { en: "Integrated model", ar: "نموذج متكامل", den: "Three complementary companies covering supply, execution and independent assurance.", dar: "ثلاث شركات متكاملة تغطي التوريد والتنفيذ والضمان المستقل." },
    { en: "Long-standing clients", ar: "علاقات راسخة مع العملاء", den: "Relationships with Qatar's leading energy operators built over decades.", dar: "علاقات مع كبرى شركات الطاقة في قطر بُنيت على مدى عقود." },
    { en: "Global principals", ar: "شركاء عالميون", den: `Channel partnerships with ${principals} world-leading equipment manufacturers.`, dar: `شراكات مع ${principals} من كبرى الشركات العالمية المصنّعة للمعدات.` },
    { en: "Governance & transparency", ar: "الحوكمة والشفافية", den: "A governance framework being strengthened in line with listed-company requirements.", dar: "إطار حوكمة يتعزّز بما يتوافق مع متطلبات الشركات المدرجة." },
    { en: "Aligned with QNV 2030", ar: "متوافقة مع رؤية قطر 2030", den: "Supporting national priorities in energy, local capability and sustainable growth.", dar: "دعم الأولويات الوطنية في الطاقة وتنمية القدرات المحلية والنمو المستدام." },
  ];

  const steps = [
    { en: "Preparation", ar: "التحضير", den: "Governance, reporting and organisational readiness.", dar: "جاهزية الحوكمة والتقارير والهيكل التنظيمي." },
    { en: "Regulatory review", ar: "المراجعة التنظيمية", den: "Review and approvals by the relevant authorities.", dar: "المراجعة والموافقات من الجهات المختصة." },
    { en: "Offering", ar: "الطرح", den: "Subscription period as set out in the official prospectus.", dar: "فترة الاكتتاب وفق ما تحدده نشرة الإصدار الرسمية." },
    { en: "Listing on QSE", ar: "الإدراج في بورصة قطر", den: "Admission of the shares to trading on the Qatar Stock Exchange.", dar: "إدراج الأسهم للتداول في بورصة قطر." },
  ];

  const shareCard = (
    <div className="rounded-[2px] border border-white/15 bg-ink-900/60 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/50 rtl:font-arabic rtl:text-[0.8rem] rtl:normal-case rtl:tracking-normal">
          {ar ? "معلومات السهم" : "Share information"}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-leaf/40 bg-leaf/10 px-3 py-1 text-[0.72rem] text-leaf-300">
          <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
          {listed ? (ar ? "مدرجة" : "Listed") : ar ? "ما قبل الإدراج" : "Pre-listing"}
        </span>
      </div>
      {listed && share.price != null && (
        <div className="border-b border-white/10 px-6 py-6" dir="ltr">
          <p className="num font-display text-5xl leading-none">
            {share.price.toFixed(3)} <span className="text-base text-white/50">{share.currency}</span>
          </p>
          {share.changePct != null && (
            <p className={`num mt-2 font-mono text-sm ${share.changePct >= 0 ? "text-leaf-300" : "text-red-300"}`}>
              {share.changePct >= 0 ? "▲" : "▼"} {share.change?.toFixed(3)} ({share.changePct.toFixed(2)}%)
            </p>
          )}
          {share.asOf && <p className="mt-2 text-[0.75rem] text-white/45">{formatDate(share.asOf, locale)}</p>}
        </div>
      )}
      <dl className="divide-y divide-white/10 text-[0.9rem]">
        {[
          [ar ? "السوق" : "Exchange", ar ? "بورصة قطر" : "Qatar Stock Exchange"],
          [ar ? "رمز التداول" : "Ticker", share.ticker || tba],
          ["ISIN", share.isin || tba],
          [ar ? "العملة" : "Currency", ar ? "ريال قطري" : "Qatari riyal (QAR)"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-6 px-6 py-3.5">
            <dt className="text-white/50">{k}</dt>
            <dd className="num text-end font-mono text-white/90 rtl:font-arabic">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );

  return (
    <>
      <PageHero
        locale={locale}
        image="/images/doha-moon.jpg"
        size="lg"
        eyebrow={ar ? "علاقات المستثمرين" : "Investor relations"}
        crumbs={[{ label: ar ? "علاقات المستثمرين" : "Investor relations" }]}
        title={
          ar ? (
            <>
              بناء قيمة طويلة الأمد <Em className="text-leaf-300">بشفافية.</Em>
            </>
          ) : (
            <>
              Building long-term value — <Em className="text-leaf-300">with transparency.</Em>
            </>
          )
        }
        intro={ar ? share.noteAr : share.noteEn}
        aside={shareCard}
      />

      {/* Highlights */}
      <section className="bg-pearl-50 py-24 md:py-32">
        <div className="container">
          <SectionHeading
            eyebrow={ar ? "لماذا العهد" : "Why Al-Ahed"}
            title={
              ar ? (
                <>
                  أسس راسخة <Em className="text-brand">لنمو مستدام.</Em>
                </>
              ) : (
                <>
                  Strong foundations <Em className="text-brand">for sustainable growth.</Em>
                </>
              )
            }
          />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((h, i) => (
              <Reveal as="li" key={h.en} delay={(i % 3) * 0.05} className="bg-white p-7 md:p-9">
                <span className="num font-mono text-xs text-leaf-700">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-8 font-display text-[1.45rem] leading-tight text-ink">{ar ? h.ar : h.en}</p>
                <p className="mt-3 text-[0.96rem] leading-relaxed text-haze">{ar ? h.dar : h.den}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Listing journey */}
      <section className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
        <div className="container relative">
          <SectionHeading
            tone="dark"
            eyebrow={ar ? "مسار الإدراج" : "The listing journey"}
            title={
              ar ? (
                <>
                  نحو الإدراج في <Em className="text-leaf-300">بورصة قطر.</Em>
                </>
              ) : (
                <>
                  Towards a listing on the <Em className="text-leaf-300">Qatar Stock Exchange.</Em>
                </>
              )
            }
          />
          <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
            <span aria-hidden className="absolute inset-x-0 top-[7px] hidden h-px bg-white/15 md:block" />
            {steps.map((s, i) => (
              <Reveal as="li" key={s.en} delay={i * 0.08} className="relative">
                <span className="relative block h-[15px] w-[15px] rounded-full border border-white/40 bg-ink" />
                <p className="num mt-8 font-mono text-xs text-white/40">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-3 font-display text-[1.45rem]">{ar ? s.ar : s.en}</p>
                <p className="mt-2 text-[0.94rem] leading-relaxed text-white/60">{ar ? s.dar : s.den}</p>
              </Reveal>
            ))}
          </ol>
          <p className="mt-14 border-t border-white/10 pt-6 text-[0.9rem] text-white/50">
            {ar
              ? "سيتم الإعلان عن الجدول الزمني والتفاصيل عبر القنوات الرسمية."
              : "Timetable and details will be announced through official channels."}
          </p>
        </div>
      </section>

      {/* Reports */}
      <section id="reports" className="scroll-mt-28 bg-pearl-50 py-24 md:py-32">
        <div className="container">
          <SectionHeading
            eyebrow={ar ? "التقارير والإفصاحات" : "Reports & disclosures"}
            title={
              ar ? (
                <>
                  مركز <Em className="text-brand">الوثائق.</Em>
                </>
              ) : (
                <>
                  Document <Em className="text-brand">centre.</Em>
                </>
              )
            }
          />
          <div className="mt-12">
            <DocumentsBrowser docs={docs} locale={locale} />
          </div>
        </div>
      </section>

      {/* Calendar + alerts + contact */}
      <section id="contact" className="scroll-mt-28 bg-white py-24 md:py-32">
        <div className="container grid gap-6 lg:grid-cols-3">
          <Reveal className="rounded-[2px] border border-ink/10 bg-pearl-50 p-8">
            <CalendarDays className="h-5 w-5 text-leaf-700" />
            <p className="mt-8 eyebrow text-haze">{ar ? "التقويم المالي" : "Financial calendar"}</p>
            <p className="mt-3 font-display text-[1.6rem] text-ink">{tba}</p>
            <p className="mt-3 text-[0.94rem] leading-relaxed text-haze">
              {ar ? "ستُنشر مواعيد الإفصاحات والجمعيات العامة هنا." : "Disclosure dates and general assembly meetings will be published here."}
            </p>
          </Reveal>
          <Reveal delay={0.06} className="relative overflow-hidden rounded-[2px] bg-ink p-8 text-white">
            <ArcsMark className="pointer-events-none absolute -bottom-20 -end-20 h-64 w-64 opacity-20" />
            <p className="eyebrow text-leaf-300">{ar ? "تنبيهات المستثمرين" : "Investor alerts"}</p>
            <p className="mt-4 font-display text-[1.5rem] leading-snug">
              {ar ? "استلم الإعلانات والإفصاحات فور صدورها." : "Receive announcements and disclosures as they are released."}
            </p>
            <SubscribeForm locale={locale} list="ir" className="relative mt-8" />
          </Reveal>
          <Reveal delay={0.12} className="rounded-[2px] border border-ink/10 bg-white p-8">
            <p className="eyebrow text-haze">{ar ? "التواصل مع علاقات المستثمرين" : "Investor relations contact"}</p>
            <p className="mt-4 font-display text-[1.5rem] text-ink">{ar ? ir.nameAr : ir.nameEn}</p>
            <ul className="mt-6 space-y-3 text-[0.95rem]">
              <li>
                <a href={`mailto:${ir.email}`} className="group inline-flex items-center gap-3 text-ink hover:text-brand">
                  <Mail className="h-4 w-4 text-leaf-700" />
                  <span className="link-underline break-all">{ir.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${ir.phone.replace(/\s/g, "")}`} className="group inline-flex items-center gap-3 text-ink hover:text-brand">
                  <Phone className="h-4 w-4 text-leaf-700" />
                  <span className="num link-underline font-mono" dir="ltr">
                    {ir.phone}
                  </span>
                </a>
              </li>
            </ul>
            <Btn href={href(locale, "/contact")} variant="outline-dark" className="mt-8">
              {ar ? "نموذج التواصل" : "Contact form"}
            </Btn>
          </Reveal>
        </div>
        <div className="container mt-14">
          <p className="max-w-4xl border-t border-ink/10 pt-6 text-[0.82rem] leading-relaxed text-haze">
            {ar
              ? "المعلومات الواردة في هذا القسم لأغراض إعلامية فقط، ولا تشكّل عرضًا أو دعوة لشراء أو الاكتتاب في أي أوراق مالية. وقد تتضمن بيانات تطلعية تخضع لمخاطر وعوامل عدم يقين. "
              : "The information in this section is provided for information purposes only and does not constitute an offer or invitation to purchase or subscribe for any securities. It may contain forward-looking statements that are subject to risks and uncertainties. "}
            <Link href={href(locale, "/legal/disclaimer")} className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
              {ar ? "إخلاء المسؤولية" : "Disclaimer"}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
