// One-off, idempotent content update (2026-11-23): content carried over from the previous website
// (alahedholding.com) and the owner's board / management profiles.
//   1. Leadership: portraits (old site) + biographies (EN/AR) for the board and executive management; the President
//      and the MD & CEO added to executive management; two further board members added HIDDEN (owner to switch on).
//   2. Leadership messages (Chairman; Vice Chairman & President) — Setting "messages", only if never saved.
//   3. News: the old site's photos, text and dates for three existing posts + the missing Hilong Group post.
// Guards: nothing the client has already edited in the admin panel is overwritten (photo only if empty, bio only if
// empty or still the seed text, posts only while they still carry the seeded stock cover).
// Images must already be in UPLOAD_DIR/2026/11 (served as /media/2026/11/...).
// Run on the server as the app user against the CURRENT release's modules (DRY_RUN=1 to preview):
//   set -a; . /etc/alahed/env; set +a; cd /srv/alahed/current
//   runuser -u alahed -- env DATABASE_URL="$DATABASE_URL" NODE_PATH=/srv/alahed/current/node_modules \
//     BACKUP_PATH=/srv/alahed/shared/backups/pre-content-$(date -u +%Y%m%d-%H%M%S).db /usr/bin/node /tmp/content.js
const { PrismaClient } = require("@prisma/client");

const DRY = !!process.env.DRY_RUN;
const M = "/media/2026/11";
const p = (...paras) => paras.map((t) => `<p>${t}</p>`).join("");
const norm = (s) => s.toLowerCase().replace(/^\s*(mr|mrs|ms|dr|eng|sheikh)\.?\s+/, "").replace(/[^a-z]/g, "");

/* ───────────── People ───────────── */

const BIO = {
  jaber: {
    en: p(
      "Mr. Jaber brings over 50 years of distinguished experience in government, diplomacy, and business, holding senior roles in Qatar's public sector and abroad. He is a founding shareholder of major Qatari institutions and a seasoned investor across sectors including oil, gas, real estate, and finance.",
    ),
    ar: p(
      "يتمتع السيد جابر بخبرة متميزة تمتد لأكثر من 50 عامًا في العمل الحكومي والدبلوماسي وقطاع الأعمال، تولّى خلالها مناصب رفيعة في القطاع العام في دولة قطر وخارجها. وهو مساهم مؤسس في عدد من كبرى المؤسسات القطرية، ومستثمر ذو خبرة واسعة في قطاعات عدة، من بينها النفط والغاز والعقارات والتمويل.",
    ),
  },
  jassim: {
    en: p(
      "Mr. Jassim brings 30 years' experience in human resources, business development, and entrepreneurship across government, semi-government, and multinational organizations. He served as Executive Director of HR at Ooredoo and led global ventures in HR solutions, digitization, and events, recognized as an Ernst &amp; Young Entrepreneur of the Year finalist.",
    ),
    ar: p(
      "يتمتع السيد جاسم بخبرة تمتد 30 عامًا في مجالات الموارد البشرية وتطوير الأعمال وريادة الأعمال، في جهات حكومية وشبه حكومية وشركات متعددة الجنسيات. شغل منصب المدير التنفيذي للموارد البشرية في Ooredoo، وقاد مشاريع عالمية في مجالات حلول الموارد البشرية والتحول الرقمي وتنظيم الفعاليات، وكان من المرشحين النهائيين لجائزة إرنست ويونغ لرائد الأعمال للعام.",
    ),
  },
  jassimExec: {
    en: p(
      "Mr. Jassim brings 30 years' experience in human resources, business development, and entrepreneurship across government, semi-government, and multinational organizations. He served as Executive Director of HR at Ooredoo and led global ventures in HR solutions, digitization, and events, recognized as an Ernst &amp; Young Entrepreneur of the Year finalist. He is also Chairman of iHorizons, Imperial Real Estate Investment, Imperial Suites, and several other private entities.",
    ),
    ar: p(
      "يتمتع السيد جاسم بخبرة تمتد 30 عامًا في مجالات الموارد البشرية وتطوير الأعمال وريادة الأعمال، في جهات حكومية وشبه حكومية وشركات متعددة الجنسيات. شغل منصب المدير التنفيذي للموارد البشرية في Ooredoo، وقاد مشاريع عالمية في مجالات حلول الموارد البشرية والتحول الرقمي وتنظيم الفعاليات، وكان من المرشحين النهائيين لجائزة إرنست ويونغ لرائد الأعمال للعام. كما يشغل منصب رئيس مجلس إدارة كلٍّ من iHorizons وإمبريال للاستثمار العقاري وإمبريال سويتس، إلى جانب عدد من الكيانات الخاصة الأخرى.",
    ),
  },
  mohammed: {
    en: p(
      "Mr. Mohammed is an experienced finance, investment, and corporate governance professional in the energy and financial sectors. He serves as Board Member of Al Rayan Bank and Chairman of Al Rayyan Investment. Previously, he held senior roles in the CEO's office at QatarEnergy and served on multiple corporate boards.",
    ),
    ar: p(
      "يتمتع السيد محمد بخبرة واسعة في مجالات التمويل والاستثمار وحوكمة الشركات في قطاعي الطاقة والمال. وهو عضو في مجلس إدارة مصرف الريان ورئيس مجلس إدارة الريان للاستثمار. وقد شغل سابقًا مناصب رفيعة في مكتب الرئيس التنفيذي لشركة قطر للطاقة، وكان عضوًا في مجالس إدارة عدد من الشركات.",
    ),
  },
  mohammedExec: {
    en: p(
      "Mr. Mohammed is an experienced finance, investment, and corporate governance professional in the energy and financial sectors. He serves as Board Member of Al Rayan Bank and Chairman of Al Rayyan Investment. He is also the Managing Director of JS Holding. Previously, he held senior roles in the CEO's office at QatarEnergy and served on multiple corporate boards.",
    ),
    ar: p(
      "يتمتع السيد محمد بخبرة واسعة في مجالات التمويل والاستثمار وحوكمة الشركات في قطاعي الطاقة والمال. وهو عضو في مجلس إدارة مصرف الريان ورئيس مجلس إدارة الريان للاستثمار، كما يشغل منصب العضو المنتدب لشركة JS القابضة. وقد شغل سابقًا مناصب رفيعة في مكتب الرئيس التنفيذي لشركة قطر للطاقة، وكان عضوًا في مجالس إدارة عدد من الشركات.",
    ),
  },
  ahmad: {
    en: p(
      "Mr. Ahmad has extensive experience in business management and real estate investments across hospitality, real estate, and logistics sectors. He serves as Executive Director of Imperial Suites Hotel and Imperial Real Estate Investment Group, and as Direct Manager of Delma Shipping, Transportation &amp; Services. He is also active in various private sector ventures in Qatar.",
    ),
    ar: p(
      "يتمتع السيد أحمد بخبرة واسعة في إدارة الأعمال والاستثمار العقاري في قطاعات الضيافة والعقارات والخدمات اللوجستية. ويشغل منصب المدير التنفيذي لفندق إمبريال سويتس ومجموعة إمبريال للاستثمار العقاري، كما يتولى الإدارة المباشرة لشركة دلما للشحن والنقل والخدمات. وهو ناشط أيضًا في عدد من مشاريع القطاع الخاص في قطر.",
    ),
  },
  hamad: {
    en: p(
      "Mr. Hamad has over 40 years of experience in the contracting and energy sectors, with in-depth knowledge of the energy and services business. He held various roles at Al-Ahed Trading and Contracting and served as General Manager of DOPET from 2010 to 2023. Earlier, he was Sales Officer at Qatar National Telephone Services, now known as Ooredoo.",
    ),
    ar: p(
      "يتمتع السيد حمد بخبرة تزيد على 40 عامًا في قطاعي المقاولات والطاقة، ومعرفة معمّقة بأعمال الطاقة والخدمات. شغل مناصب مختلفة في العهد للتجارة والمقاولات، وتولّى منصب المدير العام لشركة دوبت من عام 2010 حتى عام 2023. وقبل ذلك عمل مسؤولًا للمبيعات في شركة خدمات الهاتف الوطنية القطرية، المعروفة اليوم باسم Ooredoo.",
    ),
  },
  ibrahim: {
    en: p(
      "Mr. Ibrahim has four decades of experience in the energy sector across corporate governance, JVs, and large-scale project management. He served as Director of Privatized Companies Affairs at QatarEnergy (2004-2020), and held board roles at Qatar Steel, Gulf Drilling International, and Qatar Shell. He holds a Bachelor's in Accounting from Ain Shams University, Egypt.",
    ),
    ar: p(
      "يتمتع السيد إبراهيم بخبرة تمتد أربعة عقود في قطاع الطاقة، تشمل حوكمة الشركات والمشاريع المشتركة وإدارة المشاريع الكبرى. شغل منصب مدير شؤون الشركات المخصخصة في قطر للطاقة (2004–2020)، وتولّى عضوية مجالس إدارة كلٍّ من قطر ستيل والخليج العالمية للحفر وقطر شل. وهو حاصل على درجة البكالوريوس في المحاسبة من جامعة عين شمس في مصر.",
    ),
  },
  khalid: {
    en: p(
      "Mr. Khalid is an energy executive with over 40 years of experience across Qatar's hydrocarbon and industrial sectors. Rising through Qatar Petroleum from 1985, he became CEO of Qatalum in 2019 and has served on the boards of QAMCO, Qatar Steel, and the Gulf Aluminum Council. He holds a BSc in Chemical Engineering from the University of Southern California, USA.",
    ),
    ar: p(
      "السيد خالد من القيادات التنفيذية في قطاع الطاقة، ويتمتع بخبرة تزيد على 40 عامًا في قطاعي الهيدروكربونات والصناعة في قطر. تدرّج في المناصب في قطر للبترول منذ عام 1985، وتولّى منصب الرئيس التنفيذي لشركة قطلوم عام 2019، كما شغل عضوية مجالس إدارة قامكو وقطر ستيل ومجلس الألمنيوم الخليجي. وهو حاصل على درجة البكالوريوس في الهندسة الكيميائية من جامعة جنوب كاليفورنيا في الولايات المتحدة الأمريكية.",
    ),
  },
  nirav: {
    en: p(
      "Mr. Nirav is an experienced finance professional with expertise in accounting and corporate finance matters across the aviation, energy, and investment sectors. He previously worked in QatarEnergy's Privatized Companies Affairs Department on major restructurings and M&amp;A, and at Gulf Helicopters Company as Chief Accountant, deputizing for the Financial Controller. He is a Fellow of the Institute of Chartered Accountants of India and an Associate Member of the Chartered Institute of Management Accountants, United Kingdom. He is also a co-founder and shareholder of several entities in Real Estate and Industrial businesses in India.",
    ),
    ar: p(
      "السيد نيراف خبير مالي يتمتع بخبرة في المحاسبة وشؤون تمويل الشركات في قطاعات الطيران والطاقة والاستثمار. عمل سابقًا في إدارة شؤون الشركات المخصخصة في قطر للطاقة على عدد من عمليات إعادة الهيكلة والاندماج والاستحواذ الكبرى، وفي شركة الخليج للهليكوبتر بمنصب رئيس المحاسبين ونائبًا للمراقب المالي. وهو زميل معهد المحاسبين القانونيين في الهند، وعضو منتسب في المعهد المعتمد للمحاسبين الإداريين في المملكة المتحدة. كما أنه شريك مؤسس ومساهم في عدد من الشركات العاملة في مجالي العقارات والصناعة في الهند.",
    ),
  },
};

// Existing rows (matched by group + name) get a portrait and a biography where they have none.
const UPDATE = [
  { group: "board", name: "Jaber Ahmad Al Sulaiti", photo: `${M}/portrait-jaber-al-sulaiti.jpg`, bio: BIO.jaber },
  { group: "board", name: "Jassim Mohammed Al Mansoori", photo: `${M}/portrait-jassim-al-mansoori.jpg`, bio: BIO.jassim },
  { group: "board", name: "Mohammed Jaber Al Sulaiti", photo: `${M}/portrait-mohammed-al-sulaiti.jpg`, bio: BIO.mohammed, rename: "Mohammed Jaber Al Sulaiti" },
  { group: "board", name: "Ahmad Mohammed Al Mansoori", photo: `${M}/portrait-ahmad-al-mansoori.jpg`, bio: BIO.ahmad },
  { group: "board", name: "Hamad Qasim Al Saei", photo: `${M}/portrait-hamad-al-saei.jpg`, bio: BIO.hamad },
  { group: "management", name: "Nirav Bavisi", photo: `${M}/portrait-nirav-bavisi.jpg`, bio: BIO.nirav },
];

// New rows. Board members 6-7 come from a document marked confidential: added hidden, owner switches them on.
const CREATE = [
  { group: "board", order: 6, active: false, nameEn: "Ibrahim Ali Al-Mulla", nameAr: "إبراهيم علي الملا", roleEn: "Independent Board Member", roleAr: "عضو مجلس إدارة مستقل", photo: null, bio: BIO.ibrahim },
  { group: "board", order: 7, active: false, nameEn: "Khalid Mohamed Larem", nameAr: "خالد محمد لارم", roleEn: "Independent Board Member", roleAr: "عضو مجلس إدارة مستقل", photo: null, bio: BIO.khalid },
  { group: "management", order: 1, active: true, nameEn: "Jassim Mohammed Al Mansoori", nameAr: "جاسم محمد المنصوري", roleEn: "President", roleAr: "الرئيس", photo: `${M}/portrait-jassim-al-mansoori.jpg`, bio: BIO.jassimExec },
  { group: "management", order: 2, active: true, nameEn: "Mohammed Jaber Al Sulaiti", nameAr: "محمد جابر السليطي", roleEn: "Managing Director & Chief Executive Officer", roleAr: "العضو المنتدب والرئيس التنفيذي", photo: `${M}/portrait-mohammed-al-sulaiti.jpg`, bio: BIO.mohammedExec },
];

/* ───────────── Leadership messages (old site, verbatim; Arabic translation) ───────────── */

const CHAIRMAN = {
  en: p(
    "Since our modest beginnings in 1976, we have stayed true to our mission of delivering the finest quality services and products to various sectors within state of Qatar. We are fortunate to have participated in the development and growth of Qatar economy and continue contributing on larger scale.",
    "The Underlying principle governing the operations of Al Ahed is “Your Service Partner”. The common trait enabling us to consistently deliver our value promise to our customers, partners, employees and other stakeholders.",
    "As privately owned and diversified service company, our strength is the result of our ever widening range of activities conducted through a number of strategic business divisions, all of which are supported by sound fiscal, management and operational expertise. Over the years, our professional belief in ethics and quality has evolved into a set of corporate standards and practices which we use as our benchmark for excellence. This attitude has paid off in every step of our journey along the way. Today we pride ourselves on being a trustworthy household name both in Qatar and beyond.",
    "With strong core values, we consistently meet the needs of our customers, while providing our partners and suppliers attractive organic growth, ensuring competitive working conditions for the professional fulfillment of our employees and furthering the well being of the communities in which we operate through corporate social responsibility.",
    "Our vision is to become important economic entity in the country, implementing the wise vision of his highness Sheikh Tamim Bin Hamad Al Thani, the Emir of Qatar, in making the state of Qatar one of the leading economies, both regionally and internationally.",
  ),
  ar: p(
    "منذ بداياتنا المتواضعة عام 1976، بقينا أوفياء لرسالتنا في تقديم أجود الخدمات والمنتجات لمختلف القطاعات في دولة قطر. ونعتزّ بأننا أسهمنا في تنمية الاقتصاد القطري ونموّه، ونواصل إسهامنا على نطاق أوسع.",
    "ويقوم المبدأ الأساسي الذي يحكم أعمال العهد على شعار «شريكك في الخدمة»، وهو السمة المشتركة التي تمكّننا من الوفاء بوعدنا لعملائنا وشركائنا وموظفينا وسائر الأطراف ذات العلاقة بصورة مستمرة.",
    "وبصفتنا شركة خدمات خاصة ومتنوعة الأنشطة، تنبع قوتنا من نطاق أعمالنا المتنامي الذي نزاوله عبر عدد من وحدات الأعمال الاستراتيجية، تدعمها جميعًا خبرة مالية وإدارية وتشغيلية راسخة. وعلى مرّ السنين، تحوّل إيماننا المهني بالأخلاقيات والجودة إلى منظومة من المعايير والممارسات المؤسسية التي نتخذها مرجعًا للتميّز. وقد أثمر هذا النهج في كل مرحلة من مراحل مسيرتنا، ونفخر اليوم بأننا اسم موثوق ومعروف في قطر وخارجها.",
    "وبفضل قيمنا الراسخة، نلبّي احتياجات عملائنا باستمرار، ونوفّر لشركائنا ومورّدينا فرص نموّ طبيعي مجزية، ونضمن بيئة عمل تنافسية تتيح لموظفينا تحقيق طموحاتهم المهنية، ونسهم في رفاه المجتمعات التي نعمل فيها من خلال المسؤولية الاجتماعية للشركات.",
    "وتتمثّل رؤيتنا في أن نكون كيانًا اقتصاديًا مهمًا في الدولة، تجسيدًا للرؤية الحكيمة لحضرة صاحب السمو الشيخ تميم بن حمد آل ثاني، أمير البلاد المفدى، في جعل دولة قطر واحدة من الاقتصادات الرائدة إقليميًا ودوليًا.",
  ),
};

const PRESIDENT = {
  en: p(
    "It has been our privilege to be part of the exciting and remarkable economic development of Qatar. Our organization has been fortunate to have actively participated in contributing towards this growth for over four decades and avidly continue with more enthusiasm for the future.",
    "Since our establishment in year 1976, our focus has been to be the most preferred supplier for the oil and gas sector. We have not only achieved that goal but also continue to spread our wings to encompass other sectors such as infrastructure, utilities and construction sectors. This complete transformation is only possible due to continuous development, brain storming innovative ideas and always exceeding expectations of our customers.",
    "We have enjoyed becoming one of the most creditable and respected organizations with our activities. We continue on our course raising the bar higher by maintaining our determination to be the most stable, dependable, dynamic and profitable company in parallel with our sustainable growth goals.",
    "Our numerous renowned international partners are proof of our business success. Our strength is with our strong, motivated, professional and talented workforce who have been with us for considerable period of time. We take care of our employees like one big family of 3,000 personnel. We are extremely optimistic about the future of State of Qatar being transcending as one the regions main economic powers. We are determined as ever to be part of our country’s promising future.",
  ),
  ar: p(
    "لقد كان من دواعي اعتزازنا أن نكون جزءًا من مسيرة التنمية الاقتصادية اللافتة في دولة قطر. وقد حظيت مؤسستنا بشرف المشاركة الفاعلة في هذا النمو على مدى أكثر من أربعة عقود، ونواصل المسيرة بحماس أكبر نحو المستقبل.",
    "منذ تأسيسنا عام 1976، حرصنا على أن نكون المورّد المفضّل لقطاع النفط والغاز. ولم نكتفِ بتحقيق هذا الهدف، بل نواصل توسيع نطاق أعمالنا ليشمل قطاعات أخرى مثل البنية التحتية والمرافق والإنشاءات. وما كان لهذا التحوّل الشامل أن يتحقق لولا التطوير المستمر، وتبادل الأفكار المبتكرة، والحرص الدائم على تجاوز توقعات عملائنا.",
    "ونعتزّ بأننا أصبحنا من أكثر المؤسسات مصداقية واحترامًا في مجالات عملنا. ونمضي في طريقنا لرفع سقف الطموح، مع الحفاظ على عزمنا أن نكون الشركة الأكثر استقرارًا وموثوقية وحيوية وربحية، بالتوازي مع أهدافنا في النمو المستدام.",
    "ويشهد على نجاح أعمالنا العدد الكبير من شركائنا الدوليين المرموقين. وتكمن قوتنا في كوادرنا القوية والمتحفّزة والمحترفة والموهوبة التي رافقتنا لسنوات طويلة. ونرعى موظفينا كأسرة واحدة كبيرة تضم 3,000 فرد. ونحن متفائلون للغاية بمستقبل دولة قطر وهي ترسّخ مكانتها كإحدى القوى الاقتصادية الرئيسية في المنطقة، وعازمون كل العزم على أن نكون جزءًا من مستقبل وطننا الواعد.",
  ),
};

/* ───────────── News (old site text and photos) ───────────── */

const img = (file, alt) => `<img src="${M}/${file}" alt="${alt}">`;

const POSTS_UPDATE = [
  {
    slug: "nov-choke-valves-management-visit",
    seedCover: "/images/hq.jpg",
    data: {
      titleEn: "NOV Choke Valves senior management team visits Al-Ahed Holding",
      titleAr: "فريق الإدارة العليا لشركة NOV للصمامات الخانقة يزور العهد القابضة",
      excerptEn: "The NOV Choke Valves delegation met Mr. Jassim Al Mansoori, President and Vice Chairman, and the Al-Ahed Trading sales team.",
      excerptAr: "التقى وفد NOV للصمامات الخانقة بالسيد جاسم المنصوري، الرئيس ونائب رئيس مجلس الإدارة، وفريق مبيعات العهد للتجارة.",
      bodyEn:
        p(
          "The NOV Choke Valves senior management team visited the Al-Ahed Holding office and met with Mr. Jassim Al Mansoori, President and Vice Chairman, and the Al-Ahed Trading sales team.",
          "The NOV Choke Valves delegation included:",
        ) +
        "<ul><li>Mr. Brad Fredricks – Global President, NOV Choke Valves</li><li>Mr. Keith Casey – Vice President, Global Product Line &amp; Sales</li><li>Mr. Shyam Sahadevan – Regional Manager, Middle East</li></ul>",
      bodyAr:
        p(
          "زار فريق الإدارة العليا لشركة NOV للصمامات الخانقة مكتب العهد القابضة، حيث التقى بالسيد جاسم المنصوري، الرئيس ونائب رئيس مجلس الإدارة، وفريق مبيعات العهد للتجارة.",
          "وضمّ وفد NOV للصمامات الخانقة كلًّا من:",
        ) +
        "<ul><li>السيد براد فريدريكس – الرئيس العالمي، NOV للصمامات الخانقة</li><li>السيد كيث كيسي – نائب الرئيس لخط المنتجات العالمي والمبيعات</li><li>السيد شيام ساهاديفان – المدير الإقليمي للشرق الأوسط</li></ul>",
      coverImage: `${M}/news-nov-choke-valves-visit.jpg`,
      publishedAt: new Date("2026-10-25T09:00:00.000Z"),
    },
  },
  {
    slug: "celeros-channel-partner-of-the-year-2026",
    seedCover: "/images/refinery-pipes.jpg",
    data: {
      excerptEn:
        "The two awards recognise Al-Ahed Trading & Contracting's partnerships with GD Engineering and Copes-Vulcan, and its commitment to delivering quality engineering solutions.",
      excerptAr: "تكرّم الجائزتان شراكتَي العهد للتجارة والمقاولات مع GD Engineering وCopes-Vulcan، والتزامها بتقديم حلول هندسية عالية الجودة.",
      bodyEn:
        p(
          "We are proud to announce that Al-Ahed Trading &amp; Contracting, a subsidiary of Al-Ahed Holding Group, has been honored with two Channel Partner of the Year 2026 awards by Celeros Flow Technology for its successful partnerships with GD Engineering and Copes-Vulcan.",
          "This recognition reflects the strength of our strategic partnerships, the trust of our customers, and our commitment to delivering high-quality engineering solutions to Qatar's energy and industrial sectors.",
          "We extend our sincere appreciation to Celeros Flow Technology, our valued customers, partners, and dedicated team members whose continued support has contributed to this achievement.",
        ) + img("news-celeros-awards.jpg", "The Al-Ahed Trading &amp; Contracting team with the Celeros Flow Technology award"),
      bodyAr:
        p(
          "يسرّنا أن نعلن حصول العهد للتجارة والمقاولات، إحدى شركات مجموعة العهد القابضة، على جائزتين ضمن جوائز «شريك القناة للعام 2026» من سيليروس فلو تكنولوجي، تقديرًا لشراكتيها الناجحتين مع GD Engineering وCopes-Vulcan.",
          "ويعكس هذا التقدير متانة شراكاتنا الاستراتيجية، وثقة عملائنا، والتزامنا بتقديم حلول هندسية عالية الجودة لقطاعي الطاقة والصناعة في قطر.",
          "ونتقدّم بخالص الشكر والتقدير إلى سيليروس فلو تكنولوجي، وإلى عملائنا وشركائنا الكرام، وأعضاء فريقنا المتفانين الذين أسهم دعمهم المتواصل في تحقيق هذا الإنجاز.",
        ) + img("news-celeros-awards.jpg", "فريق العهد للتجارة والمقاولات مع جائزة سيليروس فلو تكنولوجي"),
      coverImage: `${M}/news-celeros-awards-cover.jpg`,
    },
  },
  {
    slug: "john-crane-president-courtesy-visit",
    seedCover: "/images/engineer.jpg",
    data: {
      company: "holding",
      titleEn: "Courtesy visit by Mr. Ruben Alvarez, President of John Crane",
      titleAr: "زيارة مجاملة من السيد روبن ألفاريز، رئيس شركة جون كرين",
      excerptEn: "The Group's leadership received Mr. Ruben Alvarez and Mr. Amjad Alqaqaa to discuss continued collaboration between the two organizations.",
      excerptAr: "استقبلت قيادة المجموعة السيد روبن ألفاريز والسيد أمجد القعقاع لبحث فرص مواصلة التعاون بين الجانبين.",
      bodyEn:
        p(
          "Al-Ahed Holding was pleased to welcome Mr. Ruben Alvarez, President of John Crane, and Mr. Amjad Alqaqaa during a courtesy visit.",
          "The delegation was received by Mr. Jaber Al Sulaiti, Chairman, Mr. Jassim Al Mansoori, President, Mr. Mohammed Jaber Al Sulaiti, Vice Chairman, MD &amp; CEO, and Mr. Abdulaziz Al Mansoori, Board Member, to discuss opportunities for continued collaboration and strengthen the long-standing partnership between the two organizations.",
        ) +
        [2, 3, 4, 5].map((n) => img(`news-john-crane-visit-${n}.jpg`, "Courtesy visit by the President of John Crane to Al-Ahed Holding")).join(""),
      bodyAr:
        p(
          "سعدت العهد القابضة باستقبال السيد روبن ألفاريز، رئيس شركة جون كرين، والسيد أمجد القعقاع في زيارة مجاملة.",
          "وكان في استقبال الوفد السيد جابر السليطي، رئيس مجلس الإدارة، والسيد جاسم المنصوري، الرئيس، والسيد محمد جابر السليطي، نائب رئيس مجلس الإدارة والعضو المنتدب والرئيس التنفيذي، والسيد عبدالعزيز المنصوري، عضو مجلس الإدارة، حيث جرى بحث فرص مواصلة التعاون وتعزيز الشراكة الممتدة بين الجانبين.",
        ) + [2, 3, 4, 5].map((n) => img(`news-john-crane-visit-${n}.jpg`, "زيارة مجاملة من رئيس شركة جون كرين إلى العهد القابضة")).join(""),
      coverImage: `${M}/news-john-crane-visit-1.jpg`,
      publishedAt: new Date("2026-07-02T09:00:00.000Z"),
    },
  },
];

const POST_CREATE = {
  slug: "hilong-group-leadership-visit",
  type: "news",
  company: "dopet",
  status: "published",
  featured: false,
  titleEn: "Al-Ahed Holding and DOPET welcome the senior leadership of Hilong Group",
  titleAr: "العهد القابضة ودوبت تستقبلان الإدارة العليا لمجموعة هيلونغ",
  excerptEn: "A productive meeting focused on exploring strategic collaboration and future business opportunities in Qatar.",
  excerptAr: "اجتماع مثمر ركّز على استكشاف فرص التعاون الاستراتيجي وآفاق الأعمال المستقبلية في قطر.",
  bodyEn: p(
    "Al-Ahed Holding and DOPET were pleased to welcome the senior leadership team of Hilong Group for a productive meeting focused on exploring strategic collaboration and future business opportunities in Qatar.",
    "The discussions highlighted the complementary strengths, technical capabilities, and industry experience of both organizations, as well as potential areas where these capabilities can be brought together to create long-term value.",
    "The meeting reflects a shared interest in building a strong and sustainable relationship, founded on mutual trust, technical excellence, and a common commitment to supporting the continued development of Qatar's energy sector.",
    "We look forward to strengthening this relationship and exploring opportunities for successful cooperation in the future.",
  ),
  bodyAr: p(
    "سعدت العهد القابضة ودوبت باستقبال فريق الإدارة العليا لمجموعة هيلونغ في اجتماع مثمر ركّز على استكشاف فرص التعاون الاستراتيجي وآفاق الأعمال المستقبلية في قطر.",
    "وسلّطت المباحثات الضوء على نقاط القوة المتكاملة والقدرات الفنية والخبرة الصناعية لدى الجانبين، إلى جانب المجالات التي يمكن فيها الجمع بين هذه القدرات لتحقيق قيمة طويلة الأمد.",
    "ويعكس الاجتماع اهتمامًا مشتركًا ببناء علاقة قوية ومستدامة، تقوم على الثقة المتبادلة والتميّز الفني والالتزام المشترك بدعم التطور المستمر لقطاع الطاقة في قطر.",
    "ونتطلع إلى تعزيز هذه العلاقة واستكشاف فرص تعاون ناجح في المستقبل.",
  ),
  coverImage: `${M}/news-hilong-group-visit.jpg`,
  publishedAt: new Date("2026-09-07T09:00:00.000Z"),
};

/* ───────────── Run ───────────── */

async function main() {
  const db = new PrismaClient();
  const log = (s) => console.log(`    ${DRY ? "[dry] " : ""}${s}`);
  try {
    const backup = process.env.BACKUP_PATH;
    if (backup && !DRY) {
      await db.$executeRawUnsafe(`VACUUM INTO '${backup.replace(/'/g, "''")}'`);
      log(`backup: ${backup}`);
    }

    // People
    const people = await db.person.findMany();
    const find = (group, name) => people.find((x) => x.group === group && norm(x.nameEn) === norm(name));
    for (const u of UPDATE) {
      const row = find(u.group, u.name);
      if (!row) {
        log(`!! not found: ${u.group} · ${u.name}`);
        continue;
      }
      const data = {};
      if (!row.photo) data.photo = u.photo;
      // Bio: only if empty, or still the original seed (never edited in the admin: updatedAt = people script run).
      const untouched = row.updatedAt.toISOString() < "2026-11-22T11:40:00.000Z";
      if (!row.bioEn.trim() || untouched) data.bioEn = u.bio.en;
      if (!row.bioAr.trim() || untouched) data.bioAr = u.bio.ar;
      if (u.rename && row.nameEn !== u.rename && untouched) data.nameEn = u.rename;
      if (u.rename && untouched && /^السيد\s+/.test(row.nameAr)) data.nameAr = row.nameAr.replace(/^السيد\s+/, "");
      if (!Object.keys(data).length) {
        log(`skip (edited): ${u.group} · ${row.nameEn}`);
        continue;
      }
      if (!DRY) await db.person.update({ where: { id: row.id }, data });
      log(`updated ${u.group} · ${row.nameEn} / ${row.nameAr}: ${Object.keys(data).join(", ")}`);
    }
    let addedExec = false;
    for (const c of CREATE) {
      if (find(c.group, c.nameEn)) {
        log(`skip (exists): ${c.group} · ${c.nameEn}`);
        continue;
      }
      const { bio, ...rest } = c;
      if (!DRY) await db.person.create({ data: { ...rest, bioEn: bio.en, bioAr: bio.ar } });
      if (c.group === "management") addedExec = true;
      log(`added ${c.group} · ${c.nameEn}${c.active ? "" : " (hidden)"}`);
    }
    // First run only: President and MD & CEO lead the executive team, the others keep their relative order.
    if (addedExec && !DRY) {
      const lead = CREATE.filter((c) => c.group === "management").map((c) => norm(c.nameEn));
      const exec = await db.person.findMany({ where: { group: "management" }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
      const sorted = [...exec.filter((x) => lead.includes(norm(x.nameEn))).sort((a, b) => a.order - b.order), ...exec.filter((x) => !lead.includes(norm(x.nameEn)))];
      await db.$transaction(sorted.map((x, k) => db.person.update({ where: { id: x.id }, data: { order: k + 1 } })));
      log(`management order: ${sorted.map((x) => x.nameEn).join(" › ")}`);
    }

    // Leadership messages
    const hasMessages = await db.setting.findUnique({ where: { key: "messages" } });
    if (hasMessages) log("skip (exists): leadership messages");
    else {
      const all = await db.person.findMany();
      const pid = (name) => all.find((x) => x.group === "board" && norm(x.nameEn) === norm(name))?.id ?? null;
      const items = [
        { id: "chairman", personId: pid("Jaber Ahmad Al Sulaiti"), titleEn: "Chairman's message", titleAr: "كلمة رئيس مجلس الإدارة", bodyEn: CHAIRMAN.en, bodyAr: CHAIRMAN.ar, visible: true },
        {
          id: "vice-chairman-president",
          personId: pid("Jassim Mohammed Al Mansoori"),
          titleEn: "Vice Chairman and President's message",
          titleAr: "كلمة نائب رئيس مجلس الإدارة والرئيس",
          bodyEn: PRESIDENT.en,
          bodyAr: PRESIDENT.ar,
          visible: true,
        },
      ];
      if (!DRY) await db.setting.create({ data: { key: "messages", value: JSON.stringify({ items }) } });
      log(`added leadership messages (${items.map((i) => `${i.id} → ${i.personId}`).join(", ")})`);
    }

    // News
    for (const u of POSTS_UPDATE) {
      const post = await db.post.findUnique({ where: { slug: u.slug } });
      if (!post) {
        log(`!! post not found: ${u.slug}`);
        continue;
      }
      if (post.coverImage !== u.seedCover) {
        log(`skip (edited): post ${u.slug} (cover ${post.coverImage})`);
        continue;
      }
      if (!DRY) await db.post.update({ where: { id: post.id }, data: u.data });
      log(`updated post ${u.slug}: ${Object.keys(u.data).join(", ")}`);
    }
    if (await db.post.findUnique({ where: { slug: POST_CREATE.slug } })) log(`skip (exists): post ${POST_CREATE.slug}`);
    else {
      const author = await db.user.findFirst({ where: { role: "admin" }, orderBy: { createdAt: "asc" } });
      if (!DRY) await db.post.create({ data: { ...POST_CREATE, authorId: author?.id ?? null } });
      log(`added post ${POST_CREATE.slug}`);
    }

    log(`ok — people ${await db.person.count()}, posts ${await db.post.count()}`);
  } finally {
    await db.$disconnect();
  }
}

main().catch((e) => {
  console.error("!! content update failed:", e);
  process.exit(1);
});
