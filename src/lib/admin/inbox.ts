"use server";

import { db } from "@/lib/db";
import { assertSession } from "@/lib/session";
import { run } from "./result";

export async function setMessageRead(id: string, read: boolean) {
  return run(
    async () => {
      await assertSession();
      await db.message.update({ where: { id }, data: { read } });
    },
    { revalidate: false },
  );
}

export async function deleteMessage(id: string) {
  return run(
    async () => {
      await assertSession();
      await db.message.delete({ where: { id } });
    },
    { revalidate: false },
  );
}

export async function deleteSubscriber(id: string) {
  return run(
    async () => {
      await assertSession();
      await db.subscriber.delete({ where: { id } });
    },
    { revalidate: false },
  );
}
