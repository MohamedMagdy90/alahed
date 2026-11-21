import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Infinite CSS marquee. Content is duplicated inside one track (keyframes move -50%); pauses on hover. */
export function Marquee({
  children,
  reverse = false,
  className,
  itemClassName,
}: {
  children: ReactNode;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <div dir="ltr" className={cn("group relative overflow-hidden mask-fade-x", className)}>
      <div
        className={cn(
          "flex w-max items-center group-hover:[animation-play-state:paused]",
          reverse ? "animate-marquee-rev" : "animate-marquee",
        )}
      >
        <div className={cn("flex shrink-0 items-center", itemClassName)}>{children}</div>
        <div aria-hidden className={cn("flex shrink-0 items-center", itemClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}
