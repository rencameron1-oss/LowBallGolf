# Agent Instructions

This repository is a beginner-friendly Astro, TinaCMS, GitHub and Cloudflare website template.

It is designed for vibe coding with Codex. The user should be able to describe outcomes in normal language while the agent handles the technical path where possible.

## Work Style

- Keep changes small and explain which files changed.
- Ask the user for business facts, preferences, assets, account access, or approval. Do not make them choose implementation details unless the tradeoff genuinely matters.
- Inspect the repo before editing, then choose the simplest technical path that fits the existing structure.
- Prefer editing content in `src/content` before changing components.
- Preserve the starter structure unless the user explicitly asks for a redesign.
- Run `npm run build` after code or schema changes.
- For setup, placeholder, or environment issues, run `npm run doctor` before guessing.
- Do not edit generated files in `tina/__generated__`, `public/admin`, `.astro`, or `dist`.
- Never write secrets into the repo. Tell the user which Cloudflare, GitHub, Resend, or provider secret they need to set.

## Important Commands

```bash
npm run setup
npm run dev
npm run doctor
npm run build
npm run deploy
```

## Key Files

- `src/content/site_settings/main.json`: visual presets, logo settings, font settings, layout settings, footer copy
- `src/content/home/index.md`: homepage hero and blocks
- `src/content/pages`: editable pages
- `tina/collections`: TinaCMS editing schema
- `src/config/brand.ts`: colour, font, logo and layout option definitions
- `src/utils/siteSettings.ts`: normalises settings and turns them into CSS variables
- `wrangler.jsonc`: Cloudflare Worker assets deploy config
- `src/worker.ts` and `src/worker/`: same-domain API routes for dynamic features
- `packages/ui`: bundled local shared component package
- `docs/CODEX-VIBE-CODING-GUIDE.md`: beginner-facing Codex workflow

## First-Time User Guidance

If the user is new, guide them through:

1. Run `npm run setup`.
2. Run `npm run dev`.
3. Open `http://localhost:4330`.
4. Open `http://localhost:4330/admin/index.html`.
5. Edit Site Settings before deeper code changes.
6. Run `npm run build`.

## Dynamic Feature Guidance

When adding forms, submissions, products, bookings, newsletters, or admin pages:

1. Keep normal pages in Astro and TinaCMS where possible.
2. Put backend behaviour behind same-domain Worker routes under `/api/*`.
3. Store simple live data in Cloudflare D1 when persistence is needed.
4. Add small admin pages only when the site owner needs to view or manage data.
5. Register useful admin pages in TinaCMS with `registerDynamicAdminLinks`.
6. Keep the public site static-first unless the feature truly needs runtime behaviour.
