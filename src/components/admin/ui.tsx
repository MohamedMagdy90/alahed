import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ───────────── Tokens ───────────── */

export type ABtnVariant = "primary" | "accent" | "outline" | "ghost" | "danger";

const btnBase =
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[2px] text-[0.85rem] font-medium transition-[background-color,border-color,color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf/50 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-4 [&_svg]:shrink-0";
const btnVariants: Record<ABtnVariant, string> = {
  primary: "bg-ink text-white hover:bg-navy shadow-[0_1px_0_rgba(255,255,255,0.08)_inset]",
  accent: "bg-leaf text-ink-900 hover:bg-[#6cc951]",
  outline: "border border-ink/15 bg-white text-ink hover:border-ink/35 hover:bg-pearl-50",
  ghost: "text-ink/70 hover:bg-ink/5 hover:text-ink",
  danger: "border border-red-200 bg-white text-red-700 hover:border-red-300 hover:bg-red-50",
};
const btnSizes = { md: "h-10 px-4", sm: "h-8 px-3 text-[0.8rem]", icon: "h-9 w-9", iconSm: "h-8 w-8" } as const;
export type ABtnSize = keyof typeof btnSizes;

export function aBtn(variant: ABtnVariant = "primary", size: ABtnSize = "md", className?: string) {
  return cn(btnBase, btnVariants[variant], btnSizes[size], className);
}

export const aInput =
  "h-10 w-full rounded-[2px] border border-ink/15 bg-white px-3 text-[0.9rem] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-haze-300 focus:border-leaf focus:ring-[3px] focus:ring-leaf/15 disabled:bg-pearl-50 disabled:text-haze aria-[invalid=true]:border-red-400";
export const aTextarea = cn(aInput, "h-auto min-h-[96px] resize-y py-2.5 leading-relaxed");
/** Native select styled like the inputs (works in server and client components). */
export function SelectBox({ className, children, ...rest }: ComponentProps<"select">) {
  return (
    <div className={cn("relative", className)}>
      <select className={cn(aInput, "cursor-pointer appearance-none pe-9")} {...rest}>
        {children}
      </select>
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="pointer-events-none absolute end-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-haze"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}
export const monoLabel =
  "font-mono text-[0.66rem] uppercase tracking-[0.16em] text-haze rtl:font-arabic rtl:text-[0.75rem] rtl:normal-case rtl:tracking-normal";

/* ───────────── Layout pieces ───────────── */

export function ALink({
  variant = "outline",
  size = "md",
  className,
  ...rest
}: ComponentProps<typeof Link> & { variant?: ABtnVariant; size?: ABtnSize }) {
  return <Link className={aBtn(variant, size, className)} {...rest} />;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  back,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="mb-8 flex flex-col gap-5 border-b border-ink/10 pb-7 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {back && (
          <Link
            href={back.href}
            className="mb-4 inline-flex items-center gap-1.5 text-[0.8rem] text-haze transition-colors hover:text-ink"
          >
            <span aria-hidden className="rtl:rotate-180">
              ←
            </span>
            {back.label}
          </Link>
        )}
        {eyebrow && <p className={cn(monoLabel, "mb-2.5 flex items-center gap-2")}>
          <span className="h-px w-5 bg-leaf" aria-hidden />
          {eyebrow}
        </p>}
        <h1 className="font-display text-[1.9rem] font-normal leading-[1.1] tracking-[-0.01em] text-ink md:text-[2.2rem]">
          {title}
        </h1>
        {description && <p className="mt-2.5 max-w-2xl text-[0.92rem] leading-relaxed text-haze">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Card({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("rounded-[2px] border border-ink/10 bg-white", className)}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4 border-b border-ink/[0.07] px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="font-display text-[1.05rem] font-medium text-ink">{title}</h2>}
            {description && <p className="mt-0.5 text-[0.8rem] leading-relaxed text-haze">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

type BadgeTone = "neutral" | "green" | "amber" | "blue" | "red" | "dark";
const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-pearl-100 text-ink/70 ring-ink/10",
  green: "bg-leaf-50 text-leaf-700 ring-leaf/25",
  amber: "bg-amber-50 text-amber-800 ring-amber-300/50",
  blue: "bg-brand-50 text-brand-700 ring-brand/20",
  red: "bg-red-50 text-red-700 ring-red-200",
  dark: "bg-ink text-white ring-ink",
};

export function Badge({ children, tone = "neutral", dot, className }: { children: ReactNode; tone?: BadgeTone; dot?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[0.72rem] font-medium ring-1 ring-inset",
        badgeTones[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <svg viewBox="0 0 48 48" className="mb-5 h-12 w-12 text-ink/15" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
        <path d="M6 40a18 18 0 0 1 36 0" />
        <path d="M12 40a12 12 0 0 1 24 0" />
        <path d="M18 40a6 6 0 0 1 12 0" className="text-leaf" stroke="currentColor" />
      </svg>
      <p className="font-display text-[1.1rem] text-ink">{title}</p>
      {body && <p className="mt-1.5 max-w-sm text-[0.85rem] leading-relaxed text-haze">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/** Table shell with hairline rows. Use with <thead> / <tbody> children. */
export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[640px] border-collapse text-start text-[0.875rem] [&_td]:border-b [&_td]:border-ink/[0.07] [&_td]:px-5 [&_td]:py-3.5 [&_td]:align-middle [&_th]:border-b [&_th]:border-ink/10 [&_th]:bg-pearl-50/70 [&_th]:px-5 [&_th]:py-2.5 [&_th]:text-start [&_th]:font-mono [&_th]:text-[0.65rem] [&_th]:font-normal [&_th]:uppercase [&_th]:tracking-[0.14em] [&_th]:text-haze rtl:[&_th]:font-arabic rtl:[&_th]:text-[0.75rem] rtl:[&_th]:normal-case rtl:[&_th]:tracking-normal [&_tr:last-child_td]:border-b-0 [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-pearl-50/60">
        {children}
      </table>
    </div>
  );
}

export function Pager({
  page,
  pages,
  hrefFor,
  labels,
}: {
  page: number;
  pages: number;
  hrefFor: (p: number) => string;
  labels: { prev: string; next: string; page: string; of: string };
}) {
  if (pages <= 1) return null;
  return (
    <nav className="flex items-center justify-between gap-4 border-t border-ink/[0.07] px-5 py-3 text-[0.8rem] text-haze">
      <span className="num">
        {labels.page} {page} {labels.of} {pages}
      </span>
      <div className="flex gap-2">
        {page > 1 ? (
          <ALink href={hrefFor(page - 1)} size="sm">
            {labels.prev}
          </ALink>
        ) : (
          <span className={aBtn("outline", "sm", "pointer-events-none opacity-40")}>{labels.prev}</span>
        )}
        {page < pages ? (
          <ALink href={hrefFor(page + 1)} size="sm">
            {labels.next}
          </ALink>
        ) : (
          <span className={aBtn("outline", "sm", "pointer-events-none opacity-40")}>{labels.next}</span>
        )}
      </div>
    </nav>
  );
}

/** Pill filter link (server-side query param filters). */
export function FilterChip({ href, active, children, count }: { href: string; active: boolean; children: ReactNode; count?: number }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-full border px-3.5 text-[0.8rem] transition-colors",
        active ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-ink/75 hover:border-ink/35 hover:text-ink",
      )}
    >
      {children}
      {typeof count === "number" && (
        <span className={cn("num text-[0.72rem]", active ? "text-white/60" : "text-haze")}>{count}</span>
      )}
    </Link>
  );
}
