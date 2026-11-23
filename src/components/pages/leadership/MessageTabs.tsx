"use client";

import Image from "next/image";
import { type KeyboardEvent, useId, useRef, useState } from "react";
import { Arrow } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
import { initials } from "./initials";

export type MessageView = {
  id: string;
  title: string;
  html: string;
  /** Arabic page showing the English text (no Arabic version yet). */
  ltr: boolean;
  name: string;
  role: string;
  photo: string | null;
};

/** First paragraph = lead (display font, larger); the rest reads like an article. */
const BODY =
  "prose-ah !text-[1.05rem] [&>p:first-child]:font-display [&>p:first-child]:text-[1.35rem] [&>p:first-child]:leading-[1.45] [&>p:first-child]:text-ink md:[&>p:first-child]:text-[1.55rem]";

function Thumb({ name, photo, className }: { name: string; photo: string | null; className?: string }) {
  return (
    <span className={cn("relative block aspect-[4/5] shrink-0 overflow-hidden rounded-[2px] bg-gradient-to-br from-navy via-ink to-ink-900", className)}>
      {photo ? (
        <Image src={photo} alt="" fill sizes="72px" className="object-cover object-top" />
      ) : (
        <span aria-hidden className="absolute inset-0 grid place-items-center font-display text-[1rem] text-white/90">
          {initials(name)}
        </span>
      )}
    </span>
  );
}

function Message({ m, next, onNext, ar }: { m: MessageView; next?: MessageView; onNext?: () => void; ar: boolean }) {
  return (
    <>
      <h3 className="font-display text-display-md font-normal text-ink">{m.title}</h3>
      <div className="mt-6 h-px w-16 bg-leaf" aria-hidden />
      <div dir={m.ltr ? "ltr" : undefined} className={cn(BODY, "mt-8")} dangerouslySetInnerHTML={{ __html: m.html }} />
      {m.name && (
        <div className="mt-12 flex items-center gap-4 border-t border-ink/10 pt-6">
          <Thumb name={m.name} photo={m.photo} className="w-12" />
          <p className="text-[0.95rem] leading-snug text-haze">
            <span className="block font-display text-[1.1rem] text-ink">{m.name}</span>
            {m.role}
          </p>
        </div>
      )}
      {next && onNext && (
        <button
          type="button"
          onClick={onNext}
          className="group mt-10 flex w-full items-center justify-between gap-6 rounded-[2px] bg-pearl-50 px-6 py-5 text-start transition-colors hover:bg-pearl-100"
        >
          <span>
            <span className="block text-[0.82rem] text-haze">{ar ? "الكلمة التالية" : "Next message"}</span>
            <span className="mt-1 block font-display text-[1.15rem] leading-snug text-ink">{next.title}</span>
          </span>
          <Arrow className="text-leaf-700" />
        </button>
      )}
    </>
  );
}

export function MessageTabs({ messages, ar }: { messages: MessageView[]; ar: boolean }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);

  if (messages.length === 1) {
    return (
      <article className="max-w-3xl">
        <Message m={messages[0]} ar={ar} />
      </article>
    );
  }

  const select = (i: number, focus = false) => {
    setActive(i);
    if (focus) tabs.current[i]?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = messages.length;
    // Vertical list on desktop, horizontal on phones: accept both axes; Left/Right follow the reading direction.
    const fwd = ar ? "ArrowLeft" : "ArrowRight";
    const back = ar ? "ArrowRight" : "ArrowLeft";
    let to = -1;
    if (e.key === "ArrowDown" || e.key === fwd) to = (active + 1) % n;
    else if (e.key === "ArrowUp" || e.key === back) to = (active - 1 + n) % n;
    else if (e.key === "Home") to = 0;
    else if (e.key === "End") to = n - 1;
    if (to < 0) return;
    e.preventDefault();
    select(to, true);
  };
  const goNext = (i: number) => {
    select(i);
    // Bring the start of the next message (and its tabs) into view.
    requestAnimationFrame(() => root.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <div ref={root} className="scroll-mt-28 lg:grid lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-4">
        <div
          role="tablist"
          aria-label={ar ? "كلمات القيادة" : "Leadership messages"}
          onKeyDown={onKey}
          className="grid gap-2 sm:grid-cols-2 lg:sticky lg:top-28 lg:grid-cols-1 lg:gap-0 lg:border-t lg:border-ink/10"
        >
          {messages.map((m, i) => {
            const on = i === active;
            return (
              <button
                key={m.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${base}-tab-${i}`}
                aria-selected={on}
                aria-controls={`${base}-panel-${i}`}
                tabIndex={on ? 0 : -1}
                onClick={() => select(i)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-[2px] border p-3 text-start transition-colors duration-300 sm:gap-4",
                  "lg:rounded-none lg:border-0 lg:border-b lg:border-ink/10 lg:px-0 lg:py-5",
                  on ? "border-ink/20 bg-pearl-50 lg:bg-transparent" : "border-ink/10 hover:bg-pearl-50/70 lg:hover:bg-transparent",
                )}
              >
                {/* Active marker on desktop: a leaf rule on the start edge */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute start-0 inset-y-5 hidden w-[2px] origin-top bg-leaf transition-transform duration-500 ease-out-expo lg:block",
                    on ? "scale-y-100" : "scale-y-0",
                  )}
                />
                <Thumb
                  name={m.name || m.title}
                  photo={m.photo}
                  className={cn("w-11 transition-[filter,opacity] duration-500 sm:w-12 lg:ms-5 lg:w-16", !on && "opacity-70 grayscale")}
                />
                <span className="min-w-0">
                  <span className={cn("block text-[0.8rem] leading-snug", on ? "text-leaf-700" : "text-haze")}>{m.title}</span>
                  <span className={cn("mt-1 block font-display text-[1.02rem] leading-snug transition-colors sm:text-[1.05rem] lg:text-[1.15rem]", on ? "text-ink" : "text-ink/60 group-hover:text-ink")}>
                    {m.name || m.title}
                  </span>
                  <span className="mt-0.5 line-clamp-2 hidden text-[0.88rem] leading-snug text-haze lg:block">{m.role}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-12 lg:col-span-8 lg:mt-0">
        {messages.map((m, i) => (
          <article
            key={m.id}
            role="tabpanel"
            id={`${base}-panel-${i}`}
            aria-labelledby={`${base}-tab-${i}`}
            hidden={i !== active}
            className="animate-in fade-in-0 duration-500"
          >
            <Message m={m} ar={ar} next={messages[i + 1]} onNext={() => goNext(i + 1)} />
          </article>
        ))}
      </div>
    </div>
  );
}
