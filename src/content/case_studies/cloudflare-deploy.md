---
title: Cloudflare Deploy Workflow
client: Starter User
year: "2026"
role: Static deploy
summary: The deploy path uses the same static Astro build and Cloudflare Worker assets pattern as the existing sites.
hero_image: /images/cloudflare-deploy.png
featured: true
order: 2
services:
  - Cloudflare Workers
  - Wrangler
  - GitHub Actions
stats:
  - label: Build output
    value: dist
  - label: Deploy command
    value: wrangler
  - label: Config file
    value: jsonc
seo_title: Cloudflare Deploy Workflow
seo_description: A sample case study showing how the starter deploys to Cloudflare.
---

Cloudflare deployment should stay predictable:

1. Run `npm run build`.
2. Run `npm run cf:login` once on your machine.
3. Run `npm run deploy`.

When the user is ready for automatic deploys, the GitHub Action can publish every push to `main` after the Cloudflare secrets are added.
