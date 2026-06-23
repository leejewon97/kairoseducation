import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { LANGS } from '../config/langs.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const LOCALE_DIRS = ['origin', 'study-korea', 'index'];

const ASSET_PAIRS = [
  'kairos-tokens.css',
  'kairos-shared.css',
  'index-site.css',
  'interactions.js',
  'origin-site.css',
  'origin-i18n.js',
  'origin-locale.js',
  'study-korea-site.css',
  'study-korea-i18n.js',
  'study-korea-locale.js',
  'hash-scroll.js',
  'seo-i18n.js',
  'langs.js',
  'mobile-nav.js',
  'index-locale.js',
];

function hashFile(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function compareLocaleDir(dir) {
  const mismatches = [];
  for (const code of LANGS) {
    const src = path.join(root, 'locales', dir, `${code}.json`);
    const dest = path.join(root, 'public', 'locales', dir, `${code}.json`);
    if (!fs.existsSync(dest)) {
      mismatches.push(`missing public/locales/${dir}/${code}.json`);
      continue;
    }
    if (hashFile(src) !== hashFile(dest)) {
      mismatches.push(`out of sync: locales/${dir}/${code}.json ↔ public/locales/${dir}/${code}.json`);
    }
  }
  return mismatches;
}

function compareAssets() {
  const mismatches = [];
  for (const name of ASSET_PAIRS) {
    const src = path.join(root, 'src', 'assets', name);
    const dest = path.join(root, 'public', 'assets', name);
    if (!fs.existsSync(src)) continue;
    if (!fs.existsSync(dest)) {
      mismatches.push(`missing public/assets/${name}`);
      continue;
    }
    if (hashFile(src) !== hashFile(dest)) {
      mismatches.push(`out of sync: src/assets/${name} ↔ public/assets/${name}`);
    }
  }
  return mismatches;
}

const errors = [];
for (const dir of LOCALE_DIRS) {
  errors.push(...compareLocaleDir(dir));
}
errors.push(...compareAssets());

if (errors.length) {
  console.error('verify-sync: build output is out of date:\n');
  for (const e of errors) console.error(`  - ${e}`);
  console.error('\nRun: node scripts/build-all.mjs');
  process.exit(1);
}

console.log('verify-sync: all locales and assets are in sync.');
