"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * The Al-Ahed mark, traced from the original artwork (public/brand/icon.png, 128 × 128 units).
 *
 * Each of the four bands is a true crescent: a circle with an offset circle removed. That is what gives every
 * band its thick side and its two sharp tips, exactly like the logo. `sweep` is an arc through the middle of the
 * band, from the upper tip round the thick side to the lower tip; stroked inside a <mask> it fills a band
 * progressively in the direction the logo reads.
 *
 * Bands, outside → in: medium blue, dark blue, dark green, light green.
 */
export const MARK_VIEWBOX = "0 0 128 128";

export const BANDS = [
  {
    d: "M106.33 17.43A63.36 63.36 0 1 0 106.57 111.52A58.24 58.24 0 1 1 106.33 17.43Z",
    sweep: "M104.07 24.39A56.74 56.74 0 1 0 104.27 104.57",
    sweepWidth: 15.73,
  },
  {
    d: "M123.66 55.88A52.2 52.2 0 1 0 62.85 115.74A48.02 48.02 0 1 1 123.66 55.88Z",
    sweep: "M117.97 59.27A46.09 46.09 0 1 0 66.32 110.1",
    sweepWidth: 14.72,
  },
  {
    d: "M113.74 95.83A43.36 43.36 0 1 0 40.8 93.63A40.74 40.74 0 1 1 113.74 95.83Z",
    sweep: "M109.26 95.26A39.4 39.4 0 1 0 45.31 93.33",
    sweepWidth: 10.42,
  },
  {
    d: "M92.85 111.31A36.11 36.11 0 1 0 41.6 76.08A33.66 33.66 0 1 1 92.85 111.31Z",
    sweep: "M89.64 108.39A32.15 32.15 0 1 0 45.48 78.03",
    sweepWidth: 10.42,
  },
] as const;

/** The open bowl inside the innermost band (in mark units) — where a company logo or a map point sits. */
export const BOWL = { x: 74.52, y: 83.08, r: 33.66 } as const;

export const MARK_TONES = {
  /** Exact logo colours, for white / pearl surfaces. */
  brand: ["#3667B3", "#263F93", "#096A2F", "#659E3F"],
  /** The same hues lifted for dark surfaces (the logo's dark blue disappears on navy otherwise). */
  light: ["#7BA3E4", "#4E74D4", "#3AAA63", "#98D06B"],
  white: ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"],
  ink: ["#0A1430", "#0A1430", "#0A1430", "#0A1430"],
} as const;

export type MarkTone = keyof typeof MARK_TONES;

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
