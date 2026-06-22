import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { render } from './lib/mini-template.mjs';
import { buildPage } from './lib/build-page.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const INDEX_ASSETS = [
  'kairos-tokens.css',
  'kairos-shared.css',
  'index-site.css',
  'index-locale.js',
  'interactions.js',
];

function copyIndexImages(rootDir) {
  const srcDir = path.join(rootDir, 'src', 'assets', 'img');
  const destDir = path.join(rootDir, 'public', 'assets', 'img');
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const name of fs.readdirSync(srcDir)) {
    fs.copyFileSync(path.join(srcDir, name), path.join(destDir, name));
  }
}

const tpl = fs.readFileSync(path.join(root, 'src', 'templates', 'index-page.njk'), 'utf8');
const en = JSON.parse(fs.readFileSync(path.join(root, 'locales', 'index', 'en.json'), 'utf8'));
const html = render(tpl, en);

buildPage(root, {
  outputFile: 'index.html',
  localeDir: 'index',
  assetFiles: INDEX_ASSETS,
  html,
  copyFavicon: false,
});

copyIndexImages(root);

console.log('Built public/index.html (English HTML + locales in public/locales/index/)');
