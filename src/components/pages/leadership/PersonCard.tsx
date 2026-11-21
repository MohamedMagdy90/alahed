"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Image from "next/image";
import { ArcsMark } from "@/components/site/OrbitArcs";
import { Arrow } from "@/components/site/primitives";

export type PersonView = { id: string; name: string; role: string; bio: string; photo: string | null };

const HONORIFICS = /^(mr|mrs|ms|dr|eng|sheikh|h\.e\.|السيد|السيدة|الشيخ|د\.|المهندس|م\.)\.?\s+/i;

export function initials(name: string) {
  let n = name.trim();
  for (let i = 0; i < 2; i++) n = n.replace(HONORIFICS, "");
  const parts = n.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

function Portrait({ p, className }: { p: PersonView; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-navy via-ink to-ink-900 ${className ?? ""}`}>
      {p.photo ? (
        <Image src={p.photo} alt={p.name} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover object-top" />
      ) : (
        <>
          <ArcsMark className="absolute -bottom-16 -end-16 h-64 w-64 opacity-25" />
          <span className="absolute inset-0 grid place-items-center font-display text-[4.5rem] tracking-[-0.04em] text-white/90">
            {initials(p.name)}
          </span>
        </>
      )}
    </div>
  );
}

export function PersonCard({ p, viewLabel, closeLabel, dir }: { p: PersonView; viewLabel: string; closeLabel: string; dir: "ltr" | "rtl" }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className="group block w-full text-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2px]">
            <Portrait p={p} className="absolute inset-0 transition-transform duration-1400 ease-out-expo group-hover:scale-[1.03]" />
          </div>
          <p className="mt-6 font-display text-[1.4rem] leading-tight text-ink transition-colors group-hover:text-brand">{p.name}</p>
          <p className="mt-1.5 text-[0.95rem] text-haze">{p.role}</p>
          {p.bio && (
            <span className="mt-5 inline-flex items-center gap-2 text-[0.88rem] font-medium text-ink">
              <span className="link-underline">{viewLabel}</span>
              <Arrow className="text-leaf-700" />
            </span>
          )}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-ink-900/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content
          dir={dir}
          className="fixed inset-x-0 bottom-0 z-[90] max-h-[92svh] overflow-y-auto rounded-t-[4px] bg-white shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-8 data-[state=open]:fade-in-0 md:inset-auto md:left-1/2 md:top-1/2 md:w-[min(920px,92vw)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[2px]"
        >
          <div className="grid md:grid-cols-[320px_1fr]">
            <Portrait p={p} className="aspect-[4/3] md:aspect-auto md:min-h-[460px]" />
            <div className="p-8 md:p-10">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <Dialog.Title className="font-display text-[1.9rem] leading-tight text-ink">{p.name}</Dialog.Title>
                  <Dialog.Description className="mt-2 text-[1rem] text-leaf-700">{p.role}</Dialog.Description>
                </div>
                <Dialog.Close
                  aria-label={closeLabel}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink/15 text-ink transition-colors hover:bg-ink hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Dialog.Close>
              </div>
              <div className="prose-ah mt-8 border-t border-ink/10 pt-8 !text-[1rem]" dangerouslySetInnerHTML={{ __html: p.bio }} />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
