import type { L10n } from "@/i18n/config";

export const FOUNDED = 1975;
export const yearsSince = () => new Date().getFullYear() - FOUNDED;

export const contact = {
  holding: {
    name: { en: "Al-Ahed Holding W.L.L.", ar: "شركة العهد القابضة ذ.م.م" } as L10n,
    address: {
      en: "Building 207, C Ring Road, P.O. Box 3266, Doha, State of Qatar",
      ar: "مبنى 207، الطريق الدائري الثالث، ص.ب 3266، الدوحة، دولة قطر",
    } as L10n,
    phone: "+974 4441 4022",
    phoneAlt: "+974 4441 4023",
    fax: "+974 4441 4021",
    email: "executive.assistant@alahedholding.qa",
  },
  socials: [
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/dopet" },
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/dopet.qatar/" },
    { id: "facebook", label: "Facebook", href: "https://www.facebook.com/AlAhedTradingQatar/" },
  ],
};

export type CompanyId = "aatc" | "dopet" | "dst" | "pemco";

export type Company = {
  id: CompanyId;
  slug: string;
  index: string;
  founded: number;
  /** Set when the company operates within another group company (DOPET S&T within DOPET). */
  parent?: CompanyId;
  name: L10n;
  short: L10n;
  legal: L10n;
  tagline: L10n;
  summary: L10n;
  about: L10n<string[]>;
  services: L10n<string[]>;
  highlights: { value: string; label: L10n }[];
  facilities: L10n<string[]>;
  /** Flagship principals shown in the home page network (the full portfolio lives in content/profiles). */
  partners?: string[];
  /** Earlier landmark projects (the recent project table lives in content/profiles). */
  projects?: L10n<string[]>;
  logo: string;
  logoBg: string;
  image: string;
  accent: string;
  website?: string;
  contact: { phone: string; fax?: string; email: string; address: L10n };
};

/**
 * The four companies, always in founding order (oldest first): AATC 1975, DOPET 1981, PEMCO 1987, DOPET S&T 2019.
 * Every list, tab strip, grid and menu on the site loops over this array, so the order is enforced by the sort
 * below rather than by the position of each entry in the source.
 */
export const companies: Company[] = byFounding([
  {
    id: "aatc",
    slug: "al-ahed-trading-contracting",
    index: "01",
    founded: 1975,
    name: { en: "Al-Ahed Trading & Contracting", ar: "العهد للتجارة والمقاولات" },
    short: { en: "Al-Ahed T&C", ar: "العهد للتجارة" },
    legal: { en: "Al-Ahed Trading & Contracting Co. W.L.L.", ar: "شركة العهد للتجارة والمقاولات ذ.م.م" },
    tagline: {
      en: "Internationally reputed brands, delivered at Qatar's doorstep.",
      ar: "علامات تجارية عالمية مرموقة، في متناول السوق القطري.",
    },
    summary: {
      en: "The Group's founding company. Since 1975, Al-Ahed T&C has supplied original-equipment-manufacturer (OEM) products to Qatar's energy sector through exclusive agency agreements with world-leading brands, including John Crane, Sundyne, SPX FLOW, NOV, Flexitallic, PPG and ESAB, backed by local service centres and after-sales support.",
      ar: "الشركة المؤسِّسة للمجموعة. منذ عام 1975 تورّد العهد للتجارة والمقاولات منتجات الشركات المصنّعة الأصلية لقطاع الطاقة في قطر، بموجب اتفاقيات وكالة حصرية مع علامات عالمية رائدة، منها جون كرين وسندين وإس بي إكس فلو وإن أو في وفليكسيتاليك وبي بي جي وإيساب، مدعومةً بمراكز خدمة محلية ودعم ما بعد البيع.",
    },
    about: {
      en: [
        "Established in 1975, Al-Ahed Trading & Contracting is a wholly owned subsidiary of Al-Ahed Holding. For more than 40 years it has represented John Crane and Sundyne in Qatar, and it holds Tier-1 recognition in Sundyne's ChannelONE partner programme.",
        "Its portfolio covers rotating equipment, process equipment and fittings, electrical and instrumentation, coatings and chemicals, and a showroom for industrial trade. Field service engineers, Qatar's first dry gas seal repair and testing facility at Ras Laffan and an exclusive ESAB service centre keep that equipment running.",
      ],
      ar: [
        "تأسست العهد للتجارة والمقاولات عام 1975، وهي شركة مملوكة بالكامل للعهد القابضة. وتمثّل جون كرين وسندين في قطر منذ أكثر من 40 عامًا، وحصلت على تصنيف الفئة الأولى في برنامج شركاء ChannelONE التابع لسندين.",
        "وتشمل محفظتها معدات الدوران، ومعدات العمليات والتجهيزات، والأنظمة الكهربائية والأجهزة الدقيقة، والطلاءات والمواد الكيميائية، إلى جانب صالة عرض للتجارة الصناعية. ويدعم ذلك مهندسو خدمة ميدانية، وأول منشأة في قطر لإصلاح واختبار موانع تسرب الغاز الجاف في رأس لفان، ومركز خدمة حصري لإيساب.",
      ],
    },
    services: {
      en: [
        "Mechanical seals, dry gas seals & seal support systems",
        "Pumps & compressors: supply, field service & overhauls",
        "Process pumps, mixers & chemical injection skids",
        "Pipeline valves, closures & pigging solutions",
        "Gaskets, static sealing, filters & strainers",
        "Explosion-proof lighting, cables & instrumentation",
        "Protective & marine coatings, water-treatment chemicals",
        "Welding equipment, tools & PPE (showroom)",
        "Dry gas seal repair & testing in Ras Laffan",
        "ESAB welding machine service & repair",
      ],
      ar: [
        "موانع التسرب الميكانيكية وموانع تسرب الغاز الجاف وأنظمة دعمها",
        "المضخات والضواغط: التوريد والخدمة الميدانية والعَمرات",
        "مضخات العمليات والخلاطات ووحدات حقن المواد الكيميائية",
        "صمامات خطوط الأنابيب وأغطية الفتح السريع وحلول الكاشطات",
        "الحشوات ومنتجات منع التسرب الثابتة والفلاتر والمصافي",
        "الإنارة المقاومة للانفجار والكابلات والأجهزة الدقيقة",
        "الطلاءات الواقية والبحرية وكيماويات معالجة المياه",
        "معدات اللحام والأدوات ومعدات الوقاية الشخصية (صالة العرض)",
        "إصلاح واختبار موانع تسرب الغاز الجاف في رأس لفان",
        "خدمة وإصلاح ماكينات اللحام من إيساب",
      ],
    },
    highlights: [
      { value: "1975", label: { en: "Established", ar: "سنة التأسيس" } },
      { value: "40+", label: { en: "Years representing John Crane and Sundyne", ar: "عامًا في تمثيل جون كرين وسندين" } },
      { value: "Tier 1", label: { en: "Sundyne ChannelONE partner", ar: "شريك سندين ChannelONE" } },
      { value: "3", label: { en: "Service centres", ar: "مراكز خدمة" } },
    ],
    facilities: {
      en: [
        "John Crane Service Centre, Ras Laffan Industrial City: 1,152 m², Qatar's first dry gas seal repair and testing facility",
        "ESAB Service Centre, Street 47, Salwa Road, Industrial Area: 200 m²",
        "Al-Ahed John Crane Service Centre, Salwa Industrial Area",
        "Head office, Building 207, C Ring Road, Doha",
      ],
      ar: [
        "مركز خدمة جون كرين، مدينة رأس لفان الصناعية: 1,152 م²، أول منشأة في قطر لإصلاح واختبار موانع تسرب الغاز الجاف",
        "مركز خدمة إيساب، شارع 47، طريق سلوى، المنطقة الصناعية: 200 م²",
        "مركز خدمة العهد – جون كرين، المنطقة الصناعية",
        "المكتب الرئيسي، مبنى 207، الطريق الدائري الثالث، الدوحة",
      ],
    },
    partners: [
      "John Crane",
      "Sundyne",
      "SPX FLOW",
      "NOV",
      "Celeros",
      "Flexitallic",
      "CECO Environmental",
      "Barton Firtop",
      "PCI Gases",
      "Elegar Kerpen",
      "Cortem",
      "Spink Controls",
      "PPG",
      "ESAB",
    ],
    logo: "/brand/aatc.png",
    logoBg: "#FFFFFF",
    image: "/images/refinery-pipes.jpg",
    accent: "#5DB543",
    website: "https://www.al-ahed.com",
    contact: {
      phone: "+974 4441 4022",
      fax: "+974 4441 4021",
      email: "sales@alahed.com.qa",
      address: {
        en: "Building 207, C Ring Road, 2nd Floor, P.O. Box 3266, Doha, Qatar",
        ar: "مبنى 207، الطريق الدائري الثالث، الطابق الثاني، ص.ب 3266، الدوحة، قطر",
      },
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
      en: "Doha Petroleum Construction Co. Ltd. (DOPET) W.L.L.",
      ar: "شركة الدوحة للإنشاءات البترولية المحدودة (دوبت) ذ.م.م",
    },
    tagline: {
      en: "EPIC, shutdowns and construction for Qatar's energy operators.",
      ar: "مشاريع الهندسة والتوريد والإنشاء والتشغيل، وعمليات الإيقاف والإنشاءات لمشغّلي الطاقة في قطر.",
    },
    summary: {
      en: "Founded in 1981, DOPET is one of Qatar's largest companies undertaking EPIC projects onshore and offshore, shutdowns and turnarounds, maintenance services, technical manpower and workshop services for the oil and gas, petrochemical and utilities industries.",
      ar: "تأسست دوبت عام 1981، وهي من أكبر الشركات في قطر في تنفيذ مشاريع الهندسة والتوريد والإنشاء والتشغيل في البر والبحر، وعمليات الإيقاف والصيانة الشاملة، وخدمات الصيانة، وتوفير القوى العاملة الفنية، وخدمات الورش لقطاعات النفط والغاز والبتروكيماويات والمرافق.",
    },
    about: {
      en: [
        "Powered by a dedicated team of professionals, a strong workforce and sophisticated machinery, DOPET has delivered EPIC projects and diverse assignments in piping and structural fabrication and installation, pressure vessels and tanks, electrical, instrumentation and valve overhauling.",
        "Fabrication shops, workshops and yards in Salwa Industrial Area, New Doha Industrial Area, Ras Laffan, Dukhan, Al Khor and Al Karaana support its site work. Its integrated quality, health, safety and environment management system is certified to ISO 9001, ISO 14001 and ISO 45001 by LRQA.",
      ],
      ar: [
        "بفضل فريق متخصص من المهنيين وقوى عاملة قوية ومعدات متطورة، نفّذت دوبت مشاريع هندسة وتوريد وإنشاء وتشغيل ومهام متنوعة في تصنيع وتركيب الأنابيب والهياكل المعدنية، وأوعية الضغط والخزانات، والأعمال الكهربائية والأجهزة الدقيقة، وإصلاح الصمامات.",
        "وتدعم أعمالها الميدانية ورشُ تصنيع وورش متخصصة وساحات في المنطقة الصناعية والمنطقة الصناعية الجديدة بالدوحة ورأس لفان ودخان والخور والكرعانة. ونظامها المتكامل لإدارة الجودة والصحة والسلامة والبيئة حاصل على شهادات الأيزو 9001 و14001 و45001 من LRQA.",
      ],
    },
    services: {
      en: [
        "EPIC projects, from award to final hand-over",
        "Shutdowns, turnarounds & maintenance, onshore and offshore",
        "Call-off resource & material supply",
        "Technical manpower, temporary or permanent",
        "Construction: structures, piping, vessels, skids & tanks",
        "Fabrication, valve, electrical, instrumentation & machine shops",
        "Plant & equipment hire with operators",
      ],
      ar: [
        "مشاريع الهندسة والتوريد والإنشاء والتشغيل، من الترسية حتى التسليم النهائي",
        "عمليات الإيقاف والصيانة الشاملة في البر والبحر",
        "توريد الموارد والمواد بموجب عقود إطارية",
        "توفير القوى العاملة الفنية، مؤقتة أو دائمة",
        "الإنشاءات: الهياكل والأنابيب والأوعية والوحدات المجمّعة والخزانات",
        "ورش التصنيع والصمامات والكهرباء والأجهزة الدقيقة والتشغيل الآلي",
        "تأجير المعدات والآليات مع المشغّلين",
      ],
    },
    highlights: [
      { value: "1981", label: { en: "Established", ar: "سنة التأسيس" } },
      { value: "25+", label: { en: "Years of shutdowns and turnarounds", ar: "عامًا من عمليات الإيقاف والصيانة الشاملة" } },
      { value: "80+", label: { en: "Certified welding procedures", ar: "إجراء لحام معتمد" } },
      { value: "1,500 t", label: { en: "Skid and pipe-rack capacity", ar: "سعة تصنيع الوحدات المجمّعة وحوامل الأنابيب" } },
    ],
    facilities: {
      en: [
        "Salwa Industrial Area, Gate 185, Street 25: head office, yard, fabrication and valve shops",
        "New Doha Industrial Area, Streets 12 and 1/2: fabrication shops and yards",
        "Ras Laffan Industrial City: yard and Emerson valve service centre",
        "Dukhan: yard and accommodation camp",
        "Al Khor: yard",
        "Al Karaana Industrial Zone: storage yard",
      ],
      ar: [
        "المنطقة الصناعية، بوابة 185، شارع 25: المكتب الرئيسي والساحة وورش التصنيع والصمامات",
        "المنطقة الصناعية الجديدة بالدوحة، الشارعان 12 و1/2: ورش تصنيع وساحات",
        "مدينة رأس لفان الصناعية: ساحة ومركز خدمة صمامات إيمرسون",
        "دخان: ساحة وسكن للعاملين",
        "الخور: ساحة",
        "منطقة الكرعانة الصناعية: ساحة تخزين",
      ],
    },
    projects: {
      en: [
        "EPIC for hook-up of new KHUFF gas wells & Arab D gas-cap recycling wells, Dukhan",
        "EPIC of new MP steam boiler, DM water plant & associated facilities, QP Refinery, Mesaieed",
        "Inspection & maintenance of equipment and replacement of exchangers, Unit 17 (SRU), TA-2021",
        "EPC for replacement of fresh cooling water exchangers, QG2",
        "Integrated construction services & manpower for ISND",
        "EPIC for Dukhan Production Facilities Upgrade (DPFU) Phase 1A, Package 2",
      ],
      ar: [
        "مشروع ربط آبار غاز الخف الجديدة وآبار إعادة تدوير غطاء الغاز العربي (د)، دخان",
        "مشروع غلاية بخار جديدة ومحطة مياه منزوعة المعادن ومرافق مرتبطة بها، مصفاة قطر للبترول، مسيعيد",
        "فحص وصيانة المعدات واستبدال المبادلات الحرارية في الوحدة 17 (استخلاص الكبريت)، 2021",
        "مشروع استبدال مبادلات مياه التبريد العذبة، قطر غاز 2",
        "خدمات إنشاءات متكاملة وتوفير قوى عاملة",
        "مشروع تطوير مرافق الإنتاج في دخان، المرحلة 1أ، الحزمة 2",
      ],
    },
    logo: "/brand/dopet.png",
    logoBg: "#FFFFFF",
    image: "/images/wellhead-dukhan.jpg",
    accent: "#E0322F",
    website: "https://www.dopet.com",
    contact: {
      phone: "+974 4460 0350",
      fax: "+974 4460 1066",
      email: "dopet@dopet.com",
      address: {
        en: "P.O. Box 1744, Gate 185, Street 25, Salwa Industrial Area, Doha",
        ar: "ص.ب 1744، بوابة 185، شارع 25، المنطقة الصناعية، الدوحة",
      },
    },
  },
  {
    id: "dst",
    slug: "dopet-sales-technologies",
    index: "03",
    founded: 2019,
    parent: "dopet",
    name: { en: "DOPET Sales & Technologies", ar: "دوبت للمبيعات والتكنولوجيا" },
    short: { en: "DOPET S&T", ar: "دوبت للمبيعات" },
    legal: { en: "DOPET Sales & Technologies W.L.L.", ar: "دوبيت للمبيعات والتكنولوجيا ذ.م.م" },
    tagline: {
      en: "Engineered equipment and technology from the world's leading oilfield suppliers.",
      ar: "معدات هندسية وتقنيات من كبرى الشركات العالمية لمعدات حقول النفط.",
    },
    summary: {
      en: "DOPET Sales & Technologies represents some of the world's most respected oilfield equipment and service suppliers in Qatar, from Emerson and Cameron to Aggreko and Hydratight. It began as DOPET's Sales & Technology Division in June 2000 and became a company in its own right in 2019.",
      ar: "تمثّل دوبت للمبيعات والتكنولوجيا في قطر نخبة من أبرز الشركات العالمية لمعدات وخدمات حقول النفط، من إيمرسون وكاميرون إلى أغريكو وهايدراتايت. وقد بدأت قسمًا للمبيعات والتكنولوجيا في دوبت في يونيو 2000، ثم أصبحت شركة مستقلة عام 2019.",
    },
    about: {
      en: [
        "The division was formed in June 2000 to provide quality equipment and services to the chemical, oil and gas, power and water industries in Qatar. In 2019 it became DOPET Sales & Technologies W.L.L., one of the Group's four wholly owned companies, working alongside DOPET.",
        "More than 30 professionals manage its accounts, supplying spares and services to large EPIC customers. Its stance is that of a business partner rather than an agent, providing services with integrity, quality and reliability, with a focus on advanced technologies, engineered solutions and specialised equipment.",
      ],
      ar: [
        "تأسس القسم في يونيو 2000 لتوفير معدات وخدمات عالية الجودة لقطاعات الكيماويات والنفط والغاز والكهرباء والمياه في قطر. وفي عام 2019 أصبح شركة دوبت للمبيعات والتكنولوجيا ذ.م.م، إحدى الشركات الأربع المملوكة بالكامل للمجموعة، وتعمل جنبًا إلى جنب مع دوبت.",
        "يدير حساباتها أكثر من 30 متخصصًا، يورّدون قطع الغيار والخدمات لكبار عملاء مشاريع الهندسة والتوريد والإنشاء. وهي لا تعمل وكيلًا فحسب، بل شريك أعمال يقدّم خدماته بنزاهة وجودة وموثوقية، مع تركيز على التقنيات المتقدمة والحلول الهندسية والمعدات المتخصصة.",
      ],
    },
    services: {
      en: [
        "Valves, transmitters, metering skids & flow measurement",
        "Analysers, analytical instruments & control systems",
        "Wellheads, X-mas trees, choke & ball valves",
        "Generators, transformers & load banks",
        "Bolt tensioning, torquing & on-site machining",
        "Hot-work habitats for hazardous areas",
        "Steam systems, pumps & heat exchangers",
        "Water treatment & reverse osmosis",
        "Specialised cables, pipes & materials",
      ],
      ar: [
        "الصمامات وأجهزة الإرسال ووحدات القياس وقياس التدفق",
        "أجهزة التحليل والأجهزة التحليلية وأنظمة التحكم",
        "رؤوس الآبار وأشجار الإنتاج وصمامات الخنق والصمامات الكروية",
        "المولدات والمحولات وأحمال الاختبار",
        "شد البراغي وعزم الربط والتشغيل الآلي في الموقع",
        "حاويات العمل الساخن للمناطق الخطرة",
        "أنظمة البخار والمضخات والمبادلات الحرارية",
        "معالجة المياه والتناضح العكسي",
        "الكابلات والأنابيب والمواد المتخصصة",
      ],
    },
    highlights: [
      { value: "2000", label: { en: "Sales & Technology Division formed", ar: "تأسيس قسم المبيعات والتكنولوجيا" } },
      { value: "2019", label: { en: "Established as a company", ar: "التأسيس كشركة مستقلة" } },
      { value: "30+", label: { en: "Professionals managing accounts", ar: "متخصصًا يديرون الحسابات" } },
    ],
    facilities: { en: [], ar: [] },
    logo: "/brand/dopet-st.png",
    logoBg: "#FFFFFF",
    image: "/images/engineer.jpg",
    accent: "#E0322F",
    website: "https://www.dopet.com",
    contact: {
      phone: "+974 4460 0350",
      fax: "+974 4460 1066",
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
    founded: 1987,
    name: { en: "PEMCO Inspection", ar: "بمكو للفحص" },
    short: { en: "PEMCO", ar: "بمكو" },
    legal: { en: "PEMCO Inspection Company W.L.L.", ar: "شركة بمكو لخدمات التفتيش ذ.م.م" },
    tagline: {
      en: "Independent inspection and testing that keeps critical assets safe.",
      ar: "فحص واختبار مستقل يحافظ على سلامة الأصول الحيوية.",
    },
    summary: {
      en: "Founded in 1987, PEMCO Inspection is a 100% Qatari company and one of the country's largest providers of non-destructive testing (NDT) and inspection, shutdown and turnaround support and technical manpower, with a long record of work for QatarEnergy and Qatar's industrial companies.",
      ar: "تأسست بمكو للفحص عام 1987، وهي شركة قطرية بنسبة 100% ومن أكبر الشركات في الدولة في مجال الاختبارات غير الإتلافية والفحص، ودعم عمليات الإيقاف والصيانة الشاملة، وتوفير القوى العاملة الفنية، ولها سجل طويل من الأعمال لقطر للطاقة والشركات الصناعية في قطر.",
    },
    about: {
      en: [
        "With a dedicated team of professionals, a strong workforce and modern equipment, PEMCO carries out conventional and advanced NDT, welding, plant and tank inspection, coating and corrosion inspection and rope-access integrity work for the energy, marine and offshore, power and utility, and building and infrastructure sectors.",
        "A fully equipped yard and maintenance facility keeps its equipment ready for deployment. Its people hold ASNT NDT Level III, CSWIP and AWS, SNT-TC-1A and ISO 9712 qualifications, and its radiation protection officers are MME-licensed.",
      ],
      ar: [
        "بفريق متخصص من المهنيين وقوى عاملة قوية ومعدات حديثة، تنفّذ بمكو الاختبارات غير الإتلافية التقليدية والمتقدمة، وفحص اللحامات والمصانع والخزانات، وفحص الطلاءات والتآكل، وأعمال فحص السلامة بتقنية الحبال لقطاعات الطاقة، والبحرية والبحرية المغمورة، والكهرباء والمرافق، والمباني والبنية التحتية.",
        "وتحافظ ساحة ومنشأة صيانة مجهزة بالكامل على جاهزية معداتها للعمل. ويحمل فريقها مؤهلات المستوى الثالث من ASNT وCSWIP وAWS وSNT-TC-1A وISO 9712، ومسؤولو الحماية من الإشعاع لديها مرخّصون (MME).",
      ],
    },
    services: {
      en: [
        "Conventional NDT: RT, UT, DPT, MPT, hardness & ferrite testing",
        "Advanced NDT: computed & digital radiography, PAUT, TOFD, FMC",
        "Tube inspection: ECT, IRIS, RFET, MFL, NFT/NFA",
        "Corrosion screening: LRUT, PEC, robotic mapping, tank-floor MFL",
        "Welding, plant, tank & equipment inspection",
        "Coating & corrosion inspection, offshore & marine",
        "Positive material identification (PMI) & PWHT",
        "Rope access, confined-space entry & integrity inspection",
        "Laboratory testing & CCTV pipeline inspection",
        "Third-party inspectors & technical manpower",
      ],
      ar: [
        "الاختبارات التقليدية: التصوير الإشعاعي والموجات فوق الصوتية والصبغ النافذ والجسيمات المغناطيسية واختبارا الصلادة والفريت",
        "الاختبارات المتقدمة: التصوير الإشعاعي المحوسب والرقمي وPAUT وTOFD وFMC",
        "فحص الأنابيب: ECT وIRIS وRFET وMFL وNFT/NFA",
        "مسح التآكل: LRUT وPEC والمسح الآلي وفحص أرضيات الخزانات بتقنية MFL",
        "فحص اللحامات والمصانع والخزانات والمعدات",
        "فحص الطلاءات والتآكل في المواقع البحرية",
        "تحديد هوية المواد (PMI) والمعالجة الحرارية بعد اللحام",
        "الوصول بالحبال ودخول الأماكن المحصورة وفحص السلامة",
        "الاختبارات المخبرية وفحص خطوط الأنابيب بالكاميرات",
        "مفتشو الطرف الثالث والقوى العاملة الفنية",
      ],
    },
    highlights: [
      { value: "1987", label: { en: "Established", ar: "سنة التأسيس" } },
      { value: "100%", label: { en: "Qatari owned", ar: "ملكية قطرية" } },
      { value: "Level III", label: { en: "ASNT NDT certification", ar: "شهادة ASNT للاختبارات غير الإتلافية" } },
      { value: "4", label: { en: "Long-term contracts under way", ar: "عقود طويلة الأجل قيد التنفيذ" } },
    ],
    facilities: {
      en: ["Fully equipped yard and equipment maintenance facility, Qatar"],
      ar: ["ساحة ومنشأة صيانة معدات مجهزة بالكامل، قطر"],
    },
    logo: "/brand/pemco.png",
    logoBg: "#FFFFFF",
    image: "/images/offshore.jpg",
    accent: "#2D62C4",
    website: "https://www.pemcondt.com",
    contact: {
      phone: "+974 4460 0972",
      email: "pselvaraj@pemcondt.com",
      address: { en: "P.O. Box 3266, Doha, Qatar", ar: "ص.ب 3266، الدوحة، قطر" },
    },
  },
]);

function byFounding(list: Company[]): Company[] {
  return [...list].sort((a, b) => a.founded - b.founded);
}

/** Founding-order rank of a company id ("holding" and unknown ids first), for sorting other per-company lists. */
export const companyRank = (id: string) => companies.findIndex((c) => c.id === id);

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

/** `listing: true` = only shown while listing information is switched on in the admin settings. */
export const milestones: { year: string; title: L10n; body: L10n; listing?: boolean }[] = [
  {
    year: "1975",
    title: { en: "The beginning", ar: "البداية" },
    body: {
      en: "Al-Ahed Trading & Contracting begins supplying Qatar's oil and gas industry with equipment from international manufacturers.",
      ar: "انطلاق العهد للتجارة والمقاولات في توريد معدات الشركات العالمية لقطاع النفط والغاز في قطر.",
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
    year: "1987",
    title: { en: "PEMCO Inspection", ar: "بمكو للفحص" },
    body: {
      en: "PEMCO Inspection Company is founded, a 100% Qatari provider of non-destructive testing and inspection.",
      ar: "تأسيس شركة بمكو لخدمات التفتيش، وهي شركة قطرية بالكامل متخصصة في الاختبارات غير الإتلافية والفحص.",
    },
  },
  {
    year: "2000",
    title: { en: "Sales & Technology", ar: "المبيعات والتكنولوجيا" },
    body: {
      en: "DOPET forms its Sales & Technology Division in June to represent leading oilfield equipment suppliers in Qatar.",
      ar: "تأسيس قسم المبيعات والتكنولوجيا في دوبت في يونيو لتمثيل كبرى الشركات العالمية لمعدات حقول النفط في قطر.",
    },
  },
  {
    year: "2018",
    title: { en: "Al-Ahed Holding", ar: "العهد القابضة" },
    body: {
      en: "Al-Ahed Holding is established as the parent company, owning its subsidiaries outright and setting their long-term direction.",
      ar: "تأسيس العهد القابضة شركةً أمًّا تملك شركاتها التابعة بالكامل وترسم توجهها الاستراتيجي طويل الأمد.",
    },
  },
  {
    year: "2019",
    title: { en: "DOPET Sales & Technologies", ar: "دوبت للمبيعات والتكنولوجيا" },
    body: {
      en: "The division becomes DOPET Sales & Technologies W.L.L., the Group's fourth wholly owned company.",
      ar: "تحوّل القسم إلى شركة دوبت للمبيعات والتكنولوجيا ذ.م.م، رابع الشركات المملوكة بالكامل للمجموعة.",
    },
  },
  {
    year: "2022",
    title: { en: "Safety recognised", ar: "تقدير في السلامة" },
    body: {
      en: "DOPET takes first place in QatarEnergy's 2022 Health, Environment & Safety Scorecard.",
      ar: "حصول دوبت على المركز الأول في بطاقة أداء الصحة والسلامة والبيئة لعام 2022 من قطر للطاقة.",
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
    listing: true,
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
    id: "technology",
    title: { en: "Engineered equipment", ar: "المعدات الهندسية" },
    body: {
      en: "Valves, metering, wellhead, power and specialised equipment from leading oilfield suppliers.",
      ar: "صمامات ووحدات قياس ومعدات رؤوس آبار وطاقة ومعدات متخصصة من كبرى شركات حقول النفط.",
    },
    company: "dst",
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
  { en: "Power & utilities", ar: "الكهرباء والمرافق" },
  { en: "Marine & offshore", ar: "العمليات البحرية" },
  { en: "Building & infrastructure", ar: "المباني والبنية التحتية" },
];

/** Operators and industrial companies named as clients in the companies' 2025–2026 profiles. */
export const clients = [
  "QatarEnergy",
  "QatarEnergy LNG",
  "Shell",
  "TotalEnergies",
  "Dolphin Energy",
  "North Oil Company",
  "ORYX GTL",
  "Occidental (OXY)",
  "QAFCO",
  "QAPCO",
  "Q-Chem",
];

/** The full client list (home page shows the first eleven in the network). */
export const clientsAll = [
  ...clients,
  "QAFAC",
  "RLOC",
  "Kahramaa",
  "Qatalum",
  "Qatar Steel",
  "Q-Power",
  "Mesaieed Power",
  "WOQOD",
  "SEEF",
  "QSTec",
];

export const figures = [
  { value: 1975, suffix: "", label: { en: "Year established", ar: "سنة التأسيس" } as L10n, format: "year" as const },
  { value: 4, suffix: "", label: { en: "Operating companies", ar: "شركات تابعة" } as L10n },
  { value: 50, suffix: "+", label: { en: "International brands represented", ar: "علامة تجارية عالمية نمثّلها" } as L10n },
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
  { id: "salwa", name: { en: "Salwa Industrial Area", ar: "المنطقة الصناعية" } as L10n, companies: ["aatc", "dopet", "dst"] },
  { id: "newdoha", name: { en: "New Doha Industrial Area", ar: "المنطقة الصناعية الجديدة" } as L10n, companies: ["dopet"] },
  { id: "raslaffan", name: { en: "Ras Laffan Industrial City", ar: "مدينة رأس لفان الصناعية" } as L10n, companies: ["aatc", "dopet", "dst"] },
  { id: "alkhor", name: { en: "Al Khor Industrial Area", ar: "منطقة الخور الصناعية" } as L10n, companies: ["dopet"] },
  { id: "dukhan", name: { en: "Dukhan", ar: "دخان" } as L10n, companies: ["dopet", "pemco"] },
  { id: "karaana", name: { en: "Al Karaana Industrial Zone", ar: "منطقة الكرعانة الصناعية" } as L10n, companies: ["dopet"] },
  { id: "mesaieed", name: { en: "Mesaieed Industrial City", ar: "مدينة مسيعيد الصناعية" } as L10n, companies: ["dopet"] },
];
/** Short place names for the maps themselves (full names stay in the lists and detail panels). */
export const MAP_LABEL: Record<string, L10n> = {
  newdoha: { en: "New Doha", ar: "الصناعية الجديدة" },
  raslaffan: { en: "Ras Laffan", ar: "رأس لفان" },
  alkhor: { en: "Al Khor", ar: "الخور" },
  karaana: { en: "Al Karaana", ar: "الكرعانة" },
  mesaieed: { en: "Mesaieed", ar: "مسيعيد" },
};

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
  dst: { en: "DOPET S&T", ar: "دوبت للمبيعات والتكنولوجيا" },
};

export const documentCategories: Record<string, L10n> = {
  financial: { en: "Financial statements", ar: "القوائم المالية" },
  disclosure: { en: "Disclosures", ar: "الإفصاحات" },
  governance: { en: "Governance", ar: "الحوكمة" },
  presentation: { en: "Presentations", ar: "العروض التقديمية" },
  agm: { en: "General assembly", ar: "الجمعية العامة" },
  sustainability: { en: "Sustainability", ar: "الاستدامة" },
};
