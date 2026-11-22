// One-off, idempotent data update: board & management from the Al-Ahed Holding corporate profile.
// Insert-only: a person is added only if no row with the same English name exists, so edits made in the
// admin panel are never overwritten. Run on the server as the app user, against the CURRENT release's modules
// (applied on the live site 2026-11-22 11:39 UTC, backup pre-people-20261122-113910.db):
//   set -a; . /etc/alahed/env; set +a; cd /srv/alahed/current
//   runuser -u alahed -- env DATABASE_URL="$DATABASE_URL" NODE_PATH=/srv/alahed/current/node_modules \
//     BACKUP_PATH=/srv/alahed/shared/backups/pre-people-$(date -u +%Y%m%d-%H%M%S).db /usr/bin/node /tmp/seed-people.js
const { PrismaClient } = require("@prisma/client");

const PEOPLE = [
  { group: "board", order: 1, nameEn: "Jaber Ahmad Al Sulaiti", nameAr: "جابر أحمد السليطي", roleEn: "Chairman of the Board", roleAr: "رئيس مجلس الإدارة" },
  { group: "board", order: 2, nameEn: "Jassim Mohammed Al Mansoori", nameAr: "جاسم محمد المنصوري", roleEn: "Vice Chairman & President", roleAr: "نائب رئيس مجلس الإدارة والرئيس" },
  { group: "board", order: 3, nameEn: "Mohammed Jaber Al Sulaiti", nameAr: "محمد جابر السليطي", roleEn: "Managing Director & Chief Executive Officer", roleAr: "العضو المنتدب والرئيس التنفيذي" },
  { group: "board", order: 4, nameEn: "Ahmad Mohammed Al Mansoori", nameAr: "أحمد محمد المنصوري", roleEn: "Board Member", roleAr: "عضو مجلس الإدارة" },
  { group: "board", order: 5, nameEn: "Hamad Qasim Al Saei", nameAr: "حمد قاسم الساعي", roleEn: "Board Member", roleAr: "عضو مجلس الإدارة" },
  { group: "management", order: 1, nameEn: "Nirav Bavisi", nameAr: "نيراف بافيسي", roleEn: "Chief Financial Officer", roleAr: "المدير المالي" },
  { group: "management", order: 2, nameEn: "Nicholas Dean Stothard", nameAr: "نيكولاس دين ستوثارد", roleEn: "General Manager, Doha Petroleum Construction Co. (DOPET)", roleAr: "المدير العام، شركة الدوحة للإنشاءات البترولية (دوبت)" },
  { group: "management", order: 3, nameEn: "Prabhakaran Balasubramanian", nameAr: "برابهاكاران بالاسوبرامانيان", roleEn: "General Manager, Sales, Al-Ahed Trading & Contracting", roleAr: "المدير العام للمبيعات، العهد للتجارة والمقاولات" },
  { group: "management", order: 4, nameEn: "Parthiban Selvaraj", nameAr: "بارثيبان سيلفاراج", roleEn: "General Manager, PEMCO Inspection Company", roleAr: "المدير العام، شركة بمكو لخدمات التفتيش" },
  { group: "management", order: 5, nameEn: "N. Shankaran", nameAr: "ن. شانكاران", roleEn: "Sales Manager, DOPET Sales & Technologies", roleAr: "مدير المبيعات، دوبت للمبيعات والتكنولوجيا" },
];

// Ignore honorifics, punctuation and spacing ("Mr. Mohammed Jaber Al-Sulaiti" = "Mohammed Jaber Al Sulaiti").
const norm = (s) => s.toLowerCase().replace(/^\s*(mr|mrs|ms|dr|eng|sheikh)\.?\s+/, "").replace(/[^a-z]/g, "");

async function main() {
  const db = new PrismaClient();
  try {
    const backup = process.env.BACKUP_PATH;
    if (backup) {
      await db.$executeRawUnsafe(`VACUUM INTO '${backup.replace(/'/g, "''")}'`);
      console.log(`    backup: ${backup}`);
    }
    const existing = await db.person.findMany({ select: { id: true, nameEn: true, order: true } });
    const have = new Map(existing.map((p) => [norm(p.nameEn), p]));
    let addedChair = false;
    for (const p of PEOPLE) {
      if (have.has(norm(p.nameEn))) {
        console.log(`    skip (exists): ${p.nameEn}`);
        continue;
      }
      await db.person.create({ data: p });
      if (p.order === 1 && p.group === "board") addedChair = true;
      console.log(`    added: ${p.group} · ${p.nameEn}`);
    }
    // First run only: place the existing MD & CEO after the Chairman and Vice Chairman.
    const md = have.get(norm("Mohammed Jaber Al Sulaiti"));
    if (addedChair && md && md.order < 3) {
      await db.person.update({ where: { id: md.id }, data: { order: 3 } });
      console.log("    reordered: Mohammed Jaber Al Sulaiti → 3");
    }
    const n = await db.person.count();
    console.log(`    ok — Person rows: ${n}`);
  } finally {
    await db.$disconnect();
  }
}

main().catch((e) => {
  console.error("!! people update failed:", e);
  process.exit(1);
});
