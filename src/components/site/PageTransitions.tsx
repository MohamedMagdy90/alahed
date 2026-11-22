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
/** The screen is frozen while the next page loads: never longer than this (slow networks swap without the fade). */
const MAX_WAIT = 1200;

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

  // The new route has committed: let the browser capture the new state and play the crossfade.
  // NOT requestAnimationFrame: Chrome runs no animation frames while a view transition waits for its callback,
  // so the old code hung until Chrome's own 4 s timeout on every click. A 0 ms timer still runs (after Next's
  // scroll-to-top, which happens during the commit).
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs on every route change by design
  useEffect(() => {
    const p = pending.current;
    if (!p) return;
    pending.current = null;
    window.clearTimeout(p.timer);
    window.setTimeout(p.resolve, 0);
  }, [pathname]);

  useEffect(() => {
    if (typeof document.startViewTransition !== "function") return;
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

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

    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [router]);

  // Warm the destination as soon as intent shows (mouse resting on a link, or a finger touching it), in every
  // browser. All pages are dynamic with no loading boundary, so next/link's automatic prefetch fetches nothing;
  // router.prefetch() fetches the full page, which the click then reuses (kept 5 minutes).
  useEffect(() => {
    const warmed = new Map<string, number>();
    let hoverTimer = 0;
    const target = (e: Event): string | null => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!(a instanceof HTMLAnchorElement)) return null;
      const url = qualifies(a);
      if (!url) return null;
      const key = url.pathname + url.search;
      return Date.now() - (warmed.get(key) ?? 0) < 60_000 ? null : key;
    };
    const warm = (key: string) => {
      warmed.set(key, Date.now());
      router.prefetch(key);
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const key = target(e);
      window.clearTimeout(hoverTimer);
      if (key) hoverTimer = window.setTimeout(() => warm(key), 65);
    };
    const onTouch = (e: TouchEvent) => {
      const key = target(e);
      if (key) warm(key);
    };
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("touchstart", onTouch, { passive: true });
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("touchstart", onTouch);
      window.clearTimeout(hoverTimer);
    };
  }, [router]);

  return null;
}
