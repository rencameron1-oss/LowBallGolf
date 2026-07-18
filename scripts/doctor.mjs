#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const root = new URL('..', import.meta.url);
const isWindows = process.platform === 'win32';
const args = new Set(process.argv.slice(2));
const failures = [];
const warnings = [];

const fileExists = (path) => existsSync(new URL(path, root));

const check = (condition, label, detail = '') => {
  if (condition) {
    console.log(`[ok] ${label}`);
    return;
  }

  console.log(`[fail] ${label}${detail ? ` - ${detail}` : ''}`);
  failures.push(label);
};

const warn = (condition, label, detail = '') => {
  if (condition) {
    console.log(`[ok] ${label}`);
    return;
  }

  console.log(`[warn] ${label}${detail ? ` - ${detail}` : ''}`);
  warnings.push(label);
};

const caution = (condition, label, detail = '') => {
  if (condition) {
    console.log(`[warn] ${label}${detail ? ` - ${detail}` : ''}`);
    warnings.push(label);
    return;
  }

  console.log(`[ok] ${label}`);
};

const run = (command, runArgs) =>
  spawnSync(command, runArgs, {
    cwd: root,
    encoding: 'utf8',
    shell: isWindows,
  });

const parseNodeVersion = () => {
  const [major = 0, minor = 0] = process.versions.node.split('.').map(Number);
  return { major, minor };
};

console.log('\nAgentic Site Starter doctor\n');

const nodeVersion = parseNodeVersion();
check(
  nodeVersion.major === 24 && nodeVersion.minor >= 18,
  `Node version ${process.versions.node}`,
  'need Node 24.18.0 LTS; Node 26 Current is not supported by TinaCMS dependencies'
);

const npmVersion = run('npm', ['-v']);
check(npmVersion.status === 0, 'npm is available');

check(fileExists('package.json'), 'package.json exists');
check(fileExists('package-lock.json'), 'package-lock.json exists');
check(fileExists('packages/ui/package.json'), 'bundled @bands/ui package exists');
check(fileExists('src/content/home/index.md'), 'homepage content exists');
check(fileExists('src/content/site_settings/main.json'), 'site settings content exists');
check(fileExists('netlify.toml'), 'Netlify netlify.toml exists');
check(fileExists('.nvmrc') && fileExists('.node-version'), 'Node version files exist');

warn(fileExists('.env'), '.env file check', 'missing; run npm run setup to create it from .env.example');
warn(fileExists('node_modules'), 'node_modules check', 'missing; run npm run setup');
warn(fileExists('public/images/starter-hero.png'), 'starter hero image exists');
warn(fileExists('public/images/editor-preview.png'), 'editor preview image exists');
const siteConfig = readFileSync(new URL('src/config/site.ts', root), 'utf8');
caution(siteConfig.includes('https://example.com'), 'Site URL is still the starter placeholder', 'run npm run configure before launch');
caution(siteConfig.includes('hello@example.com'), 'Contact email is still the starter placeholder', 'run npm run configure before launch');

if (args.has('--build')) {
  console.log('\nRunning production build...');
  const build = spawnSync('npm', ['run', 'build'], {
    cwd: root,
    stdio: 'inherit',
    shell: isWindows,
  });
  if (build.status !== 0) {
    failures.push('production build');
  }
}

console.log(`\nDoctor finished with ${failures.length} failure(s) and ${warnings.length} warning(s).`);

if (failures.length > 0) {
  process.exit(1);
}
