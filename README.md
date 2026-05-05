# Nexlora — Production Next.js website

A senior-led technology consultancy site, built with Next.js 15, App Router, React 19, Tailwind, next-intl (English + Arabic with full RTL), an Anthropic-powered chat widget with static fallback, and a Resend-powered contact form with logging fallback.

This is a complete, deployable codebase — not a starter or a template.

---

## What's in here

```
nexlora/
├── app/
│   ├── [locale]/                    # Localized routes (en, ar)
│   │   ├── layout.tsx               # Locale layout — fonts, dir, nav, footer, chat
│   │   ├── page.tsx                 # Home
│   │   ├── about/                   # About / leadership
│   │   ├── services/                # 5 service detail pages (shared component)
│   │   │   ├── ai-data-innovation/
│   │   │   ├── product-engineering/
│   │   │   ├── cloud-infrastructure/
│   │   │   ├── advisory-strategy/
│   │   │   └── cybersecurity/
│   │   ├── case-studies/            # Index + 3 detail pages
│   │   ├── contact/                 # Working form
│   │   ├── careers/
│   │   ├── blog/                    # Landing + post stubs
│   │   ├── privacy/
│   │   ├── terms/
│   │   └── not-found.tsx
│   ├── api/
│   │   ├── chat/route.ts            # Anthropic-backed chat (with fallback)
│   │   └── contact/route.ts         # Resend-backed form (with fallback)
│   ├── layout.tsx                   # Root layout (fonts, metadata)
│   ├── globals.css                  # Design system
│   ├── sitemap.ts                   # Auto-generated for both locales
│   ├── robots.ts
│   └── not-found.tsx
├── components/                      # Nav, Footer, Chat, Hero aurora, etc.
├── content/
│   ├── services/                    # 5 service content modules (en/ar)
│   ├── case-studies/                # 3 case studies (en/ar)
│   └── site.ts                      # Home, About, Careers, Blog, Privacy, Terms (en/ar)
├── messages/
│   ├── en.json                      # UI strings (Nav, Footer, Common, Chat, Forms…)
│   └── ar.json
├── public/                          # favicon, og-image, apple-touch-icon
├── i18n.ts                          # Locale config
├── middleware.ts                    # next-intl routing
├── tailwind.config.ts
├── next.config.mjs
├── package.json
└── .env.example
```

---

## Quick start

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local — see "Environment variables" below

# 3. Develop
npm run dev
# Open http://localhost:3000

# 4. Type-check (recommended before deploy)
npm run type-check

# 5. Production build
npm run build
npm run start
```

**Node 20+** is required. (Specified in `package.json` engines.)

---

## Environment variables

All configurable via `.env.local` for development, or your hosting provider's environment settings for production. See `.env.example` for the full list with comments.

| Variable | Purpose | Required? |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for sitemap/OG/JSON-LD | Yes (defaults to `https://nexlora.com`) |
| `NEXT_PUBLIC_CALENDLY_URL` | Booking link for "Discovery Call" CTA | Optional — falls back to `/contact` |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Enables Plausible analytics | Optional — analytics disabled if blank |
| `ANTHROPIC_API_KEY` | Powers the chat widget with Claude Sonnet | Optional — falls back to keyword-matching |
| `RESEND_API_KEY` | Sends contact-form emails | Optional — logs to console if absent |
| `RESEND_FROM_EMAIL` | Verified sender address | Required if `RESEND_API_KEY` set |
| `CONTACT_TO_EMAIL` | Where contact-form enquiries go | Defaults to `hello@nexlora.com` |

**Graceful degradation is intentional.** The site works completely without any API keys — chat falls back to a keyword-matched knowledge base, contact form logs to the server console. You can deploy and demo the site before signing up for any third-party services.

---

## Deploy to Vercel

```bash
# From the project directory
npx vercel
```

Then in the Vercel dashboard:

1. **Project settings → Environment Variables** — add every variable from `.env.example` that you want active (the same ones from `.env.local`).
2. **Project settings → Domains** — add your custom domain.
3. **Deploy** — Vercel auto-detects Next.js 15.

Vercel is recommended because the contact and chat API routes use the Node.js runtime; they will also work on any platform that supports Next.js App Router with Node runtime (Netlify, AWS Amplify, self-hosted Node).

---

## Architecture decisions

### Why next-intl with `localePrefix: 'as-needed'`
- English URLs are clean: `/`, `/services/ai-data-innovation`
- Arabic URLs are explicit: `/ar`, `/ar/services/ai-data-innovation`
- The `dir="rtl"` attribute is set on the `<div>` wrapper inside the locale layout, not on `<html>`, so server-rendered HTML stays valid for both locales without route-aware HTML attributes.
- All long-form copy lives in `content/` modules typed with TypeScript. UI labels live in `messages/{locale}.json`.

### Why content lives in `.ts` files (not MDX or a CMS)
Long-form copy with strict bilingual structure is easier to type-check in TypeScript than in MDX, and avoids the operational overhead of a headless CMS for a site this size. Every service, case study, and section enforces a shape via TypeScript types — if a translation drifts out of sync, the build breaks.

### Why a shared `<ServicePage>` and `<CaseStudyPage>`
All 5 service pages and all 3 case study pages share a single renderer. To add a new service: add a new content module in `content/services/`, register it in `content/services/index.ts`, create a 28-line page file in `app/[locale]/services/[slug]/page.tsx`. No duplicated layout code.

### Why fonts are loaded from `next/font/google`
Self-hosted, zero CLS, no extra requests to Google's CDN at runtime. Latin and Arabic fonts both use display-swap and are stored as CSS variables (`--font-display`, `--font-arabic-display`, etc.) that the design system consumes.

### Why the chat is a server route, not a direct client SDK
Keeps the `ANTHROPIC_API_KEY` on the server. The client only ever talks to `/api/chat`. Without a key, the route falls back to keyword-matching gracefully — no 500 errors, no exposed secrets.

---

## Content editing

### Editing a service page
1. Open `content/services/[slug].ts` (e.g. `ai-data.ts`)
2. Edit the `en` and `ar` blocks. They share an exported `ServiceContent` type — TypeScript will catch any mismatched fields.
3. Save. The dev server hot-reloads.

### Adding a new service
1. Copy an existing module like `content/services/ai-data.ts` to `content/services/your-new-service.ts`. Edit the slug and content.
2. Register it in `content/services/index.ts` alongside the others.
3. Create the route: `app/[locale]/services/[your-slug]/page.tsx` (copy from any existing one and update the import path).

### Editing the home page or About / Careers / Blog / Privacy / Terms
All long-form copy is in `content/site.ts`. Both `en` and `ar` keys are required.

### Editing UI strings (button labels, nav, etc.)
`messages/en.json` and `messages/ar.json`.

### Editing case studies
`content/case-studies/index.ts` — same `en` / `ar` pattern. To add a new one, follow the existing structure and register it in the `caseStudies` map at the bottom.

---

## Pre-launch checklist

Before going live, replace these placeholders:

- [ ] **Leadership bios** in `content/site.ts` → `about.leadership[]` — search for `// TODO: replace`
- [ ] **Phone number** in `content/site.ts` → `contact.aside.channels` (currently `+1 (202) 000-0000`)
- [ ] **Calendly link** in `.env` → `NEXT_PUBLIC_CALENDLY_URL`
- [ ] **Legal entity name** — search the codebase for `Nexlora Ltd` and confirm it matches your registered entity in every jurisdiction you operate in
- [ ] **Office addresses** — currently city-only; add street addresses if appropriate
- [ ] **Privacy & Terms** — review every `// REVIEW WITH COUNSEL` marker in `content/site.ts` with a qualified data-protection lawyer for the jurisdictions you operate in (US, UK, KSA at minimum)
- [ ] **Arabic translations** — written by Claude inline. **Review by a native speaker is strongly recommended** before launch, particularly for the Privacy and Terms pages.
- [ ] **Case study numbers** — currently plausible but unattributed. Replace with real, defensible figures only with client permission.
- [ ] **Testimonials** — initials and roles are placeholders. Get permission before naming anyone.
- [ ] **Real client logos** — drop into `public/logos/` and update the trust-bar / clients section as needed.
- [ ] **OG image** — replace `public/og-image.png` with your real designed social card (1200×630).
- [ ] **Apple touch icon** — replace `public/apple-touch-icon.png` (180×180).
- [ ] **Favicon** — replace `public/favicon.ico` with your real one.
- [ ] **Open roles** in `content/site.ts` → `careers.openings.roles[]` — confirm titles, locations, types match what you actually want to hire for.
- [ ] **Blog posts** — currently 5 stubs marked "Forthcoming". Either replace with real posts or remove the stubs.
- [ ] **Plausible domain** — register at plausible.io (or remove the analytics component if you don't want analytics).
- [ ] **Resend domain verification** — add and verify your sending domain at resend.com before going live, otherwise emails will fail.

---

## Accessibility

- Skip-to-content link in every locale layout
- Cursor effect is progressive enhancement: **only active on devices with `(hover: hover) and (pointer: fine)`** (no native cursor hidden on mobile or keyboard-only users)
- Respects `prefers-reduced-motion` — aurora canvas pauses, reveals show instantly, ticker stops
- All interactive elements have `aria-label`, `aria-expanded`, `role` attributes where appropriate
- Form fields have explicit `<label>` elements
- Color contrast: gold-on-dark is the primary brand combination; verify it passes WCAG AA at the specific font sizes used (display font hits AA; body font hits AAA against `#060C18`)
- Heading order is enforced page-by-page (`h1` → `h2` → `h3`)
- 404 page is keyboard-navigable and respects locale

---

## Security

- All API routes use Node runtime, not edge — keys never leave the server
- HTTP security headers are set in `next.config.mjs`: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`
- Contact form: zod-validated, honeypot field, length caps on all string inputs
- Chat route: trims history to last 10 messages, caps individual message size at 4000 chars
- No third-party tracking unless `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set AND user consents via the cookie banner

---

## Known limitations

1. **No CMS integration.** Content edits require a code commit. For a small senior-led firm this is by design (every change is reviewed). If the team grows past ~5 marketing contributors, consider migrating to Sanity or Contentlayer.
2. **No internal blog system.** The `/blog` page renders post stubs from `content/site.ts`. Real posts would either need MDX files or a CMS.
3. **No A/B testing.** Add via Vercel Edge Config or similar if you start running marketing experiments.
4. **No multi-tenant support.** Single brand, single domain.

---

## Support

Questions about the codebase? `hello@nexlora.com`.

Built with care. Designed to ship.
