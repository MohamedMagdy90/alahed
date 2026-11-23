"use client";
import { type KeyboardEvent, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type RegisterBrand = { maker?: string; name: string; origin?: string; lines: string };
export type RegisterDivision = { id: string; title: string; brands: RegisterBrand[] };

/**
 * Brand register: divisions on the start side (a sticky index on desktop, a chip row on phones), the brands of the
 * selected division as ruled rows. Every panel is server-rendered into the markup; only the selection is client state.
 */
export function Register({ divisions, accent, label, note }: { divisions: RegisterDivision[]; accent: string; label: string; note?: string }) {
  const [active, setActive] = useState(0);
  const [run, setRun] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();

  const select = (i: number) => {
    if (i === active) return;
    setActive(i);
    setRun((r) => r + 1);
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const rtl = document.documentElement.dir === "rtl";
    const fwd = ["ArrowDown", rtl ? "ArrowLeft" : "ArrowRight"];
    const back = ["ArrowUp", rtl ? "ArrowRight" : "ArrowLeft"];
    let i = active;
    if (fwd.includes(e.key)) i = (active + 1) % divisions.length;
    else if (back.includes(e.key)) i = (active - 1 + divisions.length) % divisions.length;
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = divisions.length - 1;
    else return;
    e.preventDefault();
    select(i);
    refs.current[i]?.focus();
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <div
            role="tablist"
            aria-label={label}
            aria-orientation="vertical"
            onKeyDown={onKey}
            className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:-mx-8 md:px-8 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-ink/10 lg:px-0"
          >
            {divisions.map((d, i) => {
              const on = i === active;
              return (
                <button
                  key={d.id}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${uid}-t-${d.id}`}
                  aria-selected={on}
                  aria-controls={`${uid}-p-${d.id}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  className={cn(
                    "group relative flex shrink-0 items-baseline justify-between gap-5 whitespace-nowrap rounded-full border px-4 py-2 text-start transition-colors duration-300",
                    "lg:whitespace-normal lg:rounded-none lg:border-0 lg:border-b lg:border-ink/10 lg:px-0 lg:py-5",
                    on ? "border-ink bg-ink text-white lg:bg-transparent lg:text-ink" : "border-ink/15 text-haze hover:text-ink",
                  )}
                >
                  <span
                    aria-hidden
                    className="absolute -bottom-px start-0 hidden h-[2px] w-full origin-left transition-transform duration-700 ease-out-expo rtl:origin-right lg:block"
                    style={{ background: accent, transform: on ? "scaleX(1)" : "scaleX(0)" }}
                  />
                  <span className="font-display text-[0.95rem] lg:text-[1.3rem] lg:leading-snug">{d.title}</span>
                  <span className={cn("num font-display text-[0.85rem] lg:text-[1.3rem]", on ? "opacity-80 lg:opacity-100" : "opacity-60")}>{d.brands.length}</span>
                </button>
              );
            })}
          </div>
          {note && <p className="mt-6 hidden max-w-xs text-pretty text-[0.9rem] leading-relaxed text-haze lg:block">{note}</p>}
        </div>
      </div>

      <div className="lg:col-span-8">
        {divisions.map((d, i) => {
          const on = i === active;
          return (
            <div key={d.id} role="tabpanel" id={`${uid}-p-${d.id}`} aria-labelledby={`${uid}-t-${d.id}`} hidden={!on}>
              {/* Re-keyed on every change of division, so the rows of the new panel arrive one after another. */}
              <ul key={on ? run : 0} className="border-t border-ink/10">
                {d.brands.map((b, j) => (
                  <li
                    key={b.name}
                    className={cn(
                      "group relative grid gap-3 border-b border-ink/10 py-7 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-10",
                      run > 0 && "animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both duration-700",
                    )}
                    style={run > 0 ? { animationDelay: `${Math.min(j, 8) * 45}ms` } : undefined}
                  >
                    <span
                      aria-hidden
                      className="absolute -bottom-px start-0 h-px w-full origin-left scale-x-0 transition-transform duration-700 ease-out-expo group-hover:scale-x-100 rtl:origin-right"
                      style={{ background: accent }}
                    />
                    <div dir="ltr" className="rtl:text-right">
                      {b.maker && <p className="mb-1 text-[0.8rem] text-haze">{b.maker}</p>}
                      <p className="font-display text-[1.45rem] leading-tight text-ink transition-transform duration-500 ease-out-expo md:group-hover:translate-x-1 rtl:md:group-hover:-translate-x-1">
                        {b.name}
                      </p>
                      {b.origin && <p className="mt-2 text-[0.8rem] tracking-wide text-haze-300">{b.origin}</p>}
                    </div>
                    <p className="text-pretty text-[0.98rem] leading-relaxed text-haze md:pt-1">{b.lines}</p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {note && <p className="mt-6 text-pretty text-[0.9rem] leading-relaxed text-haze lg:hidden">{note}</p>}
      </div>
    </div>
  );
}
