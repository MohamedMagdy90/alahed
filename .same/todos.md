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
## 2026-11-23 — old-site content: messages, portraits, bios, news photos (branch redesign)
- Source: old site alahedholding.com (curl works with a browser UA; WP media API is public) + owner's investor
  presentation screenshot (board x7 + executive management x3 bios; marked "Strictly private and confidential").
- [x] Leadership messages: Setting key "messages" (no schema change), admin card on /admin/people, public section
      on /leadership (#messages) above the board; person-linked (photo/name/role come from Person)
- [x] Prose: consecutive images in an article render as a 2-column gallery (:has(), stacked fallback)
- [x] Data script deploy/content-2026-11-23.js: portraits + bios (EN/AR) for board + management, Jassim/Mohammed added
      to management, Al-Mulla + Larem added HIDDEN (confidential deck), 2 messages, 3 posts updated with original
      photos/text/dates, Hilong post created. 15 optimised images in /srv/alahed/shared/storage/uploads/2026/11/
- [x] Local prod test on a copy of the live DB (pages EN/AR, admin with signed cookie, hidden rows not leaked, script
      idempotent). Live: backup pre-content-20261123-120956.db, script applied, release 20261123-121011 (= commit
      a88be3b), 44 pages warm, 0 not 200.
- Build note: workspace node_modules is a real dir now → always deploy with BUILD_DIR=/tmp/alahed-build (fresh bun
  install there) so .next-prod never lands in the workspace. A local run writes ISR pages into the standalone
  folder: delete files newer than the build before shipping.
- [x] Blank leadership portraits (owner report): PersonCard Portrait joined "relative" + caller "absolute inset-0" in a
      template string; .relative comes later in the CSS so the box collapsed to 0 px (also hid the initials before).
      Now cn()/twMerge. Commit b19b4ec, release 20261123-123457. Lesson: merge position classes with cn(), and do not
      read blank screenshot areas as "scroll animation" without checking the HTML/CSS.
- [x] Empty tiles in hairline grids (owner report: PEMCO management box half empty). components/site/GridFill.tsx
      completes the last row per breakpoint (literal hidden/block classes); single manager = full-width card; applied
      to every data-driven grid on company pages; About values tile shown from sm. Audit of all 44 EN/AR pages:
      0 grids with empty cells. Releases 20261123-125531 + the About fix (commit 6dea213).
      Rule: any new `grid gap-px bg-*` grid filled from data needs <GridFill>.
- [ ] Owner: Chairman/Vice Chairman portraits on the old site are tiny (212 px / 545 px) → upload larger ones.
- [ ] Owner: switch on Al-Mulla + Larem when the board composition is public (deck marked confidential); add photos.
- [ ] Owner: messages say "1976" (site says 1975) and have small grammar slips (kept verbatim) → confirm/edit.
- [ ] Owner: old WordPress media library is publicly listable (/wp-json/wp/v2/media) and exposes private files
      (ID copies, power of attorney, CVs) → remove/privatise on the old site.
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
- [x] Key `alahed-deploy-2026-11-22-b` added by owner. Schema unchanged (sha256 equal) → no migration.
      Release 20261122-113728 live (= commit 9dd4418 content). Verified: 34 routes 200 EN/AR, brand PNGs, sitemap,
      conditions API, new content markers, 0 log errors, other services active.
- [x] Leadership DB on the server: backup pre-people-20261122-113910.db; 9 added, MD & CEO kept and moved to order 3
      (10 Person rows). Command in the header of deploy/seed-people-2026-11.js (needs NODE_PATH).
- [x] Cleaned: /tmp/nmb, node_modules symlink, release bundle, /home/project/.pm helpers.
- [ ] Owner review of the live PDF content (4 company pages, About structure, Leadership board + management).

## 2026-11-22 afternoon — hero x4 + smoother motion (branch redesign)
- [x] Hero: DST added (heroOrder aatc, dopet, dst, pemco = logo bands inside → out; verb "equipping" / "ونجهّز").
      DST caption: "A DOPET division from 2000, a company since 2019" (matches Established 2019).
- [x] Smoothness: photo dissolve over an opaque outgoing slide (no dark dip), images pre-decoded, slow drift
      (herozoom) paused with the slideshow; logos + captions crossfade in one grid cell (no headline jump);
      clipPath instead of mask+blur for the band sweep; strip solid tint instead of backdrop blur.
- [x] Headline wrap fix: comma kept with the verb before it (nowrap wrapper), no line starts with ",".
- [x] Commits b2b697f + 34e45ba pushed; release 20261122-121304 live and verified (EN/AR, 0 log errors).
- Photo answer for owner: only DOPET's profile has usable own photos (10 facility shots, already on site).
  AATC deck = mostly OEM product renders + stock, a few small own shots (service-centre building, field service,
  ESAB centre entrance). PEMCO = diagrams + stock. Holding profile = logo only. DST hero uses stock engineer.jpg.
- Formatting: do NOT run `biome format --write` on existing files (repo isn't biome-formatted; reflows everything).

## 2026-11-22 13:00 — hero pause bug + production audit (branch redesign)
- [x] Admin password: live hash ≠ seed default and the old creds file was lost → backup
      shared/backups/pre-admin-reset-20261122-132836.db, new password set (hashed locally, cost 12), saved in git-ignored
      .deploy/admin-credentials.txt. Live login verified with Playwright (lands on /en/admin).
- [x] Hero freeze: hover-pause on the headline + invisible logo square froze the slideshow when a mega menu closed over
      it (and a tapped verb froze it on phones). Now: no hover pause; keyboard focus (:focus-visible) + pause button only.
- [x] Footprint: tour no longer pauses on hover; clicking a site takes control. Card keeps its tallest height (no CLS).
- [x] Header collapse = transform (no CLS). Fonts: Arabic/serif/mono not preloaded, unused 300 weight dropped.
- [x] Images: real optimisation on (WebP, srcset); deploy.sh installs linux-x64 sharp + health-checks /_next/image.
      Cache headers for /images and /brand. Logos sized to their rendered size. Non-first hero photos deferred.
- [x] Newsroom phone overflow (filter form 480/620 px) fixed with min-w-0. Tap targets: footer, breadcrumbs, top bar.
- [x] Local build + re-audit: 0 errors / 0 overflow / CLS 0 on 46 URLs x 3 viewports; home 3.2 MB -> 1.3 MB.
- [x] Arabic font self-hosted (public/fonts, @font-face in globals.css), preloaded on /ar only (desktop AR CLS 0.29 -> 0).
- [x] Commit 2097b8e pushed, release 20261122-141014 live (image optimiser health check ok). Hero fix verified live.
- [x] SLOW NAVIGATION (owner report): every click took 4.0 s = Chrome's view-transition timeout, because
      PageTransitions released the transition with requestAnimationFrame (not run while a transition waits).
      Now setTimeout 0; cap 1.2 s; crossfade 0.3 s; all internal links prefetched on hover/touchstart (full page,
      reused on click); image cache symlinked to shared/cache/images (survives deploys).
      Commit 3e82d8b, release 20261122-143719. Live: 0.45-0.77 s to new page (hover then click), was 4.0 s.
- Owner must hard-refresh (Ctrl+Shift+R) open tabs: an open tab keeps the old JavaScript.
- Playwright lives in /tmp/pw (wiped on container reset: npm i playwright@1.49.1, npx playwright install chromium,
  bash libs.sh for the no-root .deb libs, then `. ./env.sh`). Scripts: audit, hero, nav2/nav4/nav6, http.sh.
- [ ] Next step (proposed): ISR instead of force-dynamic (revalidatePath from admin) so links prefetch fully.
## 2026-11-23 — listing switch, founding order, HQ photo (branch redesign)
- [x] HQ photo blank: `/_next/image?url=/images/hq.png&w=828` hung (504 after 60 s) while every other width worked =
      one stalled in-flight optimiser job, shared by all later requests for that variant until restart. Photo now
      /images/hq.jpg (101 KB). deploy.sh warms every /images + /brand variant (13 widths) sequentially after each
      release and restarts once if any stalls. Verify with: curl each width, all 200.
- [x] Companies in founding order everywhere: `companies` is sorted by `founded` (byFounding) → AATC 1975, DOPET 1981,
      PEMCO 1987, DST 2019. `companyRank(id)` for other per-company lists. heroOrder + headline verbs
      (supplying, building, inspecting, equipping), companies CHAIN, companyLabels, JOB_COMPANIES, posts enum.
- [x] Listing switch: ShareInfo.visible (default false; missing in the stored JSON = hidden). Admin Settings toggle.
      Off hides: header status line (replaced by "Head office +974 4441 4022") + Investors links (utility, main,
      mobile, footer column), home InvestorTeaser, /investors (404 + noindex), sitemap entry, About "Next" milestone
      (`listing: true`), Governance listing wording + IR button (→ Contact), Leadership placeholder wording, Contact
      intro + "investor" enquiry type, disclaimer intro + `listingOnly` sections, privacy `bodyUnlisted`, footer
      subscribe line. Helper: `getListingVisible()` (lib/queries, request-cached getShareInfo).
- [x] Commit 3cf3bcc pushed, release 20261123-083607 live. DB backup pre-posts-fix-20261123-084925.db, then
      deploy/fix-posts-2026-11-23.js: NOV post cover hq.png → hq.jpg; seeded launch article rewritten (four companies,
      no IR mention; guarded: only if still equal to the seed). Live check: 20 pages EN/AR clean, 0 log errors.
- [ ] Owner: when listed, Admin → Settings → "Show listing information on the website" → Save.
## 2026-11-23 — page caching (ISR) + speed check (branch redesign)
- [x] Public pages cached: no force-dynamic in [locale]/layout.tsx and (site)/layout.tsx; generateStaticParams → []
      in [locale]/layout.tsx and the 3 [slug] pages (= nothing rendered at build, which has no DB; each page cached on
      its first visit); (site)/layout.tsx revalidate = 60 (scheduled posts; verified: appeared 37 s after its time).
      Admin saves purge everything via revalidatePath("/", "layout") in lib/admin/result.ts run() (+ settings.ts).
- [x] Stays live: /news (searchParams → export const dynamic = "force-dynamic"), admin (admin/layout.tsx), API, sitemap.
- [x] Careers ?role= read client-side (RoleFromUrl + Suspense in CareersForm). Article views: ViewBeacon → /api/views
      (1 per IP+slug per 30 min). lib/queries: DB errors are logged + rethrown (never empty data cached).
- [x] deploy.sh warms every sitemap page after release (fresh cache per release).
- [x] Local prod test (/tmp/alahed-build, test DB /tmp/alahed-test.db, /tmp/local-start.sh on :3005; the release lacks the
      arm64 Prisma engine → copy it in for local runs): 15/15 e2e (Playwright /tmp/pw/e2e.mjs). Server render 40-170 ms →
      4-18 ms cached. Commit ecc5f87, release 20261123-101749 live (42 pages warmed; live render 7-14 ms, was 40-85 ms).
- [x] Speed fixes (commit 57d95ac, release 20261123-104332): framer-motion via LazyMotion + `m` (domAnimation, strict) in
      motion/index.tsx MotionProvider → never import `motion` again, use `m`; 12-24 KB less JS per page. Phone partners
      diagram animates only on screen (flowRef/flowInView). ArcsMark = server component (site/ArcsMark.tsx), geometry in
      site/mark-geometry.ts, OrbitArcs deleted. Checks: /tmp/pw/anim2.mjs 9/9, glint.mjs (paused/running/paused) live.
- Server: Bengaluru (DO BLR1), nginx 1.24, HTTP/1.1 only. HTTP/2 must be enabled per port (`listen 443 ssl http2`) and
  would affect the other sites on the droplet → ask owner before changing.
- Speed check tooling: /tmp/pw (lighthouse 12.2.1, playwright 1.49.1, chromium-1148; libs unpacked into /tmp/pw/libs via
  apt with a private index in /tmp/pw/apt; `. /tmp/pw/env.sh`). speed.mjs: mobile/desktop, CPU slowdown 1x (this CPU is
  benchmark ~400-670, slower than the reference phone), median of 3. ~3 min per page per form factor here.
## 2026-11-23 evening — company page visual review (branch redesign, deployed 18:18 UTC)
- [x] 7db3aa6 / 308ad0d: every section its own composition; shrunken headings fixed site-wide.
- [x] 0e25f8f: short map labels (MAP_LABEL), Mesaieed label faces the sea, locations nearest first, news grid sized to
      its post count (1 = full width, 2 = halves, 3 = row).
- [x] e3d9bde: locations panel = live readout per site (temp/wind/humidity, same /api/conditions as home) + coordinates;
      map height by site count (lg grows with the detail column; single site centred). Register.tsx min-w-0 on both
      grid columns (DST phone overflow 909 px → 0). Checked: 4 companies desktop EN, DST AR + phone, AATC/DST phone
      EN/AR overflow 0, lint clean.
- [x] Release 20261123-181841 live (= commit 56cd189; previous live 20261123-131834 = fd52621, so it shipped 7db3aa6,
      308ad0d incl. the site-wide cn() heading fix, 0e25f8f, e3d9bde). Schema unchanged (sha256 77ba389f…) → no migration.
      Built with BUILD_DIR=/tmp/alahed-build, dev server stopped first. Image optimiser ok, 44 pages warm / 0 not 200,
      0 log errors, other services active. Live check: 8 company pages EN/AR carry the new markup, /api/conditions ok,
      11 other pages 200, admin → 307 login; live Playwright PEMCO desktop + DST phone match local (overflow 0).
- [ ] Owner review of the live company pages (locations readout, brand register on phones, new section layouts).
- Reset recovery used again (17:32): .git restored from origin, dev.db malformed → db push + seed. Screenshot helpers
  live in /home/project/tmp (shots.mjs full page, loc.mjs locations section, ovf.mjs phone overflow probe); copy to
  /tmp/pw before running. Long runs: nohup + poll (tool calls time out after ~90 s without output).
- Tooling note: string_replace sometimes reports success without writing (twice in a row on SiteMap.tsx) → grep
  after every edit before type-checking.
## 2026-11-23 night — HTTP/2 + About structure + Leadership (branch redesign)
- [x] HTTP/2 ON (owner OK'd via suggestion). Backup /root/nginx-backups/alahed.20261123-191002; `http2` added to the two
      :443 listen lines of sites-available/alahed only; nginx -t ok (expected warn "protocol options redefined" from
      bungee-fly), graceful reload. Before/after (tmp/h2check.sh): all 9 URLs same codes, h1.1 → h2; forced HTTP/1.1
      still works; Chromium loads alahed/crm/bungee all-h2 with 0 console errors; 0 new nginx errors; services active.
      Rollback: cp the backup back, nginx -t, systemctl reload nginx. Repo template deploy/server/nginx-alahed.conf updated.
- [x] About "Group structure" (components/pages/about/GroupStructure.tsx): ownership chart (aligned connectors,
      50%/100% on the lines, richer company cards, phone = rail tree). Checked EN + AR desktop/phone (RTL connectors
      mirror). AR phone meta: "مملوكة بالكامل" + each part whitespace-nowrap (no lone "100%" line).
- [x] Leadership: messages = speaker tabs (MessageTabs.tsx, 1 column < sm, sticky list, arrow keys), board =
      annual-report rows with inline bios (People.tsx), management = executive cards + company-leadership tiles
      (logo 46 px, job title with trailing company name trimmed EN/AR via jobTitle(), company link in the footer).
      PersonCard.tsx deleted. Phone page ~15,000 px → ~11,100 px.
- [x] Home map labels (owner report: Al Karaana × Mesaieed overlap): Al Karaana faces west, Mesaieed east; short
      names from the shared MAP_LABEL (moved to content/site.ts, SiteMap.tsx imports it). Latitude ticks moved to the
      west edge (25°N ran under Mesaieed); grid/scale text forced LTR (AR read "km 20"). Measured every site active:
      EN/AR × 390/1440 0 overlaps / 0 clipped; ticks 768-1920 px.
- [x] Commits a5b7cf0 (About + Leadership) + f7c6f40 (map labels) pushed to `redesign`. Not deployed yet (live =
      20261123-181841) → deploy after owner OK.
- Local test data: live active people + messages exported to /tmp/people.json and loaded with tmp/people-import.js;
  portraits copied to storage/uploads/2026/11 (git-ignored).
