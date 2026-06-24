import path from 'path';
import { fileURLToPath } from 'url';
import { getPageBuild } from '../config/pages.mjs';
import { writeLangsJs } from './lib/write-langs-js.mjs';
import { writeSeoFiles } from './lib/write-seo-files.mjs';
import { copyAllAssets } from './lib/build-page.mjs';
import { buildSitePage } from './lib/build-site-page.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const pageId = process.argv[2];
if (!pageId) {
  console.error('Usage: node scripts/build-one.mjs <page-id>');
  console.error('  e.g. origin, origin-contact, study-korea, study-korea-contact, index');
  process.exit(1);
}

writeLangsJs(root);
writeSeoFiles(root);
copyAllAssets(root);

const page = getPageBuild(pageId);
const output = buildSitePage(root, page, { copyAssets: false });
console.log(`Built public/${output}`);
