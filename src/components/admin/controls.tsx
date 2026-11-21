"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Dialog from "@radix-ui/react-dialog";
import { FileText, ImagePlus, Loader2, UploadCloud, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useCallback, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import type { Locale } from "@/i18n/config";
import { errorText, getAdminDict } from "@/i18n/admin";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";
import { aBtn, monoLabel } from "./ui";

/* ───────────── Field ───────────── */

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  className,
  children,
  aside,
}: {
  label: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-[0.8rem] font-medium text-ink/75">
          {label}
          {required && <span className="ms-0.5 text-leaf-700">*</span>}
        </label>
        {aside && <span className="text-[0.72rem] text-haze">{aside}</span>}
      </div>
      {children}
      {hint && !error && <p className="mt-1.5 text-[0.75rem] leading-relaxed text-haze">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-[0.75rem] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function CharCount({ value, max }: { value: string; max: number }) {
  const n = value.length;
  return <span className={cn("num", n > max ? "text-red-600" : n > max * 0.9 ? "text-amber-700" : "")}>{`${n}/${max}`}</span>;
}

/* ───────────── Switch & segmented ───────────── */

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  id?: string;
}) {
  const btn = (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-[22px] w-[40px] shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf/50 disabled:opacity-40",
        checked ? "bg-leaf" : "bg-ink/15",
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-[0_1px_3px_rgba(6,13,34,0.3)] transition-[inset-inline-start] duration-200 ease-out-expo",
          checked ? "start-[21px]" : "start-[3px]",
        )}
      />
    </button>
  );
  if (!label) return btn;
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <label htmlFor={id} className="text-[0.85rem] font-medium text-ink">
          {label}
        </label>
        {description && <p className="mt-0.5 text-[0.75rem] leading-relaxed text-haze">{description}</p>}
      </div>
      {btn}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
  className?: string;
}) {
  return (
    <div role="radiogroup" className={cn("inline-flex rounded-[2px] border border-ink/15 bg-pearl-50 p-[3px]", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex h-8 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-[1px] px-3.5 text-[0.8rem] transition-all duration-200",
            value === o.value ? "bg-white font-medium text-ink shadow-[0_1px_2px_rgba(6,13,34,0.12),0_0_0_1px_rgba(6,13,34,0.06)]" : "text-haze hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** EN / AR tabs with a dot indicator when the Arabic version is incomplete. */
export function LangTabs({
  value,
  onChange,
  locale,
  arMissing,
}: {
  value: "en" | "ar";
  onChange: (v: "en" | "ar") => void;
  locale: Locale;
  arMissing?: boolean;
}) {
  const d = getAdminDict(locale);
  return (
    <Segmented
      value={value}
      onChange={onChange}
      options={[
        { value: "en", label: <span className="font-sans">English</span> },
        {
          value: "ar",
          label: (
            <span className="flex items-center gap-2 font-arabic">
              العربية
              {arMissing && <span title={d.missingAr} className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
            </span>
          ),
        },
      ]}
    />
  );
}

/* ───────────── Modal & confirm ───────────── */

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  locale,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg" | "xl";
  locale: Locale;
}) {
  const d = getAdminDict(locale);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-900/55 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          dir={locale === "ar" ? "rtl" : "ltr"}
          className={cn(
            "fixed inset-x-3 top-[4vh] z-50 mx-auto flex max-h-[92vh] flex-col overflow-hidden rounded-[3px] border border-ink/10 bg-white shadow-[0_40px_120px_-30px_rgba(6,13,34,0.55)] duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-2 sm:top-[7vh]",
            size === "md" && "max-w-lg",
            size === "lg" && "max-w-2xl",
            size === "xl" && "max-w-4xl",
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-ink/[0.07] px-6 py-5">
            <div>
              <Dialog.Title className="font-display text-[1.25rem] font-normal text-ink">{title}</Dialog.Title>
              {description ? (
                <Dialog.Description className="mt-1 text-[0.82rem] leading-relaxed text-haze">{description}</Dialog.Description>
              ) : (
                <Dialog.Description className="sr-only">{typeof title === "string" ? title : ""}</Dialog.Description>
              )}
            </div>
            <Dialog.Close className={aBtn("ghost", "iconSm", "-me-2 -mt-1")} aria-label={d.close}>
              <X />
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">{children}</div>
          {footer && <div className="flex items-center justify-end gap-2 border-t border-ink/[0.07] bg-pearl-50/60 px-6 py-4">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ConfirmDelete({
  locale,
  onConfirm,
  trigger,
  title,
  body,
  confirmLabel,
}: {
  locale: Locale;
  onConfirm: () => Promise<unknown> | unknown;
  trigger: ReactNode;
  title?: string;
  body?: string;
  confirmLabel?: string;
}) {
  const d = getAdminDict(locale);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <AlertDialog.Root open={open} onOpenChange={(v) => !busy && setOpen(v)}>
      <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-ink-900/55 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <AlertDialog.Content
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="fixed inset-x-3 top-[18vh] z-50 mx-auto max-w-md rounded-[3px] border border-ink/10 bg-white p-6 shadow-[0_40px_120px_-30px_rgba(6,13,34,0.55)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <div className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-red-50 text-red-600 ring-1 ring-red-100">
            <X className="h-4 w-4" />
          </div>
          <AlertDialog.Title className="font-display text-[1.2rem] text-ink">{title || d.confirmDelete}</AlertDialog.Title>
          <AlertDialog.Description className="mt-1.5 text-[0.85rem] leading-relaxed text-haze">
            {body || d.confirmDeleteBody}
          </AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Cancel className={aBtn("outline")} disabled={busy}>
              {d.cancel}
            </AlertDialog.Cancel>
            <button
              type="button"
              disabled={busy}
              className={aBtn("primary", "md", "bg-red-600 hover:bg-red-700")}
              onClick={async () => {
                setBusy(true);
                try {
                  await onConfirm();
                } finally {
                  setBusy(false);
                  setOpen(false);
                }
              }}
            >
              {busy && <Loader2 className="animate-spin" />}
              {confirmLabel || d.delete}
            </button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

/* ───────────── Server action runner ───────────── */

type ActionResult<T> = { ok: true; data?: T } | { ok: false; error: string };

/** Runs a server action, shows a localized toast, and refreshes server data on success. */
export function useAction(locale: Locale) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const d = getAdminDict(locale);

  const exec = useCallback(
    async <T,>(
      fn: () => Promise<ActionResult<T>>,
      opts: { success?: string | false; refresh?: boolean } = {},
    ): Promise<ActionResult<T>> => {
      setBusy(true);
      try {
        const res = await fn();
        if (res.ok) {
          if (opts.success !== false) toast.success(opts.success || d.saved);
          if (opts.refresh !== false) startTransition(() => router.refresh());
        } else {
          toast.error(errorText(locale, res.error));
          if (res.error === "UNAUTHORIZED") window.location.href = `/${locale}/admin/login`;
        }
        return res;
      } catch {
        toast.error(d.error);
        return { ok: false, error: "ERROR" };
      } finally {
        setBusy(false);
      }
    },
    [d, locale, router],
  );

  return { exec, busy: busy || pending };
}

/* ───────────── Uploads ───────────── */

export async function uploadFile(file: File, kind: "image" | "document") {
  const body = new FormData();
  body.append("file", file);
  body.append("kind", kind);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const json = (await res.json().catch(() => ({ ok: false, error: "ERROR" }))) as
    | { ok: true; url: string; size: number; name: string }
    | { ok: false; error: string };
  return json;
}

function useDropzone(onFile: (f: File) => void) {
  const [over, setOver] = useState(false);
  return {
    over,
    props: {
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        setOver(true);
      },
      onDragLeave: () => setOver(false),
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        setOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      },
    },
  };
}

export function ImageUpload({
  value,
  onChange,
  locale,
  aspect = "aspect-[16/10]",
  fit = "cover",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  locale: Locale;
  aspect?: string;
  fit?: "cover" | "contain";
}) {
  const d = getAdminDict(locale);
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handle = async (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error(errorText(locale, "INVALID_TYPE"));
    setBusy(true);
    const res = await uploadFile(file, "image");
    setBusy(false);
    if (res.ok) onChange(res.url);
    else toast.error(errorText(locale, res.error));
  };
  const dz = useDropzone(handle);

  return (
    <div>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
          e.target.value = "";
        }}
      />
      {value ? (
        <div className="group relative overflow-hidden rounded-[2px] border border-ink/10 bg-pearl-100">
          <div className={cn("relative w-full", aspect)}>
            {/* biome-ignore lint/a11y/useAltText: decorative preview */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className={cn("absolute inset-0 h-full w-full", fit === "cover" ? "object-cover" : "object-contain p-4")} />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1.5 bg-gradient-to-t from-ink-900/70 to-transparent p-2.5 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
            <button type="button" onClick={() => input.current?.click()} className={aBtn("outline", "sm", "border-white/30 bg-white/95")}>
              {busy ? <Loader2 className="animate-spin" /> : <ImagePlus />}
              {d.replace}
            </button>
            <button type="button" onClick={() => onChange(null)} className={aBtn("outline", "sm", "border-white/30 bg-white/95 text-red-700")}>
              {d.remove}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          {...dz.props}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2.5 rounded-[2px] border border-dashed px-4 text-center transition-colors",
            aspect,
            dz.over ? "border-leaf bg-leaf-50" : "border-ink/20 bg-pearl-50 hover:border-ink/40",
          )}
        >
          {busy ? <Loader2 className="h-6 w-6 animate-spin text-haze" /> : <UploadCloud className="h-6 w-6 text-haze" strokeWidth={1.5} />}
          <span className="text-[0.8rem] text-ink/70">{busy ? d.uploading : d.dropImage}</span>
          <span className={monoLabel}>JPG · PNG · WEBP · 8 MB</span>
        </button>
      )}
    </div>
  );
}

export function PdfUpload({
  value,
  size,
  onChange,
  locale,
}: {
  value: string;
  size: number;
  onChange: (v: { url: string; size: number }) => void;
  locale: Locale;
}) {
  const d = getAdminDict(locale);
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const handle = async (file: File) => {
    if (file.type !== "application/pdf") return toast.error(errorText(locale, "INVALID_TYPE"));
    setBusy(true);
    const res = await uploadFile(file, "document");
    setBusy(false);
    if (res.ok) onChange({ url: res.url, size: res.size });
    else toast.error(errorText(locale, res.error));
  };
  const dz = useDropzone(handle);

  return (
    <div>
      <input
        ref={input}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
          e.target.value = "";
        }}
      />
      {value ? (
        <div className="flex items-center gap-3 rounded-[2px] border border-ink/10 bg-pearl-50 p-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[2px] bg-white text-red-600 ring-1 ring-ink/10">
            <FileText className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <div className="min-w-0 flex-1">
            <a href={value} target="_blank" rel="noreferrer" className="block truncate text-[0.85rem] text-ink hover:underline" dir="ltr">
              {value.split("/").pop()}
            </a>
            <span className="num text-[0.75rem] text-haze">{formatBytes(size, locale)}</span>
          </div>
          <button type="button" onClick={() => input.current?.click()} className={aBtn("outline", "sm")}>
            {busy ? <Loader2 className="animate-spin" /> : null}
            {d.replace}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          {...dz.props}
          className={cn(
            "flex h-28 w-full flex-col items-center justify-center gap-2 rounded-[2px] border border-dashed transition-colors",
            dz.over ? "border-leaf bg-leaf-50" : "border-ink/20 bg-pearl-50 hover:border-ink/40",
          )}
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin text-haze" /> : <UploadCloud className="h-5 w-5 text-haze" strokeWidth={1.5} />}
          <span className="text-[0.8rem] text-ink/70">{busy ? d.uploading : d.dropPdf}</span>
          <span className={monoLabel}>PDF · 20 MB</span>
        </button>
      )}
    </div>
  );
}

/* ───────────── Date helpers (date-only, stored at 12:00 UTC to stay on the same day in every timezone) ───────────── */

export const isoToDateInput = (iso: string | Date) => new Date(iso).toISOString().slice(0, 10);
export function dateInputToIso(value: string, original?: string) {
  if (original && isoToDateInput(original) === value) return new Date(original).toISOString();
  return new Date(`${value}T12:00:00.000Z`).toISOString();
}
