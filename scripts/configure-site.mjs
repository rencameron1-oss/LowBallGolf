#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import readline from 'node:readline/promises';
import process from 'node:process';

const root = new URL('..', import.meta.url);

const read = (path) => readFileSync(new URL(path, root), 'utf8');
const write = (path, value) => writeFileSync(new URL(path, root), value);

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48) || 'my-site';

const initialsFromName = (value) => {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3);

  const initials = parts.map((part) => part[0]?.toUpperCase()).join('');
  return initials || 'AS';
};

const ensureUrl = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return 'https://example.com';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const jsString = (value) => JSON.stringify(value);

const replaceConstValue = (source, property, value) =>
  source.replace(new RegExp(`${property}:\\s*'[^']*'`), `${property}: ${jsString(value)}`);

const replaceNestedEmail = (source, value) =>
  source.replace(/social:\s*{\s*email:\s*'[^']*'/s, `social: {\n    email: ${jsString(value)}`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = async (question, fallback) => {
  const answer = (await rl.question(`${question} (${fallback}): `)).trim();
  return answer || fallback;
};

console.log('\nConfigure Agentic Site Starter\n');

const siteName = await ask('Site name', 'My New Site');
const wordmark = await ask('Logo text', siteName);
const tagline = await ask('Short tagline', 'A clear website built with an AI coding agent');
const description = await ask('SEO description', `${siteName} is a modern editable website built with Astro, TinaCMS, GitHub and Netlify.`);
const domain = ensureUrl(await ask('Public site URL or domain', 'https://example.com'));
const email = await ask('Contact email', 'hello@example.com');
const location = await ask('Location text', 'Melbourne, Australia');
const packageName = slugify(siteName);

rl.close();

let siteConfig = read('src/config/site.ts');
siteConfig = replaceConstValue(siteConfig, 'name', siteName);
siteConfig = replaceConstValue(siteConfig, 'tagline', tagline);
siteConfig = siteConfig.replace(/description:\s*\n\s*'[^']*'/, `description:\n    ${jsString(description)}`);
siteConfig = replaceConstValue(siteConfig, 'url', domain);
siteConfig = replaceConstValue(siteConfig, 'wordmark', wordmark);
siteConfig = replaceNestedEmail(siteConfig, email);
siteConfig = replaceConstValue(siteConfig, 'emailSubject', `Enquiry from ${siteName}`);
siteConfig = replaceConstValue(siteConfig, 'titleTemplate', `%s | ${siteName}`);
write('src/config/site.ts', siteConfig);

const settings = JSON.parse(read('src/content/site_settings/main.json'));
settings.location = location;
settings.contact_intro = `Use this page for enquiries about ${siteName}.`;
settings.footer_note = `${siteName}. Built with Astro, TinaCMS, GitHub and Netlify.`;
settings.brand.logo_text = wordmark;
settings.brand.logo_initials = initialsFromName(wordmark);
write('src/content/site_settings/main.json', `${JSON.stringify(settings, null, 2)}\n`);

let astroConfig = read('astro.config.mjs');
astroConfig = astroConfig.replace(/PUBLIC_SITE_URL \|\| '[^']*'/, `PUBLIC_SITE_URL || ${jsString(domain)}`);
write('astro.config.mjs', astroConfig);

let robots = read('public/robots.txt');
robots = robots.replace(/Sitemap:\s*.*/, `Sitemap: ${domain.replace(/\/$/, '')}/sitemap-index.xml`);
write('public/robots.txt', robots);

const packageJson = JSON.parse(read('package.json'));
packageJson.name = packageName;
write('package.json', `${JSON.stringify(packageJson, null, 2)}\n`);

if (existsSync(new URL('package-lock.json', root))) {
  const packageLock = JSON.parse(read('package-lock.json'));
  packageLock.name = packageName;
  if (packageLock.packages?.['']) {
    packageLock.packages[''].name = packageName;
  }
  write('package-lock.json', `${JSON.stringify(packageLock, null, 2)}\n`);
}

if (!existsSync(new URL('.env', root)) && existsSync(new URL('.env.example', root))) {
  copyFileSync(new URL('.env.example', root), new URL('.env', root));
}

if (existsSync(new URL('.env', root))) {
  const env = read('.env');
  const nextEnv = env.includes('PUBLIC_SITE_URL=')
    ? env.replace(/PUBLIC_SITE_URL=.*/, `PUBLIC_SITE_URL=${domain}`)
    : `${env.trimEnd()}\nPUBLIC_SITE_URL=${domain}\n`;
  write('.env', nextEnv);
}

console.log('\nConfiguration updated.');
console.log('Next: run npm run doctor and npm run build.');
