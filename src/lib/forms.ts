// Shared (client-safe) option lists for the public forms.
export const CONTACT_SUBJECTS = ["general", "investor", "business", "media", "careers", "supplier"] as const;
export const CAREER_AREAS = ["engineering", "technical", "inspection", "corporate", "other"] as const;
export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];
export type CareerArea = (typeof CAREER_AREAS)[number];

export const subjectLabels: Record<ContactSubject, { en: string; ar: string }> = {
  general: { en: "General enquiry", ar: "استفسار عام" },
  investor: { en: "Investor relations", ar: "علاقات المستثمرين" },
  business: { en: "Business & partnerships", ar: "الأعمال والشراكات" },
  media: { en: "Media", ar: "الإعلام" },
  careers: { en: "Careers", ar: "الوظائف" },
  supplier: { en: "Suppliers", ar: "الموردون" },
};

export const areaLabels: Record<CareerArea, { en: string; ar: string }> = {
  engineering: { en: "Engineering & projects", ar: "الهندسة والمشاريع" },
  technical: { en: "Technical & workshop", ar: "الأعمال الفنية والورش" },
  inspection: { en: "Inspection & quality", ar: "الفحص والجودة" },
  corporate: { en: "Commercial & corporate functions", ar: "الوظائف التجارية والمؤسسية" },
  other: { en: "Other", ar: "أخرى" },
};
