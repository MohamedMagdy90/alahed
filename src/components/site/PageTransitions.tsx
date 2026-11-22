"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Page transitions with the native View Transitions API (Chrome, Edge, Safari 18+, Firefox 144+).
 *
 * - Every internal page change cross-fades (styles in globals.css, `::view-transition-*`).
 * - Cards opt into a shared-element morph: mark the clickable card (or a wrapper) with `data-vt-card`
 *   and its photo with `data-vt="media"`. The destination hero marks its photo layer with
 *   `data-vt-hero="media"`. The names are assigned only for the duration of one transition, so a page
 *   never holds two elements with the same name.
 * - Browsers without support, modified clicks, language switches, admin/API links and users who prefer
 *   reduced motion get normal navigation.
 */
type Pending = { resolve: () => void; timer: number };

const SKIP = /^\/(?:en|ar)\/admin(?:\/|$)|^\/api\/|^\/media\//;
const MAX_WAIT = 2500;

function qualifies(a: HTMLAnchorElement): URL | null {
  if (a.target && a.target !== "_self") return null;
  if (a.hasAttribute("download") || a.hasAttribute("data-vt-skip")) return null;
  const url = new URL(a.href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  if (url.pathname === window.location.pathname) return null; // hash / query change on the same page
  if (url.pathname.split("/")[1] !== window.location.pathname.split("/")[1]) return null; // language switch
  if (SKIP.test(url.pathname)) return null;
  return url;
}

function sharedMedia(a: HTMLAnchorElement): HTMLElement | null {
  const scope = a.closest<HTMLElement>("[data-vt-card]") ?? a;
  return scope.matches("[data-vt='media']") ? scope : scope.querySelector<HTMLElement>("[data-vt='media']");
}

export function PageTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef<Pending | null>(null);

  // The new route has committed (and Next has scrolled to the top): let the browser capture the new state.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs on every route change by design
  useEffect(() => {
    const p = pending.current;
    if (!p) return;
    pending.current = null;
    window.clearTimeout(p.timer);
    requestAnimationFrame(() => p.resolve());
  }, [pathname]);

  useEffect(() => {
    if (typeof document.startViewTransition !== "function") return;
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const warmed = new Map<string, number>();
    let hoverTimer = 0;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (reduced.matches) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!(a instanceof HTMLAnchorElement)) return;
      const url = qualifies(a);
      if (!url) return;

      // Runs in the capture phase before React: next/link sees `defaultPrevented` and stands down.
      e.preventDefault();
      const dest = url.pathname + url.search + url.hash;

      // A second click while a transition is pending: settle the first one immediately.
      if (pending.current) {
        window.clearTimeout(pending.current.timer);
        pending.current.resolve();
        pending.current = null;
      }

      const media = sharedMedia(a);
      if (media) media.style.viewTransitionName = "vt-media";
      root.classList.add("vt-active");

      const vt = document.startViewTransition(() => {
        // Old state captured: hand the shared name over to the destination hero.
        if (media) {
          media.style.viewTransitionName = "";
          root.classList.add("vt-morph");
        }
        return new Promise<void>((resolve) => {
          const timer = window.setTimeout(() => {
            if (pending.current?.timer === timer) pending.current = null;
            resolve();
          }, MAX_WAIT);
          pending.current = { resolve, timer };
          router.push(dest);
        });
      });
      vt.finished.finally(() => {
        root.classList.remove("vt-active", "vt-morph");
        if (media) media.style.viewTransitionName = "";
      });
    };

    // Warm card destinations on hover so the morph starts without a long freeze (dynamic pages have
    // no loading boundary for next/link's automatic prefetch to use).
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!(a instanceof HTMLAnchorElement) || !sharedMedia(a)) return;
      const url = qualifies(a);
      if (!url) return;
      const key = url.pathname + url.search;
      const last = warmed.get(key) ?? 0;
      if (Date.now() - last < 30_000) return;
      window.clearTimeout(hoverTimer);
      hoverTimer = window.setTimeout(() => {
        warmed.set(key, Date.now());
        router.prefetch(key);
      }, 80);
    };

    window.addEventListener("click", onClick, true);
    document.addEventListener("pointerover", onOver, { passive: true });
    return () => {
      window.removeEventListener("click", onClick, true);
      document.removeEventListener("pointerover", onOver);
      window.clearTimeout(hoverTimer);
    };
  }, [router]);

  return null;
}
