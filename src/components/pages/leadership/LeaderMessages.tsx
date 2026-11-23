import type { Person } from "@prisma/client";
import { SectionHeading } from "@/components/site/primitives";
import { type Locale, pick } from "@/i18n/config";
import type { LeaderMessage } from "@/lib/settings";
import { MessageTabs, type MessageView } from "./MessageTabs";

export type LeaderMessageView = LeaderMessage & { person: Person | null };

/** Leadership messages: one tab per speaker (portrait, name, role); a single message renders as a plain article. */
export function LeaderMessages({ locale, messages }: { locale: Locale; messages: LeaderMessageView[] }) {
  if (!messages.length) return null;
  const ar = locale === "ar";
  const views: MessageView[] = messages.map((m) => {
    const p = m.person;
    return {
      id: m.id,
      title: pick(m, "title", locale),
      html: pick(m, "body", locale),
      // Arabic page without an Arabic text yet: keep the English text readable (left to right).
      ltr: ar && !m.bodyAr?.replace(/<[^>]+>/g, "").trim(),
      name: p ? pick(p, "name", locale) : "",
      role: p ? pick(p, "role", locale) : "",
      photo: p?.photo ?? null,
    };
  });
  return (
    <section id="messages" className="scroll-mt-24 bg-white py-24 md:py-32">
      <div className="container">
        <SectionHeading eyebrow={ar ? "كلمات القيادة" : "Leadership messages"} title={ar ? "كلمة من قيادة المجموعة." : "A word from our leadership."} />
        <div className="mt-14 md:mt-16">
          <MessageTabs messages={views} ar={ar} />
        </div>
      </div>
    </section>
  );
}
