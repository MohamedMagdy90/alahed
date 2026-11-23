import { BANDS, MARK_TONES, type MarkTone } from "./mark-geometry";

/**
 * Decorative brand mark for inner pages (heroes, dark panels): the real logo crescents, not generic rings.
 * The 128-unit mark is padded so it sits in its box the way the previous decoration did.
 * Static SVG with no client code (it used to share a client file with an unused animation and its library).
 */
export function ArcsMark({
  className,
  strokeOpacity = 1,
  tone = "light",
}: { className?: string; strokeOpacity?: number; tone?: MarkTone }) {
  const colors = MARK_TONES[tone];
  return (
    <svg viewBox="-14 -14 156 156" className={className} aria-hidden>
      {BANDS.map((b, i) => (
        <path key={b.d} d={b.d} fill={colors[i]} fillOpacity={strokeOpacity} />
      ))}
    </svg>
  );
}
