"use client";


import { LazyMotion, MotionConfig, domAnimation, m, useReducedMotion } from "framer-motion";
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

/**
 * Global motion settings: Framer skips transform animations for users who prefer reduced motion.
 * LazyMotion + `m` components ship only the animation features the site uses (fades, slides, exit transitions,
 * in-view reveals: `domAnimation`) instead of the whole library (drag, layout animations...) on every page.
 * `strict` makes a stray full `motion.*` component fail loudly in development instead of re-adding the weight.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
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
  const Comp = m[as];
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
