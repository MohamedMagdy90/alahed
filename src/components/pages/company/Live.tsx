"use client";
import { m, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { type CSSProperties, type ReactNode, useRef } from "react";
import { useSafeReducedMotion } from "@/components/motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Full-bleed photograph that travels a little slower than the page, so the band in front of it has depth.
 * The frame clips the image; the image itself is 16% taller than the frame to leave room for the drift.
 */
export function ParallaxPhoto({ src, className, children }: { src: string; className?: string; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-7%", "7%"]);
  return (
    <div ref={ref} aria-hidden className={cn("absolute inset-0 overflow-hidden", className)}>
      <m.div className="absolute inset-x-0 -inset-y-[8%]" style={{ y }}>
        <Image src={src} alt="" fill sizes="100vw" className="object-cover" />
      </m.div>
      {children}
    </div>
  );
}

/** A rule or bar that draws itself (from the reading start) the first time it scrolls into view. */
export function Grow({ className, style, delay = 0, duration = 1.1 }: { className?: string; style?: CSSProperties; delay?: number; duration?: number }) {
  return (
    <m.span
      aria-hidden
      className={cn("block origin-left rtl:origin-right", className)}
      style={style}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration, ease: EASE, delay: Math.min(delay, 0.6) }}
    />
  );
}
