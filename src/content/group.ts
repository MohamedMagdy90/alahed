import type { CompanyId } from "@/content/site";
import type { L10n } from "@/i18n/config";

/** Group-level facts from the Al-Ahed Holding corporate profile. */

export const holdingAbout: L10n<string[]> = {
  en: [
    "Al-Ahed Holding was established in 2018 and comprises four wholly owned subsidiaries. The business began in 1975 with a modest operation serving Qatar's oil and gas industry, and grew by adding services aligned with that industry: international brands for the local market, EPIC, manpower, shutdowns, NDT and more.",
    "The holding company provides long-term vision and strategic direction to its subsidiaries and actively oversees their day-to-day operations, while continuing to invest in companies that share its core values.",
  ],
  ar: [
    "تأسست العهد القابضة عام 2018، وتضم أربع شركات تابعة مملوكة لها بالكامل. وقد بدأت الأعمال عام 1975 بنشاط متواضع في خدمة قطاع النفط والغاز في قطر، ثم توسّعت بإضافة خدمات مكمّلة لهذا القطاع: توفير العلامات العالمية للسوق المحلي، ومشاريع الهندسة والتوريد والإنشاء، والقوى العاملة، وعمليات الإيقاف، والاختبارات غير الإتلافية وغيرها.",
    "وتوفّر الشركة القابضة الرؤية بعيدة المدى والتوجيه الاستراتيجي لشركاتها التابعة، وتشرف بفاعلية على عملياتها اليومية، وتواصل الاستثمار في الشركات التي تشاركها قيمها الأساسية.",
  ],
};

export const principle: L10n = { en: "Your Service Partner", ar: "شريككم في الخدمة" };

/** Shareholding of Al-Ahed Holding W.L.L. */
export const shareholders: { name: L10n; stake: number; rep: L10n }[] = [
  {
    name: { en: "Imperial Real Estate W.L.L.", ar: "شركة إمبريال العقارية ذ.م.م" },
    stake: 50,
    rep: { en: "Represented by Mr. Jassim Mohammed Al Mansoori", ar: "يمثّلها السيد جاسم محمد المنصوري" },
  },
  {
    name: { en: "Albukhamis Trading & Contracting W.L.L.", ar: "شركة البوخميس للتجارة والمقاولات ذ.م.م" },
    stake: 50,
    rep: { en: "Represented by Mr. Jaber Ahmad Al Sulaiti", ar: "يمثّلها السيد جابر أحمد السليطي" },
  },
];

/** Board & organisation structure (also seeded into the Leadership page). */
export const board: { name: L10n; role: L10n }[] = [
  { name: { en: "Jaber Ahmad Al Sulaiti", ar: "جابر أحمد السليطي" }, role: { en: "Chairman of the Board", ar: "رئيس مجلس الإدارة" } },
  { name: { en: "Jassim Mohammed Al Mansoori", ar: "جاسم محمد المنصوري" }, role: { en: "Vice Chairman & President", ar: "نائب رئيس مجلس الإدارة والرئيس" } },
  { name: { en: "Mohammed Jaber Al Sulaiti", ar: "محمد جابر السليطي" }, role: { en: "Managing Director & CEO", ar: "العضو المنتدب والرئيس التنفيذي" } },
  { name: { en: "Ahmad Mohammed Al Mansoori", ar: "أحمد محمد المنصوري" }, role: { en: "Board Member", ar: "عضو مجلس الإدارة" } },
  { name: { en: "Hamad Qasim Al Saei", ar: "حمد قاسم الساعي" }, role: { en: "Board Member", ar: "عضو مجلس الإدارة" } },
];

export const management: { name: L10n; role: L10n; company?: CompanyId }[] = [
  { name: { en: "Nirav Bavisi", ar: "نيراف بافيسي" }, role: { en: "Chief Financial Officer", ar: "المدير المالي" } },
  { name: { en: "Prabhakaran Balasubramanian", ar: "برابهاكاران بالاسوبرامانيان" }, role: { en: "General Manager, Sales", ar: "المدير العام للمبيعات" }, company: "aatc" },
  { name: { en: "Nicholas Dean Stothard", ar: "نيكولاس دين ستوثارد" }, role: { en: "General Manager", ar: "المدير العام" }, company: "dopet" },
  { name: { en: "N. Shankaran", ar: "ن. شانكاران" }, role: { en: "Sales Manager", ar: "مدير المبيعات" }, company: "dst" },
  { name: { en: "Parthiban Selvaraj", ar: "بارثيبان سيلفاراج" }, role: { en: "General Manager", ar: "المدير العام" }, company: "pemco" },
];

/** Corporate & commercial property portfolio. */
export const properties: { name: L10n; address: L10n }[] = [
  { name: { en: "Headquarters", ar: "المقر الرئيسي" }, address: { en: "Building 207, C Ring Road, Doha", ar: "مبنى 207، الطريق الدائري الثالث، الدوحة" } },
  { name: { en: "Commercial building", ar: "المبنى التجاري" }, address: { en: "Building 209, C Ring Road, Doha", ar: "مبنى 209، الطريق الدائري الثالث، الدوحة" } },
  { name: { en: "Legacy building", ar: "المبنى التاريخي" }, address: { en: "Old Salata, the Group's former headquarters", ar: "السلطة القديمة، المقر الرئيسي السابق للمجموعة" } },
];

export const footprint = {
  area: 171500,
  locations: 7,
  label: {
    en: "Total footprint of workshops, storage, yards and camps",
    ar: "إجمالي مساحة الورش والمخازن والساحات والمساكن",
  } as L10n,
  intro: {
    en: "A broad, strategically distributed operating base across Qatar keeps the Group close to its clients, speeds up mobilisation and supports efficient project delivery.",
    ar: "قاعدة تشغيلية واسعة وموزّعة استراتيجيًا في أنحاء قطر تُبقي المجموعة قريبة من عملائها، وتسرّع التعبئة، وتدعم كفاءة تنفيذ المشاريع.",
  } as L10n,
  places: [
    { en: "Salwa Industrial Area", ar: "المنطقة الصناعية" },
    { en: "New Doha Industrial Area", ar: "المنطقة الصناعية الجديدة" },
    { en: "Ras Laffan Industrial City", ar: "مدينة رأس لفان الصناعية" },
    { en: "Dukhan Industrial City", ar: "مدينة دخان الصناعية" },
    { en: "Mesaieed Industrial City", ar: "مدينة مسيعيد الصناعية" },
    { en: "Al Karaana Industrial Zone", ar: "منطقة الكرعانة الصناعية" },
    { en: "Al Khor Industrial Area", ar: "منطقة الخور الصناعية" },
  ] as L10n[],
};

/** Integrated workshop capabilities. */
export const workshops: { value: string; title: L10n; body: L10n }[] = [
  {
    value: "5,100 m²",
    title: { en: "Fabrication shops", ar: "ورش التصنيع" },
    body: { en: "Carbon steel, stainless steel and non-ferrous fabrication.", ar: "تصنيع الفولاذ الكربوني والمقاوم للصدأ والمعادن غير الحديدية." },
  },
  {
    value: "1,050 m²",
    title: { en: "Machine shop", ar: "ورشة التشغيل الآلي" },
    body: { en: "CNC, boring, drilling and high-precision threading.", ar: "التشغيل بالحاسب والتجويف والحفر والتسنين عالي الدقة." },
  },
  {
    value: "500 m²",
    title: { en: "Electrical shop", ar: "ورشة الكهرباء" },
    body: { en: "Motor, generator, pump and distribution-board repair and testing.", ar: "إصلاح واختبار المحركات والمولدات والمضخات ولوحات التوزيع." },
  },
  {
    value: "2",
    title: { en: "Valve service centres", ar: "مركزا خدمة صمامات" },
    body: { en: "Valves up to 36 in, pressure testing up to 10,000 psi.", ar: "صمامات حتى 36 بوصة، واختبار ضغط حتى 10,000 رطل/بوصة²." },
  },
];

export const workshopsNote: L10n = {
  en: "Local, multi-discipline capacity supports service integration, import substitution and operational continuity.",
  ar: "تدعم القدرات المحلية متعددة التخصصات تكامل الخدمات وإحلال الواردات واستمرارية العمليات.",
};

/** OEM-linked service centres. */
export const oemCentres: { name: string; place: L10n; area: L10n; company: CompanyId }[] = [
  {
    name: "John Crane",
    place: { en: "Ras Laffan Industrial City", ar: "مدينة رأس لفان الصناعية" },
    area: { en: "1,152 m² built-up area", ar: "1,152 م² مساحة مبنية" },
    company: "aatc",
  },
  {
    name: "Emerson",
    place: { en: "Ras Laffan Industrial City & Salwa Industrial Area", ar: "مدينة رأس لفان الصناعية والمنطقة الصناعية" },
    area: { en: "1,400 m² covered area", ar: "1,400 م² مساحة مغطاة" },
    company: "dopet",
  },
  {
    name: "ESAB",
    place: { en: "Doha Industrial Area", ar: "المنطقة الصناعية بالدوحة" },
    area: { en: "200 m² covered area", ar: "200 م² مساحة مغطاة" },
    company: "aatc",
  },
];

export const oemNote: L10n = {
  en: "OEM-aligned facilities expand aftermarket participation, strengthen customer access and support recurring service work.",
  ar: "توسّع المرافق المرتبطة بالمصنّعين المشاركة في خدمات ما بعد البيع، وتعزّز الوصول إلى العملاء، وتدعم أعمال الخدمة المتكررة.",
};
