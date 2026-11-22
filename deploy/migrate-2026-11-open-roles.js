// One-off, idempotent schema change for "Open roles" (Job table + Message.jobId).
// Run on the server from the CURRENT release so it uses the bundled Prisma client:
//   cd /srv/alahed/current && set -a && . /etc/alahed/env && set +a && node /tmp/migrate-open-roles.js
// Additive only (new table, nullable column, indexes): the running site keeps working before and after.
const { PrismaClient } = require("@prisma/client");

const STEPS = [
  {
    check: `SELECT name FROM sqlite_master WHERE type='table' AND name='Job'`,
    sql: `CREATE TABLE "Job" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "company" TEXT NOT NULL DEFAULT 'holding',
      "area" TEXT NOT NULL DEFAULT 'engineering',
      "employment" TEXT NOT NULL DEFAULT 'full-time',
      "titleEn" TEXT NOT NULL,
      "titleAr" TEXT NOT NULL DEFAULT '',
      "locationEn" TEXT NOT NULL DEFAULT '',
      "locationAr" TEXT NOT NULL DEFAULT '',
      "summaryEn" TEXT NOT NULL DEFAULT '',
      "summaryAr" TEXT NOT NULL DEFAULT '',
      "open" BOOLEAN NOT NULL DEFAULT true,
      "postedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    )`,
  },
  {
    check: `SELECT name FROM pragma_table_info('Message') WHERE name='jobId'`,
    sql: `ALTER TABLE "Message" ADD COLUMN "jobId" TEXT`,
  },
  {
    check: `SELECT name FROM sqlite_master WHERE type='index' AND name='Job_open_postedAt_idx'`,
    sql: `CREATE INDEX "Job_open_postedAt_idx" ON "Job"("open", "postedAt")`,
  },
  {
    check: `SELECT name FROM sqlite_master WHERE type='index' AND name='Message_jobId_idx'`,
    sql: `CREATE INDEX "Message_jobId_idx" ON "Message"("jobId")`,
  },
];

async function main() {
  const db = new PrismaClient();
  try {
    const backup = process.env.BACKUP_PATH;
    if (backup) {
      // Consistent online copy of the live database before touching the schema.
      await db.$executeRawUnsafe(`VACUUM INTO '${backup.replace(/'/g, "''")}'`);
      console.log(`    backup: ${backup}`);
    }
    for (const s of STEPS) {
      const rows = await db.$queryRawUnsafe(s.check);
      if (Array.isArray(rows) && rows.length > 0) {
        console.log(`    skip (exists): ${s.sql.split("(")[0].trim()}`);
        continue;
      }
      await db.$executeRawUnsafe(s.sql);
      console.log(`    applied: ${s.sql.split("(")[0].trim()}`);
    }
    const jobs = await db.$queryRawUnsafe(`SELECT COUNT(*) AS n FROM "Job"`);
    console.log(`    ok — Job rows: ${String(jobs[0].n)}`);
  } finally {
    await db.$disconnect();
  }
}

main().catch((e) => {
  console.error("!! migration failed:", e);
  process.exit(1);
});
