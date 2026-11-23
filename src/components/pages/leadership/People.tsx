import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion";
import { CompanyLogo } from "@/components/site/CompanyLogo";
import { GridFill } from "@/components/site/GridFill";
import { Arrow } from "@/components/site/primitives";
import type { CompanyId } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { initials } from "./initials";

export type PersonView = { id: string; name: string; role: string; bio: string; photo: string | null };
export type CompanyLeadView = PersonView & { company: CompanyId; companyName: string; companyHref: string };

/** Short rich-text bios (admin HTML, sanitised on save). */
const BIO = "text-pretty text-[0.98rem] leading-[1.75] text-ink/70 [&>p+p]:mt-4 [&_a]:text-brand [&_a]:underline";

/**
 * Portrait in a 4:5 frame. Kept small on purpose: several source photos are low resolution (the Chairman's is
 * 212 × 220 px), so large frames would look soft. Initials on navy when there is no photo yet.
 */
export function Portrait({ name, photo, sizes, className }: { name: string; photo: string | null; sizes: string; className?: string }) {
  return (
    <div className={cn("relative aspect-[4/5] overflow-hidden rounded-[2px] bg-gradient-to-br from-navy via-ink to-ink-900", className)}>
      {photo ? (
        <Image src={photo} alt={name} fill sizes={sizes} className="object-cover object-top" />
      ) : (
        <span aria-hidden className="absolute inset-0 grid place-items-center font-display text-[1.5rem] tracking-[-0.04em] text-white/90">
          {initials(name)}
        </span>
      )}
    </div>
  );
}

/** Board of Directors: annual-report rows (portrait + name/role on one side, the bio on the other). */
export function BoardList({ people }: { people: PersonView[] }) {
  return (
    <ol className="mt-14 border-t border-ink/10">
      {people.map((p, i) => (
        <Reveal as="li" key={p.id} delay={(i % 3) * 0.05} className="border-b border-ink/10 py-9 lg:grid lg:grid-cols-12 lg:gap-12 lg:py-12">
          <div className="flex items-center gap-5 sm:gap-6 lg:col-span-5 lg:items-start lg:gap-8">
            <Portrait name={p.name} photo={p.photo} sizes="(min-width: 1024px) 144px, 112px" className="w-24 shrink-0 sm:w-28 lg:w-36" />
            <div className="min-w-0 lg:pt-1">
              <h3 className="font-display text-[1.3rem] leading-tight text-ink md:text-[1.5rem]">{p.name}</h3>
              <p className="mt-2 text-[0.95rem] leading-snug text-leaf-700">{p.role}</p>
            </div>
          </div>
          {p.bio && <div className={cn(BIO, "mt-6 lg:col-span-7 lg:mt-0 lg:pt-1")} dangerouslySetInnerHTML={{ __html: p.bio }} />}
        </Reveal>
      ))}
    </ol>
  );
}

/** Group executives: hairline grid of cards with a small portrait and the full bio. */
export function ExecutiveGrid({ people }: { people: PersonView[] }) {
  return (
    <ul className="mt-6 grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 md:grid-cols-3">
      {people.map((p, i) => (
        <Reveal as="li" key={p.id} delay={(i % 3) * 0.05} className="flex flex-col bg-white p-7 md:p-8">
          <div className="flex items-center gap-4">
            <Portrait name={p.name} photo={p.photo} sizes="80px" className="w-16 shrink-0 md:w-20" />
            <div className="min-w-0">
              <h3 className="font-display text-[1.2rem] leading-tight text-ink">{p.name}</h3>
              <p className="mt-1.5 text-[0.9rem] leading-snug text-leaf-700">{p.role}</p>
            </div>
          </div>
          {p.bio && <div className={cn(BIO, "mt-6 border-t border-ink/10 pt-6 text-[0.95rem]")} dangerouslySetInnerHTML={{ __html: p.bio }} />}
        </Reveal>
      ))}
      <GridFill count={people.length} cols={{ md: 3 }} as="li" className="bg-white" />
    </ul>
  );
}

/** Heads of the operating companies, identified by their company's logo rather than empty portrait frames. */
export function CompanyLeaders({ people, locale }: { people: CompanyLeadView[]; locale: Locale }) {
  const ar = locale === "ar";
  return (
    <ul className="mt-6 grid gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
      {people.map((p, i) => (
        <Reveal as="li" key={p.id} delay={(i % 4) * 0.05} className="flex flex-col bg-white">
          <div className="flex flex-1 flex-col p-6 md:p-7">
            <div className="flex h-14 items-center justify-between gap-4">
              <CompanyLogo id={p.company} locale={locale} size={46} decorative />
              {p.photo && <Portrait name={p.name} photo={p.photo} sizes="56px" className="w-11 shrink-0" />}
            </div>
            <h4 className="mt-7 font-display text-[1.2rem] leading-snug text-ink">{p.name}</h4>
            <p className="mt-1.5 text-[0.92rem] leading-snug text-leaf-700">{p.role}</p>
            {p.bio && <div className={cn(BIO, "mt-4 text-[0.9rem]")} dangerouslySetInnerHTML={{ __html: p.bio }} />}
          </div>
          <Link
            href={p.companyHref}
            className="group flex items-center justify-between gap-4 border-t border-ink/10 px-6 py-4 text-[0.88rem] leading-snug text-haze transition-colors hover:bg-pearl-50 hover:text-ink md:px-7"
          >
            <span>
              <span className="sr-only">{ar ? "عن " : "About "}</span>
              {p.companyName}
            </span>
            <Arrow className="text-leaf-700" />
          </Link>
        </Reveal>
      ))}
      <GridFill count={people.length} cols={{ sm: 2, lg: 4 }} as="li" className="bg-white" />
    </ul>
  );
}
