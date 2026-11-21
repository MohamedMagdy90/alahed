# Al-Ahed Holding — Build Tracker
## Brief
- Pre-IPO (QSE listing soon), family-owned Qatari group. Professional, advanced, flawless.
- Bilingual EN / AR (full RTL) for site AND admin panel.
- Self-hosted (Next.js + Prisma/SQLite + local uploads) on the client's DigitalOcean droplet.
- Brand assets from current site. Founding year 1975 (PEMCO est. 1975 as well).
- User instruction: do NOT use task agents — build everything directly.

## Deployment (DigitalOcean droplet 142.93.222.165, shared with other live sites)
- Temporary URL: https://alahed.142-93-222-165.sslip.io (noindex header while temporary)
- SSH key: /home/project/.deploy-keys/alahed_do_ed25519 (root). Admin creds: /home/project/.deploy-keys/admin-credentials.txt
- Server: user `alahed`, /srv/alahed/{releases,current,shared/{data,storage,backups}}, env /etc/alahed/env,
  systemd `alahed-web` (port 3002), nginx sites-available/alahed, certbot cert, daily backup cron.
- Other sites on the server (DO NOT TOUCH): bungee-fly (:3000), estate-crm (:3001), postgres.
- Deploy: `bash deploy/deploy.sh` (build to .next-prod, upload, health check, auto rollback, keep 5 releases).
- Schema changes later: backup, then `bunx prisma@6.19.0 db push` on the server against the shared DB.

## Phase 1 — Foundation
- [x] Prisma schema + seed, auth, middleware (locale + admin guard, proxy-safe redirects)
- [x] Design tokens, fonts, i18n, bilingual content
- [x] Header, Footer, PageHero, NewsCard, Marquee, OrbitArcs
- [x] Home page (all sections), 404 page
- [x] Standalone production build + first deployment
## Phase 2 — Inner pages
- [x] About  - [x] Leadership  - [x] Companies index + 3 pages  - [x] Investors
- [x] Governance & HSE  - [x] Newsroom + article  - [x] Careers + /api/careers
- [x] Contact + /api/contact  - [x] Legal pages  (deployed + verified live, 26 routes)
## Phase 3 — Admin (bilingual, RTL)
- [x] Admin dictionary (src/i18n/admin.ts) + server actions (src/lib/admin/*)
- [x] /api/admin/upload + /api/admin/cv/[...path] + /api/admin/subscribers (CSV)
- [x] Login/logout + roles (live DB role/active check in requireSession/assertSession)
- [x] Dashboard  - [x] Posts list + editor (Tiptap, EN/AR tabs, SEO preview, cover, schedule, Ctrl+S)
- [x] Leadership CRUD + ordering  - [x] IR documents  - [x] Inbox (2-pane, CV download)
- [x] Subscribers (+CSV)  - [x] Settings (admin)  - [x] Users (admin)  - [x] Account
- [x] Verified end-to-end (77 checks on local prod build) + deployed; live read-only check 30/30
## Workspace notes (learned the hard way)
- Container memory cap is 4 GB: STOP the dev server before `next build` (OOM restarts the container,
  wipes /tmp + ~/.ssh and can corrupt prisma/dev.db → rebuild with `db push` + seed).
- Host key pinned in /home/project/.deploy-keys/known_hosts; deploy.sh re-chmods the key itself.
- Shell heredocs are unreliable here: write scripts to files instead.
- Other server services: bungee-fly, estate-crm-web, estate-crm-worker (all running).
- 2026-11-21 13:08 a container restart DELETED every file 5+ folders deep (all inner pages, admin, admin APIs)
  and corrupted dev.db. Restored from the user's GitHub Archive.zip (verified identical to live release).
## Source control (mandatory)
- Git repo in this folder, branch `develop`, remote `origin` = github.com/MohamedMagdy90/alahed (PUBLIC repo).
- After EVERY meaningful change: `git add -A && git commit` (message via file, not heredoc) and `git push`.
- Never deploy uncommitted work: the live release must always match a pushed commit.
- [ ] Push blocked: workspace GitHub account `AmrDNAERP` has read-only access to the repo → owner must add
  it as collaborator (Write), or reconnect GitHub as the owner. Then `git push -u origin develop`.
- [ ] Ask owner to make the repo private and remove `Archive.zip` from `main` (it contains a local .env + dev.db;
  prod secrets verified different, but it should not be public).
## Phase 4
- [x] Sitemap/robots/hreflang  - [ ] performance pass
- [ ] Switch to real domain (remove noindex, new cert, NEXT_PUBLIC_SITE_URL)
## Phase 5 — "Feels real, not AI-built" (proposed, awaiting approval; build on a `redesign` branch)
- A (no new assets): logo system (white mono on dark, full colour on light, no chips; PEMCO cut-out);
  remove AI tells (01/02 section numbers, mono eyebrows everywhere, italic-serif accent words, uniform navy
  photo overlays, scroll-greyed text, outlined marquee, giant footer wordmark); motion audit (keep few,
  meaningful); specific EN/AR headlines; page transitions (company card → company hero); live strip
  (latest announcement + open roles from DB).
- B (needs client assets): hero video loop, real photography (people, workshops, sites), publishable
  project references, named people.
- C (after listing): live QSE share price, IR calendar.
## Content gaps to confirm with client
- Chairman & President messages, full Board list + photos (only MD & CEO seeded)
- PEMCO services detail, workforce figure
