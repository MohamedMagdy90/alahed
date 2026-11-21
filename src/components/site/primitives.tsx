import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Directional arrow that mirrors in RTL and nudges on group hover. */
export function Arrow({ className, external = false }: { className?: string; external?: boolean }) {
  if (external)
    return (
      <ArrowUpRight
        aria-hidden
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5",
          className,
        )}
      />
    );
  return (
    <ArrowRight
      aria-hidden
      className={cn(
        "h-4 w-4 shrink-0 transition-transform duration-500 ease-out-expo group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1",
        className,
      )}
    />
  );
}

type Tone = "light" | "dark";

export function Eyebrow({ children, tone = "light", className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", tone === "light" ? "text-leaf-700" : "text-leaf-300", className)}>
      <span aria-hidden className="h-px w-7 bg-current" />
      <span>{children}</span>
    </p>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  tone = "light",
  className,
  action,
}: {
  index?: string;
  eyebrow: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  tone?: Tone;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div className={cn("grid gap-8 lg:grid-cols-12 lg:items-end", className)}>
      <div className="lg:col-span-7">
        <div className="mb-6 flex items-center gap-4">
          {index && (
            <span className={cn("num font-mono text-xs", tone === "light" ? "text-haze" : "text-haze-300")}>{index}</span>
          )}
          <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        </div>
        <h2
          className={cn(
            "text-balance font-display text-display-lg font-normal",
            tone === "light" ? "text-ink" : "text-white",
          )}
        >
          {title}
        </h2>
      </div>
      {(intro || action) && (
        <div className="flex flex-col gap-6 lg:col-span-5 lg:items-start lg:ps-8">
          {intro && (
            <p className={cn("text-pretty text-[1.05rem] leading-relaxed", tone === "light" ? "text-haze" : "text-haze-300")}>
              {intro}
            </p>
          )}
          {action}
        </div>
      )}
    </div>
  );
}

/** Accent word inside display headings (serif italic in EN, bold Arabic in AR). */
export function Em({ children, className }: { children: ReactNode; className?: string }) {
  return <em className={cn("font-serif not-italic [font-style:italic] font-normal", className)}>{children}</em>;
}

type BtnVariant = "primary" | "dark" | "outline-light" | "outline-dark" | "white";

const btnBase =
  "group relative inline-flex h-12 items-stretch overflow-hidden rounded-[2px] text-[0.92rem] font-medium tracking-[-0.005em] transition-colors duration-300 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50";

const btnVariants: Record<BtnVariant, { root: string; divider: string }> = {
  primary: { root: "bg-leaf text-ink-900 hover:bg-[#6cc951]", divider: "border-ink-900/15" },
  dark: { root: "bg-ink text-white hover:bg-navy", divider: "border-white/15" },
  white: { root: "bg-white text-ink hover:bg-pearl-100", divider: "border-ink/10" },
  "outline-light": {
    root: "border border-white/25 text-white hover:border-white hover:bg-white hover:text-ink",
    divider: "border-white/20 group-hover:border-ink/10",
  },
  "outline-dark": {
    root: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-white",
    divider: "border-ink/15 group-hover:border-white/15",
  },
};

export function btnClass(variant: BtnVariant = "primary", className?: string) {
  return cn(btnBase, btnVariants[variant].root, className);
}

function BtnInner({ children, variant, external }: { children: ReactNode; variant: BtnVariant; external?: boolean }) {
  return (
    <>
      <span className="flex items-center px-5">{children}</span>
      <span className={cn("grid w-12 place-items-center border-s transition-colors", btnVariants[variant].divider)}>
        <Arrow external={external} />
      </span>
    </>
  );
}

export function Btn({
  href,
  children,
  variant = "primary",
  className,
  external,
  ...rest
}: { href: string; children: ReactNode; variant?: BtnVariant; className?: string; external?: boolean } & Omit<
  ComponentProps<typeof Link>,
  "href" | "className" | "children"
>) {
  return (
    <Link
      href={href}
      className={btnClass(variant, className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      <BtnInner variant={variant} external={external}>
        {children}
      </BtnInner>
    </Link>
  );
}

export function SubmitBtn({
  children,
  variant = "primary",
  className,
  disabled,
}: {
  children: ReactNode;
  variant?: BtnVariant;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button type="submit" disabled={disabled} className={btnClass(variant, className)}>
      <BtnInner variant={variant}>{children}</BtnInner>
    </button>
  );
}

/** Text link with animated underline + arrow. */
export function TextLink({
  href,
  children,
  className,
  tone = "light",
  external,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  tone?: Tone;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group inline-flex items-center gap-2 text-[0.92rem] font-medium",
        tone === "light" ? "text-ink" : "text-white",
        className,
      )}
    >
      <span className="link-underline pb-0.5">{children}</span>
      <Arrow external={external} className={tone === "light" ? "text-leaf-700" : "text-leaf-300"} />
    </Link>
  );
}

/** Small mono tag / chip */
export function Tag({ children, className, tone = "light" }: { children: ReactNode; className?: string; tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-[2px] border px-2.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] rtl:font-arabic rtl:text-[0.75rem] rtl:tracking-normal",
        tone === "light" ? "border-ink/10 bg-white text-ink/70" : "border-white/15 bg-white/5 text-white/80",
        className,
      )}
    >
      {children}
    </span>
  );
}
