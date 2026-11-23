"use client";

import { useEffect } from "react";

/** Counts one article view from the browser (the article itself is served from the page cache). */
export function ViewBeacon({ slug }: { slug: string }) {
  useEffect(() => {
    const body = JSON.stringify({ slug });
    try {
      if (navigator.sendBeacon?.("/api/views", new Blob([body], { type: "application/json" }))) return;
    } catch {
      /* fall through to fetch */
    }
    fetch("/api/views", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
  }, [slug]);
  return null;
}
