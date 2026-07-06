# Frensei App — Project map

**Repo:** `/Users/st24/frensei-app`  
**Production:** https://app.frensei.jp  
**Marketing site (static):** https://frensei.jp → `/Users/st24/.company/engineering/docs/`

---

## What lives where

| Area | Path | Notes |
|------|------|--------|
| App routes (Next.js) | `app/` | Pages, thin API re-exports |
| API + settings impl | `src/app/` | Real route handlers & settings UI |
| Shared UI | `components/` | Chat, coach, marketing, habit, … |
| Business logic | `lib/` | chat, plan, vocabulary, i18n, analytics |
| Supabase middleware | `src/utils/supabase/` | Auth session |
| i18n | `src/utils/i18n/` + `lib/i18n/` | UI language (en/ja/ko/zh) |
| Storage helpers | `src/features/records/` | localStorage repositories |
| Ops scripts | `scripts/` | smoke, sitemap, promo links |
| Docs | `docs/` | promo kit, architecture, security |

---

## Marketing vs product

| URL | Host | Purpose |
|-----|------|---------|
| `/` | app.frensei.jp | English app marketing LP |
| `/try` | app.frensei.jp | Guest chat trial |
| `/trial` | app.frensei.jp | Calendly embed |
| `/pricing` | app.frensei.jp | App + lesson pricing |
| `/learn/*` | app.frensei.jp | Phrase SEO pages |
| `/app` | app.frensei.jp | Main product shell |
| `/` | frensei.jp | Static lesson LP (separate deploy) |
| `/trial/` | frensei.jp | Static Calendly trial |

`/ja` redirects to `/` (English marketing default).

---

## Pricing (aligned with frensei.jp)

**App**
- Free $0
- Pro $12.99/mo (app only)

**Lessons** (book via frensei.jp/trial)
- Standard $79/mo — 50 min × 4, **Pro included**
- Intensive $139/mo — 50 min × 8, **Pro included**

---

## Deploy

```bash
cd /Users/st24/frensei-app
vercel --prod
```

Static LP:

```bash
cd /Users/st24/.company/engineering/docs
vercel --prod --yes
```

---

## Docs in this folder

- `frensei-product-architecture.md` — MVP architecture & chat contract
- `beta-promotion-kit.md` — UTM links & social copy
- `beta-analytics-queries.md` — GA4 / Sheets queries
- `security-rollout-checklist.md` — Auth gating rollout
