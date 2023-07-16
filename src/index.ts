#!/usr/bin/env node
import DraftLog from 'draftlog';
import ncp from 'ncp';

import { mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  execShellCommand,
  inCYAN,
  inGREEN,
  intervalProgress,
} from './utils/index.js';

DraftLog(console);
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(dirname(__filename), '..');

console.time('PKG Setup');
const dir = process.argv[2];

const updateStatus = intervalProgress('Setting up Kwoka PKG...');

const copyProgress = intervalProgress('Copying scaffold...');
await mkdir(dir, { recursive: true });
await new Promise((res, rej) => {
  ncp(join(__dirname, 'kwoka-pkg'), dir, { clobber: false }, (er) => {
    if (er) {
      return rej('failed');
    }
    res('success');
  });
});
copyProgress(inCYAN('Copied scaffold'), inGREEN('[OK]'));

const updateProgress = intervalProgress('Updating dependencies...');
await execShellCommand(
  `pnpm dlx npm-check-updates -u --packageFile ./${dir}/package.json --concurrency 15`,
);
updateProgress(inCYAN('Updated dependencies'), inGREEN('[OK]'));

const installProgress = intervalProgress('Installing dependencies...');
await execShellCommand(`pnpm i -C=${dir}`);
installProgress(inCYAN('Installed dependencies'), inGREEN('[OK]'));

updateStatus(inGREEN('Kwoka PKG setup successfully'));

console.log('Enjoy your new pkg!');
console.log(`Just 'cd ${dir}' and Enjoy!!!`);

console.timeEnd('PKG Setup');
