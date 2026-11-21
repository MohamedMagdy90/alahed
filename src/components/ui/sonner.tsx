"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme="light"
    className="toaster group"
    toastOptions={{
      classNames: {
        toast:
          "group toast !rounded-[3px] !border !border-ink/10 !bg-white !text-ink !shadow-[0_18px_50px_-20px_rgba(6,13,34,0.35)] !font-sans",
        title: "!font-medium",
        description: "!text-haze",
        actionButton: "!bg-ink !text-white !rounded-[2px]",
        cancelButton: "!bg-pearl-100 !text-ink !rounded-[2px]",
      },
    }}
    {...props}
  />
);

export { Toaster };
