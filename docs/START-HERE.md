# Start Here

This guide takes you from the GitHub template to a working local website. You do not need to understand Astro, TinaCMS, or Cloudflare before you begin.

## 1. Install The Two Things You Need

Install:

1. [Node.js 24 LTS](https://nodejs.org/en/download). Choose the LTS download, not the Current download.
2. [GitHub Desktop](https://desktop.github.com/) if you want a visual way to download the project and send your changes back to GitHub.

Codex, Cursor, Claude Code, VS Code, or another coding tool can be installed as well, but the website will run without one.

## 2. Make Your Own Copy On GitHub

1. Open the [Agentic Site Template](https://github.com/miichaelsmedley/agentic-site-template).
2. Click **Use this template** and then **Create a new repository**.
3. Choose your GitHub account.
4. Give the repository a name such as `my-business-site`.
5. Click **Create repository**.

This creates an independent copy. Your changes will not alter the original template.

## 3. Put The Project On Your Computer

### Recommended: GitHub Desktop

1. Open GitHub Desktop.
2. Choose **File → Clone repository**.
3. Select the repository you just created.
4. Choose where to save it and click **Clone**.
5. In GitHub Desktop, choose **Repository → Open in Terminal** when you are ready for the next step.

### Simple trial: Download ZIP

On your repository page, choose **Code → Download ZIP**, then unzip the file. Open a terminal in the unzipped folder. This is enough to run the site, but use GitHub Desktop later if you want to send your changes back to GitHub.

### Terminal option

```bash
git clone https://github.com/<your-username>/<your-repository>.git
cd <your-repository>
```

Replace the values inside angle brackets with your GitHub details.

## 4. Check Node And Start The Site

In the project terminal, run:

```bash
node -v
npm run setup
npm run dev
```

The first command should show `v24.18.0` or a newer `v24` release. Setup installs the project and checks common problems. The development command keeps running while you work.

Open these addresses in your browser:

- Website: `http://localhost:4330`
- TinaCMS editor: `http://localhost:4330/admin/index.html`

In TinaCMS, click **Enter Edit Mode**. Changes you save are written into the project on your computer.

Press `Control + C` in the terminal when you want to stop the local site.

## 5. Make It Yours

Run the guided placeholder setup:

```bash
npm run configure
```

Then start the site again with `npm run dev` and edit **Site Settings** in TinaCMS. Begin with the site name, logo, colours, contact details, and homepage copy.

If you are using Codex or another coding agent, open the whole project folder and try this prompt:

```text
Inspect this repository and keep its current structure. Help me turn it into a website for my project. Ask me only for business facts, wording, or images you need. Make one small change at a time and run npm run build before saying it is finished.
```

Never paste passwords, API keys, or Cloudflare tokens into content files or prompts that will be committed. Secrets belong in `.env` locally or in GitHub and Cloudflare secret settings.

## 6. Check Your Work

Before sending changes to GitHub, run:

```bash
npm run doctor
npm run build
```

A successful build checks both the TinaCMS admin and the Astro website.

## 7. Send Changes Back To GitHub

In GitHub Desktop:

1. Review the changed files on the left.
2. Write a short summary such as `Personalise homepage`.
3. Click **Commit to main**.
4. Click **Push origin**.

Your repository on GitHub now contains the updated site.

## 8. Publish The Website

GitHub stores the project and its history. Cloudflare publishes the actual public website. Follow [`DEPLOYMENT.md`](DEPLOYMENT.md) when you are ready to create the Cloudflare Worker and add the required GitHub secrets.

If something goes wrong, work through [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) or ask your coding agent to run `npm run doctor` and explain the result in plain language.
