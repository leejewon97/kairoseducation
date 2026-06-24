import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PAGE_BUILDS } from '../config/pages.mjs';
import { writeLangsJs } from './lib/write-langs-js.mjs';
import { writeSeoFiles } from './lib/write-seo-files.mjs';
import { copyAllAssets } from './lib/build-page.mjs';
import { buildSitePage } from './lib/build-site-page.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

writeLangsJs(root);
writeSeoFiles(root);
copyAllAssets(root);

for (const page of PAGE_BUILDS) {
  const output = buildSitePage(root, page, { copyAssets: false });
  console.log(`Built public/${output}`);
}

for (const legacy of ['origin.html', 'study-korea.html']) {
  const p = path.join(root, 'public', legacy);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

const verify = spawnSync(process.execPath, [path.join(__dirname, 'verify-sync.mjs')], {
  cwd: root,
  stdio: 'inherit',
});
process.exit(verify.status ?? 1);
