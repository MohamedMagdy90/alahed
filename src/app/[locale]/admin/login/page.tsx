import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { monoLabel } from "@/components/admin/ui";
import { Logo } from "@/components/site/Logo";
import { ArcsMark } from "@/components/site/ArcsMark";
import { getAdminDict, tx } from "@/i18n/admin";
import { type Locale, isLocale } from "@/i18n/config";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const { next } = await searchParams;
  const session = await getSession();
  if (session) {
    const user = await db.user.findUnique({ where: { id: session.uid }, select: { active: true } });
    if (user?.active) redirect(`/${locale}/admin`);
  }

  const d = getAdminDict(locale);
  const t = tx(locale);
  const other: Locale = locale === "ar" ? "en" : "ar";

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside className="grain relative hidden overflow-hidden bg-ink-900 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <ArcsMark className="pointer-events-none absolute -bottom-[22%] -end-[18%] w-[95%] opacity-[0.22] rtl:-scale-x-100" />
        <div
          className="pointer-events-none absolute -start-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand/25 blur-[140px]"
          aria-hidden
        />
        <div className="relative z-10 p-12 xl:p-16">
          <Logo variant="white" priority className="w-[180px] md:w-[196px]" />
        </div>
        <div className="relative z-10 max-w-xl p-12 xl:p-16">
          <p className={cn(monoLabel, "mb-6 flex items-center gap-3 text-leaf-300")}>
            <span className="h-px w-8 bg-leaf" aria-hidden />
            {d.cms}
          </p>
          <p className="font-display text-[2.6rem] font-normal leading-[1.08] tracking-[-0.02em] xl:text-[3.1rem]">
            {t("One group.", "مجموعة واحدة.")}
            <br />
            <span className="text-white/45">{t("Two languages.", "بلغتين.")}</span>
            <br />
            <span className="font-serif italic text-leaf-300 rtl:font-arabic rtl:not-italic">{t("Every update.", "وكل تحديث.")}</span>
          </p>
          <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-white/55">{d.loginAside}</p>
        </div>
        <div className="relative z-10 flex items-center justify-between border-t border-white/10 px-12 py-6 xl:px-16">
          <span className={cn(monoLabel, "text-white/40")}>{t("Est. 1975 · Doha, Qatar", "تأسست 1975 · الدوحة، قطر")}</span>
          <span className={cn(monoLabel, "text-white/40")} dir="ltr">
            25.2854° N, 51.5310° E
          </span>
        </div>
      </aside>

      {/* Form */}
      <section className="relative flex flex-col">
        <div className="flex items-center justify-between px-6 py-6 md:px-10">
          <div className="lg:hidden">
            <Logo priority className="w-[150px]" />
          </div>
          <div className="ms-auto flex items-center gap-1 text-[0.8rem]">
            <Link href={`/${locale}`} className="rounded-[2px] px-3 py-2 text-haze transition-colors hover:text-ink">
              {d.viewSite}
            </Link>
            <span className="h-4 w-px bg-ink/10" aria-hidden />
            <Link
              href={`/${other}/admin/login${next ? `?next=${encodeURIComponent(next.replace(/^\/(en|ar)\//, `/${other}/`))}` : ""}`}
              className={cn("rounded-[2px] px-3 py-2 text-ink transition-colors hover:bg-ink/5", other === "ar" ? "font-arabic" : "font-sans")}
              lang={other}
            >
              {other === "ar" ? "العربية" : "English"}
            </Link>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-16 md:px-10">
          <div className="w-full max-w-[400px]">
            <p className={cn(monoLabel, "mb-4 flex items-center gap-2.5")}>
              <span className="h-px w-5 bg-leaf" aria-hidden />
              {d.cms}
            </p>
            <h1 className="font-display text-[2.3rem] font-normal leading-[1.05] tracking-[-0.02em] text-ink">{d.loginTitle}</h1>
            <p className="mb-9 mt-3 text-[0.92rem] leading-relaxed text-haze">{d.loginBody}</p>
            <LoginForm locale={locale} next={next} />
            <p className="mt-8 border-t border-ink/10 pt-6 text-[0.78rem] leading-relaxed text-haze">
              {t(
                "Access is limited to authorised Al-Ahed Holding staff. Activity may be logged.",
                "الدخول مقصور على موظفي العهد القابضة المخوّلين. قد يتم تسجيل النشاط.",
              )}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
