# Al-Ahed Holding — Design System & Build Rules

Read this fully before writing code. The HOME PAGE is the visual reference:
`src/app/[locale]/(site)/page.tsx` and `src/components/home/*`. Match its quality, rhythm and details.

## Context
- Qatari family-owned group (est. 1975), preparing for a Qatar Stock Exchange listing. Tone: very advanced but
  **professional, restrained, trustworthy** (like listed Qatari groups). Never playful. No emojis. No purple/indigo.
- Bilingual: `/en/...` and `/ar/...` (Arabic = full RTL). Every visible string must exist in EN and AR.
- Stack: Next.js 15 App Router, React 18, Tailwind 3, framer-motion 11, Prisma 6 (SQLite), lucide-react icons.

## Routing
- `src/app/[locale]/layout.tsx` = root layout (html/body, fonts, Toaster). Do not edit.
- `src/app/[locale]/(site)/layout.tsx` = public header/footer + smooth scroll (force-dynamic). Do not edit.
- Public pages go in `src/app/[locale]/(site)/<route>/page.tsx`.
- Admin lives in `src/app/[locale]/admin/**` (no site header/footer).
- Page signature (Next 15 — params is a Promise):
  ```tsx
  export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: raw } = await params;
    const locale: Locale = isLocale(raw) ? raw : "en";
  }
  export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { ... }
  ```
- Links: always `href(locale, "/path")` from `@/i18n/dictionary`.

## Header behaviour (important)
The fixed header is TRANSPARENT with white text until the user scrolls. **Every public page must start with a dark
hero** — use `PageHero` from `@/components/site/PageHero` (it handles breadcrumb, eyebrow, title, intro, image, aside).

## Tokens (Tailwind)
- Colours: `ink` (#0A1430; `ink-900` #060D22 darkest, `ink-800`, `ink-700`), `navy`, `brand` (logo blue #1F4FA8,
  `brand-50/100/300/500/600/700`), `leaf` (logo green #5DB543; `leaf-700` for green TEXT on light backgrounds,
  `leaf-300` for green text on dark), `pearl-50` (page bg, warm off-white), `pearl-100/200`, `haze` (secondary text
  #6A7290, `haze-300`, `haze-200`), `dopet` (#E0322F). Lines: `border-ink/10` on light, `border-white/10` on dark.
- Tailwind opacity modifiers must be in the default scale (5,10,15,20,...). NEVER use `/12`, `/8` etc. Use `/[0.08]` if needed.
- Radius: `rounded-[2px]` for cards/buttons/images (crisp, corporate). Pills (`rounded-full`) only for small chips.
- Fonts: `font-display` (Funnel Display; headings), `font-sans` (Instrument Sans; body), `font-mono` (JetBrains Mono;
  labels, numbers, dates), `font-serif` (Instrument Serif italic; ONLY via `<Em>` for accent words in headings).
  Arabic automatically swaps display/sans to IBM Plex Sans Arabic.
- Type scale: `text-display-2xl | display-xl | display-lg | display-md` for headings (with `font-display font-normal`),
  body `text-[1.05rem] leading-relaxed text-haze`. `.eyebrow` = mono uppercase label. `.num` = tabular numbers.
- Mono labels must add: `rtl:font-arabic rtl:normal-case rtl:tracking-normal rtl:text-[0.8rem]` (Arabic has no caps).
- Durations: use the named `duration-1200 | duration-1400 | duration-1600` (never arbitrary `duration-[...]`, it is ambiguous). Easing: `ease-out-expo`.
- Helpers in globals.css: `.grain` (noise overlay, needs `relative`), `.grid-lines` (dark bg) / `.grid-lines-dark`
  (light bg) 12-col hairlines, `.link-underline`, `.prose-ah` (article rich text), `.mask-fade-x`.

## Section rhythm
- Sections: `py-24 md:py-32`, inside `.container`. Alternate backgrounds: `bg-pearl-50`, `bg-white`, dark `bg-ink` /
  `bg-ink-900` (with `text-white`, `grid-lines`, optional `ArcsMark` decoration at low opacity).
- Section header: `SectionHeading` (index "01", eyebrow, title with `<Em>`, intro, action). Numbered indexes per page.
- Grids of tiles: `grid gap-px bg-ink/10 border border-ink/10` with `bg-white` cells (hairline grid look) — see Figures.
- Lists: rows with `border-b border-ink/10`, mono index, display-font title, arrow on hover.
- Hover: images `group-hover:scale-105` with `duration-[1400ms] ease-out-expo`; arrows nudge (built into `<Arrow>`).

## Components (import, don't duplicate)
- `@/components/site/primitives`: `Arrow` (RTL-aware), `Eyebrow`, `SectionHeading`, `Em`, `Btn` (variants:
  primary | dark | white | outline-light | outline-dark; `external` prop), `SubmitBtn`, `btnClass()`, `TextLink`, `Tag`.
- `@/components/motion`: `Reveal` (fade-up on view; `delay`), `LineReveal` (mask reveal for headings), `Counter`,
  `WordReveal` (scroll-linked statement), `Parallax`.
- `@/components/site/PageHero` (dark hero), `NewsCard` (variants feature | default | row), `Marquee`, `ArcsMark`
  (logo arcs decoration), `OrbitArcs`, `SubscribeForm` (list "news" | "ir"; tone dark | light), `Logo`.
- Content: `@/content/site` (companies, contact, vision, mission, values, milestones, capabilities, sectors, clients,
  figures, governancePrinciples, sites, postTypes, companyLabels, documentCategories, FOUNDED, yearsSince).
  `@/content/qatar-map` (QATAR_PATH, QATAR_VIEWBOX "0 0 336 640", SITE_POINTS).
- i18n: `@/i18n/config` (`Locale`, `isLocale`, `dirOf`, `L10n`, `pick(row, "title", locale)` for DB bilingual
  fields, `formatDate`). `@/i18n/dictionary` (`getDict`, `href`).
- Data (server only): `@/lib/queries` (getLatestPosts, getPosts, getPostBySlug, getRelatedPosts, getPeople,
  getDocuments, getShareInfo, getIrContact). `@/lib/db` (Prisma client). `@/lib/sanitize` (cleanHtml, slugify,
  stripHtml, readingMinutes). `@/lib/storage` (saveUpload(file, "image" | "document" | "cv")). `@/lib/session`.
- Images in `/public/images`: doha-night, doha-moon, doha-dusk, hq.png, refinery-pipes, refinery-towers,
  wellhead-dukhan, offshore, engineer, fabrication, workforce (.jpg). Logos: `/brand/alahed-holding.png`,
  `/brand/aatc.png`, `/brand/dopet.png`, `/brand/pemco.png` (white backgrounds → place on white chips),
  `/brand/icon.png`.

## RTL rules
- Use logical utilities only: `ms-/me-/ps-/pe-/start-/end-/text-start/text-end/border-s/border-e`.
- Directional gradients: `ltr:bg-gradient-to-r rtl:bg-gradient-to-l`. Origins: `origin-left rtl:origin-right`.
- Phone numbers/emails/coordinates: wrap in `dir="ltr"` inside Arabic.
- Arabic copy must be natural Modern Standard Arabic, not word-for-word.

## Content integrity (critical — listed-company context)
- NEVER invent facts: no made-up names, figures, dates, quotes, certifications, project values or financials.
  Use only what is in `src/content/site.ts`, the DB, or clearly generic wording. Where data is pending, show a
  graceful "To be announced / سيتم الإعلان لاحقًا" state.

## Collaboration rules (several agents work in parallel in the same repo)
- The dev server is already running on :3000. Do NOT start, stop or restart it. Do NOT run `next build`.
- Do NOT install/remove packages. Do NOT edit `prisma/schema.prisma` or run migrations.
- Do NOT edit shared files: globals.css, tailwind.config.ts, layouts, Header, Footer, PageHero, primitives,
  motion, NewsCard, Marquee, OrbitArcs, Logo, SubscribeForm, `src/content/site.ts`, `src/i18n/*` (except your own
  new file), `src/lib/*` (except your own new file), middleware.
- Put page-specific copy in your own `src/content/pages/<area>.ts` and components in
  `src/components/pages/<area>/`. Need a new query? Create `src/lib/queries-<area>.ts` (import "server-only").
- Type-check with `bunx tsc --noEmit` and fix errors in YOUR files only (ignore others' in-progress errors).
- Verify pages with `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en/<route>` (first compile may take
  60–100 s; use `--max-time 150`). Also curl the `/ar/` version.
