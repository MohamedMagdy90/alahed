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
## 2026-11-21 evening (branch `redesign`, deployed)
- Workspace reset deleted /home/project entirely → restored from GitHub `redesign`. The deploy key was lost too:
  a NEW key `alahed-deploy-2026-11-21` was added to the server by the owner; host key pinned
  (SHA256:e+xSWCk//TUHHQZqhd2j/AU3eMsgUNFyl5hz55LHRTo). If lost again: ssh-keygen a new key, ask the owner to append
  the .pub to /root/.ssh/authorized_keys and print `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub`.
- Owner preference: do NOT start the local dev server; deploy to the droplet and let them check there.
- [x] LogoMark: the real logo = 4 crescents (circle minus offset circle), traced from public/brand/icon.png.
  Hero fills the real bands; ArcsMark (inner pages) now renders the real mark.
- [x] Where we work: dark live map (Doha clock, MET Norway conditions via /api/conditions, routes + pulses, auto-tour)
- [x] Partners: manufacturers → Al-Ahed → operators live network (desktop), stacked flow (mobile)
- [x] Arabic phone overflow fix (SubscribeForm w-0) + body overflow-x: clip
## Rest of the redesign (code done 2026-11-22, all pushed to `redesign`)
- [x] Open roles: Job model + Message.jobId, admin /admin/jobs (JobsManager, lib/admin/jobs.ts), careers #roles list,
      apply-to-role (`position=job:<id>`, `?role=<id>#apply` preselect, ROLE_CLOSED), hero strip count, home CTA list
- [x] Page transitions: components/site/PageTransitions.tsx (window capture click → startViewTransition + router.push,
      resolves on pathname change, 2.5s cap). Cards: `data-vt-card` + `data-vt="media"`; heroes: `data-vt-hero="media"`.
      CSS at the end of globals.css. Header named only during a transition (`html.vt-active .vt-header`).
- [x] De-template: Eyebrow/SectionHeading plain sans (index prop ignored), Em = plain span, no grid-lines/dash/mono caps,
      PageHero full-colour photo + edge shading, no title animation
- [x] Motion audit: motion/index.tsx = useSafeReducedMotion + MotionProvider + Reveal (10px, 0.55s, delay ≤ 0.15s);
      Marquee.tsx deleted; principals = static list
- [x] 2026-11-22 09:40 UTC: key `alahed-deploy-2026-11-22` added by owner. DB backup
      shared/backups/pre-open-roles-20261122-094011.db, migration applied (Job + Message.jobId + 2 indexes, as `alahed`),
      release 20261122-094021 live (= commit 7320774). Verified: 14 routes 200, admin/jobs → login, careers API
      ROLE_CLOSED/INVALID, vt markers present, 0 log errors, other services active.
- [ ] Owner review of the live redesign (transitions, de-templated inner pages, open roles in admin)
## Workspace resets (2026-11-21/22)
- Host load ~180; the container is replaced several times a day. `.git` internals never survive; project files
  usually do; everything outside /home/project (incl. ~/.config) is lost. Restore: clone `redesign` with
  --no-checkout into /tmp, move its .git into the project, `git reset -q`, then `git status` shows unpushed work.
- Deploy key now lives in the git-ignored `.deploy/` folder inside the project (never commit it; repo is PUBLIC).
- Commit + push after every step. Kill the auto-started `next dev` (owner preference + memory).
## Content gaps to confirm with client
- Chairman & President messages, full Board list + photos (only MD & CEO seeded)
- PEMCO services detail, workforce figure

## 2026-11-22 PDF content + logos (branch redesign)
- Source: github.com/MohamedMagdy90/PM (holding profile, AATC 2026 deck, DOPET, PEMCO, 4 logos). Download to /tmp only,
  extract, delete. Never keep PDFs / node_modules / .next* in the workspace (big files trigger resets).
- [x] Logos: aatc, dopet, dopet-st (new), pemco (palette PNGs, ~35 KB). pemco-cutout removed.
- [x] 4th company DOPET Sales & Technologies (id dst, slug dopet-sales-technologies, parent dopet); PEMCO founded 1987.
- [x] content/profiles.ts (per-company detail), content/group.ts (ownership, board, property, footprint, workshops, OEM centres)
- [x] Company page sections (components/pages/company), About structure + facilities, Governance certs/awards,
      home tabs x4, map 8 sites, admin enums, header 4 cols.
- [x] Local prod build verified (11:20): 30 public routes + legal + news 200 in EN/AR, all 4 company pages carry their
      new sections, leadership shows board + management from the people script, 0 server log errors.
- [x] deploy.sh builds in the folder that holds node_modules (/tmp/nmb), never in the workspace; cleans up after deploy.
- [ ] Deploy: key lost again → new key `alahed-deploy-2026-11-22-b` in .deploy/ (host key re-verified + pinned).
      Waiting for the owner to append the .pub to /root/.ssh/authorized_keys. Release already built (21 MB):
      `SKIP_BUILD=1 bash deploy/deploy.sh` if /tmp survived, else plain `bash deploy/deploy.sh`.
- [ ] Leadership DB on the server, after deploy (as `alahed`, backup first):
      scp deploy/seed-people-2026-11.js → /tmp/seed-people.js; cd /srv/alahed/current; source /etc/alahed/env;
      runuser -u alahed -- env DATABASE_URL=… BACKUP_PATH=/srv/alahed/shared/backups/pre-people-<ts>.db node /tmp/seed-people.js
- [ ] After deploy: delete /tmp/nmb (≈1 GB node_modules) and the node_modules symlink.
