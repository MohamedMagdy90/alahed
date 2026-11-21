import type { L10n } from "@/i18n/config";

export const FOUNDED = 1975;
export const yearsSince = () => new Date().getFullYear() - FOUNDED;

export const contact = {
  holding: {
    name: { en: "Al-Ahed Holding Co. Ltd.", ar: "شركة العهد القابضة ذ.م.م" } as L10n,
    address: { en: "P.O. Box 3266, Doha, State of Qatar", ar: "ص.ب 3266، الدوحة، دولة قطر" } as L10n,
    phone: "+974 4441 4022",
    phoneAlt: "+974 4441 4023",
    fax: "+974 4441 4021",
    email: "admin@alahed.com.qa",
  },
  socials: [
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/dopet" },
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/dopet.qatar/" },
    { id: "facebook", label: "Facebook", href: "https://www.facebook.com/AlAhedTradingQatar/" },
  ],
};

export type CompanyId = "aatc" | "dopet" | "pemco";

export type Company = {
  id: CompanyId;
  slug: string;
  index: string;
  founded: number;
  name: L10n;
  short: L10n;
  legal: L10n;
  tagline: L10n;
  summary: L10n;
  about: L10n<string[]>;
  services: L10n<string[]>;
  highlights: { value: string; label: L10n }[];
  facilities: L10n<string[]>;
  partners?: string[];
  projects?: L10n<string[]>;
  logo: string;
  logoBg: string;
  image: string;
  accent: string;
  website?: string;
  contact: { phone: string; email: string; address: L10n };
};

export const companies: Company[] = [
  {
    id: "aatc",
    slug: "al-ahed-trading-contracting",
    index: "01",
    founded: 1975,
    name: { en: "Al-Ahed Trading & Contracting", ar: "العهد للتجارة والمقاولات" },
    short: { en: "Al-Ahed T&C", ar: "العهد للتجارة" },
    legal: { en: "Al-Ahed Trading and Contracting Company W.L.L.", ar: "شركة العهد للتجارة والمقاولات ذ.م.م" },
    tagline: {
      en: "Internationally reputed brands, delivered at Qatar's doorstep.",
      ar: "علامات تجارية عالمية مرموقة، في متناول السوق القطري.",
    },
    summary: {
      en: "The Group's founding company. For five decades, Al-Ahed T&C has represented world-leading manufacturers of rotating equipment, sealing and flow-control technology for Qatar's oil, gas and petrochemical industries — backed by local service centres and engineering support.",
      ar: "الشركة المؤسِّسة للمجموعة. منذ خمسة عقود، تمثّل العهد للتجارة والمقاولات كبرى الشركات العالمية المصنّعة لمعدات الدوران وتقنيات منع التسرب والتحكم في التدفق لقطاعات النفط والغاز والبتروكيماويات في قطر، مدعومةً بمراكز خدمة محلية ودعم هندسي متخصص.",
    },
    about: {
      en: [
        "Established in 1975, Al-Ahed Trading & Contracting began as a supplier to Qatar's emerging oil and gas sector and has grown into one of the country's most trusted channel partners for critical process equipment.",
        "Working hand in hand with its principals, the company provides a one-stop solution — from product selection and supply to installation support, repair and after-sales service — through dedicated service centres in Salwa Industrial Area and Ras Laffan.",
      ],
      ar: [
        "تأسست العهد للتجارة والمقاولات عام 1975 مورّدًا لقطاع النفط والغاز الناشئ في قطر، ونمت لتصبح من أكثر الشركاء الموثوقين في الدولة لتوريد معدات العمليات الحيوية.",
        "وبالتعاون الوثيق مع الشركات التي تمثّلها، تقدّم الشركة حلولًا متكاملة تشمل اختيار المنتجات وتوريدها ودعم التركيب والإصلاح وخدمات ما بعد البيع، من خلال مراكز خدمة متخصصة في المنطقة الصناعية بالسيلية (سلوى) ورأس لفان.",
      ],
    },
    services: {
      en: [
        "Mechanical seals & dry gas seals",
        "Pumps and rotating equipment",
        "Filters, strainers & separators",
        "Quick-opening closures & pig signallers",
        "Gaskets & static sealing products",
        "Special drill pipes",
        "Mixers & chemical injection packages",
        "Oxygen & nitrogen generators",
        "Explosion-protected electrical products & cables",
        "Consulting & engineering services",
      ],
      ar: [
        "موانع التسرب الميكانيكية وموانع تسرب الغاز الجاف",
        "المضخات ومعدات الدوران",
        "الفلاتر والمصافي والفواصل",
        "أغطية الفتح السريع ومؤشرات الكاشطات",
        "الحشوات ومنتجات منع التسرب الثابتة",
        "أنابيب الحفر الخاصة",
        "الخلاطات ووحدات حقن المواد الكيميائية",
        "مولدات الأكسجين والنيتروجين",
        "المنتجات الكهربائية والكابلات المقاومة للانفجار",
        "الخدمات الاستشارية والهندسية",
      ],
    },
    highlights: [
      { value: "1975", label: { en: "Established", ar: "سنة التأسيس" } },
      { value: "13", label: { en: "Global principals", ar: "شريكًا عالميًا" } },
      { value: "2", label: { en: "John Crane service centres", ar: "مركزا خدمة جون كرين" } },
    ],
    facilities: {
      en: [
        "Al-Ahed John Crane Service Centre — Salwa Industrial Area",
        "Al-Ahed John Crane Dry Gas Seal Service Centre — Ras Laffan",
        "Showroom — Doha",
      ],
      ar: [
        "مركز خدمة العهد – جون كرين، المنطقة الصناعية",
        "مركز خدمة موانع تسرب الغاز الجاف العهد – جون كرين، رأس لفان",
        "صالة العرض – الدوحة",
      ],
    },
    partners: [
      "John Crane",
      "Sundyne",
      "NOV",
      "SPX FLOW",
      "Flexitallic",
      "Oil Plus",
      "Bion",
      "GD Engineering",
      "PCI Gases",
      "Elegar Kerpen",
      "Cortem",
      "Barton Firtop",
      "Hauff-Technik",
    ],
    logo: "/brand/aatc.png",
    logoBg: "#FFFFFF",
    image: "/images/refinery-pipes.jpg",
    accent: "#5DB543",
    website: "https://www.al-ahed.com",
    contact: {
      phone: "+974 4441 4121",
      email: "info@al-ahed.com",
      address: { en: "P.O. Box 3266, Doha, Qatar", ar: "ص.ب 3266، الدوحة، قطر" },
    },
  },
  {
    id: "dopet",
    slug: "dopet",
    index: "02",
    founded: 1981,
    name: { en: "DOPET", ar: "دوبت" },
    short: { en: "DOPET", ar: "دوبت" },
    legal: {
      en: "Doha Petroleum Construction Co. Ltd.",
      ar: "شركة الدوحة للإنشاءات البترولية المحدودة",
    },
    tagline: {
      en: "EPIC, shutdowns and construction for Qatar's energy operators.",
      ar: "مشاريع الهندسة والتوريد والإنشاء والتشغيل، وعمليات الإيقاف والإنشاءات لمشغّلي الطاقة في قطر.",
    },
    summary: {
      en: "Founded in 1981, DOPET is one of Qatar's largest companies undertaking EPIC projects, shutdowns and turnarounds, maintenance services, manpower supply and sales representation for prestigious oilfield equipment and service providers.",
      ar: "تأسست دوبت عام 1981، وهي من أكبر الشركات في قطر في تنفيذ مشاريع الهندسة والتوريد والإنشاء والتشغيل، وعمليات الإيقاف والصيانة الشاملة، وخدمات الصيانة، وتوفير القوى العاملة، وتمثيل كبرى الشركات العالمية لمعدات وخدمات حقول النفط.",
    },
    about: {
      en: [
        "Powered by a dedicated team of professionals, a strong workforce and sophisticated machinery, DOPET has delivered EPIC projects and diverse assignments in piping and structural fabrication and installation, pressure vessels and tanks, electrical, instrumentation and valve overhauling.",
        "Extensive workshops and fabrication facilities at Salwa Industrial Area, New Doha Industrial Area and Ras Laffan support site works, backed by a modern, fully equipped plant and maintenance facility. DOPET serves most major onshore and offshore operators in oil and gas, petrochemicals and utilities.",
      ],
      ar: [
        "بفضل فريق متخصص من المهنيين وقوى عاملة قوية ومعدات متطورة، نفّذت دوبت مشاريع هندسة وتوريد وإنشاء وتشغيل ومهام متنوعة في تصنيع وتركيب الأنابيب والهياكل المعدنية، وأوعية الضغط والخزانات، والأعمال الكهربائية والأجهزة الدقيقة، وإصلاح الصمامات.",
        "وتدعم أعمالها الميدانية ورشٌ ومرافق تصنيع واسعة في المنطقة الصناعية والمنطقة الصناعية الجديدة بالدوحة ورأس لفان، إلى جانب منشأة حديثة ومجهزة بالكامل لصيانة المعدات. وتخدم دوبت معظم المشغّلين الرئيسيين في البر والبحر في قطاعات النفط والغاز والبتروكيماويات والمرافق.",
      ],
    },
    services: {
      en: [
        "EPIC projects",
        "Call-off services",
        "Turnarounds, shutdowns & maintenance — onshore and offshore",
        "Construction works",
        "Workshop & fabrication services",
        "Manpower supply",
        "Sales & technology representation",
      ],
      ar: [
        "مشاريع الهندسة والتوريد والإنشاء والتشغيل",
        "خدمات العقود الإطارية",
        "عمليات الإيقاف والصيانة الشاملة في البر والبحر",
        "أعمال الإنشاءات",
        "خدمات الورش والتصنيع",
        "توفير القوى العاملة",
        "تمثيل المبيعات والتقنيات",
      ],
    },
    highlights: [
      { value: "1981", label: { en: "Established", ar: "سنة التأسيس" } },
      { value: "3", label: { en: "Fabrication facilities", ar: "مرافق تصنيع" } },
      { value: "EPIC", label: { en: "Onshore & offshore", ar: "في البر والبحر" } },
    ],
    facilities: {
      en: ["Salwa Industrial Area — Gate 185, Street 25", "New Doha Industrial Area", "Ras Laffan Industrial City"],
      ar: ["المنطقة الصناعية – بوابة 185، شارع 25", "المنطقة الصناعية الجديدة بالدوحة", "مدينة رأس لفان الصناعية"],
    },
    projects: {
      en: [
        "EPIC for hook-up of new KHUFF gas wells & Arab D gas-cap recycling wells — Dukhan",
        "EPIC of new MP steam boiler, DM water plant & associated facilities — QP Refinery, Mesaieed",
        "Inspection & maintenance of equipment and replacement of exchangers, Unit 17 (SRU) — TA-2021",
        "EPC for replacement of fresh cooling water exchangers — QG2",
        "Integrated construction services & manpower for ISND",
        "EPIC for Dukhan Production Facilities Upgrade (DPFU) Phase 1A, Package 2",
      ],
      ar: [
        "مشروع ربط آبار غاز الخف الجديدة وآبار إعادة تدوير غطاء الغاز العربي (د) – دخان",
        "مشروع غلاية بخار جديدة ومحطة مياه منزوعة المعادن ومرافق مرتبطة بها – مصفاة قطر للبترول، مسيعيد",
        "فحص وصيانة المعدات واستبدال المبادلات الحرارية في الوحدة 17 (استخلاص الكبريت) – 2021",
        "مشروع استبدال مبادلات مياه التبريد العذبة – قطر غاز 2",
        "خدمات إنشاءات متكاملة وتوفير قوى عاملة",
        "مشروع تطوير مرافق الإنتاج في دخان – المرحلة 1أ، الحزمة 2",
      ],
    },
    logo: "/brand/dopet.png",
    logoBg: "#FFFFFF",
    image: "/images/wellhead-dukhan.jpg",
    accent: "#E0322F",
    website: "https://www.dopet.com",
    contact: {
      phone: "+974 4460 0350",
      email: "dopet@dopet.com",
      address: {
        en: "P.O. Box 1744, Gate 185, Street 25, Salwa Industrial Area, Doha",
        ar: "ص.ب 1744، بوابة 185، شارع 25، المنطقة الصناعية، الدوحة",
      },
    },
  },
  {
    id: "pemco",
    slug: "pemco-inspection",
    index: "03",
    founded: 1975,
    name: { en: "PEMCO Inspection", ar: "بمكو للفحص" },
    short: { en: "PEMCO", ar: "بمكو" },
    legal: { en: "PEMCO Inspection", ar: "بمكو للفحص" },
    tagline: {
      en: "Independent inspection and testing that keeps critical assets safe.",
      ar: "فحص واختبار مستقل يحافظ على سلامة الأصول الحيوية.",
    },
    summary: {
      en: "PEMCO Inspection provides inspection, non-destructive testing (NDT) and quality assurance services for onshore and offshore oil and gas assets, supporting asset integrity, safety and regulatory compliance across Qatar.",
      ar: "تقدّم بمكو للفحص خدمات الفحص والاختبارات غير الإتلافية وضمان الجودة للأصول النفطية والغازية في البر والبحر، دعمًا لسلامة الأصول وموثوقيتها والامتثال للمتطلبات التنظيمية في قطر.",
    },
    about: {
      en: [
        "Part of the Group since its earliest years, PEMCO Inspection supports operators and contractors with independent inspection and testing throughout the asset life cycle — from fabrication and construction to in-service integrity programmes.",
        "Working alongside DOPET's construction and shutdown teams, PEMCO adds an assurance layer that helps clients complete critical work safely, on schedule and to specification.",
      ],
      ar: [
        "تُعد بمكو للفحص جزءًا من المجموعة منذ سنواتها الأولى، وتدعم المشغّلين والمقاولين بخدمات فحص واختبار مستقلة طوال دورة حياة الأصول، بدءًا من التصنيع والإنشاء وحتى برامج سلامة الأصول أثناء التشغيل.",
        "وبالعمل جنبًا إلى جنب مع فرق الإنشاءات وعمليات الإيقاف في دوبت، تضيف بمكو مستوى إضافيًا من الضمان يساعد العملاء على إنجاز الأعمال الحيوية بأمان وفي الوقت المحدد ووفق المواصفات.",
      ],
    },
    services: {
      en: [
        "Non-destructive testing (NDT)",
        "Third-party inspection",
        "Fabrication & construction inspection",
        "Shutdown & turnaround inspection support",
        "Asset integrity & condition assessment",
        "Quality assurance & quality control",
      ],
      ar: [
        "الاختبارات غير الإتلافية",
        "الفحص من طرف ثالث",
        "فحص أعمال التصنيع والإنشاء",
        "دعم الفحص خلال عمليات الإيقاف والصيانة الشاملة",
        "تقييم سلامة الأصول وحالتها",
        "ضمان الجودة ومراقبتها",
      ],
    },
    highlights: [
      { value: "1975", label: { en: "Established", ar: "سنة التأسيس" } },
      { value: "NDT", label: { en: "Testing & inspection", ar: "الفحص والاختبار" } },
      { value: "QA/QC", label: { en: "Quality assurance", ar: "ضمان الجودة" } },
    ],
    facilities: {
      en: ["Doha, State of Qatar"],
      ar: ["الدوحة، دولة قطر"],
    },
    logo: "/brand/pemco-cutout.png",
    logoBg: "#FFFFFF",
    image: "/images/offshore.jpg",
    accent: "#2D62C4",
    contact: {
      phone: "+974 4441 4022",
      email: "admin@alahed.com.qa",
      address: { en: "P.O. Box 3266, Doha, Qatar", ar: "ص.ب 3266، الدوحة، قطر" },
    },
  },
];

export const getCompany = (slug: string) => companies.find((c) => c.slug === slug);
export const companyById = (id: string) => companies.find((c) => c.id === id);

export const vision: L10n = {
  en: "To be the preferred partner of choice to our customers and employees, striving to deliver world-class products and solutions while maximising stakeholders' value.",
  ar: "أن نكون الشريك المفضّل لعملائنا وموظفينا، ساعين إلى تقديم منتجات وحلول عالمية المستوى، مع تعظيم القيمة لجميع أصحاب المصلحة.",
};

export const mission: L10n<string[]> = {
  en: [
    "We commit ourselves to building a forward-thinking, diversified organisation that maximises shareholder value by continuously enhancing business performance, delivering healthy financial results and achieving sustainable growth — providing a wide range of quality products and services at competitive prices.",
    "We continue to foster professionalism, personal integrity and the highest ethical standards in every aspect of our business and corporate social responsibility, while enabling individual career aspirations and a healthy work–life balance.",
  ],
  ar: [
    "نلتزم ببناء مؤسسة متنوعة ذات رؤية مستقبلية، تسعى إلى تعظيم قيمة المساهمين من خلال التحسين المستمر للأداء، وتحقيق نتائج مالية قوية ونمو مستدام، وتقديم مجموعة واسعة من المنتجات والخدمات عالية الجودة بأسعار تنافسية.",
    "ونواصل ترسيخ قيم المهنية والنزاهة الشخصية وأعلى المعايير الأخلاقية في جميع جوانب أعمالنا ومسؤوليتنا المجتمعية، مع تمكين الطموحات المهنية لموظفينا والحفاظ على توازن صحي بين العمل والحياة.",
  ],
};

export const values: { title: L10n; body: L10n }[] = [
  {
    title: { en: "Teamwork", ar: "العمل الجماعي" },
    body: {
      en: "We treat each other with respect and communicate openly, fostering collaboration while encouraging individual contribution — and letting the best ideas surface from anywhere in the organisation.",
      ar: "نتعامل باحترام متبادل وتواصل منفتح، ونعزز التعاون مع تشجيع المساهمة الفردية، ونتيح للأفكار المتميزة أن تبرز من أي مكان في المؤسسة.",
    },
  },
  {
    title: { en: "Think Customer", ar: "العميل أولًا" },
    body: {
      en: "Customers remain the primary focus of everything we do. We listen, understand and anticipate what they need today and tomorrow, delivering outstanding products, services and value.",
      ar: "يبقى العميل محور كل ما نقوم به؛ نُصغي إليه ونفهم احتياجاته ونستبقها اليوم وغدًا، لنقدّم له منتجات وخدمات وقيمة استثنائية.",
    },
  },
  {
    title: { en: "Value Employees", ar: "تقدير الموظفين" },
    body: {
      en: "Our people are as crucial to our success as our customers. Everyone is treated fairly and given the opportunity to develop and grow.",
      ar: "موظفونا لا يقلّون أهمية عن عملائنا في تحقيق نجاحنا؛ نعامل الجميع بإنصاف ونمنحهم فرص التطور والنمو.",
    },
  },
  {
    title: { en: "Take Action & Be Responsible", ar: "المبادرة وتحمّل المسؤولية" },
    body: {
      en: "We encourage proactivity, flexibility and innovation, take ownership of our commitments and do business safely and ethically — respecting the environment and the communities where we work.",
      ar: "نشجّع روح المبادرة والمرونة والابتكار، ونتحمّل مسؤولية التزاماتنا، ونمارس أعمالنا بأمان وأخلاقية، مع احترام البيئة والمجتمعات التي نعمل فيها.",
    },
  },
  {
    title: { en: "Strive for Excellence", ar: "السعي نحو التميّز" },
    body: {
      en: "We are committed to excellence in everything we do, passionate about results that exceed expectations, and driven to find practical, out-of-the-ordinary solutions.",
      ar: "نلتزم بالتميّز في كل ما نقوم به، ونسعى بشغف إلى نتائج تفوق التوقعات، وإلى إيجاد حلول عملية ومبتكرة.",
    },
  },
  {
    title: { en: "Integrity", ar: "النزاهة" },
    body: {
      en: "We meet the highest ethical standards in all our dealings, keep our word and hold ourselves accountable — with zero tolerance for fraud and corruption.",
      ar: "نلتزم بأعلى المعايير الأخلاقية في جميع تعاملاتنا، ونفي بوعودنا ونتحمّل مسؤولية أعمالنا، مع عدم التسامح مطلقًا مع الاحتيال والفساد.",
    },
  },
  {
    title: { en: "Commercial Focus", ar: "التركيز التجاري" },
    body: {
      en: "We promote profitability, efficiency and best-practice processes, and build productive, trusting relationships with governments, partners, customers and communities.",
      ar: "نعزّز الربحية والكفاءة وأفضل الممارسات، ونبني علاقات مثمرة قائمة على الثقة مع الجهات الحكومية والشركاء والعملاء والمجتمعات.",
    },
  },
];

export const milestones: { year: string; title: L10n; body: L10n }[] = [
  {
    year: "1975",
    title: { en: "The beginning", ar: "البداية" },
    body: {
      en: "Al-Ahed Trading & Contracting and PEMCO Inspection begin serving Qatar's oil and gas industry.",
      ar: "انطلاق العهد للتجارة والمقاولات وبمكو للفحص في خدمة قطاع النفط والغاز في قطر.",
    },
  },
  {
    year: "1981",
    title: { en: "DOPET is founded", ar: "تأسيس دوبت" },
    body: {
      en: "Doha Petroleum Construction Co. (DOPET) is established, adding EPIC, construction and maintenance capability.",
      ar: "تأسيس شركة الدوحة للإنشاءات البترولية (دوبت) لتضيف قدرات الهندسة والتوريد والإنشاء والصيانة.",
    },
  },
  {
    year: "2000s",
    title: { en: "Service centres", ar: "مراكز الخدمة" },
    body: {
      en: "Al-Ahed and John Crane open dedicated service centres in Salwa Industrial Area and Ras Laffan.",
      ar: "افتتاح مراكز خدمة متخصصة بالشراكة مع جون كرين في المنطقة الصناعية ورأس لفان.",
    },
  },
  {
    year: "2018",
    title: { en: "Al-Ahed Holding", ar: "العهد القابضة" },
    body: {
      en: "Al-Ahed Holding is established as the parent company, bringing the three subsidiaries under one strategic umbrella.",
      ar: "تأسيس العهد القابضة كشركة أم تجمع الشركات التابعة الثلاث تحت مظلة استراتيجية واحدة.",
    },
  },
  {
    year: "2026",
    title: { en: "Recognised by partners", ar: "تقدير الشركاء" },
    body: {
      en: "Al-Ahed T&C receives two Channel Partner of the Year awards from Celeros Flow Technology.",
      ar: "حصول العهد للتجارة والمقاولات على جائزتي شريك القناة للعام من سيليروس فلو تكنولوجي.",
    },
  },
  {
    year: "Next",
    title: { en: "The next chapter", ar: "الفصل القادم" },
    body: {
      en: "Preparing the Group for a listing on the Qatar Stock Exchange, with strengthened governance and transparency.",
      ar: "تهيئة المجموعة للإدراج في بورصة قطر، مع تعزيز الحوكمة والشفافية.",
    },
  },
];

export const capabilities: { id: string; title: L10n; body: L10n; company: CompanyId }[] = [
  {
    id: "brands",
    title: { en: "Brand representation", ar: "تمثيل العلامات التجارية" },
    body: {
      en: "Exclusive channel partnerships with world-leading manufacturers of process equipment.",
      ar: "شراكات حصرية مع كبرى الشركات العالمية المصنّعة لمعدات العمليات.",
    },
    company: "aatc",
  },
  {
    id: "epic",
    title: { en: "EPIC projects", ar: "مشاريع الهندسة والتوريد والإنشاء" },
    body: {
      en: "Engineering, procurement, installation and commissioning for onshore and offshore facilities.",
      ar: "الهندسة والتوريد والتركيب والتشغيل للمنشآت في البر والبحر.",
    },
    company: "dopet",
  },
  {
    id: "shutdown",
    title: { en: "Shutdowns & turnarounds", ar: "عمليات الإيقاف والصيانة الشاملة" },
    body: {
      en: "Planned maintenance campaigns delivered safely and on schedule.",
      ar: "حملات صيانة مخططة تُنفّذ بأمان وفي الوقت المحدد.",
    },
    company: "dopet",
  },
  {
    id: "service",
    title: { en: "Service & repair", ar: "الخدمة والإصلاح" },
    body: {
      en: "Certified service centres for seals, pumps and rotating equipment.",
      ar: "مراكز خدمة معتمدة لموانع التسرب والمضخات ومعدات الدوران.",
    },
    company: "aatc",
  },
  {
    id: "manpower",
    title: { en: "Manpower supply", ar: "توفير القوى العاملة" },
    body: {
      en: "Skilled technical workforce for construction, maintenance and operations.",
      ar: "قوى عاملة فنية ماهرة لأعمال الإنشاء والصيانة والتشغيل.",
    },
    company: "dopet",
  },
  {
    id: "ndt",
    title: { en: "Inspection & NDT", ar: "الفحص والاختبارات غير الإتلافية" },
    body: {
      en: "Independent inspection and testing that protects asset integrity.",
      ar: "فحص واختبار مستقل يحمي سلامة الأصول.",
    },
    company: "pemco",
  },
];

export const sectors: L10n[] = [
  { en: "Oil & Gas", ar: "النفط والغاز" },
  { en: "LNG", ar: "الغاز الطبيعي المسال" },
  { en: "Petrochemicals", ar: "البتروكيماويات" },
  { en: "Refining", ar: "التكرير" },
  { en: "Utilities", ar: "المرافق" },
  { en: "Offshore", ar: "العمليات البحرية" },
];

export const clients = ["QatarEnergy", "QatarEnergy LNG", "Shell", "Dolphin Energy", "ORYX GTL", "Qatar Petroleum Refinery", "Dukhan Field", "Mesaieed Industrial City"];

export const figures = [
  { value: 1975, suffix: "", label: { en: "Year established", ar: "سنة التأسيس" } as L10n, format: "year" as const },
  { value: 3, suffix: "", label: { en: "Operating companies", ar: "شركات تابعة" } as L10n },
  { value: 13, suffix: "+", label: { en: "Global principals", ar: "شريكًا عالميًا" } as L10n },
  { value: 95, suffix: "%", label: { en: "On-time in-full delivery", ar: "تسليم في الوقت وبالكامل" } as L10n },
  { value: 1, prefix: "<", suffix: "", label: { en: "Accident frequency rate", ar: "معدل تكرار الحوادث" } as L10n },
  { value: 14001, prefix: "ISO ", suffix: "", label: { en: "Certified industrial sites", ar: "مواقع صناعية معتمدة" } as L10n, format: "year" as const },
];

export const governancePrinciples: L10n[] = [
  { en: "Transparency in operational decisions", ar: "الشفافية في القرارات التشغيلية" },
  { en: "Effective internal controls", ar: "ضوابط رقابية داخلية فعّالة" },
  { en: "Rigorous rules on conflicts of interest", ar: "قواعد صارمة بشأن تعارض المصالح" },
  { en: "Solid principles for related-party dealings", ar: "مبادئ راسخة للتعامل مع الأطراف ذات العلاقة" },
  { en: "Risk assessment", ar: "تقييم المخاطر" },
  { en: "Auditing & accounting standards", ar: "معايير التدقيق والمحاسبة" },
  { en: "Protection of minority rights", ar: "حماية حقوق الأقلية" },
  { en: "Compliance", ar: "الامتثال" },
];

export const sites = [
  { id: "doha", name: { en: "Doha — Group HQ", ar: "الدوحة – المقر الرئيسي" } as L10n, companies: ["holding", "aatc", "pemco"] },
  { id: "salwa", name: { en: "Salwa Industrial Area", ar: "المنطقة الصناعية" } as L10n, companies: ["aatc", "dopet"] },
  { id: "raslaffan", name: { en: "Ras Laffan Industrial City", ar: "مدينة رأس لفان الصناعية" } as L10n, companies: ["aatc", "dopet"] },
  { id: "mesaieed", name: { en: "Mesaieed", ar: "مسيعيد" } as L10n, companies: ["dopet"] },
  { id: "dukhan", name: { en: "Dukhan", ar: "دخان" } as L10n, companies: ["dopet"] },
];

export const postTypes: Record<string, L10n> = {
  news: { en: "News", ar: "أخبار" },
  blog: { en: "Insights", ar: "مقالات" },
  event: { en: "Events", ar: "فعاليات" },
  press: { en: "Press release", ar: "بيان صحفي" },
  award: { en: "Awards", ar: "جوائز" },
};

export const companyLabels: Record<string, L10n> = {
  holding: { en: "Al-Ahed Holding", ar: "العهد القابضة" },
  aatc: { en: "Al-Ahed T&C", ar: "العهد للتجارة والمقاولات" },
  dopet: { en: "DOPET", ar: "دوبت" },
  pemco: { en: "PEMCO", ar: "بمكو" },
};

export const documentCategories: Record<string, L10n> = {
  financial: { en: "Financial statements", ar: "القوائم المالية" },
  disclosure: { en: "Disclosures", ar: "الإفصاحات" },
  governance: { en: "Governance", ar: "الحوكمة" },
  presentation: { en: "Presentations", ar: "العروض التقديمية" },
  agm: { en: "General assembly", ar: "الجمعية العامة" },
  sustainability: { en: "Sustainability", ar: "الاستدامة" },
};
