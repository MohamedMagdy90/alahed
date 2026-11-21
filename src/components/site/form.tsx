import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputCls =
  "h-12 w-full rounded-[2px] border border-ink/15 bg-white px-4 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-haze-300 focus:border-leaf aria-[invalid=true]:border-red-400";
export const textareaCls = cn(inputCls, "h-auto min-h-[150px] resize-y py-3 leading-relaxed");

export function Field({
  label,
  htmlFor,
  error,
  required,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between gap-3 text-[0.85rem] text-ink/70">
        <span>
          {label}
          {required && <span className="ms-1 text-leaf-700">*</span>}
        </span>
        {hint && <span className="text-[0.75rem] text-haze">{hint}</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-[0.8rem] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/** Off-screen honeypot field; bots fill it, humans never see it. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
