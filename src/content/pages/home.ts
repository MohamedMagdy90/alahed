import type { CompanyId } from "@/content/site";
import type { L10n } from "@/i18n/config";

/**
 * Home page copy (redesign). Rules: factual, specific, no slogans, no invented figures.
 * Everything here is either taken from src/content/site.ts or is plain descriptive wording.
 */

/** Hero headline: three verbs, one per company (supply → AATC, build → DOPET, inspect → PEMCO). */
export type HeroSegment = string | { verb: number; text: string };

export const heroOrder: CompanyId[] = ["aatc", "dopet", "pemco"];

export const heroHeadline: L10n<HeroSegment[]> = {
  en: [
    { verb: 0, text: "Supplying" },
    ", ",
    { verb: 1, text: "building" },
    " and ",
    { verb: 2, text: "inspecting" },
    " Qatar’s energy infrastructure since 1975.",
  ],
  ar: [{ verb: 0, text: "نورّد" }, " ", { verb: 1, text: "ونبني" }, " ", { verb: 2, text: "ونفحص" }, " منشآت الطاقة في قطر منذ عام 1975."],
};

/** One plain sentence per company for the hero caption. */
export const heroCaption: Record<CompanyId, L10n> = {
  aatc: {
    en: "Represents 13 global manufacturers of seals, pumps and flow equipment, with two John Crane service centres in Qatar.",
    ar: "تمثّل 13 شركة عالمية مصنّعة لموانع التسرب والمضخات ومعدات التدفق، ولديها مركزا خدمة جون كرين في قطر.",
  },
  dopet: {
    en: "EPIC projects, shutdowns and maintenance for Qatar’s operators, onshore and offshore, since 1981.",
    ar: "مشاريع الهندسة والتوريد والإنشاء، وعمليات الإيقاف والصيانة لمشغّلي الطاقة في قطر، في البر والبحر، منذ عام 1981.",
  },
  pemco: {
    en: "Independent inspection and non-destructive testing that keeps critical assets safe.",
    ar: "فحص مستقل واختبارات غير إتلافية تحافظ على سلامة الأصول الحيوية.",
  },
};

export const aboutStatement: L10n = {
  en: "Al-Ahed began in 1975 by supplying equipment to Qatar’s young oil and gas industry. Today the Group’s three companies supply critical process equipment, build and maintain plants onshore and offshore, and independently inspect the assets that keep the country’s energy flowing.",
  ar: "بدأت العهد عام 1975 بتوريد المعدات لقطاع النفط والغاز الناشئ في قطر. واليوم تورّد شركات المجموعة الثلاث معدات العمليات الحيوية، وتبني المنشآت وتصونها في البر والبحر، وتفحص بشكل مستقل الأصول التي تحافظ على تدفق الطاقة في الدولة.",
};

/** Concrete facts only (all present in src/content/site.ts). */
export const facts: { value: string; label: L10n }[] = [
  { value: "1975", label: { en: "Founded in Doha", ar: "سنة التأسيس في الدوحة" } },
  { value: "3", label: { en: "Operating companies", ar: "شركات تشغيلية" } },
  { value: "13", label: { en: "Global manufacturers represented", ar: "شركة مصنّعة عالمية نمثّلها" } },
  { value: "2", label: { en: "John Crane service centres", ar: "مركزا خدمة جون كرين" } },
  { value: "3", label: { en: "DOPET fabrication facilities", ar: "مرافق تصنيع لدى دوبت" } },
];

export const sectorsSentence: L10n = {
  en: "We work across oil and gas, LNG, petrochemicals, refining, utilities and offshore.",
  ar: "نعمل في قطاعات النفط والغاز، والغاز الطبيعي المسال، والبتروكيماويات، والتكرير، والمرافق، والعمليات البحرية.",
};

/** What actually happens at each location (facilities and projects listed in src/content/site.ts). */
export const siteDetails: Record<string, { company: CompanyId | "holding"; text: L10n }[]> = {
  doha: [
    { company: "holding", text: { en: "Group headquarters", ar: "المقر الرئيسي للمجموعة" } },
    { company: "aatc", text: { en: "Al-Ahed T&C showroom", ar: "صالة عرض العهد للتجارة والمقاولات" } },
    { company: "pemco", text: { en: "PEMCO Inspection offices", ar: "مكاتب بمكو للفحص" } },
  ],
  salwa: [
    { company: "aatc", text: { en: "Al-Ahed John Crane Service Centre", ar: "مركز خدمة العهد – جون كرين" } },
    { company: "dopet", text: { en: "DOPET facility, Gate 185, Street 25", ar: "مرفق دوبت، بوابة 185، شارع 25" } },
  ],
  raslaffan: [
    { company: "aatc", text: { en: "Al-Ahed John Crane Dry Gas Seal Service Centre", ar: "مركز خدمة موانع تسرب الغاز الجاف العهد – جون كرين" } },
    { company: "dopet", text: { en: "DOPET facility, Ras Laffan Industrial City", ar: "مرفق دوبت، مدينة رأس لفان الصناعية" } },
  ],
  mesaieed: [
    {
      company: "dopet",
      text: {
        en: "EPIC of a new MP steam boiler, DM water plant and associated facilities at QP Refinery",
        ar: "مشروع غلاية بخار جديدة ومحطة مياه منزوعة المعادن ومرافق مرتبطة بها في مصفاة قطر للبترول",
      },
    },
  ],
  dukhan: [
    {
      company: "dopet",
      text: {
        en: "Hook-up of new KHUFF gas wells and Arab D gas-cap recycling wells",
        ar: "ربط آبار غاز الخف الجديدة وآبار إعادة تدوير غطاء الغاز العربي (د)",
      },
    },
    {
      company: "dopet",
      text: {
        en: "Dukhan Production Facilities Upgrade (DPFU), Phase 1A, Package 2",
        ar: "تطوير مرافق الإنتاج في دخان، المرحلة 1أ، الحزمة 2",
      },
    },
  ],
};
