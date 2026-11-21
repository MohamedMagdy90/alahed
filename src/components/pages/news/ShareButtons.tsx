"use client";

import { Check, Link2, Linkedin, Mail, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ShareButtons({ title, label, copiedLabel, className }: { title: string; label: string; copiedLabel: string; className?: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => setUrl(window.location.href), []);

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const items = [
    { k: "linkedin", Icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, name: "LinkedIn" },
    {
      k: "x",
      Icon: (_: { className?: string }) => (
        <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
      name: "X",
    },
    { k: "whatsapp", Icon: MessageCircle, href: `https://wa.me/?text=${t}%20${u}`, name: "WhatsApp" },
    { k: "email", Icon: Mail, href: `mailto:?subject=${t}&body=${u}`, name: "Email" },
  ];

  const btn = "grid h-10 w-10 place-items-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="eyebrow me-2 text-haze">{label}</span>
      {items.map(({ k, Icon, href, name }) => (
        <a key={k} href={href} target="_blank" rel="noopener noreferrer" aria-label={name} className={btn}>
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button
        type="button"
        aria-label={copied ? copiedLabel : "Copy link"}
        className={cn(btn, copied && "border-leaf bg-leaf text-ink hover:border-leaf hover:bg-leaf hover:text-ink")}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            /* clipboard unavailable */
          }
        }}
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
