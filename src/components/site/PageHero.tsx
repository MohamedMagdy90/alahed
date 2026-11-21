import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { LineReveal, Reveal } from "@/components/motion";
import type { Locale } from "@/i18n/config";
import { getDict, href } from "@/i18n/dictionary";
import { cn } from "@/lib/utils";
import { ArcsMark } from "./OrbitArcs";

export type Crumb = { label: string; href?: string };

/**
 * Dark inner-page hero. Header overlays it transparently.
 * - `title` may be a string or ReactNode (use <Em> for accent words).
 * - `aside` renders in the end column (e.g. key facts, a logo card).
 */
export function PageHero({
  locale,
  eyebrow,
  title,
  intro,
  image,
  crumbs = [],
  aside,
  size = "md",
  children,
}: {
  locale: Locale;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  image?: string;
  crumbs?: Crumb[];
  aside?: ReactNode;
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
}) {
  const t = getDict(locale);
  return (
    <section
      className={cn(
        "grain relative isolate flex flex-col justify-end overflow-hidden bg-ink-900 text-white",
        size === "lg" ? "min-h-[88svh]" : size === "md" ? "min-h-[72svh]" : "min-h-[56svh]",
      )}
    >
      {image && (
        <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 animate-kenburns object-cover opacity-55" />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900 via-ink-900/75 to-ink-900/30" />
      <div className="absolute inset-0 -z-10 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-ink-900/90 via-ink-900/40 to-transparent" />
      <div className="grid-lines absolute inset-0 -z-10" />
      <ArcsMark className="pointer-events-none absolute -end-24 top-24 -z-10 h-[520px] w-[520px] opacity-[0.12] md:-end-10" />

      <div className="container relative pb-16 pt-44 md:pb-20">
        <Reveal>
          <nav aria-label="Breadcrumb" className="mb-10 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/50 rtl:font-arabic rtl:text-[0.8rem] rtl:normal-case rtl:tracking-normal">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href={href(locale)} className="hover:text-white">
                  {t.home}
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.label} className="flex items-center gap-2">
                  <span className="text-white/25">/</span>
                  {c.href ? (
                    <Link href={c.href} className="hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-white/80" aria-current="page">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className={aside ? "lg:col-span-8" : "lg:col-span-10"}>
            <Reveal delay={0.05}>
              <p className="eyebrow mb-6 flex items-center gap-3 text-leaf-300">
                <span aria-hidden className="h-px w-7 bg-current" />
                {eyebrow}
              </p>
            </Reveal>
            <h1 className="text-balance font-display text-display-xl font-normal">
              <LineReveal delay={0.1}>{title}</LineReveal>
            </h1>
            {intro && (
              <Reveal delay={0.25}>
                <p className="mt-8 max-w-2xl text-pretty text-[1.1rem] leading-relaxed text-white/70">{intro}</p>
              </Reveal>
            )}
            {children && <Reveal delay={0.35}>{children}</Reveal>}
          </div>
          {aside && (
            <Reveal delay={0.3} className="lg:col-span-4">
              {aside}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
