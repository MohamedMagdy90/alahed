"use client";

import {
  BriefcaseBusiness,
  ExternalLink,
  FileText,
  Inbox,
  LayoutGrid,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Settings2,
  ShieldCheck,
  UserCog,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import { getAdminDict } from "@/i18n/admin";
import { logout } from "@/lib/admin/auth";
import { cn } from "@/lib/utils";
import { Logo } from "../site/Logo";
import { monoLabel } from "./ui";

type NavItem = { href: string; label: string; icon: typeof LayoutGrid; badge?: number; exact?: boolean };

export function AdminShell({
  locale,
  user,
  unread,
  children,
}: {
  locale: Locale;
  user: { name: string; email: string; role: "admin" | "editor" };
  unread: number;
  children: ReactNode;
}) {
  const d = getAdminDict(locale);
  const pathname = usePathname() || "";
  const [open, setOpen] = useState(false);
  const base = `/${locale}/admin`;

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const groups: { label: string; items: NavItem[] }[] = [
    {
      label: d.groups.content,
      items: [
        { href: base, label: d.nav.dashboard, icon: LayoutGrid, exact: true },
        { href: `${base}/posts`, label: d.nav.posts, icon: Newspaper },
        { href: `${base}/people`, label: d.nav.people, icon: UsersRound },
        { href: `${base}/jobs`, label: d.nav.jobs, icon: BriefcaseBusiness },
        { href: `${base}/documents`, label: d.nav.documents, icon: FileText },
      ],
    },
    {
      label: d.groups.engagement,
      items: [
        { href: `${base}/inbox`, label: d.nav.inbox, icon: Inbox, badge: unread },
        { href: `${base}/subscribers`, label: d.nav.subscribers, icon: Mail },
      ],
    },
    ...(user.role === "admin"
      ? [
          {
            label: d.groups.admin,
            items: [
              { href: `${base}/settings`, label: d.nav.settings, icon: Settings2 },
              { href: `${base}/users`, label: d.nav.users, icon: ShieldCheck },
            ],
          },
        ]
      : []),
  ];

  const isActive = (i: NavItem) => (i.exact ? pathname === i.href : pathname === i.href || pathname.startsWith(`${i.href}/`));
  const other: Locale = locale === "ar" ? "en" : "ar";
  const switchHref = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`) || `/${other}/admin`;
  const initials = user.name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const signOut = async () => {
    await logout();
    window.location.assign(`${base}/login`);
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/[0.07] px-6">
        <Link href={base} aria-label={d.nav.dashboard}>
          <Logo variant="white" className="w-[138px] md:w-[138px]" />
        </Link>
        <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center text-white/60 hover:text-white lg:hidden" aria-label={d.close}>
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6">
        {groups.map((g) => (
          <div key={g.label} className="mb-7">
            <p className={cn(monoLabel, "mb-2 px-3 text-white/30")}>{g.label}</p>
            <ul className="space-y-0.5">
              {g.items.map((i) => {
                const active = isActive(i);
                return (
                  <li key={i.href}>
                    <Link
                      href={i.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex h-10 items-center gap-3 rounded-[2px] px-3 text-[0.875rem] transition-colors",
                        active ? "bg-white/[0.07] text-white" : "text-white/55 hover:bg-white/[0.04] hover:text-white",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute inset-y-2 start-0 w-[2px] rounded-full bg-leaf transition-all duration-300",
                          active ? "opacity-100" : "opacity-0",
                        )}
                        aria-hidden
                      />
                      <i.icon className={cn("h-[17px] w-[17px] shrink-0", active ? "text-leaf-300" : "text-white/40 group-hover:text-white/70")} strokeWidth={1.6} />
                      <span className="flex-1 truncate">{i.label}</span>
                      {!!i.badge && (
                        <span className="num grid h-5 min-w-5 place-items-center rounded-full bg-leaf px-1.5 text-[0.68rem] font-semibold text-ink-900">
                          {i.badge > 99 ? "99+" : i.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/[0.07] p-3">
        <Link
          href={`${base}/account`}
          className={cn(
            "flex items-center gap-3 rounded-[2px] p-2.5 transition-colors hover:bg-white/[0.05]",
            pathname.startsWith(`${base}/account`) && "bg-white/[0.07]",
          )}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-navy font-mono text-[0.72rem] text-white ring-1 ring-white/15">
            {initials || "A"}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.85rem] text-white">{user.name}</span>
            <span className="block truncate text-[0.72rem] text-white/40">{user.role === "admin" ? d.admin : d.editor}</span>
          </span>
          <UserCog className="h-4 w-4 text-white/35" strokeWidth={1.6} />
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="mt-1 flex h-9 w-full items-center gap-3 rounded-[2px] px-3 text-[0.82rem] text-white/45 transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <LogOut className="h-4 w-4 rtl:-scale-x-100" strokeWidth={1.6} />
          {d.logout}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:ps-[264px]">
      {/* Desktop sidebar */}
      <aside className="grain fixed inset-y-0 start-0 z-40 hidden w-[264px] bg-ink-900 lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-[visibility] duration-500 lg:hidden",
          open ? "pointer-events-auto visible" : "pointer-events-none invisible",
        )}
        aria-hidden={!open}
      >
        <div
          className={cn("absolute inset-0 bg-ink-900/60 backdrop-blur-[2px] transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            "grain absolute inset-y-0 start-0 w-[min(300px,86vw)] bg-ink-900 shadow-2xl transition-transform duration-500 ease-out-expo",
            open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full",
          )}
        >
          {sidebar}
        </aside>
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-30 flex h-[60px] items-center gap-3 border-b border-ink/10 bg-pearl-50/85 px-4 backdrop-blur-md md:px-8">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="-ms-1 grid h-9 w-9 place-items-center rounded-[2px] text-ink hover:bg-ink/5 lg:hidden"
          aria-label={d.menu}
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className={cn(monoLabel, "hidden items-center gap-2 sm:flex")}>
          <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden />
          {d.cms}
        </span>
        <div className="ms-auto flex items-center gap-1">
          <Link
            href={switchHref}
            lang={other}
            className={cn(
              "flex h-9 items-center rounded-[2px] border border-ink/10 bg-white px-3 text-[0.8rem] text-ink transition-colors hover:border-ink/30",
              other === "ar" ? "font-arabic" : "font-sans",
            )}
          >
            {other === "ar" ? "العربية" : "English"}
          </Link>
          <a
            href={`/${locale}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-9 items-center gap-2 rounded-[2px] px-3 text-[0.8rem] text-haze transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <span className="hidden sm:inline">{d.viewSite}</span>
            <ExternalLink className="h-3.5 w-3.5 rtl:-scale-x-100" />
          </a>
        </div>
      </header>

      <main className="px-4 pb-20 pt-8 md:px-8 md:pt-10 xl:px-12">
        <div className="mx-auto max-w-[1280px]">{children}</div>
      </main>
    </div>
  );
}
