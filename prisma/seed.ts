/* Idempotent seed: `bun prisma/seed.ts` */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const p = (...paras: string[]) => paras.map((t) => `<p>${t}</p>`).join("");

const posts = [
  {
    slug: "new-corporate-website",
    type: "press",
    company: "holding",
    featured: true,
    publishedAt: new Date("2026-11-20T09:00:00Z"),
    coverImage: "/images/doha-night.jpg",
    titleEn: "Al-Ahed Holding launches its new corporate website",
    titleAr: "العهد القابضة تطلق موقعها الإلكتروني المؤسسي الجديد",
    excerptEn:
      "A new bilingual platform brings the Group, its three operating companies and a dedicated investor relations centre together in one place.",
    excerptAr:
      "منصة جديدة ثنائية اللغة تجمع المجموعة وشركاتها التشغيلية الثلاث ومركزًا مخصصًا لعلاقات المستثمرين في مكان واحد.",
    bodyEn: p(
      "Al-Ahed Holding has launched its new corporate website, available in English and Arabic, as part of the Group's ongoing commitment to transparency and clear communication with clients, partners, employees and the investment community.",
      "The website presents the Group's history since 1975, the capabilities of its three operating companies — Al-Ahed Trading &amp; Contracting, DOPET and PEMCO Inspection — and a dedicated investor relations section where governance documents and disclosures will be published.",
      "News, announcements and insights from across the Group will be updated regularly through the newsroom.",
    ),
    bodyAr: p(
      "أطلقت العهد القابضة موقعها الإلكتروني المؤسسي الجديد باللغتين العربية والإنجليزية، في إطار التزام المجموعة المستمر بالشفافية والتواصل الواضح مع العملاء والشركاء والموظفين ومجتمع الاستثمار.",
      "ويستعرض الموقع مسيرة المجموعة منذ عام 1975، وقدرات شركاتها التشغيلية الثلاث – العهد للتجارة والمقاولات ودوبت وبمكو للفحص – إلى جانب قسم مخصص لعلاقات المستثمرين تُنشر فيه وثائق الحوكمة والإفصاحات.",
      "وسيتم تحديث الأخبار والإعلانات والمقالات من مختلف شركات المجموعة بشكل منتظم عبر المركز الإعلامي.",
    ),
  },
  {
    slug: "celeros-channel-partner-of-the-year-2026",
    type: "award",
    company: "aatc",
    featured: true,
    publishedAt: new Date("2026-10-14T09:00:00Z"),
    coverImage: "/images/refinery-pipes.jpg",
    titleEn: "Al-Ahed T&C wins two Channel Partner of the Year 2026 awards from Celeros Flow Technology",
    titleAr: "العهد للتجارة والمقاولات تفوز بجائزتي «شريك القناة للعام 2026» من سيليروس فلو تكنولوجي",
    excerptEn:
      "Two awards from Celeros Flow Technology recognise the strength of Al-Ahed's long-standing partnership and its service to customers in Qatar.",
    excerptAr: "جائزتان من سيليروس فلو تكنولوجي تقديرًا لقوة الشراكة الممتدة مع العهد وخدمتها للعملاء في قطر.",
    bodyEn: p(
      "Al-Ahed Trading &amp; Contracting has been recognised by Celeros Flow Technology with two Channel Partner of the Year 2026 awards.",
      "The recognition reflects the commitment of the Al-Ahed team to delivering dependable flow-control solutions and responsive support to customers across Qatar's energy sector, in close collaboration with its principals.",
      "Al-Ahed Holding congratulates the Al-Ahed T&amp;C team on this achievement.",
    ),
    bodyAr: p(
      "حصلت العهد للتجارة والمقاولات على جائزتي «شريك القناة للعام 2026» من سيليروس فلو تكنولوجي.",
      "ويعكس هذا التقدير التزام فريق العهد بتقديم حلول موثوقة للتحكم في التدفق ودعم سريع للعملاء في قطاع الطاقة القطري، بالتعاون الوثيق مع الشركات التي تمثّلها.",
      "وتتقدم العهد القابضة بالتهنئة إلى فريق العهد للتجارة والمقاولات على هذا الإنجاز.",
    ),
  },
  {
    slug: "nov-choke-valves-management-visit",
    type: "news",
    company: "holding",
    featured: false,
    publishedAt: new Date("2026-09-22T09:00:00Z"),
    coverImage: "/images/hq.png",
    titleEn: "NOV Choke Valves management team visits Al-Ahed Holding",
    titleAr: "فريق إدارة NOV للصمامات الخانقة يزور العهد القابضة",
    excerptEn: "The visit focused on strengthening collaboration and supporting customers across Qatar's oil and gas sector.",
    excerptAr: "ركّزت الزيارة على تعزيز التعاون ودعم العملاء في قطاع النفط والغاز في قطر.",
    bodyEn: p(
      "Al-Ahed Holding welcomed the management team of NOV Choke Valves to its headquarters in Doha.",
      "The meeting provided an opportunity to review the partnership, discuss market developments and explore ways to further support operators across Qatar's oil and gas sector.",
    ),
    bodyAr: p(
      "استقبلت العهد القابضة فريق إدارة NOV للصمامات الخانقة في مقرها الرئيسي بالدوحة.",
      "وشكّل الاجتماع فرصة لمراجعة الشراكة ومناقشة مستجدات السوق واستكشاف سبل تعزيز دعم المشغّلين في قطاع النفط والغاز في قطر.",
    ),
  },
  {
    slug: "john-crane-president-courtesy-visit",
    type: "news",
    company: "aatc",
    featured: false,
    publishedAt: new Date("2026-06-10T09:00:00Z"),
    coverImage: "/images/engineer.jpg",
    titleEn: "John Crane's President pays a courtesy visit to Al-Ahed",
    titleAr: "رئيس جون كرين يقوم بزيارة مجاملة إلى العهد",
    excerptEn: "A visit that underlines one of the Group's longest-standing principal relationships.",
    excerptAr: "زيارة تؤكد إحدى أعرق علاقات الشراكة لدى المجموعة.",
    bodyEn: p(
      "Al-Ahed was pleased to host the President of John Crane for a courtesy visit.",
      "Al-Ahed and John Crane operate dedicated service centres in Salwa Industrial Area and Ras Laffan, supporting mechanical seal and dry gas seal users across Qatar. The visit reaffirmed both companies' commitment to the partnership and to service excellence.",
    ),
    bodyAr: p(
      "سعدت العهد باستضافة رئيس شركة جون كرين في زيارة مجاملة.",
      "وتدير العهد وجون كرين مراكز خدمة متخصصة في المنطقة الصناعية ورأس لفان لدعم مستخدمي موانع التسرب الميكانيكية وموانع تسرب الغاز الجاف في قطر. وأكدت الزيارة التزام الشركتين بالشراكة وبالتميّز في الخدمة.",
    ),
  },
  {
    slug: "farewell-nabil-sayed-ahmed",
    type: "news",
    company: "holding",
    featured: false,
    publishedAt: new Date("2026-03-18T09:00:00Z"),
    coverImage: "/images/doha-dusk.jpg",
    titleEn: "A farewell to Mr. Nabil Sayed Ahmed",
    titleAr: "وداعًا للسيد نبيل سيد أحمد",
    excerptEn: "Colleagues gathered to thank Mr. Nabil Sayed Ahmed for his years of dedicated service to the Group.",
    excerptAr: "اجتمع الزملاء لتوجيه الشكر للسيد نبيل سيد أحمد على سنوات خدمته المخلصة للمجموعة.",
    bodyEn: p(
      "Management and colleagues across Al-Ahed Holding came together to bid farewell to Mr. Nabil Sayed Ahmed.",
      "We thank him for his dedication and contribution over the years, and wish him every success and happiness in the next chapter.",
    ),
    bodyAr: p(
      "اجتمعت الإدارة والزملاء في العهد القابضة لتوديع السيد نبيل سيد أحمد.",
      "نشكره على تفانيه وإسهاماته على مدى السنوات، ونتمنى له كل التوفيق والسعادة في المرحلة القادمة.",
    ),
  },
  {
    slug: "adipec-highlights",
    type: "event",
    company: "holding",
    featured: false,
    publishedAt: new Date("2025-11-12T09:00:00Z"),
    coverImage: "/images/offshore.jpg",
    titleEn: "Highlights from ADIPEC",
    titleAr: "أبرز محطات معرض أديبك",
    excerptEn: "The Group's teams met partners and customers at one of the world's largest energy exhibitions in Abu Dhabi.",
    excerptAr: "التقت فرق المجموعة بالشركاء والعملاء في أحد أكبر معارض الطاقة في العالم بأبوظبي.",
    bodyEn: p(
      "Representatives from across Al-Ahed Holding attended ADIPEC in Abu Dhabi, one of the world's largest gatherings of the energy industry.",
      "The exhibition offered a valuable opportunity to meet principals and customers, follow the latest technologies in rotating equipment, sealing and flow control, and explore new avenues for collaboration in the region.",
    ),
    bodyAr: p(
      "شارك ممثلون من مختلف شركات العهد القابضة في معرض ومؤتمر أديبك في أبوظبي، أحد أكبر تجمعات قطاع الطاقة في العالم.",
      "وأتاح المعرض فرصة قيّمة للقاء الشركاء والعملاء، ومتابعة أحدث التقنيات في معدات الدوران ومنع التسرب والتحكم في التدفق، واستكشاف آفاق جديدة للتعاون في المنطقة.",
    ),
  },
];

const people = [
  {
    group: "board",
    order: 1,
    nameEn: "Mr. Mohammed Jaber Al Sulaiti",
    nameAr: "السيد محمد جابر السليطي",
    roleEn: "Managing Director & Chief Executive Officer",
    roleAr: "العضو المنتدب والرئيس التنفيذي",
    bioEn: p(
      "Mr. Al Sulaiti leads Al-Ahed Holding as Managing Director and Chief Executive Officer. He is also Managing Director of JS Holding and a Board Member of AlRayan Bank.",
      "His previous roles include Director of Privatized Companies at QatarEnergy, Board Member and Chairman of the Audit Committee at QAFCO, Board and Audit Committee Member at QAPCO and QAMCO, and Board Member of Nebras Power.",
      "He holds a BA in Accounting and Finance from Middlesex University, United Kingdom.",
    ),
    bioAr: p(
      "يقود السيد السليطي العهد القابضة بصفته العضو المنتدب والرئيس التنفيذي، كما يشغل منصب العضو المنتدب لشركة جي إس القابضة وعضو مجلس إدارة مصرف الريان.",
      "وشغل سابقًا منصب مدير الشركات المخصخصة في قطر للطاقة، وعضو مجلس الإدارة ورئيس لجنة التدقيق في قافكو، وعضو مجلس الإدارة ولجنة التدقيق في قابكو وقامكو، وعضو مجلس إدارة نبراس للطاقة.",
      "وهو حاصل على درجة البكالوريوس في المحاسبة والمالية من جامعة ميدلسكس في المملكة المتحدة.",
    ),
  },
];

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@alahedholding.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "AlAhed@1975";
  const admin = await db.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Administrator", role: "admin", passwordHash: await bcrypt.hash(password, 12) },
  });

  for (const post of posts) {
    await db.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: { ...post, status: "published", authorId: admin.id },
    });
  }

  if ((await db.person.count()) === 0) {
    for (const person of people) await db.person.create({ data: person });
  }

  console.log(`Seeded: admin ${email}, ${posts.length} posts, ${people.length} people.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
