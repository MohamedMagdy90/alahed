import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's default font sizes: without this, custom sizes such as `text-display-lg`
 * are read as text colours and dropped as soon as a colour class (`text-ink`) follows them.
 * Keep in sync with `theme.extend.fontSize` in tailwind.config.ts.
 */
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["display-2xl", "display-xl", "display-lg", "display-md", "eyebrow"] }] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
