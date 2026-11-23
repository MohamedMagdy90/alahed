import type { L10n } from "@/i18n/config";

/**
 * Listing-related wording depends on the "show listing information" switch in the admin settings:
 * `introUnlisted` / `bodyUnlisted` replace the text while it is off, and `listingOnly` sections are left out.
 */
export type LegalDoc = {
  title: L10n;
  intro: L10n;
  introUnlisted?: L10n;
  sections: { id: string; title: L10n; body: L10n<string[]>; bodyUnlisted?: L10n<string[]>; listingOnly?: boolean }[];
};

/** The document as visitors should see it, with or without the listing-related wording. */
export function legalView(doc: LegalDoc, listing: boolean) {
  if (listing) return { intro: doc.intro, sections: doc.sections.map((s) => ({ id: s.id, title: s.title, body: s.body })) };
  return {
    intro: doc.introUnlisted ?? doc.intro,
    sections: doc.sections.filter((s) => !s.listingOnly).map((s) => ({ id: s.id, title: s.title, body: s.bodyUnlisted ?? s.body })),
  };
}

export const LEGAL_UPDATED = "2026-11-21";

export const legal: Record<"privacy" | "terms" | "disclaimer", LegalDoc> = {
  privacy: {
    title: { en: "Privacy policy", ar: "سياسة الخصوصية" },
    intro: {
      en: "This policy explains how Al-Ahed Holding and its group companies collect, use and protect personal data submitted through this website.",
      ar: "توضّح هذه السياسة كيفية جمع العهد القابضة وشركاتها التابعة للبيانات الشخصية المقدَّمة عبر هذا الموقع واستخدامها وحمايتها.",
    },
    sections: [
      {
        id: "data",
        title: { en: "Information we collect", ar: "المعلومات التي نجمعها" },
        body: {
          en: [
            "We collect the information you choose to provide through our forms: your name, email address, phone number, company, the content of your message and, for job applications, your CV and related details.",
            "When you subscribe to news or investor alerts we store your email address, preferred language and the list you joined. We also collect limited technical information, such as browser type and pages visited, to keep the website secure and working properly.",
          ],
          ar: [
            "نجمع المعلومات التي تختار تقديمها عبر نماذجنا، مثل الاسم والبريد الإلكتروني ورقم الهاتف والشركة ومحتوى رسالتك، وفي حالة طلبات التوظيف سيرتك الذاتية والبيانات المرتبطة بها.",
            "وعند الاشتراك في الأخبار أو تنبيهات المستثمرين، نحتفظ ببريدك الإلكتروني ولغتك المفضلة ونوع القائمة. كما نجمع معلومات تقنية محدودة، مثل نوع المتصفح والصفحات التي تمت زيارتها، للحفاظ على أمان الموقع وحسن عمله.",
          ],
        },
        bodyUnlisted: {
          en: [
            "We collect the information you choose to provide through our forms: your name, email address, phone number, company, the content of your message and, for job applications, your CV and related details.",
            "When you subscribe to our news updates we store your email address and preferred language. We also collect limited technical information, such as browser type and pages visited, to keep the website secure and working properly.",
          ],
          ar: [
            "نجمع المعلومات التي تختار تقديمها عبر نماذجنا، مثل الاسم والبريد الإلكتروني ورقم الهاتف والشركة ومحتوى رسالتك، وفي حالة طلبات التوظيف سيرتك الذاتية والبيانات المرتبطة بها.",
            "وعند الاشتراك في نشرة الأخبار، نحتفظ ببريدك الإلكتروني ولغتك المفضلة. كما نجمع معلومات تقنية محدودة، مثل نوع المتصفح والصفحات التي تمت زيارتها، للحفاظ على أمان الموقع وحسن عمله.",
          ],
        },
      },
      {
        id: "use",
        title: { en: "How we use your information", ar: "كيف نستخدم معلوماتك" },
        body: {
          en: [
            "We use your information only to respond to your enquiry, assess job applications, send the communications you requested, and operate and improve the website. We do not sell your personal data.",
          ],
          ar: [
            "نستخدم معلوماتك فقط للرد على استفسارك، وتقييم طلبات التوظيف، وإرسال المراسلات التي طلبتها، وتشغيل الموقع وتحسينه. ولا نبيع بياناتك الشخصية لأي جهة.",
          ],
        },
      },
      {
        id: "sharing",
        title: { en: "Sharing and storage", ar: "المشاركة والتخزين" },
        body: {
          en: [
            "Information may be shared within the Al-Ahed group of companies where needed to handle your request. Data is stored on secured servers with access limited to authorised staff.",
          ],
          ar: [
            "قد تتم مشاركة المعلومات داخل مجموعة شركات العهد عند الحاجة لمعالجة طلبك. وتُخزَّن البيانات على خوادم مؤمّنة، ويقتصر الوصول إليها على الموظفين المخوّلين.",
          ],
        },
      },
      {
        id: "retention",
        title: { en: "Retention", ar: "مدة الاحتفاظ" },
        body: {
          en: [
            "We keep personal data only for as long as necessary for the purposes described above or as required by law. You can unsubscribe from email communications at any time.",
          ],
          ar: [
            "نحتفظ بالبيانات الشخصية للمدة اللازمة فقط لتحقيق الأغراض الموضحة أعلاه أو وفق ما يقتضيه القانون. ويمكنك إلغاء الاشتراك في المراسلات البريدية في أي وقت.",
          ],
        },
      },
      {
        id: "rights",
        title: { en: "Your rights", ar: "حقوقك" },
        body: {
          en: [
            "In line with the laws of the State of Qatar on the protection of personal data, you may request access to, correction of or deletion of your personal data, or object to its processing, by contacting us at the address below.",
          ],
          ar: [
            "وفقًا لقوانين دولة قطر الخاصة بحماية البيانات الشخصية، يحق لك طلب الاطلاع على بياناتك الشخصية أو تصحيحها أو حذفها، أو الاعتراض على معالجتها، من خلال التواصل معنا عبر العنوان أدناه.",
          ],
        },
      },
      {
        id: "contact",
        title: { en: "Contact", ar: "التواصل" },
        body: {
          en: ["For privacy questions or requests, contact Al-Ahed Holding, P.O. Box 3266, Doha, State of Qatar — admin@alahed.com.qa."],
          ar: ["لأي استفسارات أو طلبات تتعلق بالخصوصية، يرجى التواصل مع العهد القابضة، ص.ب 3266، الدوحة، دولة قطر — admin@alahed.com.qa."],
        },
      },
    ],
  },
  terms: {
    title: { en: "Terms of use", ar: "شروط الاستخدام" },
    intro: {
      en: "By accessing and using this website you agree to the following terms. If you do not agree, please do not use the website.",
      ar: "باستخدامك لهذا الموقع فإنك توافق على الشروط التالية. وفي حال عدم موافقتك، يرجى عدم استخدام الموقع.",
    },
    sections: [
      {
        id: "use",
        title: { en: "Use of the website", ar: "استخدام الموقع" },
        body: {
          en: ["You may use this website for lawful, informational purposes only. You must not attempt to gain unauthorised access to any part of the website, interfere with its operation or use it to transmit harmful content."],
          ar: ["يجوز لك استخدام هذا الموقع لأغراض مشروعة وإعلامية فقط، ولا يجوز لك محاولة الوصول غير المصرّح به إلى أي جزء منه أو التدخل في عمله أو استخدامه لنقل محتوى ضار."],
        },
      },
      {
        id: "ip",
        title: { en: "Intellectual property", ar: "الملكية الفكرية" },
        body: {
          en: ["All content on this website — including text, images, logos and design — is owned by or licensed to Al-Ahed Holding and its group companies. Third-party trademarks belong to their respective owners. Content may not be reproduced without prior written permission."],
          ar: ["جميع محتويات هذا الموقع، بما في ذلك النصوص والصور والشعارات والتصميم، مملوكة للعهد القابضة وشركاتها التابعة أو مرخّصة لها. والعلامات التجارية للغير مملوكة لأصحابها. ولا يجوز نسخ أي محتوى دون إذن خطي مسبق."],
        },
      },
      {
        id: "links",
        title: { en: "Links to other websites", ar: "روابط المواقع الأخرى" },
        body: {
          en: ["This website may link to third-party websites, including those of our principals and group companies. We are not responsible for the content or practices of external websites."],
          ar: ["قد يتضمن هذا الموقع روابط لمواقع أطراف أخرى، بما في ذلك مواقع شركائنا وشركات المجموعة، ولا نتحمّل مسؤولية محتوى المواقع الخارجية أو ممارساتها."],
        },
      },
      {
        id: "liability",
        title: { en: "Limitation of liability", ar: "حدود المسؤولية" },
        body: {
          en: ["The website is provided \"as is\". To the extent permitted by law, Al-Ahed Holding accepts no liability for any loss arising from the use of, or inability to use, this website or its content."],
          ar: ["يُقدَّم الموقع \"كما هو\". وإلى الحد الذي يسمح به القانون، لا تتحمّل العهد القابضة أي مسؤولية عن أي خسارة تنشأ عن استخدام هذا الموقع أو محتواه أو تعذّر استخدامه."],
        },
      },
      {
        id: "law",
        title: { en: "Governing law", ar: "القانون الواجب التطبيق" },
        body: {
          en: ["These terms are governed by the laws of the State of Qatar, and the courts of Qatar shall have exclusive jurisdiction over any dispute."],
          ar: ["تخضع هذه الشروط لقوانين دولة قطر، وتختص محاكم دولة قطر حصريًا بالنظر في أي نزاع ينشأ عنها."],
        },
      },
    ],
  },
  disclaimer: {
    title: { en: "Disclaimer", ar: "إخلاء المسؤولية" },
    intro: {
      en: "Please read this disclaimer carefully, particularly in relation to the investor relations information on this website.",
      ar: "يرجى قراءة إخلاء المسؤولية هذا بعناية، ولا سيما ما يتعلق بمعلومات علاقات المستثمرين الواردة في هذا الموقع.",
    },
    introUnlisted: {
      en: "Please read this disclaimer carefully before relying on the information on this website.",
      ar: "يرجى قراءة إخلاء المسؤولية هذا بعناية قبل الاعتماد على المعلومات الواردة في هذا الموقع.",
    },
    sections: [
      {
        id: "info",
        title: { en: "Information purposes only", ar: "لأغراض إعلامية فقط" },
        body: {
          en: ["The information on this website is provided for general information purposes. While we take care to keep it accurate and up to date, we make no representation or warranty as to its completeness or accuracy."],
          ar: ["تُقدَّم المعلومات الواردة في هذا الموقع لأغراض إعلامية عامة. ورغم حرصنا على دقتها وتحديثها، فإننا لا نقدّم أي ضمان بشأن اكتمالها أو دقتها."],
        },
      },
      {
        id: "offer",
        listingOnly: true,
        title: { en: "No offer of securities", ar: "ليس عرضًا للأوراق المالية" },
        body: {
          en: [
            "Nothing on this website constitutes an offer, solicitation or invitation to buy or subscribe for any securities of Al-Ahed Holding in any jurisdiction. Any offering of securities will be made only by means of an official prospectus approved by the competent authorities, including the Qatar Financial Markets Authority.",
          ],
          ar: [
            "لا يشكّل أي محتوى في هذا الموقع عرضًا أو التماسًا أو دعوة لشراء أو الاكتتاب في أي أوراق مالية للعهد القابضة في أي ولاية قضائية. ويتم أي طرح للأوراق المالية فقط من خلال نشرة إصدار رسمية معتمدة من الجهات المختصة، بما فيها هيئة قطر للأسواق المالية.",
          ],
        },
      },
      {
        id: "forward",
        title: { en: "Forward-looking statements", ar: "البيانات التطلعية" },
        body: {
          en: ["This website may contain forward-looking statements regarding plans, objectives and expectations. Such statements involve risks and uncertainties, and actual results may differ materially. We undertake no obligation to update them except as required by applicable regulations."],
          ar: ["قد يتضمن هذا الموقع بيانات تطلعية تتعلق بالخطط والأهداف والتوقعات، وتنطوي هذه البيانات على مخاطر وعوامل عدم يقين، وقد تختلف النتائج الفعلية عنها بشكل جوهري. ولا نلتزم بتحديثها إلا وفق ما تقتضيه الأنظمة المعمول بها."],
        },
      },
      {
        id: "decisions",
        listingOnly: true,
        title: { en: "Investment decisions", ar: "القرارات الاستثمارية" },
        body: {
          en: ["Investment decisions should be based solely on official disclosures published through the Qatar Stock Exchange and the Qatar Financial Markets Authority, and investors should seek independent professional advice."],
          ar: ["ينبغي أن تستند القرارات الاستثمارية حصريًا إلى الإفصاحات الرسمية المنشورة عبر بورصة قطر وهيئة قطر للأسواق المالية، وننصح المستثمرين بالحصول على استشارة مهنية مستقلة."],
        },
      },
    ],
  },
};
