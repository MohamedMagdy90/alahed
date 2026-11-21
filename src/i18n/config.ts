export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export const dirOf = (l: Locale) => (l === "ar" ? "rtl" : "ltr");

/** Bilingual value helper */
export type L10n<T = string> = { en: T; ar: T };
export const tr = <T,>(v: L10n<T>, l: Locale): T => v[l];

/** Pick a localized field from a DB record, falling back to English. */
export function pick<T extends Record<string, unknown>>(row: T, base: string, l: Locale): string {
  const ar = row[`${base}Ar`];
  const en = row[`${base}En`];
  if (l === "ar" && typeof ar === "string" && ar.trim()) return ar;
  return typeof en === "string" ? en : "";
}

export function formatDate(d: Date | string, l: Locale, opts?: Intl.DateTimeFormatOptions) {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat(l === "ar" ? "ar-QA-u-nu-latn" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...opts,
  }).format(date);
}
