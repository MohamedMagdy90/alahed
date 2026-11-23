"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

import { BANDS, MARK_TONES, MARK_VIEWBOX, type MarkTone } from "./mark-geometry";

// Geometry lives in mark-geometry.ts (no "use client") so server components can draw the mark too.
export { BANDS, BOWL, MARK_TONES, MARK_VIEWBOX, type MarkTone } from "./mark-geometry";

export function LogoMark({
  className,
  tone = "brand",
  opacity = 1,
  glint = false,
  paused = false,
  title,
}: {
  className?: string;
  tone?: MarkTone;
  opacity?: number;
  /** A soft light that travels along each band in turn (for "live" moments, e.g. the network hub). */
  glint?: boolean;
  paused?: boolean;
  /** Accessible name; omit when purely decorative. */
  title?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const colors = MARK_TONES[tone];
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={cn("overflow-visible", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {glint && (
        <defs>
          <filter id={`${uid}soft`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
          {BANDS.map((b, i) => (
            <mask key={b.d} id={`${uid}g${i}`} maskUnits="userSpaceOnUse" x="-10" y="-10" width="148" height="148">
              <path
                d={b.sweep}
                pathLength={1}
                fill="none"
                stroke="white"
                strokeWidth={b.sweepWidth + 2}
                strokeDasharray="0.24 1.26"
                filter={`url(#${uid}soft)`}
                style={{
                  strokeDashoffset: 0.24,
                  animation: "markglint 6s cubic-bezier(0.65, 0, 0.35, 1) infinite",
                  animationDelay: `${i * 0.32}s`,
                  animationPlayState: paused ? "paused" : "running",
                }}
              />
            </mask>
          ))}
        </defs>
      )}
      {BANDS.map((b, i) => (
        <path key={b.d} d={b.d} fill={colors[i]} fillOpacity={opacity} />
      ))}
      {glint &&
        BANDS.map((b, i) => (
          <path key={`glint-${b.d}`} d={b.d} fill="white" fillOpacity={tone === "white" ? 0.9 : 0.6} mask={`url(#${uid}g${i})`} />
        ))}
    </svg>
  );
}
