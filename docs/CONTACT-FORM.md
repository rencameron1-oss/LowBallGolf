# Contact Form And The First Bit Of Backend Code

This is the first dynamic piece of the template. Everything else in the
site is static — pre-built HTML pages served from the `dist/` folder.
The contact form is different. When a visitor presses **Send**, the form
posts to a small piece of code running on Cloudflare's network, which
forwards the message to a Gmail address.

This file walks through what is wired together and what you need to
configure before it actually delivers email.

## What Is Already In Place

- **The form** in `src/pages/contact.astro`. A plain HTML form with a
  hidden honeypot input that catches naive spam bots, plus a small
  `<script>` block that posts the form as JSON to `/api/contact` and
  shows a status message.
- **The Worker entry** in `src/worker.ts`. Cloudflare runs this for
  every request. It hands `/api/contact` to the contact handler and
  serves every other URL from your built static site.
- **The handler** in `src/worker/contact.ts`. Validates the input,
  checks the honeypot, and asks Resend to send an email to your
  Gmail inbox.
- **The wiring** in `wrangler.jsonc`. Tells Cloudflare to use the
  Worker file as the entry point and exposes two environment
  variables — `MAIL_FROM` and `MAIL_TO` — so you don't have to change
  code to change addresses.

## What You Need To Do

You need three things from Resend (https://resend.com): a free
account, a verified sending domain, and an API key.

### 1. Sign Up For Resend

Resend handles the actual email sending. You can use it free for low
volume. If you want a quick demo before owning a domain, Resend lets
you send from `onboarding@resend.dev`, which is what the template is
configured with by default.

For real use, add and verify a domain you own (Resend walks you
through the DNS records). Then update `MAIL_FROM` in `wrangler.jsonc`
to a sender on that domain — for example `Website <hello@yourdomain.com>`.

### 2. Set Your Gmail Address

Open `wrangler.jsonc` and change the `MAIL_TO` value to the Gmail
address (or any address) where you want enquiries delivered:

```jsonc
"vars": {
  "MAIL_FROM": "Website <hello@yourdomain.com>",
  "MAIL_TO": "you@gmail.com"
}
```

### 3. Store The Resend API Key As A Secret

Never put API keys in `wrangler.jsonc` — that file gets committed to
GitHub. Cloudflare has a separate "secrets" store for that. Run:

```bash
npx wrangler secret put RESEND_API_KEY
```

It will prompt you for the value. Paste the key from the Resend
dashboard. Cloudflare encrypts it and your Worker can read it as
`env.RESEND_API_KEY` at runtime.

### 4. Deploy

```bash
npm run deploy
```

That builds the static site and uploads both the assets and the
Worker. Visit `https://your-site.workers.dev/contact`, fill in the
form, and the message should appear in your Gmail inbox within a
few seconds.

## Trying It Locally First

`npm run dev` starts the Astro dev server only — it does not run the
Worker, so submitting the form locally returns a 404. To test the
full flow on your machine, run:

```bash
npm run build
npx wrangler dev
```

That serves the built site through the real Worker code. You can
also pass the API key inline for the dev session:

```bash
npx wrangler dev --var RESEND_API_KEY:re_xxx
```

## Where To Take This Next

This is the simplest possible dynamic page: form → API → email. The
natural next lessons build on it without rewriting any of the code
you already have:

1. **Persist messages to D1.** Add a Cloudflare D1 database, write a
   migration that creates a `contact_submissions` table, and insert
   each submission before sending the email.
2. **Add an admin page.** Behind a password, list every submission
   so you can mark them as replied, booked, or spam.
3. **Add rate limiting.** Use the `source_ip` recorded in D1 to
   reject more than a few submissions per hour from one address.

Each of those is a focused, reviewable change that you can ask your
coding agent to do one at a time.
