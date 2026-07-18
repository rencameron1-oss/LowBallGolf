# Updating The Toolchain

Use this checklist when maintaining the template. The goal is a reproducible beginner setup, not only newer version numbers.

## 1. Use The Current Node LTS

Check the [Node.js release page](https://nodejs.org/en/about/previous-releases) and use an LTS release supported by Astro and TinaCMS. Keep these locations aligned:

- `package.json` engines
- `.nvmrc`
- `.node-version`
- `.devcontainer/devcontainer.json`
- `scripts/setup.mjs`
- `scripts/doctor.mjs`
- the README and troubleshooting guide

Do not move the template to a Node Current release until TinaCMS and its native dependencies install successfully on it.

## 2. Check Official Upgrade Guidance

Read the official [Astro upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v7/) and [TinaCMS upgrade guide](https://tina.io/docs/guides/upgrade-to-latest-version). TinaCMS recommends upgrading `tinacms` and `@tinacms/cli` together.

Check the direct packages:

```bash
npm outdated
```

Keep direct dependency versions exact in `package.json`. The committed lockfile then gives every new user the same tested dependency tree.

## 3. Rebuild Tina And Astro

After updating packages, run:

```bash
npm run doctor
npm run build
npm run dev
```

Open both:

- `http://localhost:4330`
- `http://localhost:4330/admin/index.html`

Click **Enter Edit Mode** and confirm the homepage form and visual preview load. Running Tina development also refreshes `tina/tina-lock.json` when its compiled schema changes; commit that file if it changes.

Astro 7 automatically backgrounds its development server when it detects some AI agents. Keep `ASTRO_DEV_BACKGROUND=0` in the npm development scripts so TinaCMS does not lose its child Astro process.

## 4. Rehearse A New User Install

From a clean copy with no `node_modules` or generated output, run:

```bash
npm ci --include=optional --no-audit --no-fund
npm run doctor
npm run build
```

Also run `npm audit`. Do not use `npm audit fix --force` blindly: it can replace the current Tina CLI with an incompatible historical version. If an advisory remains only inside the latest TinaCMS toolchain, check Tina's next release and record the upstream limitation in the maintenance pull request.

## 5. Verify GitHub

Push the maintenance branch, make sure GitHub can install and build with `.node-version`, then merge only the reviewed files. Confirm the repository is still marked as a GitHub template and that the **Use this template** link works.
