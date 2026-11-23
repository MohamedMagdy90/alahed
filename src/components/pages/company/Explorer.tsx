"use client";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export type ExplorerGroup = { id: string; title: string; body?: string; items?: string[] };

function Detail({ g, accent, run }: { g: ExplorerGroup; accent: string; run: number }) {
  return (
    <div key={run}>
      {g.body && <p className="text-pretty text-[1.05rem] leading-relaxed text-ink/80">{g.body}</p>}
      {g.items && (
        <ul className={cn("grid gap-x-10 sm:grid-cols-2", g.body && "mt-6")}>
          {g.items.map((x, j) => (
            <li
              key={x}
              className={cn("flex gap-3 border-t border-ink/10 py-3.5 text-[0.98rem] leading-snug text-ink/85", run > 0 && "animate-in fade-in-0 slide-in-from-bottom-1 fill-mode-both duration-500")}
              style={run > 0 ? { animationDelay: `${Math.min(j, 10) * 35}ms` } : undefined}
            >
              <span aria-hidden className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
              {x}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Grouped services: group names as a large index on the start side; the selected group's scope opens beside it on
 * desktop and directly underneath on phones (one group open at a time).
 */
export function Explorer({ groups, accent }: { groups: ExplorerGroup[]; accent: string }) {
  const [active, setActive] = useState(0);
  const [run, setRun] = useState(0);
  const uid = useId();
  const select = (i: number) => {
    if (i === active) return;
    setActive(i);
    setRun((r) => r + 1);
  };
  const cur = groups[active];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <ul className="border-t border-ink/10 lg:col-span-5">
        {groups.map((g, i) => {
          const on = i === active;
          return (
            <li key={g.id} className="relative border-b border-ink/10">
              <span
                aria-hidden
                className="absolute -bottom-px start-0 h-[2px] w-full origin-left transition-transform duration-700 ease-out-expo rtl:origin-right"
                style={{ background: accent, transform: on ? "scaleX(1)" : "scaleX(0)" }}
              />
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`${uid}-m-${g.id}`}
                onClick={() => select(i)}
                className="group flex w-full items-baseline justify-between gap-6 py-5 text-start md:py-6"
              >
                <span
                  className={cn(
                    "font-display text-[1.4rem] leading-snug transition-[color,transform] duration-500 ease-out-expo md:text-[1.75rem]",
                    on ? "text-ink lg:translate-x-1.5 rtl:lg:-translate-x-1.5" : "text-ink/35 group-hover:text-ink/70",
                  )}
                >
                  {g.title}
                </span>
                {g.items && <span className={cn("num shrink-0 text-[0.9rem] transition-colors", on ? "text-ink" : "text-haze-300")}>{g.items.length}</span>}
              </button>
              {/* Phones and tablets: the scope opens under its title. */}
              <div id={`${uid}-m-${g.id}`} className="grid transition-[grid-template-rows] duration-500 ease-out-expo lg:hidden" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
                <div className="overflow-hidden">
                  <div className="pb-8">
                    <Detail g={g} accent={accent} run={on ? run : 0} />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Desktop: the scope of the selected group, beside the index. */}
      <div className="hidden lg:col-span-7 lg:block">
        <div className="sticky top-28 border-s border-ink/10 ps-12 xl:ps-16">
          <div key={active} className={cn("flex items-baseline justify-between gap-6", run > 0 && "animate-in fade-in-0 duration-500")}>
            <h3 className="text-balance font-display text-display-md font-normal text-ink">{cur.title}</h3>
            <span dir="ltr" className="num shrink-0 text-[0.9rem] text-haze">
              {String(active + 1).padStart(2, "0")} <span className="text-haze-300">/ {String(groups.length).padStart(2, "0")}</span>
            </span>
          </div>
          <div className="mt-8">
            <Detail g={cur} accent={accent} run={run} />
          </div>
        </div>
      </div>
    </div>
  );
}
