"use client";


import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import { type ReactNode, useEffect, useState } from "react";


const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Reduced-motion preference that is identical on the server and the first client render
 * (avoids hydration mismatches); reflects the real preference after mount.
 */
export function useSafeReducedMotion() {
  const prefers = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? !!prefers : false;
}

/** Global motion settings: Framer skips transform animations for users who prefer reduced motion. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Quiet fade + small rise on first view. Delays are capped so long lists never "cascade". */
export function Reveal({
  children,
  delay = 0,
  y = 10,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "span";
}) {
  const reduce = useSafeReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.55, ease: EASE, delay: Math.min(delay, 0.15) }}
    >
      {children}
    </Comp>
  );
}
