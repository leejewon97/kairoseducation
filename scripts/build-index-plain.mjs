import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { render } from './lib/mini-template.mjs';
import { buildPage } from './lib/build-page.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const tpl = fs.readFileSync(path.join(root, 'src', 'templates', 'index-page.njk'), 'utf8');
const en = JSON.parse(fs.readFileSync(path.join(root, 'locales', 'index', 'en.json'), 'utf8'));
const html = render(tpl, en);

buildPage(root, {
  outputFile: 'index.html',
  localeDir: 'index',
  assetFiles: ['index-locale.js'],
  html,
  copyFavicon: false,
});

console.log('Built public/index.html (English HTML + locales in public/locales/index/)');
