// One-off data fix (2026-11-23), run on the server as the app user against the CURRENT release's modules:
//   set -a; . /etc/alahed/env; set +a; cd /srv/alahed/current
//   runuser -u alahed -- env DATABASE_URL="$DATABASE_URL" NODE_PATH=/srv/alahed/current/node_modules \
//     /usr/bin/node /tmp/fix-posts.js
// Back up shared/data/alahed.db first.
//
// 1. The headquarters photo moved from /images/hq.png to /images/hq.jpg: repoint covers and inline images.
// 2. The seeded "new corporate website" article promised an investor relations section (now hidden until the
//    listing) and said "three operating companies" (there are four). It is rewritten ONLY if every text field
//    still equals the original seed, so anything the client has edited in the admin panel is left untouched.
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();
const p = (...paras) => paras.map((t) => `<p>${t}</p>`).join("");

const SEED = {
  excerptEn:
    "A new bilingual platform brings the Group, its three operating companies and a dedicated investor relations centre together in one place.",
  excerptAr: "منصة جديدة ثنائية اللغة تجمع المجموعة وشركاتها التشغيلية الثلاث ومركزًا مخصصًا لعلاقات المستثمرين في مكان واحد.",
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
};

const NEW = {
  excerptEn: "A new bilingual platform brings the Group and its four operating companies together in one place.",
  excerptAr: "منصة جديدة ثنائية اللغة تجمع المجموعة وشركاتها التشغيلية الأربع في مكان واحد.",
  bodyEn: p(
    "Al-Ahed Holding has launched its new corporate website, available in English and Arabic, as part of the Group's ongoing commitment to clear communication with clients, partners and employees.",
    "The website presents the Group's history since 1975 and the capabilities of its four operating companies — Al-Ahed Trading &amp; Contracting, DOPET, PEMCO Inspection and DOPET Sales &amp; Technologies — together with the Group's governance, HSE commitments and career opportunities.",
    "News, announcements and insights from across the Group will be updated regularly through the newsroom.",
  ),
  bodyAr: p(
    "أطلقت العهد القابضة موقعها الإلكتروني المؤسسي الجديد باللغتين العربية والإنجليزية، في إطار التزام المجموعة المستمر بالتواصل الواضح مع العملاء والشركاء والموظفين.",
    "ويستعرض الموقع مسيرة المجموعة منذ عام 1975، وقدرات شركاتها التشغيلية الأربع – العهد للتجارة والمقاولات ودوبت وبمكو للفحص ودوبت للمبيعات والتكنولوجيا – إلى جانب منظومة الحوكمة والتزامات الصحة والسلامة والبيئة وفرص العمل في المجموعة.",
    "وسيتم تحديث الأخبار والإعلانات والمقالات من مختلف شركات المجموعة بشكل منتظم عبر المركز الإعلامي.",
  ),
};

(async () => {
  // 1. hq.png -> hq.jpg
  const posts = await db.post.findMany();
  let moved = 0;
  for (const post of posts) {
    const data = {};
    for (const f of ["coverImage", "bodyEn", "bodyAr"]) {
      if (post[f] && post[f].includes("/images/hq.png")) data[f] = post[f].split("/images/hq.png").join("/images/hq.jpg");
    }
    if (Object.keys(data).length) {
      await db.post.update({ where: { id: post.id }, data });
      moved++;
      console.log(`hq.jpg: ${post.slug} (${Object.keys(data).join(", ")})`);
    }
  }
  const people = await db.person.findMany({ where: { photo: { contains: "/images/hq.png" } } });
  for (const person of people) {
    await db.person.update({ where: { id: person.id }, data: { photo: person.photo.split("/images/hq.png").join("/images/hq.jpg") } });
    console.log(`hq.jpg: person ${person.nameEn}`);
  }
  console.log(`hq.jpg references fixed: ${moved} post(s), ${people.length} person(s)`);

  // 2. Seeded launch article, only if untouched
  const a = await db.post.findUnique({ where: { slug: "new-corporate-website" } });
  if (!a) console.log("launch article: not found, nothing to do");
  else {
    const changed = Object.keys(SEED).filter((k) => a[k] !== SEED[k]);
    if (changed.length) console.log(`launch article: edited in the admin panel (${changed.join(", ")}), left untouched`);
    else {
      await db.post.update({ where: { id: a.id }, data: NEW });
      console.log("launch article: rewritten (four companies, no investor relations mention)");
    }
  }
  await db.$disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
