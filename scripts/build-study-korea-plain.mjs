import path from 'path';
import { fileURLToPath } from 'url';
import { getPageBuild } from '../config/pages.mjs';
import { writeLangsJs } from './lib/write-langs-js.mjs';
import { writeSeoFiles } from './lib/write-seo-files.mjs';
import { copyAllAssets } from './lib/build-page.mjs';
import { buildSitePage } from './lib/build-site-page.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

writeLangsJs(root);
writeSeoFiles(root);
copyAllAssets(root);
buildSitePage(root, getPageBuild('study-korea'), { copyAssets: false });
console.log('Built public/study-korea/index.html (English HTML + locales in public/locales/study-korea/)');
