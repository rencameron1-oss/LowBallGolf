# Deployment

This template keeps the same deploy shape as the existing static Astro sites:

1. TinaCMS builds the admin into `public/admin`.
2. Astro builds the static site into `dist`.
3. Wrangler deploys `dist` as Cloudflare Worker assets.

## Local Deployment

```bash
npm run doctor
npm run build
npm run cf:login
npm run deploy
```

`npm run deploy` runs the build first, then calls `wrangler deploy`.

## Cloudflare Worker Name

Set the Worker name in `wrangler.jsonc`:

```jsonc
{
  "name": "my-new-site",
  "assets": {
    "directory": "./dist"
  }
}
```

The starter does not include custom-domain routes by default. That keeps first deploys simpler and lets Cloudflare publish to a `workers.dev` URL.

After the first deploy works, add a custom domain in the Cloudflare dashboard or extend `wrangler.jsonc` with route settings.

## GitHub Actions Deployment

The workflow is in `.github/workflows/deploy.yml`.

Required GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Optional GitHub repository variables:

- `PUBLIC_SITE_URL`
- `PUBLIC_GA_ID`

The workflow runs on pushes to `main` and can also be started manually.

## Before Launch

Run:

```bash
npm run configure
npm run doctor
npm run build
```

Fix warnings about placeholder domain, placeholder email, and placeholder Worker name before treating a deploy as a real launch.
