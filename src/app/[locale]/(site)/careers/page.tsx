import { GraduationCap, HardHat, Handshake, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion";
import { CareersForm, type FormRole } from "@/components/pages/careers/CareersForm";
import { PageHero } from "@/components/site/PageHero";
import { Arrow, Btn, SectionHeading } from "@/components/site/primitives";
import { companyLabels } from "@/content/site";
import { type Locale, formatDate, isLocale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import { asEmployment, employmentLabels, openRolesLabel } from "@/lib/forms";
import { getOpenJobs } from "@/lib/queries";

type P = { params: Promise<{ locale: string }>; searchParams: Promise<{ role?: string }> };

export async function generateMetadata({ params }: Pick<P, "params">): Promise<Metadata> {
  const { locale } = await params;
  const ar = locale === "ar";
  return {
    title: ar ? "الوظائف" : "Careers",
    description: ar
      ? "انضم إلى العهد القابضة وشركاتها: فرص في الهندسة والأعمال الفنية والفحص والوظائف المؤسسية."
      : "Join Al-Ahed Holding and its companies: opportunities in engineering, technical trades, inspection and corporate functions.",
    alternates: { languages: { en: "/en/careers", ar: "/ar/careers" } },
  };
}

export default async function CareersPage({ params, searchParams }: P) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const ar = locale === "ar";
  const [{ role }, jobs] = await Promise.all([searchParams, getOpenJobs()]);
  const careersHref = href(locale, "/careers");
  const roles: FormRole[] = jobs.map((j) => ({
    id: j.id,
    title: ar && j.titleAr ? j.titleAr : j.titleEn,
    company: companyLabels[j.company]?.[locale] ?? "",
  }));

  const pillars = [
    { icon: ShieldCheck, en: "Safety first", ar: "السلامة أولًا", den: "We work safely, every day, on every site — and we look after one another.", dar: "نعمل بأمان كل يوم وفي كل موقع، ونهتم ببعضنا بعضًا." },
    { icon: GraduationCap, en: "Room to grow", ar: "فرص للنمو", den: "Everyone is treated fairly and given the opportunity to develop and progress.", dar: "نعامل الجميع بإنصاف ونمنحهم فرص التطور والتقدّم." },
    { icon: Handshake, en: "Integrity", ar: "النزاهة", den: "We keep our word and hold ourselves to the highest ethical standards.", dar: "نفي بوعودنا ونلتزم بأعلى المعايير الأخلاقية." },
    { icon: HardHat, en: "Teamwork", ar: "العمل الجماعي", den: "Open communication and collaboration, where the best ideas come from anywhere.", dar: "تواصل منفتح وتعاون مستمر، تبرز فيه الأفكار المتميزة من أي مكان." },
  ];

  const areas = [
    { img: "/images/wellhead-dukhan.jpg", en: "Engineering & projects", ar: "الهندسة والمشاريع", den: "Project engineers, planners and project managers for EPIC and construction work.", dar: "مهندسو مشاريع ومخططون ومديرو مشاريع لأعمال الهندسة والتوريد والإنشاء." },
    { img: "/images/fabrication.jpg", en: "Technical & workshop", ar: "الأعمال الفنية والورش", den: "Technicians, fabricators and service specialists in our workshops and on site.", dar: "فنيون ومتخصصون في التصنيع والخدمة في ورشنا وفي المواقع." },
    { img: "/images/offshore.jpg", en: "Inspection & quality", ar: "الفحص والجودة", den: "Inspectors, NDT technicians and QA/QC professionals protecting asset integrity.", dar: "مفتشون وفنيو اختبارات غير إتلافية ومتخصصو ضمان الجودة لحماية سلامة الأصول." },
    { img: "/images/hq.png", en: "Commercial & corporate", ar: "الوظائف التجارية والمؤسسية", den: "Sales, finance, HR, procurement and other corporate functions.", dar: "المبيعات والمالية والموارد البشرية والمشتريات وغيرها من الوظائف المؤسسية." },
  ];

  const steps = [
    { en: "Apply", ar: "التقديم", den: "Submit your details and CV using the form below.", dar: "أرسل بياناتك وسيرتك الذاتية عبر النموذج أدناه." },
    { en: "Review", ar: "المراجعة", den: "Our HR team reviews every application carefully.", dar: "يراجع فريق الموارد البشرية كل طلب بعناية." },
    { en: "Interview", ar: "المقابلة", den: "Shortlisted candidates are invited to meet the team.", dar: "ندعو المرشحين المؤهلين للقاء الفريق." },
    { en: "Offer", ar: "العرض الوظيفي", den: "Successful candidates receive an offer and onboarding plan.", dar: "يحصل المرشحون الناجحون على عرض وظيفي وخطة انضمام." },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        image="/images/workforce.jpg"
        eyebrow={ar ? "الوظائف" : "Careers"}
        crumbs={[{ label: ar ? "الوظائف" : "Careers" }]}
        title={ar ? "اعمل في مواقع الطاقة في قطر، مع شركات تعمل فيها منذ 1975." : "Work on Qatar’s energy sites, with companies that have been there since 1975."}
        intro={
          ar
            ? "نبحث عن أشخاص يشاركوننا الالتزام بالسلامة والجودة والتميّز، للعمل في مشاريع وخدمات تدعم قطاع الطاقة في قطر."
            : "We're looking for people who share our commitment to safety, quality and excellence — to work on projects and services that support Qatar's energy sector."
        }
      >
        <div className="mt-10 flex flex-wrap gap-3">
          {jobs.length > 0 ? (
            <>
              <Btn href="#roles">{openRolesLabel(jobs.length, locale)}</Btn>
              <Btn href="#apply" variant="outline-light">
                {ar ? "طلب عام" : "General application"}
              </Btn>
            </>
          ) : (
            <Btn href="#apply">{ar ? "قدّم الآن" : "Apply now"}</Btn>
          )}
        </div>
      </PageHero>

      {/* Open roles (managed in the admin panel) */}
      <section id="roles" className="scroll-mt-24 border-b border-ink/10 bg-white py-20 md:py-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-[0.95rem] font-medium text-leaf-700">{ar ? "الوظائف الشاغرة" : "Open roles"}</p>
            <h2 className="mt-4 text-balance font-display text-display-md font-normal text-ink">
              {jobs.length > 0 ? (ar ? "نوظّف الآن." : "We’re hiring now.") : ar ? "لا توجد وظائف معلنة حاليًا." : "No roles advertised right now."}
            </h2>
            <p className="mt-5 max-w-sm text-pretty text-[1rem] leading-relaxed text-haze">
              {jobs.length > 0
                ? ar
                  ? "تقدّم لوظيفة محددة وسيصل طلبك مباشرة إلى فريق التوظيف مع اسم الوظيفة."
                  : "Apply for a specific role and your CV goes straight to the hiring team with the role attached."
                : ar
                  ? "نقرأ كل طلب عام، ونتواصل مع المرشحين عند فتح وظيفة تناسب خبراتهم."
                  : "We read every general application and contact candidates when a matching role opens."}
            </p>
          </div>
          <div className="lg:col-span-8">
            {jobs.length > 0 ? (
              <ul className="border-t border-ink/10">
                {jobs.map((j) => {
                  const title = ar && j.titleAr ? j.titleAr : j.titleEn;
                  const location = ar ? j.locationAr || j.locationEn : j.locationEn;
                  const summary = ar ? j.summaryAr || j.summaryEn : j.summaryEn;
                  return (
                    <li key={j.id} className="border-b border-ink/10">
                      <Link
                        href={`${careersHref}?role=${j.id}#apply`}
                        className="group grid gap-4 py-7 transition-colors md:grid-cols-[1fr_auto] md:items-center md:gap-10"
                      >
                        <div className="min-w-0">
                          <p className="text-[0.88rem] text-haze">
                            {[companyLabels[j.company]?.[locale], location, employmentLabels[asEmployment(j.employment)][locale]].filter(Boolean).join(" · ")}
                          </p>
                          <p className="mt-2 font-display text-[1.55rem] leading-tight text-ink transition-colors group-hover:text-leaf-700">{title}</p>
                          {summary && <p className="mt-3 line-clamp-2 max-w-2xl text-[0.97rem] leading-relaxed text-haze">{summary}</p>}
                        </div>
                        <div className="flex items-center gap-6 md:flex-col md:items-end md:gap-3">
                          <time className="num text-[0.85rem] text-haze">{formatDate(j.postedAt, locale)}</time>
                          <span className="inline-flex items-center gap-2 text-[0.92rem] font-medium text-ink">
                            {ar ? "تقدّم لهذه الوظيفة" : "Apply for this role"}
                            <Arrow className="text-leaf-700" />
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex flex-col items-start gap-6 border-y border-ink/10 py-10">
                <p className="max-w-xl text-pretty text-[1.05rem] leading-relaxed text-ink/80">
                  {ar
                    ? "أرسل سيرتك الذاتية إلى قاعدة المواهب واختر المجال الأقرب إلى خبرتك. تبقى بياناتك لدينا ونعود إليها مع كل وظيفة جديدة."
                    : "Send your CV to our talent pool and pick the area closest to your experience. We keep it on file and check it against every new role."}
                </p>
                <Btn href="#apply" variant="dark">
                  {ar ? "أرسل طلبًا عامًا" : "Send a general application"}
                </Btn>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why join */}
      <section className="bg-pearl-50 py-24 md:py-32">
        <div className="container">
          <SectionHeading
            eyebrow={ar ? "لماذا تنضم إلينا" : "Why join us"}
            title={ar ? "ما تتوقعه من العمل معنا." : "What you can expect from working with us."}
          />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <Reveal as="li" key={p.en} delay={i * 0.05} className="bg-white p-7 md:p-8">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-leaf-50 text-leaf-700">
                  <p.icon className="h-5 w-5" />
                </span>
                <p className="mt-8 font-display text-[1.35rem] text-ink">{ar ? p.ar : p.en}</p>
                <p className="mt-3 text-[0.94rem] leading-relaxed text-haze">{ar ? p.dar : p.den}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Areas */}
      <section className="bg-white py-24 md:py-32">
        <div className="container">
          <SectionHeading
            eyebrow={ar ? "مجالات العمل" : "Areas of work"}
            title={ar ? "الأعمال التي نوظّف لها في شركاتنا الثلاث." : "The work we hire for across our three companies."}
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((a, i) => (
              <Reveal key={a.en} delay={i * 0.06}>
                <div className="group relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[2px] bg-ink-900 p-6 text-white">
                  <Image src={a.img} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="-z-20 object-cover opacity-60 transition-transform duration-1400 ease-out-expo group-hover:scale-105" />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900 via-ink-900/60 to-transparent" />
                  <p className="font-display text-[1.4rem] leading-tight">{ar ? a.ar : a.en}</p>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-white/70">{ar ? a.dar : a.den}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative overflow-hidden bg-ink py-24 text-white md:py-28">
        <div className="container relative">
          <SectionHeading tone="dark" eyebrow={ar ? "كيف تتقدّم" : "How to apply"} title={ar ? "ما يحدث بعد إرسال سيرتك الذاتية." : "What happens after you send your CV."} />
          <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
            <span aria-hidden className="absolute inset-x-0 top-[7px] hidden h-px bg-white/15 md:block" />
            {steps.map((s, i) => (
              <Reveal as="li" key={s.en} delay={i * 0.08} className="relative">
                <span className="relative block h-[15px] w-[15px] rounded-full border border-leaf bg-ink" />
                <p className="num mt-8 text-[0.85rem] text-white/45">{ar ? `الخطوة ${i + 1}` : `Step ${i + 1}`}</p>
                <p className="mt-3 font-display text-[1.45rem]">{ar ? s.ar : s.en}</p>
                <p className="mt-2 text-[0.94rem] leading-relaxed text-white/60">{ar ? s.dar : s.den}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Application */}
      <section id="apply" className="scroll-mt-24 bg-pearl-50 py-24 md:py-32">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div className="mb-6 flex items-center gap-4">
                <span className="num font-mono text-xs text-haze">04</span>
                <p className="eyebrow flex items-center gap-3 text-leaf-700">
                  <span aria-hidden className="h-px w-7 bg-current" />
                  {ar ? "نموذج التقديم" : "Application form"}
                </p>
              </div>
              <h2 className="text-balance font-display text-display-md font-normal text-ink">
                {ar ? "أرسل طلبك." : "Send us your application."}
              </h2>
              <p className="mt-5 text-pretty text-[1rem] leading-relaxed text-haze">
                {ar
                  ? "نحتفظ بطلبك ضمن قاعدة بياناتنا للمواهب، ونتواصل معك عند توفر فرصة تناسب خبراتك."
                  : "We keep your application in our talent pool and will contact you when an opportunity matches your experience."}
              </p>
              <p className="mt-6 text-[0.9rem] text-haze">
                {ar ? "لديك سؤال؟ " : "Have a question? "}
                <a href={href(locale, "/contact")} className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                  {ar ? "تواصل معنا" : "Contact us"}
                </a>
              </p>
            </div>
          </div>
          <div className="rounded-[2px] border border-ink/10 bg-white p-6 md:p-10 lg:col-span-8">
            <CareersForm locale={locale} roles={roles} initialRole={role} />
          </div>
        </div>
      </section>
    </>
  );
}
