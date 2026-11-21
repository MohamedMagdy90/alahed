import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion";
import { Arrow, Btn, Em } from "@/components/site/primitives";
import { SubscribeForm } from "@/components/site/SubscribeForm";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import type { ShareInfo } from "@/lib/settings";

export function InvestorTeaser({ locale, share }: { locale: Locale; share: ShareInfo }) {
  const ar = locale === "ar";
  const listed = share.status === "listed";
  const tba = ar ? "يُعلن لاحقًا" : "To be announced";

  const rows = [
    { k: ar ? "الحالة" : "Status", v: listed ? (ar ? "مدرجة" : "Listed") : ar ? "ما قبل الإدراج" : "Pre-listing", accent: true },
    { k: ar ? "السوق" : "Exchange", v: ar ? "بورصة قطر" : "Qatar Stock Exchange" },
    { k: ar ? "رمز التداول" : "Ticker", v: share.ticker || tba },
    { k: "ISIN", v: share.isin || tba },
  ];

  const tiles = [
    { href: "/investors#reports", t: ar ? "التقارير والإفصاحات" : "Reports & disclosures", d: ar ? "القوائم المالية والإفصاحات الرسمية" : "Financial statements and official disclosures" },
    { href: "/governance", t: ar ? "الحوكمة المؤسسية" : "Corporate governance", d: ar ? "المبادئ والسياسات والضوابط" : "Principles, policies and controls" },
    { href: "/investors#contact", t: ar ? "التواصل مع علاقات المستثمرين" : "Investor relations contact", d: ar ? "للاستفسارات من المساهمين والمحللين" : "For shareholder and analyst enquiries" },
  ];

  return (
    <section className="grain relative isolate overflow-hidden bg-ink-900 py-24 text-white md:py-32">
      <Image src="/images/doha-moon.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover object-bottom opacity-35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-900 via-ink-900/80 to-ink-900" />
      <div className="grid-lines absolute inset-0 -z-10" />

      <div className="container">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="mb-6 flex items-center gap-4">
              <span className="num font-mono text-xs text-white/40">07</span>
              <p className="eyebrow flex items-center gap-3 text-leaf-300">
                <span aria-hidden className="h-px w-7 bg-current" />
                {ar ? "علاقات المستثمرين" : "Investor relations"}
              </p>
            </div>
            <h2 className="text-balance font-display text-display-lg font-normal">
              {ar ? (
                <>
                  نستعد <Em className="text-leaf-300">للفصل القادم.</Em>
                </>
              ) : (
                <>
                  Preparing for the <Em className="text-leaf-300">next chapter.</Em>
                </>
              )}
            </h2>
            <p className="mt-8 max-w-xl text-pretty text-[1.05rem] leading-relaxed text-white/70">
              {ar ? share.noteAr : share.noteEn}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Btn href={href(locale, "/investors")}>{ar ? "مركز المستثمرين" : "Investor centre"}</Btn>
              <Btn href={href(locale, "/governance")} variant="outline-light">
                {ar ? "الحوكمة" : "Governance"}
              </Btn>
            </div>
          </div>

          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="rounded-[2px] border border-white/15 bg-white/[0.04] backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/50 rtl:font-arabic rtl:text-[0.8rem] rtl:normal-case rtl:tracking-normal">
                  {ar ? "معلومات السهم" : "Share information"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-leaf/40 bg-leaf/10 px-3 py-1 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-leaf-300 rtl:font-arabic rtl:text-[0.75rem] rtl:normal-case rtl:tracking-normal">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping2 rounded-full bg-leaf" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-leaf" />
                  </span>
                  {listed ? "QSE" : ar ? "قيد التحضير" : "In preparation"}
                </span>
              </div>

              {listed && share.price != null ? (
                <div className="border-b border-white/10 px-6 py-8">
                  <p className="num font-display text-6xl leading-none" dir="ltr">
                    {share.price.toFixed(3)} <span className="text-lg text-white/50">{share.currency}</span>
                  </p>
                  {share.changePct != null && (
                    <p className={`num mt-3 font-mono text-sm ${share.changePct >= 0 ? "text-leaf-300" : "text-red-300"}`} dir="ltr">
                      {share.changePct >= 0 ? "▲" : "▼"} {share.change?.toFixed(3)} ({share.changePct.toFixed(2)}%)
                    </p>
                  )}
                </div>
              ) : null}

              <dl className="divide-y divide-white/10">
                {rows.map((r) => (
                  <div key={r.k} className="flex items-center justify-between gap-6 px-6 py-4">
                    <dt className="text-[0.88rem] text-white/50">{r.k}</dt>
                    <dd className={`num text-end font-mono text-[0.85rem] rtl:font-arabic ${r.accent ? "text-leaf-300" : "text-white/90"}`}>{r.v}</dd>
                  </div>
                ))}
              </dl>

              <div className="border-t border-white/10 p-6">
                <p className="font-display text-lg">{ar ? "تنبيهات المستثمرين" : "Investor alerts"}</p>
                <p className="mb-5 mt-1 text-[0.88rem] text-white/55">
                  {ar ? "كن أول من يتلقى الإعلانات والإفصاحات." : "Be the first to receive announcements and disclosures."}
                </p>
                <SubscribeForm locale={locale} list="ir" />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[2px] border border-white/10 bg-white/10 md:grid-cols-3">
          {tiles.map((t, i) => (
            <Reveal key={t.href} delay={i * 0.06} className="bg-ink-900">
              <Link href={href(locale, t.href)} className="group flex h-full items-start justify-between gap-6 p-7 transition-colors hover:bg-white/[0.04] md:p-8">
                <span>
                  <span className="block font-display text-[1.2rem]">{t.t}</span>
                  <span className="mt-2 block text-[0.88rem] text-white/50">{t.d}</span>
                </span>
                <Arrow className="mt-1 text-leaf-300" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
