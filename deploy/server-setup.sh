#!/usr/bin/env bash
# One-time (idempotent) server setup for the Al-Ahed Holding website. Run on the droplet as root:
#   DOMAIN=alahed.142-93-222-165.sslip.io bash server-setup.sh
# Expects alahed-web.service and nginx-alahed.conf next to this script.
# Only creates NEW files for this site; never edits other sites' configs.
set -euo pipefail
DOMAIN="${DOMAIN:?set DOMAIN}"
HERE="$(cd "$(dirname "$0")" && pwd)"
APP=/srv/alahed

echo "==> user + folders"
id alahed >/dev/null 2>&1 || useradd --system --home-dir "$APP" --shell /usr/sbin/nologin alahed
mkdir -p "$APP"/releases "$APP"/shared/data "$APP"/shared/storage/uploads "$APP"/shared/storage/private "$APP"/shared/backups
chown -R alahed:alahed "$APP"
chmod 750 "$APP"

echo "==> environment (/etc/alahed/env)"
mkdir -p /etc/alahed
if [ ! -f /etc/alahed/env ]; then
  cat > /etc/alahed/env <<ENV
# Al-Ahed Holding website runtime environment
PORT=3002
HOSTNAME=127.0.0.1
DATABASE_URL="file:$APP/shared/data/alahed.db"
AUTH_SECRET="$(openssl rand -hex 32)"
UPLOAD_DIR="$APP/shared/storage/uploads"
PRIVATE_DIR="$APP/shared/storage/private"
NEXT_PUBLIC_SITE_URL="https://$DOMAIN"
ENV
fi
chown root:alahed /etc/alahed/env
chmod 640 /etc/alahed/env

echo "==> systemd service"
install -m 644 "$HERE/alahed-web.service" /etc/systemd/system/alahed-web.service
systemctl daemon-reload
systemctl enable alahed-web >/dev/null

echo "==> TLS certificate for $DOMAIN"
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
  # Temporary HTTP-only block so Let's Encrypt can reach the webroot challenge.
  cat > /etc/nginx/sites-available/alahed <<NGX
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;
    location ^~ /.well-known/acme-challenge/ { root /var/www/certbot; default_type text/plain; }
    location / { return 404; }
}
NGX
  ln -sfn /etc/nginx/sites-available/alahed /etc/nginx/sites-enabled/alahed
  nginx -t && systemctl reload nginx
  mkdir -p /var/www/certbot
  certbot certonly --webroot -w /var/www/certbot -d "$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email
fi

echo "==> nginx site"
sed "s/__DOMAIN__/$DOMAIN/g" "$HERE/nginx-alahed.conf" > /etc/nginx/sites-available/alahed
ln -sfn /etc/nginx/sites-available/alahed /etc/nginx/sites-enabled/alahed
nginx -t && systemctl reload nginx

echo "==> daily backup (database + uploads, keeps 14 days)"
cat > /etc/cron.daily/alahed-backup <<'CRON'
#!/bin/sh
set -e
B=/srv/alahed/shared/backups
TS=$(date +%Y%m%d-%H%M)
[ -f /srv/alahed/shared/data/alahed.db ] && cp /srv/alahed/shared/data/alahed.db "$B/alahed-$TS.db"
tar czf "$B/uploads-$TS.tgz" -C /srv/alahed/shared storage 2>/dev/null || true
chown alahed:alahed "$B"/* 2>/dev/null || true
find "$B" -type f -mtime +14 -delete
CRON
chmod 755 /etc/cron.daily/alahed-backup

echo "==> done: https://$DOMAIN (service starts after the first release is deployed)"
