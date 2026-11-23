"use client";

import { usePathname } from "next/navigation";
import { ArcsMark } from "@/components/site/ArcsMark";
import { Btn } from "@/components/site/primitives";

export default function NotFound() {
  const pathname = usePathname() || "/en";
  const ar = pathname.startsWith("/ar");
  const l = ar ? "ar" : "en";
  return (
    <section className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink-900 text-white">
      <ArcsMark className="pointer-events-none absolute -end-40 top-1/2 -z-10 h-[820px] w-[820px] -translate-y-1/2 opacity-[0.14]" />
      <div className="container pb-20 pt-40">
        <p className="eyebrow mb-8 flex items-center gap-3 text-leaf-300">
          {ar ? "خطأ 404" : "Error 404"}
        </p>
        <h1 className="max-w-3xl text-balance font-display text-display-xl font-normal">
          {ar ? "لم نتمكن من العثور على هذه الصفحة." : "We couldn't find the page you're looking for."}
        </h1>
        <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-white/65">
          {ar
            ? "ربما تم نقل الصفحة أو تغيير عنوانها. يمكنك العودة إلى الصفحة الرئيسية أو التواصل معنا."
            : "The page may have been moved or its address changed. Return to the homepage or get in touch with us."}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Btn href={`/${l}`}>{ar ? "الصفحة الرئيسية" : "Back to homepage"}</Btn>
          <Btn href={`/${l}/contact`} variant="outline-light">
            {ar ? "اتصل بنا" : "Contact us"}
          </Btn>
        </div>
      </div>
    </section>
  );
}
