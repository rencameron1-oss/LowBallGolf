# Codex Vibe Coding Guide

This starter is designed for a beginner who wants to talk to Codex in normal language and let the AI handle the technical work as far as it reasonably can.

WordPress replacement is only the first doorway. The bigger goal is a repeatable way to build and improve a real website by describing outcomes, letting Codex inspect the repo, and verifying each change.

## The Working Agreement

The user brings:

- business facts
- audience and tone
- offers, prices, locations, services, and proof points
- images, logos, brand preferences, and examples
- account access for GitHub, Cloudflare, Resend, domain DNS, and any paid services
- approval before publishing, sending email, taking payments, or changing live data

Codex handles where possible:

- reading the repo and finding the right files
- editing content, pages, components, TinaCMS schema, Worker routes, and docs
- choosing the simplest technical path that fits the current starter
- adding focused dynamic features such as forms, submissions, product lists, and simple admin pages
- running `npm run doctor`, `npm run build`, and other local checks
- explaining changed files in plain language
- preparing commits or deployment steps when asked

## What To Say To Codex

Say the outcome first. You do not need to know which file or framework piece is involved.

Good:

```text
I run a mobile dog grooming business. Turn this starter into a simple local services site. Keep the structure, ask me for missing business facts, and run the build when done.
```

Good:

```text
Add a booking enquiry page. It should collect name, email, suburb, preferred day, pet type, and notes. Make it feel like part of the current site and tell me what needs to happen for the form to email me.
```

Good:

```text
Add a simple products section with three starter products. Make the products editable and create a first product detail page. Keep checkout out of scope for now.
```

Risky:

```text
Rebuild this into my whole business website and deploy it.
```

Better:

```text
First, inspect the starter and ask me for the business details you need. Then update only the homepage copy and site settings. Run npm run build.
```

## The Safe Iteration Loop

1. Ask for one outcome.
2. Codex inspects before editing.
3. Codex makes the smallest useful change.
4. Codex runs the relevant check.
5. You review the visible result and the changed-file summary.
6. Commit the working state.
7. Ask for the next outcome.

This is the practical version of vibe coding: move quickly, but keep each step reviewable.

## What Codex Can Build In This Starter

Content and brochure work:

- rewrite the homepage
- change site settings, colours, fonts, and logo text
- add pages, posts, case studies, testimonials, and navigation
- make new content editable in TinaCMS
- update SEO titles and descriptions

Design and structure:

- adjust existing blocks
- add a new reusable block
- tune layout spacing and responsive behaviour
- replace starter images with real assets

Dynamic features:

- contact and enquiry forms
- form validation and spam honeypots
- Cloudflare Worker API routes under `/api/*`
- D1-backed submissions
- simple admin pages such as `/admin/messages`
- TinaCMS "Live Data" sidebar links for admin pages
- product or service listings
- newsletter signup flows

Deployment:

- check local setup with `npm run doctor`
- build TinaCMS and Astro with `npm run build`
- check Cloudflare login with `npm run cf:whoami`
- deploy with `npm run deploy` when you confirm
- explain required Cloudflare, GitHub, and Resend secrets without writing secrets into the repo

## What Still Needs The Human

Codex should not invent important facts. You need to provide or approve:

- legal business name
- pricing
- terms, refunds, and privacy wording
- testimonials and claims
- final brand direction
- account logins and permissions
- API keys and secret values
- whether a live deploy should happen
- payment provider setup

## Dynamic Pages Without Rebuilding WordPress

Most of the site should stay static and fast. Add dynamic behaviour only where it earns its keep.

The pattern is:

1. Build or edit a normal Astro page.
2. Add a same-domain Worker route under `/api/*`.
3. Validate the request.
4. Store data in D1 or send it to the right service.
5. Add a small admin page if the site owner needs to view or manage the data.
6. Register that admin page inside TinaCMS under "Live Data" when useful.

The first dynamic feature in this starter is the contact form. The natural next step is D1-backed submissions plus an `/admin/messages` page.

## Best First Codex Sessions

Session 1:

```text
Inspect this repo and explain the main editing loop for a beginner. Do not change files yet.
```

Session 2:

```text
Configure this starter for my business. Ask me for missing facts, then update the site settings and homepage content. Run npm run build.
```

Session 3:

```text
Add a Services page with three editable service cards, add it to navigation, and run npm run build.
```

Session 4:

```text
Inspect the contact form and Worker route. Make a plan for saving submissions in D1 and showing them in an admin page. Do not implement until I say go.
```

Session 5:

```text
Go ahead with the D1-backed submissions admin page. Keep secrets out of the repo and run the build when done.
```

## The Point

The win is not that the user becomes a professional developer on day one.

The win is that they can start with a real site, describe what they want, let Codex handle the technical path, and learn by reviewing working changes.
