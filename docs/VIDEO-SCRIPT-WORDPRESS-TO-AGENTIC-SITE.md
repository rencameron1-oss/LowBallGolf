# Video Plan: Vibe Coding A Real Website With Codex

## Working Premise

This video is for a person who is beginning a vibe coding journey and wants a real first project they can improve by talking to Codex.

WordPress replacement is the opening example, not the main promise. The pitch is:

> A lot of simple business, portfolio, band, club, and personal sites start as brochure pages with a few dynamic pieces. Instead of learning every technical layer first, this starter gives you a real editable site where you describe the outcome, Codex handles the technical work where it can, and each change is verified before you move on.

## Title Options

- Your First Vibe Coded Website With Codex
- Talk To Codex, Build A Real Website
- From Website Idea To Working Site With Codex
- Stop Wrestling With WordPress: Vibe Code A Site You Control
- A Real Starter Website For People Learning With AI

My current favourite:

> Your First Vibe Coded Website With Codex

It puts the actual lesson first. WordPress can still be the contrast, but the main idea is that the viewer can iterate by talking to Codex.

## Code Ease Assessment

Overall readiness: strong.

What is beginner-friendly:

- The project has a clear identity: "A transportable Astro, TinaCMS, GitHub and Cloudflare website template for people beginning their agentic coding journey."
- The first-run path is simple: `npm run setup`, then `npm run dev`.
- The ongoing loop is teachable: describe an outcome, let Codex inspect and edit, run `npm run build`, review, commit.
- The local editor path is approachable: the public site and TinaCMS editor both run from `http://localhost:4330`.
- The README explains that this is a GitHub Template, not a fork. That matters because beginners get a clean copy under their own account.
- The bundled `@bands/ui` package avoids the private-package problem. Everything needed to run the template travels in one repository.
- The docs are useful and plain: `CODEX-VIBE-CODING-GUIDE.md`, `AGENTIC-CODING-GUIDE.md`, `DEPLOYMENT.md`, `TROUBLESHOOTING.md`, and `CONTACT-FORM.md`.
- `npm run doctor` gives a beginner a way to check common setup issues without guessing.
- `npm run build` currently passes. It builds TinaCMS first, then Astro, which is the right proof because the editor is part of the product.

Potential beginner friction:

- The stack still has real moving parts: Node, npm, GitHub, Cloudflare, TinaCMS, Wrangler, and optional Resend. The video should frame this as "a guided first stack", not "zero setup".
- `npm run configure` is interactive. Good for a beginner, but it should be demonstrated slowly.
- The contact form introduces backend concepts. Treat it as "your first dynamic feature", not as something the viewer must master in the first session.
- The repo can still have uncommitted local changes during prep. Before filming, commit the intended starter state so the demo begins cleanly.

Cleanups now applied in the repo:

- Removed the stray `New sentence` text from `src/content/home/index.md`.
- Merged TinaCMS setup into a single `cmsCallback`, so the font preview plugin and future "Live Data" sidebar entries both register.
- Kept the "Live Data" Tina sidebar helper available for Part 2, but left it empty for Part 1.
- Restored the bundled UI package metadata.

Pre-recording checklist:

- Run `npm run doctor` and `npm run build` immediately before recording.
- If you show the GitHub path, say "Use this template" or "create your own copy". Avoid saying "fork" unless you explain the difference.

## Video Shape

Target length: 8 to 12 minutes.

Core promise:

> By the end, the viewer has their own copy of the starter site, can run it locally, can open the editor, can ask Codex for a real outcome, and knows how to verify that the site still builds.

Do not make the first video a full deploy tutorial. Mention deploy, show the command and docs, but keep the win focused on owning and editing the site.

## Part 1 And Part 2 Arc

Part 1 is about learning the Codex iteration loop on the brochure-site part of the project:

- pages
- posts
- homepage sections
- navigation
- brand settings
- local editing
- GitHub history
- Cloudflare publishing

Part 2 answers the natural objection:

> That is fine for brochure pages, but what about the dynamic pages WordPress usually handles with plugins?

The answer is:

> Keep the brochure pages static and fast. Add dynamic behaviour only where you need it, using small same-domain API routes on Cloudflare Workers.

Examples:

- contact forms
- enquiry submissions
- product lists
- booking requests
- newsletter signups
- simple admin pages
- member-only pages later

The starter already has the first dynamic piece: the contact page posts to `/api/contact`, and the Worker handles it before falling back to the static site.

## Part 2 Video Plan: Add The First Dynamic Page

Working title:

> What About Forms And Products? Adding Dynamic Pages Without Going Back To WordPress

Core promise:

> By the end, the viewer understands how this starter handles dynamic behaviour: a normal page posts to a same-domain API route, Cloudflare Worker code handles the request, and the next step is to save submissions in D1 and surface them inside TinaCMS.

Recommended Part 2 scope:

1. Show the existing contact form.
2. Show the `/api/contact` Worker route.
3. Explain why this is different from installing a WordPress plugin.
4. Add or demonstrate the next step: save submissions to Cloudflare D1.
5. Add or demonstrate an `/admin/messages` page that lists submissions.
6. Register that page in TinaCMS under "Live Data" using the helper already wired into the template.

Part 2 first agent prompt:

```text
Inspect the existing contact form and Cloudflare Worker. Add a Cloudflare D1-backed contact_submissions table, save each valid contact form submission before sending the email, add an /admin/messages page that lists recent submissions, register that admin page in TinaCMS under Live Data, and run npm run build. Keep secrets out of the repo.
```

Important framing:

- This is not trying to rebuild all of WordPress in one go.
- It is adding one useful dynamic feature at a time.
- The static site stays static.
- The backend stays small and visible.
- The agent has clear files to inspect and a build command to verify.
- The user describes the business need. Codex handles the Worker, D1, route, admin page, and verification steps as far as the local environment allows.

### Part 2 Script Outline

#### 0:00 Recap

Part 1 showed the brochure-site side: pages, posts, content blocks, editing, GitHub, and Cloudflare.

But WordPress is not only brochure pages. People use it because it can also handle forms, product pages, bookings, memberships, and admin screens.

So the fair question is: can this starter do that too?

Yes, but in a more deliberate way.

#### 0:45 The Dynamic Page Idea

Most of the site can stay static.

That is good. Static pages are fast, cheap to host, and have a smaller security surface.

Then, when you need something dynamic, you add a small backend route for that one job.

In this starter, the first example is the contact form.

The page is normal Astro.

The form posts to `/api/contact`.

Cloudflare Worker receives that request.

The Worker validates it and sends the message by email.

Everything else still serves as static files.

#### 2:00 Show The Code Path

Screen: `src/pages/contact.astro`, then `src/worker.ts`, then `src/worker/contact.ts`.

Script:

This is the bit WordPress would usually hide behind a plugin.

Here, you can actually see it.

The form gathers the fields.

The script posts JSON to `/api/contact`.

The Worker checks the route.

The contact handler validates the payload, checks the honeypot field, and sends the email.

That is the first dynamic page. Not a huge app. Not a plugin marketplace. Just a small piece of backend code attached to the static site.

#### 3:30 The Next Step: Save Submissions

Screen: show `docs/CONTACT-FORM.md`, especially "Where To Take This Next".

Script:

Email is useful, but the next practical step is to save every submission.

That gives you a simple admin page where you can see what came in, mark it as replied, and keep a record.

On Cloudflare, the beginner-friendly database for this is D1.

So Part 2 is the natural next build:

Create a `contact_submissions` table.

Save each valid form submission.

Add an admin page at `/admin/messages`.

Then register that page inside TinaCMS under "Live Data".

Now your editor is not only for brochure content. It also becomes a place where simple live business data can be viewed.

#### 5:00 Products And Other Dynamic Pages

Script:

The same pattern can extend to products.

A simple product page might start as static content.

Then later you add stock status, enquiry buttons, Stripe checkout, a booking request, or an admin page for managing availability.

The important thing is the pattern:

Keep the page simple.

Add one API route.

Store data in the right place.

Add an admin surface only when you need one.

That is how you avoid replacing WordPress plugin chaos with a different kind of chaos.

#### 6:30 Closing

Script:

This is the practical middle ground.

You get the speed and simplicity of static pages for most of the site.

You get dynamic features where they genuinely matter.

And because the code lives in your repo, Codex can inspect it, change it, run the build, and explain what changed.

That is the journey:

Part 1: own and edit the site.

Part 2: add your first dynamic feature.

Then keep going, one reviewable change at a time.

## Full Script

### 0:00 Hook

Screen: show the starter homepage, then quickly show the Tina editor and the repo files.

Script:

If you are starting your first vibe coding project, a website is a good place to begin because the feedback is visible.

You can see the page. You can change the words. You can change the layout. Then, when you need a form or a product page, you can add the first bit of backend code.

That is where Codex becomes useful.

This is a real editable website starter. You can copy it into your own GitHub account, run it on your computer, edit it in a local CMS, and then talk to Codex about what you want changed.

The point is not that you suddenly become a full-stack developer in one afternoon. The point is that Codex can do the technical work to a point, and you can learn by reviewing small, working changes.

### 0:55 The Honest WordPress Framing

Screen: simple slide or browser tab with the starter site still visible. Do not show a busy comparison table.

Script:

WordPress is a useful comparison because a lot of people understand that pain: hosting, themes, plugins, updates, security fixes, page builders, licences.

But this video is not really about hating WordPress.

It is about a different way to work.

Instead of logging into a system and hoping you can find the right plugin or setting, you describe the outcome to Codex.

"Make this homepage suit my business."

"Add a Services page."

"Create a booking enquiry form."

"Run the build and tell me what changed."

What you probably need is:

One place for your content.

One clear way to edit it.

One clear way to publish it.

And a structure that Codex can understand well enough to help with the technical parts.

That is what this starter is for.

### 1:50 What This Starter Is

Screen: show `README.md`, then the homepage, then `src/content/home/index.md`.

Script:

This starter uses Astro for the website, TinaCMS for local editing, GitHub for version history, Cloudflare for publishing, and Codex as the technical collaborator.

That sounds like a lot if you are new, but the point is that the hard-to-name pieces are already organised.

The content lives in clear folders.

The visual blocks are already built.

The setup commands are named.

The deployment path is documented.

And there is a doctor command that checks the obvious things before you waste half a day wondering what went wrong.

This is not an empty tutorial. It is a working website that you can change by talking to an AI coding agent and verifying the result.

### 2:45 Get Your Own Copy

Screen: show GitHub repo page and the "Use this template" button.

Script:

The first thing to understand is that this is a GitHub Template.

So you do not need to fork it in the usual open-source sense. You click "Use this template", choose your account, give the new site a name, and GitHub creates a clean copy for you.

That copy is yours.

You can break it, fix it, rewrite it, delete it, publish it, or turn it into a proper site for your own project.

That is a much better learning environment than poking around inside a live WordPress install where one plugin update can ruin your afternoon.

### 3:40 Run It Locally

Screen: terminal in the repo.

Script:

Once the repo is on your machine, there are two commands to start with.

First:

```bash
npm run setup
```

That installs the dependencies and runs the project doctor.

Then:

```bash
npm run dev
```

That starts the website and the TinaCMS editor together.

The site opens at:

```text
http://localhost:4330
```

And the editor opens at:

```text
http://localhost:4330/admin/index.html
```

This is the first big moment. You have a real website running on your own machine.

### 4:50 The Safe Agent Loop

Screen: show `docs/CODEX-VIBE-CODING-GUIDE.md`.

Script:

Now this is where Codex comes in.

The mistake beginners make is asking for one giant change.

"Turn this into my whole business website and deploy it."

That is too much.

The safer loop is:

Ask for one clear change.

Let Codex inspect the repo.

Let Codex choose the technical path unless you have a strong preference.

Keep the current structure unless you actually want a redesign.

Run the build.

Review the files that changed.

Commit the working state.

That loop matters because vibe coding is not about randomly accepting whatever the AI writes. It is about describing the outcome, letting Codex do the technical work it can do, and verifying the result.

### 5:55 First Prompt To Try

Screen: show Codex or another coding agent with the prompt.

Script:

Here is the kind of first prompt I would use:

```text
Inspect this repo, keep the current structure, and update the homepage copy for my business. Ask me only for business facts you cannot infer. Only change content files unless code changes are needed. Then run npm run build and summarise the files you changed.
```

That prompt does a few useful things.

It tells Codex to inspect first.

It says to keep the structure.

It narrows the work to content where possible.

And it asks for a build at the end.

That is a very different experience from logging into WordPress, installing another page builder, and hoping you remember what changed when something breaks.

### 6:55 Show TinaCMS

Screen: open TinaCMS and show Site Settings, homepage blocks, navigation.

Script:

For a lot of day-to-day changes, you do not even need to touch code directly.

The local editor lets you change site settings, colours, fonts, logo text, pages, posts, navigation, case studies, testimonials, and homepage blocks.

This is important for beginners.

You get the friendliness of an editor, but the content still lives in files. That means GitHub can track it, your coding agent can understand it, and your site can be built as fast static pages.

It is a nice middle ground between "I do not want to code anything" and "I want full control".

### 7:55 Verify The Site

Screen: terminal running build.

Script:

After a change, run:

```bash
npm run build
```

In this starter, the build does two things.

It builds the TinaCMS admin.

Then it builds the Astro site.

That matters because the editor is part of the website workflow. A plain website build is not enough if the editor is broken.

If the build passes, you have a much better signal that the site is still healthy.

### 8:45 Publishing Path

Screen: show `docs/DEPLOYMENT.md`, `wrangler.jsonc`, maybe GitHub Actions workflow.

Script:

When you are ready to publish, the starter is set up for Cloudflare.

Cloudflare has a generous free tier, and this kind of static site is a good fit for it.

The local deploy path is:

```bash
npm run doctor
npm run build
npm run cf:login
npm run deploy
```

There is also a GitHub Actions workflow for automatic deploys once your Cloudflare secrets are added.

I would not make deployment the first battle. First, get the site running. Make a small change. Build it. Understand the loop. Then publish.

### 9:45 Closing

Screen: return to the starter homepage.

Script:

The real point here is ownership.

You are not trapped inside a theme.

You are not waiting for plugin updates.

You are not paying monthly fees just to keep a simple site alive.

You have a real project, in your own GitHub account, with clear files, clear commands, an editor, and a path to publish.

That is a strong first step into vibe coding because it gives you something practical to change, but it also gives you enough structure to stay safe.

Start small.

Change the name.

Change the homepage.

Run the build.

Commit the result.

Then do the next thing.

That is how you move from "I have a website someone else controls" to "I can actually iterate on my own site."

## Thumbnail And On-Screen Text Ideas

Thumbnail text options:

- "Replace WordPress?"
- "Your First AI Website"
- "Stop Renting Your Website"
- "Vibe Code A Real Site"

Short on-screen captions:

- "Use Template, not fork"
- "Run setup"
- "Open local editor"
- "Ask for one change"
- "Build before you trust it"
- "Publish when ready"

## Best First Follow-Up Videos

1. Customise the starter for a real local business.
2. Add a new Services page and make it editable in TinaCMS.
3. Turn the contact form into a D1-backed submissions admin page.
4. Deploy the finished site to Cloudflare.
5. Use GitHub commits as your safety net when working with AI.
