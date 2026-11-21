import Image from "next/image";
import { cn } from "@/lib/utils";

/** Al-Ahed Holding logo (original brand PNG). `white` renders a clean monochrome mark for dark backgrounds. */
export function Logo({ variant = "color", className, priority }: { variant?: "color" | "white"; className?: string; priority?: boolean }) {
  return (
    <Image
      src="/brand/alahed-holding.png"
      alt="Al-Ahed Holding — العهد القابضة"
      width={366}
      height={100}
      priority={priority}
      className={cn(
        "h-auto w-[150px] transition-[filter] duration-500 md:w-[172px]",
        variant === "white" && "[filter:brightness(0)_invert(1)]",
        className,
      )}
    />
  );
}
