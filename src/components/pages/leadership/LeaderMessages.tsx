import type { Person } from "@prisma/client";
import Image from "next/image";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/site/primitives";
import { type Locale, pick } from "@/i18n/config";
import type { LeaderMessage } from "@/lib/settings";
import { cn } from "@/lib/utils";
import { initials } from "./initials";

export type LeaderMessageView = LeaderMessage & { person: Person | null };

/** First paragraph = lead (display font, larger); the rest reads like an article. */
const body =
  "prose-ah !text-[1.05rem] [&>p:first-child]:font-display [&>p:first-child]:text-[1.4rem] [&>p:first-child]:leading-[1.45] [&>p:first-child]:text-ink md:[&>p:first-child]:text-[1.6rem]";

function Portrait({ person, name, className, sizes }: { person: Person; name: string; className?: string; sizes: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-[2px] bg-gradient-to-br from-navy via-ink to-ink-900", className)}>
      {person.photo ? (
        <Image src={person.photo} alt={name} fill sizes={sizes} className="object-cover object-top" />
      ) : (
        <span className="absolute inset-0 grid place-items-center font-display text-[2.5rem] tracking-[-0.04em] text-white/90">{initials(name)}</span>
      )}
    </div>
  );
}

export function LeaderMessages({ locale, messages }: { locale: Locale; messages: LeaderMessageView[] }) {
  if (!messages.length) return null;
  const ar = locale === "ar";
  return (
    <section id="messages" className="scroll-mt-24 bg-white py-24 md:py-32">
      <div className="container">
        <SectionHeading
          eyebrow={ar ? "كلمات القيادة" : "Leadership messages"}
          title={ar ? "كلمة من قيادة المجموعة." : "A word from our leadership."}
        />
        <div className="mt-16 md:mt-20">
          {messages.map((m, i) => {
            const p = m.person;
            const name = p ? pick(p, "name", locale) : "";
            const role = p ? pick(p, "role", locale) : "";
            const title = pick(m, "title", locale);
            const html = pick(m, "body", locale);
            // Arabic page without an Arabic text yet: keep the English text readable (left to right).
            const fallbackLtr = ar && !m.bodyAr?.replace(/<[^>]+>/g, "").trim();
            return (
              <Reveal
                key={m.id}
                as="article"
                className={cn("grid gap-8 lg:grid-cols-12 lg:gap-12", i > 0 && "mt-20 border-t border-ink/10 pt-20 md:mt-24 md:pt-24")}
              >
                {p && (
                  <aside className="lg:col-span-3">
                    {/* Phone / tablet: compact byline */}
                    <div className="flex items-center gap-5 lg:hidden">
                      <Portrait person={p} name={name} sizes="96px" className="aspect-[4/5] w-24 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-display text-[1.25rem] leading-tight text-ink">{name}</p>
                        <p className="mt-1 text-[0.92rem] text-haze">{role}</p>
                      </div>
                    </div>
                    {/* Desktop: portrait column that stays in view while reading */}
                    <div className="hidden lg:sticky lg:top-28 lg:block">
                      <Portrait person={p} name={name} sizes="(min-width: 1440px) 300px, 22vw" className="aspect-[4/5] w-full" />
                      <p className="mt-6 font-display text-[1.3rem] leading-tight text-ink">{name}</p>
                      <p className="mt-1.5 text-[0.95rem] text-haze">{role}</p>
                    </div>
                  </aside>
                )}
                <div className={cn(p ? "lg:col-span-8 lg:col-start-5" : "lg:col-span-9")}>
                  <h3 className="font-display text-display-md font-normal text-ink">{title}</h3>
                  <div className="mt-6 h-px w-16 bg-leaf" aria-hidden />
                  <div dir={fallbackLtr ? "ltr" : undefined} className={cn(body, "mt-8")} dangerouslySetInnerHTML={{ __html: html }} />
                  {p && (
                    <p className="mt-10 border-t border-ink/10 pt-6 text-[0.95rem] text-haze">
                      <span className="font-display text-[1.1rem] text-ink">{name}</span>
                      <span className="mx-2 text-ink/25" aria-hidden>
                        ·
                      </span>
                      {role}
                    </p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
