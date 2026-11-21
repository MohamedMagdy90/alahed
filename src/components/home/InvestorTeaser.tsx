import Link from "next/link";
import { Arrow, Btn } from "@/components/site/primitives";
import { SubscribeForm } from "@/components/site/SubscribeForm";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/dictionary";
import type { ShareInfo } from "@/lib/settings";

export function InvestorTeaser({ locale, share }: { locale: Locale; share: ShareInfo }) {
  const ar = locale === "ar";
  const listed = share.status === "listed";
  const tba = ar ? "يُعلن لاحقًا" : "To be announced";

  const rows = [
    { k: ar ? "الحالة" : "Status", v: listed ? (ar ? "مدرجة" : "Listed") : ar ? "ما قبل الإدراج" : "Pre-listing" },
    { k: ar ? "السوق" : "Exchange", v: ar ? "بورصة قطر" : "Qatar Stock Exchange" },
    { k: ar ? "رمز التداول" : "Ticker", v: share.ticker || tba },
    { k: "ISIN", v: share.isin || tba },
  ];

  const links = [
    { href: "/investors#reports", t: ar ? "التقارير والإفصاحات" : "Reports & disclosures" },
    { href: "/governance", t: ar ? "الحوكمة المؤسسية" : "Corporate governance" },
    { href: "/investors#contact", t: ar ? "التواصل مع علاقات المستثمرين" : "Investor relations contact" },
  ];

  return (
    <section className="bg-ink-900 py-24 text-white md:py-32">
      <div className="container">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="text-[0.95rem] font-medium text-leaf-300">{ar ? "علاقات المستثمرين" : "Investor relations"}</p>
            <h2 className="mt-4 max-w-2xl text-balance font-display text-display-lg font-normal">
              {listed
                ? ar
                  ? "مدرجة في بورصة قطر."
                  : "Listed on the Qatar Stock Exchange."
                : ar
                  ? "نستعد للإدراج في بورصة قطر."
                  : "Preparing to list on the Qatar Stock Exchange."}
            </h2>
            <p className="mt-8 max-w-xl text-pretty text-[1.05rem] leading-relaxed text-white/70">{ar ? share.noteAr : share.noteEn}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Btn href={href(locale, "/investors")}>{ar ? "مركز المستثمرين" : "Investor centre"}</Btn>
              <Btn href={href(locale, "/governance")} variant="outline-light">
                {ar ? "الحوكمة" : "Governance"}
              </Btn>
            </div>

            <ul className="mt-14 max-w-xl border-t border-white/10">
              {links.map((l) => (
                <li key={l.href} className="border-b border-white/10">
                  <Link href={href(locale, l.href)} className="group flex items-center justify-between gap-6 py-4 text-[0.98rem] text-white/80 hover:text-white">
                    <span className="link-underline">{l.t}</span>
                    <Arrow className="text-leaf-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[2px] border border-white/15 bg-white/[0.03]">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <span className="text-[0.9rem] font-medium text-white/80">{ar ? "معلومات السهم" : "Share information"}</span>
                <span className="inline-flex items-center gap-2 text-[0.82rem] text-leaf-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
                  {listed ? (ar ? "مدرجة" : "Listed") : ar ? "قيد التحضير" : "In preparation"}
                </span>
              </div>

              {listed && share.price != null ? (
                <div className="border-b border-white/10 px-6 py-8">
                  <p className="num font-display text-6xl leading-none" dir="ltr">
                    {share.price.toFixed(3)} <span className="text-lg text-white/50">{share.currency}</span>
                  </p>
                  {share.changePct != null && (
                    <p className={`num mt-3 text-sm ${share.changePct >= 0 ? "text-leaf-300" : "text-red-300"}`} dir="ltr">
                      {share.changePct >= 0 ? "▲" : "▼"} {share.change?.toFixed(3)} ({share.changePct.toFixed(2)}%)
                    </p>
                  )}
                </div>
              ) : null}

              <dl className="divide-y divide-white/10">
                {rows.map((r) => (
                  <div key={r.k} className="flex items-center justify-between gap-6 px-6 py-4 text-[0.92rem]">
                    <dt className="text-white/50">{r.k}</dt>
                    <dd className="num text-end text-white/90">{r.v}</dd>
                  </div>
                ))}
              </dl>

              <div className="border-t border-white/10 p-6">
                <p className="font-display text-lg">{ar ? "تنبيهات المستثمرين" : "Investor alerts"}</p>
                <p className="mb-5 mt-1 text-[0.9rem] text-white/55">
                  {ar ? "تلقَّ الإعلانات والإفصاحات عبر البريد الإلكتروني فور نشرها." : "Receive announcements and disclosures by email as soon as they are published."}
                </p>
                <SubscribeForm locale={locale} list="ir" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
