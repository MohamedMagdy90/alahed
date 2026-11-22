#!/usr/bin/env bash
# Build locally and ship a new release to the droplet (zero-touch for other sites).
#   bash deploy/deploy.sh            # build + deploy
#   SKIP_BUILD=1 bash deploy/deploy.sh   # re-ship the last build
set -euo pipefail
cd "$(dirname "$0")/.."

HOST="${DEPLOY_HOST:-root@142.93.222.165}"
KEY="${DEPLOY_KEY:-$PWD/.deploy/alahed_do_ed25519}"
DOMAIN="${DOMAIN:-alahed.142-93-222-165.sslip.io}"
DIST=.next-prod
# Host key is pinned next to the deploy key (survives workspace restarts that wipe ~/.ssh).
KNOWN="${DEPLOY_KNOWN_HOSTS:-$(dirname "$KEY")/known_hosts}"
chmod 600 "$KEY" 2>/dev/null || true
SSH_OPTS="-i $KEY -o BatchMode=yes -o ConnectTimeout=15 -o UserKnownHostsFile=$KNOWN -o StrictHostKeyChecking=yes"
SSH="ssh $SSH_OPTS"
TS=$(date -u +%Y%m%d-%H%M%S)
OUT=/tmp/alahed-release
# Build where the dependencies really live, so build output never lands in the workspace (large files there
# trigger container resets). node_modules may be a symlink into /tmp; with no dependencies, install in /tmp.
if [ -n "${BUILD_DIR:-}" ]; then BUILD="$BUILD_DIR"
elif [ -e node_modules ]; then BUILD="$(dirname "$(readlink -f node_modules)")"
else BUILD=/tmp/alahed-build; fi

if [ -z "${SKIP_BUILD:-}" ]; then
  echo "==> build ($BUILD/$DIST)"
  if [ "$(readlink -f "$BUILD")" != "$(readlink -f .)" ]; then
    mkdir -p "$BUILD"
    rm -rf "$BUILD/src" "$BUILD/public" "$BUILD/prisma" "$BUILD/$DIST"
    tar -cf - --exclude=./node_modules --exclude=./.git --exclude='./.next*' --exclude=./.deploy \
      --exclude=./storage --exclude='./prisma/*.db*' --exclude=./tsconfig.tsbuildinfo --exclude=./.same . \
      | tar -xf - -C "$BUILD"
    [ -d "$BUILD/node_modules" ] || (cd "$BUILD" && bun install --frozen-lockfile)
  fi
  (
    cd "$BUILD"
    rm -rf "$DIST"
    bunx prisma generate >/dev/null
    NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=3072}" NEXT_DIST_DIR=$DIST \
      NEXT_PUBLIC_SITE_URL="https://$DOMAIN" NEXT_TELEMETRY_DISABLED=1 bunx next build
  )
fi

echo "==> assemble release"
rm -rf "$OUT" && mkdir -p "$OUT"
cp -a "$BUILD/$DIST/standalone/." "$OUT/"
mkdir -p "$OUT/$DIST" && cp -a "$BUILD/$DIST/static" "$OUT/$DIST/static"
cp -a public "$OUT/public"
mkdir -p "$OUT/prisma" && cp prisma/schema.prisma "$OUT/prisma/"
# Never ship local databases, env files or uploads.
rm -rf "$OUT/.env" "$OUT/prisma/"*.db "$OUT/storage" "$OUT/deploy" "$OUT/.same"
# Image optimisation (next/image) needs sharp built for the droplet (linux x86_64, glibc). The build machine may
# be arm64, so the traced binaries are dropped and the x64 package is installed instead, with its dependencies
# nested under sharp/node_modules so they can never clash with the app's own copies.
SHARP_VERSION=0.34.2
SHARP_DIR=/tmp/alahed-sharp-x64-$SHARP_VERSION
rm -rf "$OUT/node_modules/@img" "$OUT/node_modules/sharp"
if [ ! -d "$SHARP_DIR/node_modules/@img/sharp-linux-x64" ]; then
  rm -rf "$SHARP_DIR" && mkdir -p "$SHARP_DIR"
  echo '{"name":"sharp-x64","private":true}' > "$SHARP_DIR/package.json"
  (cd "$SHARP_DIR" && npm install --silent --no-audit --no-fund --os=linux --cpu=x64 --libc=glibc "sharp@$SHARP_VERSION")
fi
mkdir -p "$OUT/node_modules/sharp/node_modules"
cp -a "$SHARP_DIR/node_modules/sharp/." "$OUT/node_modules/sharp/"
for d in "$SHARP_DIR"/node_modules/*; do
  [ "$(basename "$d")" = "sharp" ] || cp -a "$d" "$OUT/node_modules/sharp/node_modules/"
done
tar czf /tmp/alahed-release.tgz -C "$OUT" .
echo "    size: $(du -h /tmp/alahed-release.tgz | cut -f1)"

echo "==> upload"
scp $SSH_OPTS -q /tmp/alahed-release.tgz "$HOST:/tmp/alahed-release.tgz"

# First deploy only: seed database prepared locally (deploy/seed-db.sh).
if [ -f /tmp/alahed-seed.db ]; then
  scp $SSH_OPTS -q /tmp/alahed-seed.db "$HOST:/tmp/alahed-seed.db"
fi

echo "==> activate release $TS"
$SSH "$HOST" "TS=$TS bash -s" <<'REMOTE'
set -euo pipefail
APP=/srv/alahed
REL=$APP/releases/$TS
PREV=$(readlink -f $APP/current 2>/dev/null || true)
mkdir -p "$REL"
tar xzf /tmp/alahed-release.tgz -C "$REL"
rm -f /tmp/alahed-release.tgz
# Initial database (only if none exists yet)
if [ -f /tmp/alahed-seed.db ]; then
  if [ ! -f $APP/shared/data/alahed.db ]; then mv /tmp/alahed-seed.db $APP/shared/data/alahed.db; echo "    database installed"; else rm -f /tmp/alahed-seed.db; fi
fi
# Optimised images are cached outside the release, so a deploy does not make the next visitors wait while
# every photo is re-encoded (1-2 s each).
mkdir -p $APP/shared/cache/images "$REL/.next-prod/cache"
rm -rf "$REL/.next-prod/cache/images" && ln -sfn $APP/shared/cache/images "$REL/.next-prod/cache/images"
chown -R alahed:alahed "$REL" $APP/shared
ln -sfn "$REL" $APP/current
systemctl restart alahed-web
ok=""
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://127.0.0.1:3002/en || true)
  if [ "$code" = "200" ]; then ok=1; break; fi
  sleep 1
done
# The image optimiser must work too (sharp for this CPU), or every photo on the site breaks.
if [ -n "$ok" ]; then
  img=$(curl -s -o /dev/null -w "%{http_code} %{content_type}" --max-time 30 -H "Accept: image/webp,image/*;q=0.8" \
    "http://127.0.0.1:3002/_next/image?url=%2Fimages%2Fdoha-night.jpg&w=640&q=75" || true)
  case "$img" in
    "200 image/webp"*) echo "    image optimiser ok" ;;
    *) ok=""; code="image optimiser: $img" ;;
  esac
fi
if [ -z "$ok" ]; then
  echo "!! health check failed (last code: $code) — rolling back"
  journalctl -u alahed-web -n 40 --no-pager || true
  if [ -n "$PREV" ] && [ -d "$PREV" ]; then ln -sfn "$PREV" $APP/current; systemctl restart alahed-web; fi
  exit 1
fi
echo "    healthy"
# Keep the 5 most recent releases
ls -1dt $APP/releases/* | tail -n +6 | xargs -r rm -rf
REMOTE

rm -f /tmp/alahed-seed.db
# Free the space: build output and the release bundle are not needed after a successful deploy.
rm -rf "$OUT" /tmp/alahed-release.tgz
[ "$(readlink -f "$BUILD")" = "$(readlink -f .)" ] || rm -rf "$BUILD/$DIST"
echo "==> live: https://$DOMAIN"
