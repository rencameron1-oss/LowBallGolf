---
title: Contact
hero_heading: Configure Your Site
hero_subheading: Replace the placeholder email, domain, Worker name, copy, and brand settings when you turn this template into your own project.
hero_image: /images/cloudflare-deploy.png
intro: For a real site, this page becomes your contact or enquiry page. While it is still a starter, use it as the checklist for personalising the template.
blocks:
  - heading: Starter checklist
    email: hello@example.com
    email_subject: Website enquiry
    location: Your location
    location_detail: Replace this in TinaCMS
    response_time: Run npm run configure, then npm run doctor
    cta_text: Send Email
    _template: contactInfoBlock
  - heading: Before you deploy
    items:
      - question: GitHub
        answer: Create a GitHub repository from this template, then commit your changes in small steps so your agent can explain and verify them.
      - question: Cloudflare
        answer: Create a Cloudflare account, log in with Wrangler, and deploy once npm run build passes.
      - question: Secrets
        answer: For GitHub Actions deploys, add CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID in your repository secrets.
    _template: faqBlock
seo_title: Configure Your Site
seo_description: Personalise the starter site, set up GitHub and Cloudflare, and prepare for deployment.
---

Run `npm run configure` when you are ready to replace the placeholders. The script updates the main config files without asking a beginner to hunt through the codebase manually.
