import type { CompanyId } from "@/content/site";
import type { L10n } from "@/i18n/config";

/**
 * Home page copy (redesign). Rules: factual, specific, no slogans, no invented figures.
 * Everything here is taken from src/content/site.ts, profiles.ts or group.ts (the companies' own profiles).
 */

/** Hero headline: four verbs, one per company (`verb` = index in heroOrder). */
export type HeroSegment = string | { verb: number; text: string };

/**
 * Hero order = founding order (AATC 1975, DOPET 1981, PEMCO 1987, DOPET S&T 2019), like every other company list
 * on the site. It is also the logo bands from the inside out: the Group grows outward ring by ring.
 */
export const heroOrder: CompanyId[] = ["aatc", "dopet", "pemco", "dst"];

export const heroHeadline: L10n<HeroSegment[]> = {
  en: [
    { verb: 0, text: "Supplying" },
    ", ",
    { verb: 1, text: "building" },
    ", ",
    { verb: 2, text: "inspecting" },
    " and ",
    { verb: 3, text: "equipping" },
    " Qatar’s energy infrastructure since 1975.",
  ],
  ar: [
    { verb: 0, text: "نورّد" },
    " ",
    { verb: 1, text: "ونبني" },
    " ",
    { verb: 2, text: "ونفحص" },
    " ",
    { verb: 3, text: "ونجهّز" },
    " منشآت الطاقة في قطر منذ عام 1975.",
  ],
};

/** One plain sentence per company for the hero caption. */
export const heroCaption: Record<CompanyId, L10n> = {
  aatc: {
    en: "Exclusive agent in Qatar for John Crane, Sundyne, SPX FLOW, NOV and more than 30 other brands, with service centres in Ras Laffan and Doha.",
    ar: "الوكيل الحصري في قطر لجون كرين وسندين وإس بي إكس فلو وإن أو في وأكثر من 30 علامة أخرى، مع مراكز خدمة في رأس لفان والدوحة.",
  },
  dopet: {
    en: "EPIC projects, shutdowns and maintenance for Qatar’s operators, onshore and offshore, since 1981.",
    ar: "مشاريع الهندسة والتوريد والإنشاء، وعمليات الإيقاف والصيانة لمشغّلي الطاقة في قطر، في البر والبحر، منذ عام 1981.",
  },
  dst: {
    en: "Engineered equipment from Emerson, Cameron, Aggreko and other leading oilfield suppliers. A DOPET division from 2000, a company since 2019.",
    ar: "معدات هندسية من إيمرسون وكاميرون وأغريكو وغيرها من كبرى شركات حقول النفط. بدأت قسمًا في دوبت عام 2000، وأصبحت شركة مستقلة عام 2019.",
  },
  pemco: {
    en: "Conventional and advanced non-destructive testing and inspection, 100% Qatari, since 1987.",
    ar: "اختبارات غير إتلافية وفحص بالتقنيات التقليدية والمتقدمة، بملكية قطرية كاملة، منذ عام 1987.",
  },
};

export const aboutStatement: L10n = {
  en: "Al-Ahed began in 1975 by supplying equipment to Qatar’s young oil and gas industry. Today the Group’s four companies supply critical process equipment, build and maintain plants onshore and offshore, and independently inspect the assets that keep the country’s energy flowing.",
  ar: "بدأت العهد عام 1975 بتوريد المعدات لقطاع النفط والغاز الناشئ في قطر. واليوم تورّد شركات المجموعة الأربع معدات العمليات الحيوية، وتبني المنشآت وتصونها في البر والبحر، وتفحص بشكل مستقل الأصول التي تحافظ على تدفق الطاقة في الدولة.",
};

/** Concrete facts only (all present in the content files). */
export const facts: { value: string; label: L10n }[] = [
  { value: "1975", label: { en: "Founded in Doha", ar: "سنة التأسيس في الدوحة" } },
  { value: "4", label: { en: "Operating companies", ar: "شركات تشغيلية" } },
  { value: "50+", label: { en: "International brands represented", ar: "علامة تجارية عالمية نمثّلها" } },
  { value: "3", label: { en: "OEM-linked service centres", ar: "مراكز خدمة مرتبطة بالمصنّعين" } },
  { value: "171,500 m²", label: { en: "Workshops, yards and camps", ar: "ورش وساحات ومساكن" } },
];

export const sectorsSentence: L10n = {
  en: "We work across oil and gas, LNG, petrochemicals, refining, power and utilities, marine and offshore, and building and infrastructure.",
  ar: "نعمل في قطاعات النفط والغاز، والغاز الطبيعي المسال، والبتروكيماويات، والتكرير، والكهرباء والمرافق، والعمليات البحرية، والمباني والبنية التحتية.",
};

/**
 * Geographic coordinates of each location (WGS 84), used for the coordinates shown on the map, straight-line
 * distances from Group HQ and live local conditions. Doha, Salwa, Ras Laffan, Mesaieed and Dukhan are from
 * Wikipedia / Wikidata; New Doha, Al Karaana and Al Khor are approximate centres of the industrial zones.
 * Doha shows the Group's headquarters building; industrial areas show DOPET's own facilities where available.
 */
export const siteGeo: Record<string, { lat: number; lon: number; image: string }> = {
  doha: { lat: 25.2867, lon: 51.5333, image: "/images/hq.jpg" },
  salwa: { lat: 25.1675, lon: 51.4394, image: "/images/facilities/dopet-valve-shop.jpg" },
  newdoha: { lat: 25.115, lon: 51.465, image: "/images/facilities/dopet-fabrication-shop.jpg" },
  raslaffan: { lat: 25.8575, lon: 51.5389, image: "/images/refinery-towers.jpg" },
  alkhor: { lat: 25.69, lon: 51.46, image: "/images/facilities/dopet-structures.jpg" },
  dukhan: { lat: 25.43, lon: 50.78, image: "/images/wellhead-dukhan.jpg" },
  karaana: { lat: 25.01, lon: 51.06, image: "/images/facilities/dopet-skids.jpg" },
  mesaieed: { lat: 24.99, lon: 51.55, image: "/images/refinery-pipes.jpg" },
};

/** What actually happens at each location (facilities and projects listed in the content files). */
export const siteDetails: Record<string, { company: CompanyId | "holding"; text: L10n }[]> = {
  doha: [
    { company: "holding", text: { en: "Group headquarters, Building 207, C Ring Road", ar: "المقر الرئيسي للمجموعة، مبنى 207، الطريق الدائري الثالث" } },
    { company: "holding", text: { en: "Commercial building, Building 209, C Ring Road", ar: "المبنى التجاري، مبنى 209، الطريق الدائري الثالث" } },
    { company: "aatc", text: { en: "Al-Ahed T&C head office and showroom", ar: "المكتب الرئيسي وصالة عرض العهد للتجارة والمقاولات" } },
    { company: "pemco", text: { en: "PEMCO Inspection offices", ar: "مكاتب بمكو للفحص" } },
  ],
  salwa: [
    { company: "dopet", text: { en: "DOPET head office, 16,600 m² yard, fabrication and valve shops, Street 25", ar: "المكتب الرئيسي لدوبت وساحة 16,600 م² وورش التصنيع والصمامات، شارع 25" } },
    { company: "dopet", text: { en: "Accommodation camps for 900 people, Streets 27 and 47", ar: "مساكن تتسع لـ900 فرد، الشارعان 27 و47" } },
    { company: "aatc", text: { en: "ESAB Service Centre, Street 47, Salwa Road", ar: "مركز خدمة إيساب، شارع 47، طريق سلوى" } },
    { company: "aatc", text: { en: "Al-Ahed John Crane Service Centre", ar: "مركز خدمة العهد – جون كرين" } },
  ],
  newdoha: [
    { company: "dopet", text: { en: "3,200 m² fabrication shop with four 10 t cranes, Street 12", ar: "ورشة تصنيع 3,200 م² بأربع رافعات بحمولة 10 أطنان، شارع 12" } },
    { company: "dopet", text: { en: "600 m² stainless steel and non-ferrous shop", ar: "ورشة 600 م² للفولاذ المقاوم للصدأ والمعادن غير الحديدية" } },
    { company: "dopet", text: { en: "Yards of 21,300 m² (Street 12) and 10,000 m² (Street 1/2)", ar: "ساحتان بمساحة 21,300 م² (شارع 12) و10,000 م² (شارع 1/2)" } },
  ],
  raslaffan: [
    { company: "aatc", text: { en: "John Crane Service Centre, 1,152 m²: Qatar’s first dry gas seal repair and testing facility", ar: "مركز خدمة جون كرين، 1,152 م²: أول منشأة في قطر لإصلاح واختبار موانع تسرب الغاز الجاف" } },
    { company: "dopet", text: { en: "Valve service centre in partnership with Emerson, 600 m²", ar: "مركز خدمة صمامات بالشراكة مع إيمرسون، 600 م²" } },
    { company: "dopet", text: { en: "27,000 m² yard, 8 km from Ras Laffan port", ar: "ساحة 27,000 م² على بعد 8 كم من ميناء رأس لفان" } },
  ],
  alkhor: [{ company: "dopet", text: { en: "DOPET yard, 5,000 m²", ar: "ساحة دوبت، 5,000 م²" } }],
  dukhan: [
    { company: "dopet", text: { en: "14,000 m² yard and a 650-person accommodation camp", ar: "ساحة 14,000 م² ومسكن يتسع لـ650 فردًا" } },
    { company: "dopet", text: { en: "Turnaround and maintenance, Khatiya North, Main and South (from 2023)", ar: "الإيقاف والصيانة الشاملة، خطية الشمالية والرئيسية والجنوبية (منذ 2023)" } },
    { company: "pemco", text: { en: "Radiography subcontract for QatarEnergy, 2024–2029", ar: "عقد من الباطن للتصوير الإشعاعي لقطر للطاقة، 2024–2029" } },
    { company: "dopet", text: { en: "Hook-up of new KHUFF gas wells and Arab D gas-cap recycling wells", ar: "ربط آبار غاز الخف الجديدة وآبار إعادة تدوير غطاء الغاز العربي (د)" } },
  ],
  karaana: [{ company: "dopet", text: { en: "DOPET storage yard, 74,000 m²", ar: "ساحة تخزين دوبت، 74,000 م²" } }],
  mesaieed: [
    { company: "dopet", text: { en: "EPIC automation upgrade of NGL storage and loading facilities (from 2021)", ar: "مشروع تحديث أنظمة الأتمتة لمرافق تخزين وتحميل سوائل الغاز الطبيعي (منذ 2021)" } },
    { company: "dopet", text: { en: "EPIC of a new MP steam boiler and DM water plant at QP Refinery", ar: "مشروع غلاية بخار جديدة ومحطة مياه منزوعة المعادن في مصفاة قطر للبترول" } },
  ],
};
