"use client";

import { Trash2 } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getAdminDict, tx } from "@/i18n/admin";
import { deleteSubscriber } from "@/lib/admin/inbox";
import { ConfirmDelete, useAction } from "./controls";
import { aBtn } from "./ui";

export function SubscriberDelete({ locale, id, email }: { locale: Locale; id: string; email: string }) {
  const d = getAdminDict(locale);
  const t = tx(locale);
  const { exec } = useAction(locale);
  return (
    <ConfirmDelete
      locale={locale}
      title={t("Remove this subscriber?", "إزالة هذا المشترك؟")}
      body={email}
      confirmLabel={d.remove}
      onConfirm={() => exec(() => deleteSubscriber(id), { success: d.deleted })}
      trigger={
        <button type="button" className={aBtn("ghost", "iconSm", "hover:bg-red-50 hover:text-red-700")} aria-label={d.remove}>
          <Trash2 />
        </button>
      }
    />
  );
}
