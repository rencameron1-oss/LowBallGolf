#!/usr/bin/env node
import { copyFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const root = new URL('..', import.meta.url);
const isWindows = process.platform === 'win32';

const run = (command, args) => {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: isWindows,
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
};

const parseNodeVersion = () => {
  const [major = 0, minor = 0] = process.versions.node.split('.').map(Number);
  return { major, minor };
};

const nodeVersion = parseNodeVersion();
const nodeIsSupported = nodeVersion.major === 24 && nodeVersion.minor >= 18;

console.log('\nAgentic Site Starter setup\n');

if (!nodeIsSupported) {
  console.error(
    `Node ${process.versions.node} is not supported by this starter. Install Node 24.18.0 LTS (not Node 26 Current), then run setup again.`
  );
  process.exit(1);
}

if (!existsSync(new URL('.env', root)) && existsSync(new URL('.env.example', root))) {
  copyFileSync(new URL('.env.example', root), new URL('.env', root));
  console.log('Created .env from .env.example');
}

console.log('Installing dependencies...');
run('npm', ['install', '--include=optional', '--no-audit', '--no-fund']);

console.log('\nRunning project doctor...');
run('npm', ['run', 'doctor']);

console.log('\nSetup complete. Run npm run dev to start the site and TinaCMS.');
