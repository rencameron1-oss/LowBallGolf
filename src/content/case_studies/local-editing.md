---
title: Local Editing Workflow
client: Starter User
year: "2026"
role: Beginner setup
summary: A novice can install dependencies, run the local site, open TinaCMS, and edit real content before touching deployment.
hero_image: /images/editor-preview.png
featured: true
order: 1
services:
  - TinaCMS
  - Astro
  - Local setup
stats:
  - label: Commands
    value: "2"
  - label: Editor port
    value: "4010"
  - label: Site port
    value: "4330"
seo_title: Local Editing Workflow
seo_description: A sample case study showing the local editing path in the agentic site template.
---

The local workflow is intentionally simple:

1. Run `npm run setup`.
2. Run `npm run dev`.
3. Open the site at `http://localhost:4330`.
4. Open TinaCMS at `http://localhost:4330/admin/index.html`.

This gives a beginner a real feedback loop before they learn GitHub Actions or Cloudflare secrets.
