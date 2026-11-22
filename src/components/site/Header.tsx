"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Globe, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { companies } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { getDict, href } from "@/i18n/dictionary";
import { cn } from "@/lib/utils";
import { CompanyLogo } from "./CompanyLogo";
import { Logo } from "./Logo";
import { Arrow } from "./primitives";

type MenuKey = "about" | "companies" | null;

function DohaClock({ locale }: { locale: Locale }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Qatar", hour12: false });
    const tick = () => setNow(f.format(new Date()));
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="num inline-flex items-center gap-2" suppressHydrationWarning>
      <span className="text-white/45">{locale === "ar" ? "الدوحة" : "Doha"}</span>
      <span>{now ?? "--:--"}</span>
      <span className="text-white/45">GMT+3</span>
    </span>
  );
}

export function Header({ locale, listed }: { locale: Locale; listed: boolean }) {
  const t = getDict(locale);
  const pathname = usePathname() || `/${locale}`;
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<MenuKey>(null);
  const [mobile, setMobile] = useState(false);
  const other: Locale = locale === "en" ? "ar" : "en";
  const switchHref = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: close menus on navigation
  useEffect(() => {
    setMenu(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = mobile ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setMenu(null), setMobile(false));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobile]);

  const solid = scrolled || menu !== null;
  const is = (p: string) => pathname === href(locale, p) || pathname.startsWith(`${href(locale, p)}/`);

  const aboutLinks = [
    { href: "/about", label: t.nav.story, desc: t.nav.storyDesc },
    { href: "/leadership", label: t.nav.leadership, desc: t.nav.leadershipDesc },
    { href: "/governance", label: t.nav.governance, desc: t.nav.governanceDesc },
  ];

  const navItem = cn(
    "relative inline-flex h-full items-center gap-1.5 px-3.5 text-[0.9rem] font-medium transition-colors duration-300 xl:px-4",
    solid ? "text-ink/80 hover:text-ink" : "text-white/85 hover:text-white",
  );
  const activeBar = (active: boolean) => (
    <span
      className={cn(
        "absolute inset-x-3.5 bottom-0 h-[2px] origin-left bg-leaf transition-transform duration-500 ease-out-expo xl:inset-x-4 rtl:origin-right",
        active ? "scale-x-100" : "scale-x-0",
      )}
    />
  );

  return (
    <>
      <a
        href="#main"
        className="fixed start-4 top-4 z-[100] -translate-y-24 rounded-[2px] bg-leaf px-4 py-2 text-sm font-medium text-ink focus:translate-y-0"
      >
        {t.skip}
      </a>

      <header className="vt-header fixed inset-x-0 top-0 z-50" onMouseLeave={() => setMenu(null)}>
        {/* Utility bar */}
        <div
          className={cn(
            "overflow-hidden bg-ink-900 text-[0.72rem] text-white/80 transition-[height,opacity] duration-500 ease-out-expo",
            scrolled ? "h-0 opacity-0" : "h-9 opacity-100",
          )}
        >
          <div className="container flex h-9 items-center justify-between gap-6 text-[0.78rem]">
            <Link href={href(locale, "/investors")} className="group inline-flex items-center gap-2 hover:text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
              <span className="link-underline">{listed ? t.listed : t.listingStatus}</span>
            </Link>
            <div className="hidden items-center gap-6 md:flex">
              <DohaClock locale={locale} />
              <span className="h-3 w-px bg-white/15" />
              <Link href={href(locale, "/investors")} className="hover:text-white">
                {t.nav.investors}
              </Link>
              <Link href={href(locale, "/careers")} className="hover:text-white">
                {t.nav.careers}
              </Link>
              <Link href={href(locale, "/contact")} className="hover:text-white">
                {t.nav.contact}
              </Link>
              <span className="h-3 w-px bg-white/15" />
              <Link
                href={switchHref}
                hrefLang={other}
                aria-label={t.switchLangLabel}
                className={cn("inline-flex items-center gap-1.5 text-white hover:text-leaf-300", other === "ar" && "font-arabic")}
                onClick={() => {
                  document.cookie = `ah_locale=${other};path=/;max-age=31536000`;
                }}
              >
                <Globe className="h-3.5 w-3.5" />
                {t.switchLang}
              </Link>
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div
          className={cn(
            "relative transition-[background-color,box-shadow,border-color] duration-500",
            solid
              ? "border-b border-ink/10 bg-white/95 shadow-[0_10px_40px_-24px_rgba(6,13,34,0.35)] backdrop-blur-xl"
              : "border-b border-white/10 bg-transparent",
          )}
        >
          <div className="container flex h-[76px] items-center justify-between gap-6">
            <Link href={href(locale)} aria-label={t.brand} className="relative shrink-0">
              <Logo variant={solid ? "color" : "white"} priority />
            </Link>

            <nav className="hidden h-full items-center lg:flex" aria-label="Primary">
              <button
                type="button"
                className={navItem}
                aria-expanded={menu === "about"}
                onMouseEnter={() => setMenu("about")}
                onClick={() => setMenu(menu === "about" ? null : "about")}
              >
                {t.nav.about}
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-300", menu === "about" && "rotate-180")} />
                {activeBar(is("/about") || is("/leadership") || is("/governance"))}
              </button>
              <button
                type="button"
                className={navItem}
                aria-expanded={menu === "companies"}
                onMouseEnter={() => setMenu("companies")}
                onClick={() => setMenu(menu === "companies" ? null : "companies")}
              >
                {t.nav.companies}
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-300", menu === "companies" && "rotate-180")} />
                {activeBar(is("/companies"))}
              </button>
              {[
                { p: "/investors", l: t.nav.investors },
                { p: "/news", l: t.nav.news },
                { p: "/careers", l: t.nav.careers },
              ].map((n) => (
                <Link key={n.p} href={href(locale, n.p)} className={navItem} onMouseEnter={() => setMenu(null)}>
                  {n.l}
                  {activeBar(is(n.p))}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href={switchHref}
                hrefLang={other}
                aria-label={t.switchLangLabel}
                onClick={() => {
                  document.cookie = `ah_locale=${other};path=/;max-age=31536000`;
                }}
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-full border text-[0.8rem] font-medium transition-colors md:hidden",
                  other === "ar" && "font-arabic",
                  solid ? "border-ink/15 text-ink" : "border-white/25 text-white",
                )}
              >
                {t.switchLangShort}
              </Link>
              <Link
                href={href(locale, "/contact")}
                className={cn(
                  "group hidden h-11 items-center gap-3 rounded-[2px] px-5 text-[0.88rem] font-medium transition-colors duration-300 lg:inline-flex",
                  solid ? "bg-ink text-white hover:bg-navy" : "bg-white text-ink hover:bg-leaf",
                )}
              >
                {t.contactUs}
                <Arrow />
              </Link>
              <button
                type="button"
                onClick={() => setMobile(true)}
                aria-label={t.menu}
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-full border transition-colors lg:hidden",
                  solid ? "border-ink/15 text-ink" : "border-white/25 text-white",
                )}
              >
                <Menu className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>

          {/* Mega menus */}
          <AnimatePresence>
            {menu && (
              <motion.div
                key={menu}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-0 top-full hidden border-b border-ink/10 bg-white shadow-[0_40px_80px_-40px_rgba(6,13,34,0.35)] lg:block"
              >
                <div className="container grid grid-cols-12 gap-10 py-10">
                  {menu === "companies" ? (
                    <>
                      <div className="col-span-3 flex flex-col justify-between border-e border-ink/10 pe-10">
                        <div>
                          <p className="mb-3 text-[0.85rem] font-medium text-leaf-700">{t.nav.companies}</p>
                          <p className="font-display text-2xl leading-tight text-ink">{t.nav.companiesDesc}</p>
                        </div>
                        <Link href={href(locale, "/companies")} className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink">
                          <span className="link-underline">{t.nav.allCompanies}</span>
                          <Arrow className="text-leaf-700" />
                        </Link>
                      </div>
                      <div className="col-span-9 grid grid-cols-4 gap-5">
                        {companies.map((c) => (
                          <Link key={c.id} href={href(locale, `/companies/${c.slug}`)} className="group block">
                            <div className="relative aspect-[16/9] overflow-hidden rounded-[2px] bg-pearl-100">
                              <Image
                                src={c.image}
                                alt=""
                                fill
                                sizes="300px"
                                className="object-cover transition-transform duration-1200 ease-out-expo group-hover:scale-105"
                              />
                            </div>
                            <div className="mt-4 flex h-9 items-center">
                              <CompanyLogo id={c.id} locale={locale} size={30} decorative />
                            </div>
                            <div className="mt-3 flex items-start justify-between gap-3">
                              <div>
                                <p className="font-display text-[1.05rem] text-ink">{c.name[locale]}</p>
                                <p className="mt-1 line-clamp-2 text-[0.85rem] leading-snug text-haze">{c.tagline[locale]}</p>
                              </div>
                              <Arrow className="mt-1.5 text-leaf-700" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-span-3 border-e border-ink/10 pe-10">
                        <p className="mb-3 text-[0.85rem] font-medium text-leaf-700">{t.nav.about}</p>
                        <p className="font-display text-2xl leading-tight text-ink">
                          {locale === "ar" ? "مجموعة قطرية في خدمة قطاع الطاقة منذ عام 1975." : "A Qatari group serving the energy sector since 1975."}
                        </p>
                      </div>
                      <ul className="col-span-6 divide-y divide-ink/10">
                        {aboutLinks.map((l) => (
                          <li key={l.href}>
                            <Link href={href(locale, l.href)} className="group flex items-center justify-between gap-6 py-5">
                              <span>
                                <span className="block font-display text-xl text-ink transition-colors group-hover:text-brand">{l.label}</span>
                                <span className="mt-1 block text-sm text-haze">{l.desc}</span>
                              </span>
                              <Arrow className="text-leaf-700" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="col-span-3">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-pearl-100">
                          <Image src="/images/hq.png" alt="" fill sizes="320px" className="object-cover" />
                        </div>
                        <p className="mt-3 text-[0.82rem] text-haze">
                          {locale === "ar" ? "المقر الرئيسي للمجموعة · الدوحة" : "Group headquarters · Doha"}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile navigation */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink-900 text-white lg:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="container flex h-[76px] shrink-0 items-center justify-between border-b border-white/10">
              <Logo variant="white" />
              <button
                type="button"
                onClick={() => setMobile(false)}
                aria-label={t.close}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/25"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>
            <nav className="container flex-1 py-8" aria-label="Mobile">
              {[
                { label: t.nav.about, children: aboutLinks },
                {
                  label: t.nav.companies,
                  children: [
                    { href: "/companies", label: t.nav.allCompanies, desc: "" },
                    ...companies.map((c) => ({ href: `/companies/${c.slug}`, label: c.name[locale], desc: "" })),
                  ],
                },
              ].map((g, gi) => (
                <motion.div
                  key={g.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + gi * 0.05 }}
                  className="border-b border-white/10 py-5"
                >
                  <p className="mb-3 text-[0.85rem] font-medium text-leaf-300">{g.label}</p>
                  <ul className="space-y-2">
                    {g.children.map((c) => (
                      <li key={c.href}>
                        <Link href={href(locale, c.href)} className="font-display text-2xl text-white/90">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
              {[
                { p: "/investors", l: t.nav.investors },
                { p: "/news", l: t.nav.news },
                { p: "/careers", l: t.nav.careers },
                { p: "/contact", l: t.nav.contact },
              ].map((n, i) => (
                <motion.div
                  key={n.p}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <Link
                    href={href(locale, n.p)}
                    className="group flex items-center justify-between border-b border-white/10 py-5 font-display text-3xl"
                  >
                    {n.l}
                    <Arrow className="text-leaf-300" />
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="container flex items-center justify-between border-t border-white/10 py-6 text-sm text-white/70">
              <span className="num" dir="ltr">
                +974 4441 4022
              </span>
              <Link href={switchHref} hrefLang={other} className={cn("text-white", other === "ar" && "font-arabic")}>
                {t.switchLang}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
