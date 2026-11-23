import { cn } from "@/lib/utils";

/**
 * Blank tiles that complete the last row of a hairline grid (`grid gap-px bg-ink/10` with coloured cells), so the
 * grid's line colour never shows through as an empty box when the item count does not fill the row. `cols` lists the
 * column count per breakpoint exactly as in the grid's classes (e.g. `sm:grid-cols-2 lg:grid-cols-3` → { sm: 2, lg: 3 }).
 * Give the tiles the same background as the cells via `className`. Use `as="li"` inside <ul>/<ol>.
 */
type Cols = { base?: number; sm?: number; md?: number; lg?: number; xl?: number };

const BPS = ["base", "sm", "md", "lg", "xl"] as const;
// Written out in full so Tailwind generates every class.
const SHOW = { base: "block", sm: "sm:block", md: "md:block", lg: "lg:block", xl: "xl:block" } as const;
const HIDE = { base: "hidden", sm: "sm:hidden", md: "md:hidden", lg: "lg:hidden", xl: "xl:hidden" } as const;

export function GridFill({ count, cols, className, as: Tag = "div" }: { count: number; cols: Cols; className?: string; as?: "div" | "li" }) {
  if (count <= 0) return null;
  let current = 1;
  const missing = BPS.map((bp) => {
    current = cols[bp] ?? current;
    return current > 1 && count % current ? current - (count % current) : 0;
  });
  const max = Math.max(...missing);
  if (!max) return null;
  return (
    <>
      {Array.from({ length: max }, (_, k) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static, content-free filler tiles
        <Tag key={k} aria-hidden className={cn(BPS.map((bp, i) => (k < missing[i] ? SHOW[bp] : HIDE[bp])), className)} />
      ))}
    </>
  );
}
