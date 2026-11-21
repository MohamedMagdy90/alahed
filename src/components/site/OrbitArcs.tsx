"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { useSafeReducedMotion } from "@/components/motion";
import { cn } from "@/lib/utils";
import { BANDS, MARK_TONES, type MarkTone } from "./LogoMark";

export const C = 400;
export const pt = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  // Rounded so server and browser render identical attribute strings.
  return [Math.round((C + r * Math.cos(a)) * 100) / 100, Math.round((C + r * Math.sin(a)) * 100) / 100] as const;
};
/** Counter-clockwise arc (screen space) from `start` spanning `len` degrees — opens to the upper right like the logo. */
export const arc = (r: number, start: number, len: number) => {
  const [x0, y0] = pt(r, start);
  const [x1, y1] = pt(r, start - len);
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${len > 180 ? 1 : 0} 0 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};

export type ArcLabel = { index: string; name: string; meta: string; href?: string };

export const ARCS = [
  { r: 330, start: -88, len: 238, color: "#8EAAE0", width: 2.5 },
  { r: 250, start: -48, len: 258, color: "#3B74DB", width: 3 },
  { r: 170, start: -22, len: 258, color: "#5DB543", width: 3.5 },
];

export function OrbitArcs({
  className,
  labels,
  delay = 0.3,
  mirror = false,
}: { className?: string; labels?: ArcLabel[]; delay?: number; mirror?: boolean }) {
  const reduce = useSafeReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 });
  const sy = useSpring(my, { stiffness: 40, damping: 18 });
  const x1 = useTransform(sx, (v) => v * 10);
  const y1 = useTransform(sy, (v) => v * 10);
  const x2 = useTransform(sx, (v) => v * 22);
  const y2 = useTransform(sy, (v) => v * 22);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduce]);

  const ticks = Array.from({ length: 120 }, (_, i) => i * 3);

  return (
    <div className={cn("relative aspect-square w-full select-none", className)} aria-hidden={!labels}>
      {/* ambient glow */}
      <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(59,116,219,0.28),transparent_65%)] blur-2xl" />

      <div className={cn("absolute inset-0", mirror && "-scale-x-100")}>
      {/* Static engineering layer */}
      <motion.svg viewBox="0 0 800 800" className="absolute inset-0 h-full w-full" style={{ x: x1, y: y1 }}>
        <g className="origin-center animate-spin-slower" style={{ transformBox: "fill-box" }}>
          {ticks.map((deg) => {
            const long = deg % 30 === 0;
            const [ax, ay] = pt(386, deg);
            const [bx, by] = pt(long ? 372 : 380, deg);
            return (
              <line
                key={deg}
                x1={ax}
                y1={ay}
                x2={bx}
                y2={by}
                stroke="white"
                strokeOpacity={long ? 0.35 : 0.14}
                strokeWidth={long ? 1.2 : 0.8}
              />
            );
          })}
        </g>
        {[330, 250, 170].map((r) => (
          <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="white" strokeOpacity={0.07} strokeWidth={1} />
        ))}
        <circle cx={C} cy={C} r={90} fill="none" stroke="white" strokeOpacity={0.1} strokeDasharray="2 6" />
        <line x1={C - 18} y1={C} x2={C + 18} y2={C} stroke="white" strokeOpacity={0.25} />
        <line x1={C} y1={C - 18} x2={C} y2={C + 18} stroke="white" strokeOpacity={0.25} />
        {/* orbiting comets */}
        {[
          { r: 330, dur: 38 },
          { r: 250, dur: 28 },
          { r: 170, dur: 20 },
        ].map(({ r, dur }, i) => (
          <g
            key={r}
            style={{ transformOrigin: "400px 400px", animation: reduce ? undefined : `spin-slow ${dur}s linear infinite`, animationDelay: `${-i * 7}s` }}
          >
            <circle cx={C + r} cy={C} r={2.2} fill="white" fillOpacity={0.75} />
          </g>
        ))}
      </motion.svg>

      {/* Brand arcs */}
      <motion.svg viewBox="0 0 800 800" className="absolute inset-0 h-full w-full overflow-visible" style={{ x: x2, y: y2 }}>
        <defs>
          <filter id="arc-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        {ARCS.map((a, i) => (
          <g key={a.r}>
            <motion.path
              d={arc(a.r, a.start, a.len)}
              fill="none"
              stroke={a.color}
              strokeWidth={a.width * 5}
              strokeLinecap="round"
              opacity={0.28}
              filter="url(#arc-glow)"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1], delay: delay + i * 0.22 }}
            />
            <motion.path
              d={arc(a.r, a.start, a.len)}
              fill="none"
              stroke={a.color}
              strokeWidth={a.width}
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1], delay: delay + i * 0.22 }}
            />
            <motion.circle
              cx={pt(a.r, a.start)[0]}
              cy={pt(a.r, a.start)[1]}
              r={6}
              fill={a.color}
              initial={reduce ? false : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: delay + 0.2 + i * 0.22 }}
            />
            <circle cx={pt(a.r, a.start)[0]} cy={pt(a.r, a.start)[1]} r={6} fill="none" stroke={a.color} strokeOpacity={0.6}>
              {!reduce && <animate attributeName="r" values="6;22" dur="2.6s" begin={`${i * 0.6}s`} repeatCount="indefinite" />}
              {!reduce && (
                <animate attributeName="stroke-opacity" values="0.6;0" dur="2.6s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
              )}
            </circle>
          </g>
        ))}
      </motion.svg>
      </div>

      {/* Labels anchored to arc starts */}
      {labels?.map((l, i) => {
        const a = ARCS[i];
        if (!a) return null;
        const [x, y] = pt(a.r, a.start);
        const content = (
          <span className="flex items-baseline gap-3 whitespace-nowrap">
            <span className="num font-mono text-[0.68rem] text-white/45">{l.index}</span>
            <span>
              <span className="block font-display text-[0.98rem] text-white transition-colors group-hover:text-leaf-300">{l.name}</span>
              <span className="block font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white/45 rtl:font-arabic rtl:tracking-normal">
                {l.meta}
              </span>
            </span>
          </span>
        );
        return (
          <motion.div
            key={l.index}
            className={cn("orbit-label absolute", mirror ? "pr-4 text-right" : "pl-4 text-left")}
            style={{
              ...(mirror ? { right: `${(x / 800) * 100}%` } : { left: `${(x / 800) * 100}%` }),
              top: `${(y / 800) * 100}%`,
              y: "-50%",
            }}
            initial={reduce ? false : { opacity: 0, x: mirror ? 8 : -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: delay + 1.2 + i * 0.15 }}
          >
            {l.href ? (
              <Link href={l.href} className={cn("group block", mirror ? "pr-3" : "pl-3")}>
                {content}
              </Link>
            ) : (
              <div className={mirror ? "pr-3" : "pl-3"}>{content}</div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * Decorative brand mark for inner pages (heroes, dark panels): the real logo crescents, not generic rings.
 * The 128-unit mark is padded so it sits in its box the way the previous decoration did.
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
