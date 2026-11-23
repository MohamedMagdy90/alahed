import type { CompanyId } from "@/content/site";
import type { L10n } from "@/i18n/config";

/**
 * Detailed company content, taken from the companies' own profiles (Al-Ahed Holding corporate profile,
 * Al-Ahed Trading presentation 04/2026, DOPET corporate profile, PEMCO profile). Nothing here is invented:
 * where a profile gives only a heading, the site shows only the heading.
 */

export type Brand = { name: string; origin?: string; lines: L10n };
export type Division = { id: string; title: L10n; brands: Brand[] };
export type Pillar = { title: L10n; body?: L10n };
export type ServiceGroup = { title: L10n; body?: L10n; items?: L10n<string[]> };
export type Domain = { id: string; title: L10n; body: L10n; points: L10n<string[]>; image: string };
export type Facility = { title: L10n; summary: L10n; specs: L10n<string[]>; image?: string; metric?: { value: L10n; label: L10n } };
export type ProjectRow = { client: string; title: L10n; period: string; scope?: L10n };
export type ProjectTable = { id: string; title: L10n; rows: ProjectRow[] };

export type Profile = {
  /** Second photograph, used behind the principles band (the hero keeps the company's main image). */
  photo?: string;
  vision?: L10n;
  mission?: L10n;
  pillars?: { title: L10n; items: Pillar[] };
  markets?: L10n[];
  serviceGroups?: { title: L10n; groups: ServiceGroup[] };
  portfolio?: { title: L10n; intro: L10n; divisions: Division[]; note?: L10n };
  showroom?: { title: L10n; intro: L10n; groups: { title: L10n; brands: string[] }[] };
  serviceCentres?: Facility[];
  domains?: { title: L10n; intro: L10n; items: Domain[] };
  facilities?: { title: L10n; intro: L10n; items: Facility[] };
  yards?: { site: L10n; area: number }[];
  camps?: { site: L10n; capacity: number }[];
  certifications?: { title: L10n; intro: L10n; items: { name: string; body: L10n }[] };
  hse?: { intro: L10n; items: L10n[] };
  awards?: { org: string; title: L10n; date: string }[];
  projectTables?: ProjectTable[];
  partnersNote?: { title: L10n; items: { client: L10n; work: L10n }[] };
  clients?: string[];
  people?: { name: L10n; role: L10n }[];
  partnership?: { title: L10n; intro: L10n; points: L10n[] };
};

const t = (en: string, ar: string): L10n => ({ en, ar });
const list = (en: string[], ar: string[]): L10n<string[]> => ({ en, ar });

export const profiles: Record<CompanyId, Profile> = {
  /* ------------------------------------------------------------------ AATC */
  aatc: {
    photo: "/images/refinery-towers.jpg",
    vision: t(
      "To be the premier service partner for Qatar's energy sector, driving innovation and excellence.",
      "أن نكون شريك الخدمة الأول لقطاع الطاقة في قطر، دافعين نحو الابتكار والتميّز.",
    ),
    mission: t(
      "To deliver quality-driven, cost-effective solutions that exceed client expectations, ensuring long-term partnerships.",
      "تقديم حلول عالية الجودة وفعّالة من حيث التكلفة تفوق توقعات العملاء وتضمن شراكات طويلة الأمد.",
    ),
    pillars: {
      title: t("What makes us different", "ما يميّزنا"),
      items: [
        { title: t("50+ years", "أكثر من 50 عامًا"), body: t("Over five decades of experience in Qatar's energy industry.", "أكثر من خمسة عقود من الخبرة في قطاع الطاقة القطري.") },
        { title: t("OEM partnerships", "شراكات مع المصنّعين"), body: t("Exclusive partnerships with global, energy-specialised original equipment manufacturers.", "شراكات حصرية مع شركات عالمية مصنّعة للمعدات الأصلية ومتخصصة في قطاع الطاقة.") },
        { title: t("After-sales", "ما بعد البيع"), body: t("A proven record of timely delivery and dependable after-sales support.", "سجل مثبت في التسليم في الوقت المحدد ودعم موثوق لما بعد البيع.") },
        { title: t("Quality and cost", "الجودة والتكلفة"), body: t("High-quality solutions at competitive prices, the basis of lasting partnerships.", "حلول عالية الجودة بأسعار تنافسية، وهي أساس الشراكات الدائمة.") },
      ],
    },
    portfolio: {
      title: t("Product portfolio", "محفظة المنتجات"),
      intro: t(
        "Exclusive agency agreements with leading manufacturers, organised in five divisions. Each brand is supplied as OEM-certified, warranted product with local support.",
        "اتفاقيات وكالة حصرية مع كبرى الشركات المصنّعة، موزّعة على خمسة أقسام. وتُورَّد منتجات كل علامة أصليةً ومعتمدةً من المصنّع ومشمولةً بالضمان، مع دعم محلي.",
      ),
      note: t("Exclusive agencies also include SuperHouse and Norton Saint-Gobain.", "وتشمل الوكالات الحصرية أيضًا SuperHouse ونورتون سان غوبان."),
      divisions: [
        {
          id: "rotating",
          title: t("Rotating equipment", "معدات الدوران"),
          brands: [
            { name: "John Crane", lines: t("Mechanical seals, dry gas seals, turbomachinery support systems, API plan systems, couplings, gland packings, filtration systems and JCAMS asset management. Represented by Al-Ahed for more than 40 years.", "موانع التسرب الميكانيكية وموانع تسرب الغاز الجاف وأنظمة دعم التوربينات وأنظمة خطط API والوصلات والحشوات وأنظمة الترشيح وحلول JCAMS لإدارة الأصول. تمثّلها العهد منذ أكثر من 40 عامًا.") },
            { name: "Sundyne", origin: "France · USA · UK · Spain", lines: t("LMV API-610 OH6 pumps, API-617 process gas compressors, Sunflo ANSI pumps, HMD and ANSIMAG seal-less magnetic drive pumps and Marelli API-610 pumps. Al-Ahed is a Tier-1 ChannelONE partner.", "مضخات LMV وفق API-610 من النوع OH6، وضواغط غاز العمليات وفق API-617، ومضخات Sunflo وفق ANSI، ومضخات HMD وANSIMAG المغناطيسية دون موانع تسرب، ومضخات Marelli وفق API-610. والعهد شريك من الفئة الأولى في برنامج ChannelONE.") },
          ],
        },
        {
          id: "process",
          title: t("Process equipment & fittings", "معدات العمليات والتجهيزات"),
          brands: [
            { name: "SPX FLOW · Bran+Luebbe", origin: "Germany", lines: t("Double diaphragm, metering and process pumps, chemical injection skids and multi-stream analysing equipment.", "مضخات ثنائية الغشاء ومضخات القياس ومضخات العمليات ووحدات حقن المواد الكيميائية ومعدات التحليل متعددة التيارات.") },
            { name: "SPX FLOW · Lightnin & Plenty Mixers", origin: "Poland", lines: t("Custom-designed mixers and agitators for equalisation, neutralisation, flocculation, aeration and blending.", "خلاطات ومقلّبات مصممة حسب الطلب للمعادلة والتعادل والتلبيد والتهوية والخلط.") },
            { name: "SPX FLOW · Johnson Pump", origin: "Netherlands", lines: t("Internal gear, flow control, rotary lobe and air-operated double diaphragm pumps.", "مضخات التروس الداخلية والتحكم في التدفق والفصوص الدوارة والمضخات ثنائية الغشاء الهوائية.") },
            { name: "CECO Environmental · Fybroc", origin: "USA", lines: t("Fibreglass-reinforced polymer (FRP) pumps for acids, brines, caustics, solvents and seawater.", "مضخات من البوليمر المقوّى بالألياف الزجاجية للأحماض والمحاليل الملحية والقلويات والمذيبات ومياه البحر.") },
            { name: "Celeros · GD Engineering", origin: "UK", lines: t("Quick-opening closures, pig signallers and multiple pig launching systems, topside and subsea.", "أغطية الفتح السريع ومؤشرات الكاشطات وأنظمة إطلاق الكاشطات المتعددة فوق سطح البحر وتحته.") },
            { name: "Celeros · M&J Valves", origin: "USA", lines: t("Control, gate, check, diverter, bi-directional ball and surge valves for pipelines, storage and offshore platforms.", "صمامات التحكم والبوابة وعدم الرجوع والتحويل والصمامات الكروية ثنائية الاتجاه وصمامات التموّر لخطوط الأنابيب والتخزين والمنصات البحرية.") },
            { name: "Celeros · Copes-Vulcan", origin: "USA", lines: t("General-service and severe-duty control valves, desuperheaters and steam-converting valves.", "صمامات تحكم للخدمة العامة والظروف القاسية، ومخفّضات حرارة البخار وصمامات تحويل البخار.") },
            { name: "Celeros · Plenty Mirrlees Pumps", origin: "UK", lines: t("Positive displacement, rotary vane and twin and triple screw pumps.", "مضخات الإزاحة الموجبة والريشة الدوارة والمضخات اللولبية الثنائية والثلاثية.") },
            { name: "NOV", origin: "USA · Malaysia · Oman", lines: t("XL Systems wedge-thread connectors (16–72 in), process and flow technologies for separation and treatment, Fiber Glass Systems GRE piping and choke valves.", "وصلات XL Systems ذات اللولب الإسفيني (16–72 بوصة)، وتقنيات العمليات والتدفق للفصل والمعالجة، وأنابيب الإيبوكسي المقوّى بالألياف الزجاجية من Fiber Glass Systems، وصمامات الخنق.") },
            { name: "Flexitallic", origin: "UK", lines: t("Spiral wound, semi-metallic, RTJ, Kammprofile and sheet gaskets, and dynamic and static packings.", "حشوات حلزونية وشبه معدنية وحلقية وKammprofile وحشوات الألواح، والحشوات الديناميكية والثابتة.") },
            { name: "Barton Firtop", origin: "UK", lines: t("Filters, strainers, coalescers, separators, pressure vessels, flame arresters, sight glasses and static mixers.", "الفلاتر والمصافي والمجمّعات والفواصل وأوعية الضغط ومانعات اللهب وزجاج المراقبة والخلاطات الثابتة.") },
            { name: "Prosave", origin: "South Korea", lines: t("Pilot-operated pressure relief, vacuum relief and air release valves, and flame arresters.", "صمامات تنفيس الضغط الموجّهة وصمامات تنفيس الفراغ وتحرير الهواء، ومانعات اللهب.") },
            { name: "Flowline Valves", origin: "Oman", lines: t("Ball, gate, globe, check, butterfly and specialty industrial valves.", "صمامات صناعية كروية وبوابية وكروية الشكل وعدم رجوع وفراشية وصمامات خاصة.") },
            { name: "Genetech", origin: "Oman", lines: t("Instrumentation valves, block-and-bleed valves, manifolds and tube fittings.", "صمامات الأجهزة الدقيقة وصمامات العزل والتنفيس والمشعبات ووصلات الأنابيب.") },
            { name: "Noble Glass Works", origin: "India", lines: t("Toughened glass for flameproof lighting, sight glasses and glass and PTFE components.", "زجاج مقسّى لإنارة مقاومة اللهب وزجاج المراقبة ومكوّنات الزجاج والتفلون.") },
            { name: "PCI Gases", origin: "USA · India", lines: t("Ruggedised on-site oxygen and nitrogen generators.", "مولدات أكسجين ونيتروجين متينة للإنتاج في الموقع.") },
            { name: "Allmarc", origin: "India", lines: t("Scaffolding and shoring, decking and safe-access systems, Grip Strut and custom fabrication.", "السقالات والدعامات وأنظمة الأرضيات والوصول الآمن وGrip Strut والتصنيع حسب الطلب.") },
            { name: "Detect Technologies", origin: "India", lines: t("T-Pulse AI for workplace safety, operations and inspections, and GUMPS pipeline corrosion protection.", "منصة T-Pulse للذكاء الاصطناعي في السلامة والتشغيل والفحص، وحلول GUMPS لحماية خطوط الأنابيب من التآكل.") },
          ],
        },
        {
          id: "electrical",
          title: t("Electrical & instrumentation", "الكهرباء والأجهزة الدقيقة"),
          brands: [
            { name: "Elegar Kerpen", origin: "India", lines: t("Instrumentation, control, high-temperature and hybrid cables.", "كابلات الأجهزة الدقيقة والتحكم والكابلات المقاومة للحرارة والكابلات الهجينة.") },
            { name: "Cortem Group", origin: "Italy", lines: t("ATEX/IECEx explosion-proof lighting, junction boxes, control stations, switchgear and panel boards.", "إنارة مقاومة للانفجار وفق ATEX/IECEx، وصناديق التوصيل ومحطات التحكم والمفاتيح الكهربائية واللوحات.") },
            { name: "Baliga Lighting", origin: "India", lines: t("Flameproof and increased-safety lighting, Exd control panels and purged panels.", "إنارة مقاومة للهب وعالية الأمان، ولوحات تحكم Exd ولوحات مضغوطة.") },
            { name: "Capeserve Energy", origin: "India", lines: t("Explosion-proof battery management systems (ExBMS) to ATEX and IECEx.", "أنظمة إدارة بطاريات مقاومة للانفجار وفق ATEX وIECEx.") },
            { name: "Spink Controls", origin: "India", lines: t("Flow meters, data loggers, temperature and level sensors and variable-area flow meters.", "مقاييس التدفق ومسجّلات البيانات وحساسات الحرارة والمستوى ومقاييس التدفق متغيرة المساحة.") },
          ],
        },
        {
          id: "coatings",
          title: t("Coatings & chemicals", "الطلاءات والمواد الكيميائية"),
          brands: [
            { name: "PPG · Sigma", origin: "GCC · Europe", lines: t("Offshore, marine, glass-flake epoxy, anti-fouling, pipeline, tank and high-temperature coatings.", "طلاءات للمنشآت البحرية والسفن والإيبوكسي بالرقائق الزجاجية ومضادة للحشف ولخطوط الأنابيب والخزانات ومقاومة للحرارة.") },
            { name: "Grand Polycoats", origin: "GCC · India", lines: t("Industrial, warehouse, car-park and food-grade epoxy and PU floor coatings, and anti-static coatings.", "طلاءات أرضيات صناعية وللمستودعات ومواقف السيارات ومصانع الأغذية بالإيبوكسي والبولي يوريثان، وطلاءات مضادة للكهرباء الساكنة.") },
            { name: "Aditya Birla Chemicals", origin: "India", lines: t("Wastewater and pool treatment chemicals and food-grade calcium chloride.", "كيماويات معالجة مياه الصرف وأحواض السباحة، وكلوريد الكالسيوم الغذائي.") },
            { name: "NanoH2O", lines: t("Membranes and water chemicals (formerly LG Chem).", "الأغشية وكيماويات المياه (سابقًا LG Chem).") },
          ],
        },
      ],
    },
    showroom: {
      title: t("Showroom: industrial trade", "صالة العرض: التجارة الصناعية"),
      intro: t(
        "As an authorised distributor, the Doha showroom stocks tools, welding equipment and safety products from internationally known brands.",
        "بصفتها موزّعًا معتمدًا، تعرض صالة العرض في الدوحة أدوات ومعدات لحام ومنتجات سلامة من علامات تجارية عالمية معروفة.",
      ),
      groups: [
        { title: t("Welding", "اللحام"), brands: ["ESAB"] },
        { title: t("Abrasives & markers", "مواد الصنفرة والأقلام"), brands: ["Grindex", "Sakura"] },
        { title: t("Hand tools", "الأدوات اليدوية"), brands: ["Irimo", "Bahco"] },
        { title: t("Power tools", "الأدوات الكهربائية"), brands: ["Chicago Pneumatic", "Fuji"] },
        { title: t("Precision tools", "أدوات القياس الدقيقة"), brands: ["Mitutoyo", "IMCO"] },
        { title: t("Personal protection", "معدات الوقاية الشخصية"), brands: ["Allan Cooper"] },
        { title: t("Security", "الأمان"), brands: ["Master Lock"] },
        { title: t("Portable blowers & ventilators", "المنافيخ والمراوح المتنقلة"), brands: ["Coppus"] },
      ],
    },
    serviceCentres: [
      {
        title: t("John Crane Service Centre", "مركز خدمة جون كرين"),
        summary: t("Ras Laffan Industrial City. Qatar's first dry gas seal repair and testing facility.", "مدينة رأس لفان الصناعية. أول منشأة في قطر لإصلاح واختبار موانع تسرب الغاز الجاف."),
        metric: { value: t("1,152 m²", "1,152 م²"), label: t("Built-up area", "مساحة مبنية") },
        specs: list(
          ["Repair and testing of dry gas seals in Qatar", "Spare-part stocking", "Repair and balancing of standard and high-pressure couplings", "Shorter lead times and lower shipping costs for customers"],
          ["إصلاح واختبار موانع تسرب الغاز الجاف داخل قطر", "تخزين قطع الغيار", "إصلاح وموازنة الوصلات القياسية وعالية الضغط", "تقليص مدد التوريد وتكاليف الشحن على العملاء"],
        ),
      },
      {
        title: t("ESAB Service Centre", "مركز خدمة إيساب"),
        summary: t("Street 47, Salwa Road, Industrial Area. An exclusive, full-fledged ESAB service centre.", "شارع 47، طريق سلوى، المنطقة الصناعية. مركز خدمة حصري ومتكامل لإيساب."),
        metric: { value: t("200 m²", "200 م²"), label: t("Covered area", "مساحة مغطاة") },
        specs: list(["Service and repair of ESAB welding machines", "Sales of spares and consumables"], ["خدمة وإصلاح ماكينات اللحام من إيساب", "بيع قطع الغيار والمواد الاستهلاكية"]),
      },
      {
        title: t("Sundyne field service", "الخدمة الميدانية لسندين"),
        summary: t("Installation, maintenance and repair of Sundyne pumps and compressors, on site.", "تركيب وصيانة وإصلاح مضخات وضواغط سندين في الموقع."),
        metric: { value: t("On site", "في الموقع"), label: t("Field service engineers", "مهندسو خدمة ميدانية") },
        specs: list(
          ["Field service engineers trained on Sundyne equipment", "Preventive maintenance, troubleshooting and on-demand repairs", "Upgrades and overhauls that extend equipment life"],
          ["مهندسو خدمة ميدانية مدرّبون على معدات سندين", "صيانة وقائية وتشخيص الأعطال وإصلاحات عند الطلب", "تحديثات وعَمرات تطيل عمر المعدات"],
        ),
      },
    ],
    partnership: {
      title: t("Trading partnership opportunities", "فرص الشراكة التجارية"),
      intro: t(
        "Al-Ahed works with manufacturers that want a long-term, local partner in Qatar and the region.",
        "تتعاون العهد مع الشركات المصنّعة التي تبحث عن شريك محلي طويل الأمد في قطر والمنطقة.",
      ),
      points: [
        t("Partnering to provide OEM-certified and warranted products", "الشراكة في توفير منتجات معتمدة من المصنّع ومشمولة بالضمان"),
        t("Assessing the size and volume of market opportunities", "تقييم حجم الفرص المتاحة في السوق"),
        t("Sourcing from represented brands, with logistics and shipping support", "التوريد من العلامات الممثَّلة مع دعم الخدمات اللوجستية والشحن"),
        t("Local presence and after-sales expertise that keep products in service", "حضور محلي وخبرة في خدمات ما بعد البيع تحافظ على المنتجات في الخدمة"),
      ],
    },
    clients: [
      "QatarEnergy",
      "QatarEnergy LNG",
      "Shell",
      "TotalEnergies",
      "Dolphin Energy",
      "North Oil Company",
      "ORYX GTL",
      "Q-Chem",
      "QAFCO",
      "QAPCO",
      "QAFAC",
      "RLOC",
      "Kahramaa",
      "Qatalum",
      "Qatar Steel",
      "Q-Power",
      "Mesaieed Power",
    ],
    people: [{ name: t("Prabhakaran Balasubramanian", "برابهاكاران بالاسوبرامانيان"), role: t("General Manager, Sales", "المدير العام للمبيعات") }],
  },

  /* ----------------------------------------------------------------- DOPET */
  dopet: {
    photo: "/images/fabrication.jpg",
    pillars: {
      title: t("Our keys to growth", "مفاتيح نموّنا"),
      items: [
        { title: t("Commitment to HSE and quality", "الالتزام بالصحة والسلامة والبيئة والجودة") },
        { title: t("Dedication and teamwork", "التفاني والعمل الجماعي") },
        { title: t("A winning philosophy", "فلسفة قائمة على النجاح") },
      ],
    },
    markets: [t("Oil & gas", "النفط والغاز"), t("Petrochemicals", "البتروكيماويات"), t("Utilities", "المرافق")],
    serviceGroups: {
      title: t("Services", "الخدمات"),
      groups: [
        { title: t("EPIC projects", "مشاريع الهندسة والتوريد والإنشاء والتشغيل"), body: t("Engineering, procurement, installation and commissioning contracts, from award to final hand-over.", "عقود الهندسة والتوريد والتركيب والتشغيل، من الترسية حتى التسليم النهائي.") },
        { title: t("Shutdowns & turnarounds", "عمليات الإيقاف والصيانة الشاملة"), body: t("More than 25 years of time-critical shutdown and turnaround work for upstream and downstream operators at refineries, petrochemical and gas processing plants.", "أكثر من 25 عامًا من أعمال الإيقاف والصيانة الشاملة الحرجة زمنيًا لمشغّلي قطاعي المنبع والمصب في المصافي ومصانع البتروكيماويات ومعالجة الغاز.") },
        { title: t("Call-off services", "خدمات العقود الإطارية"), body: t("Comprehensive resource and material supply through call-off contracts.", "توريد شامل للموارد والمواد من خلال العقود الإطارية.") },
        { title: t("Technical manpower", "القوى العاملة الفنية"), body: t("Skilled and unskilled workforce for the energy sector, on a temporary or permanent basis, and technical equipment with operators.", "قوى عاملة ماهرة وغير ماهرة لقطاع الطاقة، بشكل مؤقت أو دائم، إلى جانب المعدات الفنية مع مشغّليها.") },
        { title: t("Workshops & facilities", "الورش والمرافق"), body: t("Fabrication, valve, electrical, instrumentation and machine shops that provide integrated support to every operation.", "ورش التصنيع والصمامات والكهرباء والأجهزة الدقيقة والتشغيل الآلي التي توفّر دعمًا متكاملًا لكل العمليات.") },
        { title: t("Sales & technology", "المبيعات والتكنولوجيا"), body: t("Local representation of the world's leading oilfield suppliers, through DOPET Sales & Technologies.", "التمثيل المحلي لكبرى الشركات العالمية لمعدات حقول النفط، من خلال دوبت للمبيعات والتكنولوجيا.") },
      ],
    },
    domains: {
      title: t("Construction competence", "القدرات الإنشائية"),
      intro: t(
        "A full design-and-build service across five domains, for small and large, commercial and industrial projects, to the specified technical requirements and international standards.",
        "خدمة متكاملة للتصميم والبناء في خمسة مجالات، للمشاريع الصغيرة والكبيرة التجارية والصناعية، وفق المتطلبات الفنية المحددة والمعايير الدولية.",
      ),
      items: [
        {
          id: "structures",
          title: t("Structures", "الهياكل"),
          body: t("Full design and construction of all types of structures. Heavy units are fabricated in parts and assembled at the Doha or Ras Laffan yards.", "تصميم وإنشاء جميع أنواع الهياكل. وتُصنَّع الوحدات الثقيلة على أجزاء وتُجمَّع في ساحات الدوحة أو رأس لفان."),
          points: list(
            ["Design in Bentley STAAD Pro and RAM Connection", "Ras Laffan yard 8 km from Ras Laffan port", "15 m wide direct road access to the port"],
            ["التصميم ببرنامجي Bentley STAAD Pro وRAM Connection", "ساحة رأس لفان على بعد 8 كم من ميناء رأس لفان", "طريق مباشر بعرض 15 مترًا إلى الميناء"],
          ),
          image: "/images/facilities/dopet-structures.jpg",
        },
        {
          id: "piping",
          title: t("Piping", "الأنابيب"),
          body: t("Pipe spools in carbon steel, stainless steel, cupro-nickel, titanium, aluminium and glass-reinforced epoxy.", "وصلات أنابيب من الفولاذ الكربوني والمقاوم للصدأ والنحاس والنيكل والتيتانيوم والألمنيوم والإيبوكسي المقوّى بالألياف الزجاجية."),
          points: list(
            ["SMAW, SAW, TIG, MIG and FCAW welding", "80+ welding procedure specifications certified by third-party inspection agencies", "All welders coded and certified"],
            ["اللحام بطرق SMAW وSAW وTIG وMIG وFCAW", "أكثر من 80 مواصفة إجراء لحام معتمدة من جهات فحص مستقلة", "جميع اللحّامين مرمّزون ومعتمدون"],
          ),
          image: "/images/facilities/dopet-piping.jpg",
        },
        {
          id: "vessels",
          title: t("Pressure vessels", "أوعية الضغط"),
          body: t("Design and manufacture of pressure vessels in a range of sizes and pressure ratings.", "تصميم وتصنيع أوعية الضغط بأحجام وتصنيفات ضغط متنوعة."),
          points: list(
            ["ASME Sec VIII, BS 5500, ASME U & S, NBBI R & NB", "Plate rolling up to 50 mm thick and 3 m wide, minimum diameter 400 mm", "Design in Intergraph PV Elite"],
            ["وفق ASME Sec VIII وBS 5500 وASME U وS وNBBI R وNB", "درفلة ألواح حتى سماكة 50 مم وعرض 3 أمتار، وأصغر قطر 400 مم", "التصميم ببرنامج Intergraph PV Elite"],
          ),
          image: "/images/facilities/dopet-vessels.jpg",
        },
        {
          id: "skids",
          title: t("Skids & pipe racks", "الوحدات المجمّعة وحوامل الأنابيب"),
          body: t("Skids, pipe racks and other heavy items up to 1,500 tonnes.", "وحدات مجمّعة وحوامل أنابيب وقطع ثقيلة أخرى حتى 1,500 طن."),
          points: list(
            ["Transport of heavy items to onshore and offshore field locations"],
            ["نقل القطع الثقيلة إلى مواقع الحقول في البر والبحر"],
          ),
          image: "/images/facilities/dopet-skids.jpg",
        },
        {
          id: "tanks",
          title: t("Storage tanks", "خزانات التخزين"),
          body: t("Above-ground steel tanks to API standards for flammable and combustible liquids and chemicals.", "خزانات فولاذية فوق الأرض وفق معايير API للسوائل القابلة للاشتعال والاحتراق والمواد الكيميائية."),
          points: list(
            ["Shop-fabricated and site-fabricated tanks", "Design in Intergraph TANK"],
            ["خزانات مصنّعة في الورشة وفي الموقع", "التصميم ببرنامج Intergraph TANK"],
          ),
          image: "/images/facilities/dopet-tanks.jpg",
        },
      ],
    },
    facilities: {
      title: t("Workshops & facilities", "الورش والمرافق"),
      intro: t(
        "A multi-discipline service base for fabrication, maintenance and general services, conveniently located to support DOPET's site work.",
        "قاعدة خدمات متعددة التخصصات للتصنيع والصيانة والخدمات العامة، في مواقع ملائمة لدعم أعمال دوبت الميدانية.",
      ),
      items: [
        {
          title: t("Fabrication shops", "ورش التصنيع"),
          summary: t("5,100 m² of covered fabrication space for carbon steel, stainless steel and non-ferrous metals.", "5,100 م² من مساحات التصنيع المغطاة للفولاذ الكربوني والمقاوم للصدأ والمعادن غير الحديدية."),
          specs: list(
            ["3,200 m², 4 × 10 t overhead cranes · Street 12, New Doha Industrial Area", "1,300 m² carbon steel shop, 2 × 10 t cranes · Street 25, Salwa Industrial Area", "600 m² stainless steel and non-ferrous shop · Street 12, New Doha Industrial Area"],
            ["3,200 م²، 4 رافعات علوية بحمولة 10 أطنان · شارع 12، المنطقة الصناعية الجديدة", "1,300 م² ورشة فولاذ كربوني، رافعتان بحمولة 10 أطنان · شارع 25، المنطقة الصناعية", "600 م² ورشة فولاذ مقاوم للصدأ ومعادن غير حديدية · شارع 12، المنطقة الصناعية الجديدة"],
          ),
          image: "/images/facilities/dopet-fabrication-shop.jpg",
        },
        {
          title: t("Valve maintenance", "صيانة الصمامات"),
          summary: t("Two 600 m² service centres, in Salwa Industrial Area and in Ras Laffan in partnership with Emerson. Ready to deploy to remote sites.", "مركزا خدمة بمساحة 600 م² لكل منهما، في المنطقة الصناعية وفي رأس لفان بالشراكة مع إيمرسون. وجاهزان للعمل في المواقع البعيدة."),
          specs: list(
            ["Isolation valves up to 36 in, control valves up to 24 in, relief valves up to 12 in", "Pressure testing up to 10,000 psi", "10 t (Salwa) and 8 t (Ras Laffan) overhead cranes"],
            ["صمامات العزل حتى 36 بوصة، وصمامات التحكم حتى 24 بوصة، وصمامات التنفيس حتى 12 بوصة", "اختبار الضغط حتى 10,000 رطل/بوصة²", "رافعات علوية بحمولة 10 أطنان (المنطقة الصناعية) و8 أطنان (رأس لفان)"],
          ),
          image: "/images/facilities/dopet-valve-shop.jpg",
        },
        {
          title: t("Electrical shop", "ورشة الكهرباء"),
          summary: t("500 m² with 2 × 10 t cranes. Member of the UK Association of Electrical and Mechanical Trades (AEMT).", "500 م² ورافعتان بحمولة 10 أطنان. عضو في الجمعية البريطانية للمهن الكهربائية والميكانيكية (AEMT)."),
          specs: list(
            ["Repair and refurbishment of motors, generators, submersible pumps and distribution boards", "Rewinding, overhauls and rotor dynamic balancing", "Testing of low- and high-voltage motors, onshore and offshore"],
            ["إصلاح وتجديد المحركات والمولدات والمضخات الغاطسة ولوحات التوزيع", "إعادة اللف والعَمرات والموازنة الديناميكية للأجزاء الدوارة", "اختبار محركات الجهد المنخفض والعالي في البر والبحر"],
          ),
          image: "/images/facilities/dopet-electrical-shop.jpg",
        },
        {
          title: t("Instrumentation shop", "ورشة الأجهزة الدقيقة"),
          summary: t("Certified maintenance and calibration of pneumatic to smart instruments, ELV, fire alarm and security systems.", "صيانة ومعايرة معتمدة للأجهزة من الهوائية إلى الذكية، وأنظمة الجهد المنخفض جدًا وإنذار الحريق والأمن."),
          specs: list(
            ["Pressure: −0.8 to 20 bar pneumatic, 0 to 1,400 bar hydraulic", "Temperature: −35 °C to 1,100 °C", "Thermocouple calibration: −200 °C to 1,370 °C"],
            ["الضغط: من −0.8 إلى 20 بار هوائي، ومن 0 إلى 1,400 بار هيدروليكي", "الحرارة: من −35 إلى 1,100 درجة مئوية", "معايرة المزدوجات الحرارية: من −200 إلى 1,370 درجة مئوية"],
          ),
          image: "/images/facilities/dopet-instrumentation-shop.jpg",
        },
        {
          title: t("Machine shop", "ورشة التشغيل الآلي"),
          summary: t("1,050 m² with a 5 t overhead crane.", "1,050 م² ورافعة علوية بحمولة 5 أطنان."),
          specs: list(
            ["CNC lathes, 24 in and 6 in lathes", "Horizontal boring, 60 in vertical boring and radial drilling", "High-precision API, premium connection and well tube threading"],
            ["مخارط CNC ومخارط 24 و6 بوصات", "تجويف أفقي وتجويف رأسي 60 بوصة وحفر شعاعي", "تسنين عالي الدقة وفق API والوصلات المتميزة وأنابيب الآبار"],
          ),
          image: "/images/facilities/dopet-machine-shop.jpg",
        },
        {
          title: t("Plant & machinery", "المعدات والآليات"),
          summary: t("A construction fleet maintained by DOPET's own trained technicians.", "أسطول معدات إنشائية يصونه فنيو دوبت المدرّبون."),
          specs: list(
            ["Mobile cranes from 18 to 120 t, forklifts from 2 to 10 t", "Welding machines, power generators, compressors, HP jetting pumps", "Trailers, JCBs, Bobcats, dump trucks and bundle pullers"],
            ["رافعات متحركة من 18 إلى 120 طنًا، ورافعات شوكية من 2 إلى 10 أطنان", "ماكينات لحام ومولدات كهرباء وضواغط ومضخات غسيل عالية الضغط", "مقطورات وجرافات JCB وBobcat وشاحنات قلابة وساحبات حزم الأنابيب"],
          ),
        },
      ],
    },
    yards: [
      { site: t("Al Karaana Industrial Zone (storage)", "منطقة الكرعانة الصناعية (تخزين)"), area: 74000 },
      { site: t("Ras Laffan", "رأس لفان"), area: 27000 },
      { site: t("New Doha Industrial Area, Street 12", "المنطقة الصناعية الجديدة، شارع 12"), area: 21300 },
      { site: t("Salwa Industrial Area, Street 25", "المنطقة الصناعية، شارع 25"), area: 16600 },
      { site: t("Dukhan", "دخان"), area: 14000 },
      { site: t("New Doha Industrial Area, Street 1/2", "المنطقة الصناعية الجديدة، شارع 1/2"), area: 10000 },
      { site: t("Al Khor", "الخور"), area: 5000 },
    ],
    camps: [
      { site: t("Dukhan", "دخان"), capacity: 650 },
      { site: t("Salwa Industrial Area, Street 27", "المنطقة الصناعية، شارع 27"), capacity: 450 },
      { site: t("Salwa Industrial Area, Street 47", "المنطقة الصناعية، شارع 47"), capacity: 450 },
    ],
    certifications: {
      title: t("Standards & certifications", "المعايير والشهادات"),
      intro: t(
        "DOPET's integrated QHSE management system complies with international standards and is certified by Lloyd's Register (LRQA).",
        "يلتزم نظام دوبت المتكامل لإدارة الجودة والصحة والسلامة والبيئة بالمعايير الدولية، وهو معتمد من لويدز ريجستر (LRQA).",
      ),
      items: [
        { name: "ISO 9001:2015", body: t("Quality management", "إدارة الجودة") },
        { name: "ISO 14001:2015", body: t("Environmental management", "الإدارة البيئية") },
        { name: "ISO 45001:2018", body: t("Occupational health & safety", "الصحة والسلامة المهنية") },
        { name: "ASME U, PP & S", body: t("Pressure vessels, power piping and power boilers", "أوعية الضغط وأنابيب الطاقة والغلايات") },
        { name: "NBBI R", body: t("Repair and alteration of pressure equipment", "إصلاح وتعديل معدات الضغط") },
        { name: "API 5CT, 6A, 7-1 & 16A", body: t("Casing and tubing, wellhead, drill-stem and drill-through equipment", "أنابيب التغليف والإنتاج ومعدات رؤوس الآبار وأعمدة الحفر") },
        { name: "Voestalpine VA Superior / VAGT", body: t("Premium connection threading", "تسنين الوصلات المتميزة") },
        { name: "TPCO TP-FJ, TP-CQ & TP-G2", body: t("Tianjin Pipe premium connection threading", "تسنين الوصلات المتميزة لأنابيب تيانجين") },
      ],
    },
    hse: {
      intro: t(
        "DOPET's priority is to protect the health and safety of its people and the public while minimising the environmental impact of its activities.",
        "تتمثّل أولوية دوبت في حماية صحة وسلامة موظفيها والجمهور، مع الحد من الأثر البيئي لأنشطتها.",
      ),
      items: [
        t("Published safety statistics", "نشر إحصاءات السلامة"),
        t("Hazard Observation Limitation Device (HOLD) programme", "برنامج رصد المخاطر والحد منها (HOLD)"),
        t("Safety incentives", "حوافز السلامة"),
        t("Governmental compliance", "الامتثال للمتطلبات الحكومية"),
        t("HSE policy and manual", "سياسة ودليل الصحة والسلامة والبيئة"),
      ],
    },
    awards: [
      { org: "QatarEnergy", date: "2022", title: t("First place in the 2022 Health, Environment & Safety Scorecard, for outstanding performance and contribution to improving HES culture.", "المركز الأول في بطاقة أداء الصحة والسلامة والبيئة لعام 2022، تقديرًا للأداء المتميز والإسهام في تعزيز ثقافة السلامة.") },
      { org: "QatarEnergy", date: "31.12.2021", title: t("One million man-hours without a lost-time injury on FIFA project GC20103300/4216.", "مليون ساعة عمل دون إصابات مضيّعة للوقت في مشروع FIFA رقم GC20103300/4216.") },
      { org: "Qatargas", date: "12.2022", title: t("Recognition for team contribution to the Project Management Department's 35 million man-hours without a lost-time injury.", "تقدير للإسهام في إنجاز إدارة المشاريع 35 مليون ساعة عمل دون إصابات مضيّعة للوقت.") },
    ],
    projectTables: [
      {
        id: "recent",
        title: t("Recent major projects", "أبرز المشاريع الحديثة"),
        rows: [
          { client: "QatarEnergy LNG", period: "2023 –", title: t("EPIC for upgrade of the fire-fighting system in the RLTO tank farm and jetty area", "مشروع تحديث نظام مكافحة الحريق في مزرعة خزانات وأرصفة RLTO"), scope: t("Rationalise and upgrade existing fire-fighting systems in tank farms and jetties", "ترشيد وتحديث أنظمة مكافحة الحريق القائمة في مزارع الخزانات والأرصفة") },
          { client: "QatarEnergy", period: "2023 –", title: t("Turnaround and maintenance services, Khatiya North, Main & South, Dukhan", "خدمات الإيقاف والصيانة الشاملة، خطية الشمالية والرئيسية والجنوبية، دخان"), scope: t("Maintenance and replacement of key equipment", "صيانة واستبدال المعدات الرئيسية") },
          { client: "QatarEnergy", period: "2023", title: t("Offshore maintenance support for PS-2 and PS-3 shutdown", "دعم الصيانة البحرية لإيقاف PS-2 وPS-3"), scope: t("Shutdown maintenance of columns, vessels, exchangers, filters, valves, flare tip and piping", "صيانة الأعمدة والأوعية والمبادلات والفلاتر والصمامات ورأس الشعلة والأنابيب خلال الإيقاف") },
          { client: "QatarEnergy", period: "2021 –", title: t("EPIC for automation upgrade of NGL storage and loading facilities, Mesaieed", "مشروع تحديث أنظمة الأتمتة لمرافق تخزين وتحميل سوائل الغاز الطبيعي، مسيعيد"), scope: t("Replace obsolete control and safeguarding automation with the latest proven technology", "استبدال أنظمة التحكم والحماية المتقادمة بأحدث التقنيات المثبتة") },
          { client: "Dolphin Energy", period: "2021 – 2023", title: t("Offshore EPC for replacement of instrument tubing, DOL-1 & 2", "أعمال بحرية لاستبدال أنابيب الأجهزة، DOL-1 و2"), scope: t("Well upgrade and tubing replacement", "تحديث الآبار واستبدال الأنابيب") },
          { client: "Dolphin Energy", period: "2019 – 2023", title: t("Maintenance manpower support services", "خدمات دعم القوى العاملة للصيانة"), scope: t("Manpower for onshore maintenance", "قوى عاملة لأعمال الصيانة البرية") },
          { client: "QatarEnergy LNG", period: "2017 – 2022", title: t("EPIC for installation of granulator units, Common Sulphur Plant", "مشروع تركيب وحدات التحبيب في مصنع الكبريت المشترك"), scope: t("Engineering, procurement, installation, testing and commissioning of new granulator units", "هندسة وتوريد وتركيب واختبار وتشغيل وحدات تحبيب جديدة") },
          { client: "QatarEnergy LNG", period: "2021 – 2025", title: t("Hire of technical manpower and equipment", "توفير القوى العاملة الفنية والمعدات"), scope: t("Manpower, ad-hoc services and equipment for onshore and offshore maintenance, including workshop support", "قوى عاملة وخدمات عند الطلب ومعدات للصيانة البرية والبحرية، بما في ذلك دعم الورش") },
          { client: "TotalEnergies", period: "2021 – 2024", title: t("Technical manpower, equipment and onshore fabrication", "القوى العاملة الفنية والمعدات والتصنيع البري"), scope: t("Support for maintenance at the Al Khalij offshore field and Halul", "دعم أعمال الصيانة في حقل الخليج البحري وجزيرة حالول") },
          { client: "QAFCO", period: "2021 – 2025", title: t("Manpower for QAFCO's workshop", "قوى عاملة لورشة قافكو"), scope: t("Skilled manpower for fabrication, welding and electrical work", "قوى عاملة ماهرة لأعمال التصنيع واللحام والكهرباء") },
          { client: "North Oil Company", period: "2020 – 2025", title: t("Maintenance and construction services", "خدمات الصيانة والإنشاءات"), scope: t("Skilled manpower for ad-hoc, offshore, onshore and shutdown support", "قوى عاملة ماهرة للدعم عند الطلب وفي البر والبحر وخلال الإيقاف") },
          { client: "OXY", period: "2016 – 2021", title: t("Integrated construction services", "خدمات إنشاءات متكاملة"), scope: t("Fabrication, inspection, painting, load-out and sea-fastening of piping and structures", "تصنيع وفحص وطلاء وتحميل وتثبيت بحري للأنابيب والهياكل") },
          { client: "ORYX GTL", period: "2018", title: t("EPIC for single-trip transmitter failures causing plant trips", "مشروع معالجة أعطال أجهزة الإرسال المسببة لتوقف المصنع"), scope: t("Detailed engineering, procurement, installation, pre-commissioning and commissioning", "الهندسة التفصيلية والتوريد والتركيب وما قبل التشغيل والتشغيل") },
          { client: "QAPCO", period: "2020", title: t("Inspection and maintenance of low-pressure equipment, Vinyl and LLDPE", "فحص وصيانة معدات الضغط المنخفض، الفينيل وLLDPE") },
        ],
      },
    ],
    clients: ["QatarEnergy", "QatarEnergy LNG", "OXY", "Dolphin Energy", "North Oil Company", "TotalEnergies", "ORYX GTL", "QAFCO", "QAPCO", "Q-Chem", "QAFAC", "RLOC", "WOQOD", "SEEF", "QSTec"],
    people: [
      { name: t("Nicholas Dean Stothard", "نيكولاس دين ستوثارد"), role: t("General Manager", "المدير العام") },
      { name: t("Armen Abou Hamad", "أرمين أبو حمد"), role: t("Operations Manager, EPIC & Shutdown Projects", "مدير العمليات، مشاريع الهندسة والتوريد والإنشاء والإيقاف") },
      { name: t("Dominic McClean", "دومينيك ماكلين"), role: t("Operations Manager, Manpower & Workshops", "مدير العمليات، القوى العاملة والورش") },
    ],
  },

  /* ------------------------------------------------------------- DOPET S&T */
  dst: {
    photo: "/images/doha-dusk.jpg",
    pillars: {
      title: t("How we work", "طريقة عملنا"),
      items: [
        { title: t("A business partner, not an agent", "شريك أعمال لا وكيل فقط"), body: t("Services provided with integrity, quality and reliability.", "خدمات تُقدَّم بنزاهة وجودة وموثوقية.") },
        { title: t("Support for large EPIC customers", "دعم كبار عملاء المشاريع"), body: t("Spares and services for major engineering, procurement and construction projects.", "قطع الغيار والخدمات لمشاريع الهندسة والتوريد والإنشاء الكبرى.") },
        { title: t("Advanced technologies", "التقنيات المتقدمة"), body: t("Engineered solutions and specialised equipment that support industrial innovation and efficiency.", "حلول هندسية ومعدات متخصصة تدعم الابتكار والكفاءة الصناعية.") },
      ],
    },
    markets: [t("Chemicals", "الكيماويات"), t("Oil & gas", "النفط والغاز"), t("Power & water", "الكهرباء والمياه")],
    portfolio: {
      title: t("Agency representation", "الوكالات التجارية"),
      intro: t(
        "A portfolio of the world's most respected suppliers, represented in Qatar.",
        "محفظة من أبرز الشركات العالمية، تمثّلها الشركة في قطر.",
      ),
      divisions: [
        {
          id: "measurement",
          title: t("Process control & measurement", "التحكم في العمليات والقياس"),
          brands: [
            { name: "Emerson", lines: t("Fisher, Rosemount, Daniel, Brooks and MMI: valves, transmitters, metering skids, flow meters, analysers and control systems.", "فيشر وروزماونت ودانيال وبروكس وMMI: الصمامات وأجهزة الإرسال ووحدات القياس ومقاييس التدفق وأجهزة التحليل وأنظمة التحكم.") },
            { name: "Statiflo", lines: t("Static mixers, gas dispersion systems, flow conditioners, chemical injection lances and custody-transfer mixers.", "الخلاطات الثابتة وأنظمة تشتيت الغاز ومكيّفات التدفق ورماح حقن المواد الكيميائية وخلاطات نقل الملكية.") },
            { name: "Pulsafeeder", lines: t("Metering and dosing pumps.", "مضخات القياس والجرعات.") },
          ],
        },
        {
          id: "wellhead",
          title: t("Wellhead & drilling", "رؤوس الآبار والحفر"),
          brands: [
            { name: "Cameron", lines: t("X-mas trees, wellheads, choke and ball valves.", "أشجار الإنتاج ورؤوس الآبار وصمامات الخنق والصمامات الكروية.") },
            { name: "Breda", lines: t("Wellhead systems, valves, linear actuators, packaged and control systems.", "أنظمة رؤوس الآبار والصمامات والمشغّلات الخطية والأنظمة المجمّعة وأنظمة التحكم.") },
            { name: "NOV (Reed)", lines: t("Drilling rock bits.", "رؤوس الحفر الصخرية.") },
          ],
        },
        {
          id: "site",
          title: t("Power & site services", "الطاقة وخدمات المواقع"),
          brands: [
            { name: "Aggreko", lines: t("Diesel generators, transformers and load banks.", "مولدات الديزل والمحولات وأحمال الاختبار.") },
            { name: "Helios Power Solutions", lines: t("AC/DC converters, inverters, power supplies, battery chargers, DC power systems and battery monitoring.", "محولات التيار المتردد والمستمر والعاكسات ومزودات الطاقة وشواحن البطاريات وأنظمة التيار المستمر ومراقبة البطاريات.") },
            { name: "Hydratight", lines: t("On-site machining, bolt tensioning and torquing equipment.", "التشغيل الآلي في الموقع ومعدات شد البراغي وعزم الربط.") },
            { name: "Rapid Access", lines: t("Boom, scissor and sky lifts (a Loxam company).", "رافعات ذراعية ومقصية وجوية (إحدى شركات Loxam).") },
            { name: "Safehouse", lines: t("Hot-work habitats for oil and gas hazardous areas.", "حاويات العمل الساخن للمناطق الخطرة في منشآت النفط والغاز.") },
          ],
        },
        {
          id: "utility",
          title: t("Process & utility equipment", "معدات العمليات والمرافق"),
          brands: [
            { name: "Spirax Sarco", lines: t("Condensate pumps, steam traps and plate heat exchangers.", "مضخات المكثفات ومصائد البخار والمبادلات الحرارية اللوحية.") },
            { name: "Cryostar", lines: t("Cryogenic pumps and compressors, small-scale liquefaction, regasification and LNG/LCNG refuelling stations.", "المضخات والضواغط المبرّدة ومحطات الإسالة الصغيرة وإعادة التغويز ومحطات تزويد الغاز الطبيعي المسال والمضغوط.") },
            { name: "AERZEN", lines: t("Turbo blowers, biogas compressors and blower units.", "المنافيخ التوربينية وضواغط الغاز الحيوي ووحدات المنافيخ.") },
            { name: "B&W SPIG", lines: t("Dry and wet cooling systems and cooling towers.", "أنظمة التبريد الجاف والرطب وأبراج التبريد.") },
            { name: "ITT C-Treat", lines: t("Reverse osmosis watermakers.", "وحدات تحلية المياه بالتناضح العكسي.") },
            { name: "De Nora Water Technologies", lines: t("Water treatment technologies.", "تقنيات معالجة المياه.") },
          ],
        },
        {
          id: "materials",
          title: t("Pipes, materials & cables", "الأنابيب والمواد والكابلات"),
          brands: [
            { name: "Butting", lines: t("Stainless steel welded pipes, clad pipes, customised components and assemblies.", "أنابيب الفولاذ المقاوم للصدأ الملحومة والأنابيب المكسوّة والمكوّنات والتجميعات حسب الطلب.") },
            { name: "Vishal Tubes & Pipes", lines: t("Pipes, tubes, round bars, fasteners and flanges in CS, SS, duplex, super duplex, Inconel and titanium.", "أنابيب وقضبان مستديرة ومثبّتات وشفاه من الفولاذ الكربوني والمقاوم للصدأ والدوبلكس والسوبر دوبلكس والإنكونيل والتيتانيوم.") },
            { name: "Thermocab", lines: t("Electrical and specialised cables.", "الكابلات الكهربائية والمتخصصة.") },
          ],
        },
      ],
    },
    people: [{ name: t("N. Shankaran", "ن. شانكاران"), role: t("Sales Manager", "مدير المبيعات") }],
  },

  /* ----------------------------------------------------------------- PEMCO */
  pemco: {
    photo: "/images/workforce.jpg",
    pillars: {
      title: t("Why PEMCO", "لماذا بمكو"),
      items: [
        { title: t("Strong track record", "سجل حافل") },
        { title: t("Cutting-edge technology", "تقنيات متطورة") },
        { title: t("Cost-effective", "فعالية التكلفة") },
        { title: t("Dedicated workforce", "فريق عمل متفانٍ") },
        { title: t("Accredited and certified", "اعتمادات وشهادات") },
        { title: t("Customer satisfaction", "رضا العملاء") },
      ],
    },
    markets: [t("Oil & gas", "النفط والغاز"), t("Marine & offshore", "البحرية والمنشآت البحرية"), t("Power & utility", "الكهرباء والمرافق"), t("Building & infrastructure", "المباني والبنية التحتية")],
    serviceGroups: {
      title: t("Inspection & testing services", "خدمات الفحص والاختبار"),
      groups: [
        {
          title: t("Conventional NDT", "الاختبارات التقليدية غير الإتلافية"),
          items: list(
            ["Radiography (RT) and real-time radiography (RTR)", "Ultrasonic testing (UT)", "Dye penetrant testing, visible and fluorescent", "Magnetic particle testing, visible and fluorescent", "Hardness and ferrite testing", "Leak testing: bubble, halogen diode, MSLT", "Visual testing, direct and remote", "Thermal infrared testing"],
            ["التصوير الإشعاعي والتصوير الإشعاعي الفوري", "الاختبار بالموجات فوق الصوتية", "اختبار الصبغ النافذ المرئي والفلوري", "اختبار الجسيمات المغناطيسية المرئي والفلوري", "اختبارا الصلادة والفريت", "اختبار التسرب: الفقاعات والصمام الثنائي الهالوجيني وMSLT", "الفحص البصري المباشر وعن بُعد", "الاختبار الحراري بالأشعة تحت الحمراء"],
          ),
        },
        {
          title: t("Advanced NDT", "الاختبارات المتقدمة"),
          items: list(
            ["Computed (CR) and digital (DR) radiography", "Phased array UT (PAUT), corrosion mapping and flange-face inspection", "Time-of-flight diffraction (TOFD) and full matrix capture (FMC)", "Long- and short-range guided-wave UT (LRUT, SRUT)", "Pulsed eddy current (PEC) for corrosion under insulation", "Acoustic emission testing of pressure vessels", "Online furnace-tube IR thermography", "Drones for indoor inspection and UT thickness gauging"],
            ["التصوير الإشعاعي المحوسب والرقمي", "الموجات فوق الصوتية بالمصفوفة المرحلية ومسح التآكل وفحص أوجه الشفاه", "حيود زمن الطيران والالتقاط بالمصفوفة الكاملة", "الموجات الموجّهة بعيدة وقصيرة المدى", "التيار الدوامي النبضي للتآكل تحت العزل", "اختبار الانبعاث الصوتي لأوعية الضغط", "التصوير الحراري لأنابيب الأفران أثناء التشغيل", "طائرات مسيّرة للفحص الداخلي وقياس السماكة"],
          ),
        },
        {
          title: t("Tube & tank inspection", "فحص الأنابيب والخزانات"),
          items: list(
            ["Eddy current testing (ECT) and eddy current array", "Internal rotary inspection system (IRIS)", "Remote field eddy current (RFET)", "Magnetic flux leakage (MFL) and near-field testing (NFT/NFA)", "Tank-floor MFL scanning and SLOFEC", "Robotic corrosion mapping (RMS2)", "CCTV inspection of pipelines and piping"],
            ["الاختبار بالتيار الدوامي ومصفوفة التيار الدوامي", "نظام الفحص الدوراني الداخلي", "التيار الدوامي ذو المجال البعيد", "تسرب التدفق المغناطيسي واختبار المجال القريب", "مسح أرضيات الخزانات بتقنية MFL وSLOFEC", "المسح الآلي للتآكل", "فحص خطوط الأنابيب بالكاميرات"],
          ),
        },
        {
          title: t("Inspection services", "خدمات التفتيش"),
          items: list(
            ["Welding, plant, tank and equipment inspection", "Coating and corrosion inspection, offshore and marine", "Positive material identification (PMI)", "Post-weld heat treatment (PWHT)", "Laboratory testing", "Third-party inspector services"],
            ["فحص اللحامات والمصانع والخزانات والمعدات", "فحص الطلاءات والتآكل في المواقع البحرية", "تحديد هوية المواد", "المعالجة الحرارية بعد اللحام", "الاختبارات المخبرية", "خدمات مفتشي الطرف الثالث"],
          ),
        },
        {
          title: t("Rope access", "الوصول بالحبال"),
          items: list(["Structural inspections", "Confined-space entry", "Integrity inspections"], ["فحص الهياكل", "دخول الأماكن المحصورة", "فحص السلامة"]),
        },
        {
          title: t("Certified manpower", "قوى عاملة معتمدة"),
          items: list(
            ["NDT Level III (ASNT)", "Inspectors certified to CSWIP and AWS", "NDT technicians to SNT-TC-1A and ISO 9712", "MME-licensed radiation protection officers", "Senior mechanical inspectors"],
            ["المستوى الثالث للاختبارات غير الإتلافية (ASNT)", "مفتشون معتمدون وفق CSWIP وAWS", "فنيو اختبارات وفق SNT-TC-1A وISO 9712", "مسؤولو حماية من الإشعاع مرخّصون (MME)", "كبار المفتشين الميكانيكيين"],
          ),
        },
      ],
    },
    projectTables: [
      {
        id: "ongoing",
        title: t("Ongoing contracts", "العقود الجارية"),
        rows: [
          { client: "QatarEnergy", period: "2024 – 2029", title: t("Coating inspection, five-year contract", "فحص الطلاءات، عقد لمدة خمس سنوات") },
          { client: "QatarEnergy", period: "2024 – 2029", title: t("Call-off NDT services for offshore and marine locations, five years", "خدمات الاختبارات غير الإتلافية بعقد إطاري للمواقع البحرية، لمدة خمس سنوات") },
          { client: "QatarEnergy · Applus Velosi", period: "2024 – 2029", title: t("Radiography subcontract for Dukhan, five years", "عقد من الباطن للتصوير الإشعاعي في دخان، لمدة خمس سنوات") },
          { client: "QatarEnergy LNG · TÜV", period: "2025 –", title: t("Radiography and advanced NDT subcontract, seven years", "عقد من الباطن للتصوير الإشعاعي والاختبارات المتقدمة، لمدة سبع سنوات") },
        ],
      },
      {
        id: "completed",
        title: t("Recently completed", "مشاريع منجزة مؤخرًا"),
        rows: [
          { client: "QatarEnergy", period: "", title: t("Radiography, piping survey and NDT at Dukhan, offshore, refinery and marine", "التصوير الإشعاعي ومسح الأنابيب والاختبارات غير الإتلافية في دخان والمنشآت البحرية والمصفاة والموانئ") },
          { client: "QatarEnergy", period: "2019 – 2024", title: t("Supply of senior mechanical inspectors, offshore and onshore", "توفير كبار المفتشين الميكانيكيين في البر والبحر") },
          { client: "QAFCO · QAPCO · Q-Chem · Qatar Fuel", period: "", title: t("Radiography and NDT", "التصوير الإشعاعي والاختبارات غير الإتلافية") },
        ],
      },
    ],
    partnersNote: {
      title: t("Contractors we work with", "المقاولون الذين نعمل معهم"),
      items: [
        { client: t("EPC & shutdown work", "أعمال الهندسة والتوريد والإنشاء والإيقاف"), work: t("DESCON, Medgulf, Al-Balagh, CCIC, Occidental Petroleum, DOPET, UDC, Galfar, SMOP, Rosetti, CCC", "DESCON وMedgulf والبلاغ وCCIC وأوكسيدنتال بتروليوم ودوبت وUDC وجلفار وSMOP وروزيتي وCCC") },
        { client: t("Current contractors", "المقاولون الحاليون"), work: t("DESCON, Medgulf, Al-Balagh, DOPET, Rosetti, QCON, Rotary, PTSC, Alpha NDT, TÜV SÜD, Stork", "DESCON وMedgulf والبلاغ ودوبت وروزيتي وQCON وروتاري وPTSC وAlpha NDT وTÜV SÜD وستورك") },
      ],
    },
    clients: ["QatarEnergy", "QatarEnergy LNG", "QAFCO", "QAPCO", "Q-Chem", "Qatar Fuel", "Occidental Petroleum"],
    people: [{ name: t("Parthiban Selvaraj", "بارثيبان سيلفاراج"), role: t("General Manager", "المدير العام") }],
  },
};

export const profileOf = (id: CompanyId) => profiles[id];

/** Every brand represented across the Group (AATC divisions + showroom + DOPET S&T agencies). */
export const allBrands = (() => {
  const names = new Set<string>();
  for (const p of Object.values(profiles)) {
    for (const d of p.portfolio?.divisions ?? []) for (const b of d.brands) names.add(b.name.split(" · ")[0].replace(/ \(.*\)$/, ""));
    for (const g of p.showroom?.groups ?? []) for (const b of g.brands) names.add(b);
  }
  return [...names];
})();
