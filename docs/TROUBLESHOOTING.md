# Troubleshooting

## Node Version Problems

This project expects Node.js 24.18.0 LTS or a newer Node 24 patch release. Do not choose Node 26 Current for this pinned TinaCMS toolchain.

Check:

```bash
node -v
```

If you use `nvm`:

```bash
nvm install
nvm use
```

If you installed Node from the Node.js website, download the current **Node 24 LTS** installer from [nodejs.org](https://nodejs.org/en/download), install it, close and reopen your terminal, then run `node -v` again.

## Dependencies Did Not Install

Run:

```bash
npm run setup
```

If that still fails, close the development server, delete the `node_modules` folder in Finder or File Explorer, then run:

```bash
npm ci --include=optional --no-audit --no-fund
```

If the error mentions `better-sqlite3`, check `node -v` first. It usually means the project is being run with Node 26 Current instead of the supported Node 24 LTS version.

## TinaCMS Editor Does Not Open

Start the combined dev server:

```bash
npm run dev
```

Then open:

```text
http://localhost:4330/admin/index.html
```

The template uses:

- Astro site port: `4330`
- TinaCMS app port: `4010`
- TinaCMS datalayer port: `9010`

If those ports are busy, stop the old process or change the ports in `package.json` and `astro.config.mjs`.

Always start the combined editor with `npm run dev`. Astro 7 can automatically move its development server into the background when it detects an AI coding agent; the template's command disables that behaviour so TinaCMS and Astro stay connected.

## Build Fails Before Astro Starts

The build command runs TinaCMS first:

```bash
npm run build:cms
```

Then Astro:

```bash
npm run build
```

This is intentional. A successful Astro-only build is not enough if the local editor cannot build.

## Cloudflare Login Problems

Check Wrangler:

```bash
npm run cf:whoami
```

If not logged in:

```bash
npm run cf:login
```

For GitHub Actions deploys, do not use browser login. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repository secrets.
