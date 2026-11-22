import Image from "next/image";
import { type CompanyId, companyById } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Group company logos, presented without a white chip.
 * - tone "color": original artwork, for white / pearl surfaces.
 * - tone "white": clean monochrome for dark surfaces and photography.
 * - tone "ink": monochrome navy, for quiet / inactive states on light surfaces.
 *
 * The logos have different proportions (AATC ≈ 2.7:1, DOPET ≈ 1.8:1, DOPET S&T ≈ 2:1, PEMCO ≈ 2.3:1), so each
 * one gets its own height relative to `size` to look optically equal next to the others.
 * Artwork: the companies' current logos, cropped, background removed (public/brand).
 */
const ART: Record<CompanyId, { w: number; h: number; scale: number }> = {
  aatc: { w: 977, h: 360, scale: 0.86 },
  dopet: { w: 654, h: 360, scale: 1 },
  dst: { w: 708, h: 360, scale: 0.97 },
  pemco: { w: 818, h: 360, scale: 0.92 },
};

const TONE = {
  color: "",
  white: "[filter:brightness(0)_invert(1)]",
  ink: "[filter:brightness(0)_saturate(100%)] opacity-70",
} as const;

export function CompanyLogo({
  id,
  locale,
  size = 40,
  tone = "color",
  className,
  decorative = false,
}: {
  id: CompanyId;
  locale: Locale;
  /** Optical height in px (DOPET renders at exactly this height). */
  size?: number;
  tone?: keyof typeof TONE;
  className?: string;
  /** Set when the company name is already shown next to the logo. */
  decorative?: boolean;
}) {
  const c = companyById(id);
  if (!c) return null;
  const art = ART[id];
  const height = Math.round(size * art.scale);
  const width = Math.round((height * art.w) / art.h);
  return (
    <Image
      src={c.logo}
      alt={decorative ? "" : c.name[locale]}
      // The rendered size, so the optimiser serves a 1x/2x pair at that size rather than the full artwork.
      width={width}
      height={height}
      style={{ height, width }}
      className={cn("max-w-none shrink-0 object-contain transition-[filter,opacity] duration-500", TONE[tone], className)}
    />
  );
}
