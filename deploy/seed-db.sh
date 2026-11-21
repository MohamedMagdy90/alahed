#!/usr/bin/env bash
# Prepare the INITIAL production database locally (schema + seed content + admin user).
# Only used for the first deploy; deploy.sh installs it only if the server has no database yet.
#   SEED_ADMIN_PASSWORD='...' bash deploy/seed-db.sh
set -euo pipefail
cd "$(dirname "$0")/.."
: "${SEED_ADMIN_PASSWORD:?set SEED_ADMIN_PASSWORD}"
rm -f /tmp/alahed-seed.db
export DATABASE_URL="file:/tmp/alahed-seed.db"
bunx prisma db push --skip-generate >/dev/null
SEED_ADMIN_EMAIL="${SEED_ADMIN_EMAIL:-admin@alahedholding.com}" bun prisma/seed.ts
echo "seed database ready: /tmp/alahed-seed.db"
