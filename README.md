# Agentic Site Template

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Use this template](https://img.shields.io/badge/Use%20this%20template-2ea44f?logo=github)](https://github.com/miichaelsmedley/agentic-site-template/generate)

A transportable Astro, TinaCMS, GitHub and Cloudflare website template for people beginning their vibe coding journey with Codex or another AI coding agent.

This is a real editable website, not a blank tutorial. It ships with a 30-block component library, local TinaCMS editing, starter content, environment checks, a working contact form (your first dynamic page), Cloudflare Worker assets deployment, a GitHub Actions deploy workflow, and prompts that help you ask Codex for outcomes instead of technical implementation details.

The point is not only to replace a WordPress site. That is a useful first use case, because many small sites are mostly brochure pages plus a few dynamic pieces. The bigger point is to give a beginner a working project where they can say what they want, let Codex handle the technical work where possible, and verify each change before moving on.

## What You Need

- A GitHub account
- A Cloudflare account (free tier is fine)
- Node.js 24.18.0 LTS (use the LTS download, not Node 26 Current)
- An AI coding agent such as Codex, Claude Code, Cursor, or GitHub Copilot
- A Resend account if you want the contact form to actually email you (optional, free tier is fine)

No private package registry is required. The shared UI package is bundled inside `./packages/ui`.

## Get Your Own Copy In Five Minutes

This repo is a **GitHub Template**. That means you don't fork it — you copy it. The button above creates a brand-new repository under your own account with no shared history. You can then delete it, rewrite it, or push it to your own Cloudflare without affecting this one.

1. Install [Node.js 24 LTS](https://nodejs.org/en/download) if it is not already on your computer. Choose the LTS download.
2. Click **[Use this template](https://github.com/miichaelsmedley/agentic-site-template/generate)** at the top of the GitHub page (or the badge above).
3. Choose your account, give the new repo a name (e.g. `my-business-site`), and click **Create repository**.
4. Put the new project on your computer using whichever option feels most comfortable:
   - **GitHub Desktop (recommended for beginners):** open GitHub Desktop, choose **File → Clone repository**, select your new repository, and click **Clone**.
   - **Download ZIP:** on your new repository page, choose **Code → Download ZIP**, then unzip it. This is fine for trying the site, although GitHub Desktop or Git is needed later to send changes back to GitHub.
   - **Terminal:** clone the repository with:
   ```bash
   git clone https://github.com/<your-username>/<your-new-repo>.git
   cd <your-new-repo>
   ```
   You can also open it in GitHub Codespaces, where Node is pre-configured by `.devcontainer/devcontainer.json`.
5. Open a terminal in the project folder, then install and start it:
   ```bash
   npm run setup
   npm run dev
   ```
6. Open the site at `http://localhost:4330` and the TinaCMS editor at `http://localhost:4330/admin/index.html`.
7. Open the project folder in Codex or your coding agent. Ask for one small outcome in plain language. Let the agent inspect the repo, make the technical change, run `npm run build`, and explain what changed.
8. When you're ready to publish, follow [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) to deploy to Cloudflare.

For a slower, click-by-click version of these instructions, read [`docs/START-HERE.md`](docs/START-HERE.md). If `.nvmrc` or `.node-version` complains, install the matching Node version (`nvm install` or `fnm install` will read those files automatically).

## Quick Start

```bash
npm run setup
npm run dev
```

Open:

- Website: `http://localhost:4330`
- TinaCMS editor: `http://localhost:4330/admin/index.html`

## Personalise The Site

```bash
npm run configure
npm run doctor
npm run build
```

`npm run configure` updates the main placeholders:

- site name
- logo text
- domain
- contact email
- location
- Cloudflare Worker name

Basic visual settings are editable in TinaCMS under **Site Settings**:

- colour scheme preset
- logo style: text, initials, or uploaded logo
- logo initials and shape
- site font pairing, plus optional heading/body/hero/logo font overrides
- page width
- section spacing
- corner style
- header style

Hero slider slides also have their own **Heading Font** and **Heading Size** controls. Use **Compact** for long headings so the words do not bunch together.

You can then ask Codex to update content in `src/content`, components in `src/components`, backend routes in `src/worker`, and docs in `docs`.

## Vibe Coding With Codex

The intended loop is:

1. Describe the outcome you want.
2. Let Codex inspect the existing structure.
3. Let Codex choose the technical path and edit the files.
4. Let Codex run `npm run doctor` or `npm run build`.
5. Review the result in plain language.
6. Commit the working state.

Good prompts sound like this:

```text
I run a local music school. Turn the homepage into a simple music lesson website. Keep the current layout and run the build when done.
```

```text
Add a Services page for three service packages. Make it editable in TinaCMS and add it to navigation. Run npm run build.
```

```text
Make the contact form save submissions to a database and add a simple admin page where I can view them. Keep secrets out of the repo and explain what I need to set in Cloudflare.
```

Codex can usually handle code, schema changes, content files, Worker routes, D1 migrations, and build checks. You still need to provide the business facts, approve wording, log in to external accounts, and supply any secret values.

## How The NPM Packages Work

The root `package.json` is the main install manifest. When someone runs `npm run setup`, it calls `npm install`, which downloads everything listed in `dependencies` and `devDependencies` into `node_modules`.

Main runtime packages:

- `astro`: builds the website.
- `tinacms`: powers the local content editor.
- `@astrojs/sitemap`: generates the sitemap.
- `@bands/ui`: the bundled local component/block package at `./packages/ui`.

Main development packages:

- `@tinacms/cli`: runs the TinaCMS dev server and admin build.
- `@tailwindcss/vite` and `@tailwindcss/typography`: styling pipeline.
- `wrangler`: Cloudflare CLI used for local deploys.

The local package matters: `@bands/ui` is not downloaded from npm. It points to:

```json
"@bands/ui": "file:./packages/ui"
```

That makes the template transportable as one repository. A beginner does not need to publish, link, or install a private package.

## Current Toolchain

The direct dependencies are deliberately pinned so a fresh copy installs the same tested versions:

- Astro `7.1.1`
- TinaCMS `3.11.0`
- TinaCMS CLI `2.5.6`
- Vite `8.1.5`
- Tailwind CSS Vite plugin `4.3.3`
- Wrangler `4.112.0`
- Node.js `24.18.0` LTS

Future maintainers can follow [`docs/UPDATING.md`](docs/UPDATING.md) to check for newer releases and repeat the compatibility tests.

## Deploy To Cloudflare

Local deploy:

```bash
npm run cf:login
npm run deploy
```

GitHub Actions deploy:

1. Push this repo to GitHub.
2. In Cloudflare, create an API token that can deploy Workers.
3. In GitHub, add repository secrets:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
4. Optional: add repository variables:
   - `PUBLIC_SITE_URL`
   - `PUBLIC_GA_ID`
5. Push to `main` or run the workflow manually.

## Useful Commands

```bash
npm run setup       # install dependencies and run checks
npm run configure   # replace starter placeholders
npm run doctor      # check the common setup problems
npm run dev         # run Astro and TinaCMS together
npm run build       # build TinaCMS admin and Astro static output
npm run deploy      # build and deploy to Cloudflare
```

## Good First Agent Prompt

```text
Inspect this repo, keep the current structure, and update the homepage copy for my business. Ask me only for business facts you cannot infer. Then run npm run build and summarise the files you changed.
```

More guidance lives in `docs/CODEX-VIBE-CODING-GUIDE.md`, `docs/AGENTIC-CODING-GUIDE.md`, `docs/DEPLOYMENT.md`, and `docs/TROUBLESHOOTING.md`.

## License

MIT — see [LICENSE](LICENSE). Fork it, ship it, sell it, rebuild it. Just keep the copyright notice in copies of the original code.

Bundled and downloaded dependencies retain their own licenses (Astro, TinaCMS, Tailwind, Wrangler, etc.) — all permissive (MIT / Apache 2.0).
