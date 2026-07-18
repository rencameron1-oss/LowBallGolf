---
title: Homepage
hero:
  autoplay_seconds: 8
  primary_cta_text: Start Editing
  primary_cta_url: /contact
  secondary_cta_text: See the template
  secondary_cta_url: /work
  slides:
    - name: Starter
      tab_label: Starter
      duration_seconds: 8
      layout: dot-grid
      theme: dark
      effects: []
      eyebrow: 'ASTRO, TINACMS, GITHUB, CLOUDFLARE'
      heading: 'A website starter people can actually move, edit, and deploy'
      heading_font: site
      heading_size: balanced
      subheading: 'This generic site packages a proven content-block system with scripts, docs, and deployment defaults for someone starting their agentic coding journey.'
      background_image: /images/starter-hero.png
      badges:
        - Editable content
        - Cloudflare ready
        - Agent friendly
      primary_cta_text: Start Editing
      primary_cta_url: /contact
      secondary_cta_text: View Workflows
      secondary_cta_url: /work
    - name: Editor
      tab_label: Editor
      duration_seconds: 8
      layout: mural
      theme: light
      effects:
        - particles
      eyebrow: LOCAL CMS
      heading: Reorder the page with reusable content blocks
      heading_font: site
      heading_size: balanced
      subheading: 'TinaCMS gives the site owner an approachable editor for pages, posts, case studies, navigation, brand colours, and reusable homepage sections.'
      background_image: /images/editor-preview.png
      badges:
        - Home blocks
        - Pages
        - Navigation
    - name: Deploy
      tab_label: Deploy
      duration_seconds: 8
      layout: parallax
      theme: dark
      effects:
        - scanlines
        - grid
      eyebrow: SAME FLOW
      heading: 'GitHub for versioning, Cloudflare for publishing'
      heading_font: site
      heading_size: compact
      subheading: 'The starter keeps the existing deployment shape: build static Astro output, publish the dist folder with Wrangler, and automate releases from GitHub Actions when ready.'
      background_image: /images/cloudflare-deploy.png
      badges:
        - npm run build
        - npm run deploy
        - GitHub Actions
blocks:
  - image: /images/agentic-workflow.png
    image_alt: Simple workflow from editing to GitHub and Cloudflare deployment
    heading: 'Built for beginners, not just developers'
    body: |
      The template includes the site, the shared block library, starter content, local editing, Cloudflare deploy configuration, a setup script, a doctor script, and a plain-English guide. A new user can clone the repo, run the setup, open the editor, and ask an AI coding agent to make changes with enough structure to stay on track.
    image_position: right
    cta_text: Explore the guides
    cta_url: /writing
    background: surface
    _template: imageTextBlock
  - kicker: What is bundled
    heading: The template has the pieces a novice usually trips over
    subheading: 'The goal is not a clever stack. It is a clean first project with the fiddly parts already named, pinned, checked, and documented.'
    cards:
      - icon: sparkles
        heading: Agent-ready structure
        description: 'Clear folders, editable content, starter prompts, and a small set of commands make the site easier for AI coding tools to understand.'
      - icon: calendar
        heading: Repeatable local setup
        description: 'Node version files, npm scripts, a setup command, and a doctor command reduce the dependency guessing.'
      - icon: award
        heading: Cloudflare deploy path
        description: 'Wrangler is installed locally, the Worker assets config is included, and GitHub Actions can deploy after secrets are added.'
    columns: '3'
    _template: featureCardsBlock
  - stats:
      - value: '1'
        label: Repository to clone
      - value: '4'
        label: Main commands
      - value: '0'
        label: Private package links
      - value: 100%
        label: Static deployment
    background: surface
    _template: statsBlock
  - kicker: Example workflows
    heading: Starter case studies
    subheading: 'These sample cards show how a finished site might explain services, projects, or offers. Replace them with your own work in Tina.'
    columns: '3'
    limit: 3
    cta_text: View all
    cta_url: /work
    _template: caseStudyListBlock
  - eyebrow: Ready for your version
    heading: 'Change the name, colours, copy, images, and deploy target when you are ready.'
    subheading: 'Keep the structure, replace the story, and let your coding agent make careful changes one step at a time.'
    cta_text: Configure the site
    cta_url: /contact
    secondary_cta_text: Read the docs
    secondary_cta_url: /writing
    background_image: /images/cloudflare-deploy.png
    background_style: image
    _template: ctaBannerBlock
seo_title: Agentic Site Starter
seo_description: 'A generic Astro, TinaCMS, GitHub and Cloudflare website template for novice agentic coders.'
---
