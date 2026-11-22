// Shared (client-safe) option lists for the public forms.
export const CONTACT_SUBJECTS = ["general", "investor", "business", "media", "careers", "supplier"] as const;
export const CAREER_AREAS = ["engineering", "technical", "inspection", "corporate", "other"] as const;
export const JOB_COMPANIES = ["holding", "aatc", "dopet", "dst", "pemco"] as const;
export const JOB_EMPLOYMENT = ["full-time", "contract", "temporary"] as const;
export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];
export type CareerArea = (typeof CAREER_AREAS)[number];
export type JobCompany = (typeof JOB_COMPANIES)[number];
export type JobEmployment = (typeof JOB_EMPLOYMENT)[number];
/** Prefix used by the careers form when an application targets a listed role: `job:<id>`. */
export const JOB_POSITION_PREFIX = "job:";
export const employmentLabels: Record<JobEmployment, { en: string; ar: string }> = {
  "full-time": { en: "Full time", ar: "دوام كامل" },
  contract: { en: "Contract", ar: "عقد" },
  temporary: { en: "Temporary", ar: "مؤقت" },
};
/** "3 open roles" / Arabic dual and plural forms (1, 2, 3–10, 11+). */
export function openRolesLabel(n: number, locale: "en" | "ar") {
  if (locale === "en") return `${n} open role${n === 1 ? "" : "s"}`;
  if (n === 1) return "وظيفة شاغرة واحدة";
  if (n === 2) return "وظيفتان شاغرتان";
  if (n <= 10) return `${n} وظائف شاغرة`;
  return `${n} وظيفة شاغرة`;
}
export const asJobCompany = (v: string): JobCompany => ((JOB_COMPANIES as readonly string[]).includes(v) ? (v as JobCompany) : "holding");
export const asCareerArea = (v: string): CareerArea => ((CAREER_AREAS as readonly string[]).includes(v) ? (v as CareerArea) : "other");
export const asEmployment = (v: string): JobEmployment => ((JOB_EMPLOYMENT as readonly string[]).includes(v) ? (v as JobEmployment) : "full-time");

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
