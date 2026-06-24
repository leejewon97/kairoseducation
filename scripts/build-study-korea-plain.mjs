import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PATHS } from '../config/paths.mjs';
import { buildSeoLinks, buildOgTwitterTags } from './lib/seo-head.mjs';
import { buildPage } from './lib/build-page.mjs';
import { renderPageTemplate } from './lib/render-built.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const PAGE_PATH = PATHS.studyKorea.landing;

const PKG_ROMANS = ['I', 'II', 'III', 'IV'];
const en = JSON.parse(fs.readFileSync(path.join(root, 'locales', 'study-korea', 'en.json'), 'utf8'));
const enBuilt = {
  ...en,
  packages: {
    ...en.packages,
    items: en.packages.items.map((p, i) => ({
      ...p,
      roman: PKG_ROMANS[i] ?? '',
      btnClass: p.featured ? 'btn btn-light' : 'btn btn-ghost',
      btnHtml: p.featured ? en.packages.packageCtaArrow : en.packages.packageCta,
    })),
  },
};

const html = renderPageTemplate(root, 'study-korea-page.njk', {
  ...enBuilt,
  pageStylesheet: 'origin-site.css',
  extraStylesheet: 'study-korea-site.css',
  contactPath: PATHS.studyKorea.contact,
  seoLinks: buildSeoLinks(PAGE_PATH),
  ogTwitterTags: buildOgTwitterTags({
    title: enBuilt.title,
    metaDescription: enBuilt.metaDescription,
    pagePath: PAGE_PATH,
    lang: 'en',
  }),
});

buildPage(root, {
  outputFile: 'study-korea/index.html',
  localeDir: 'study-korea',
  assetFiles: [
    'kairos-tokens.css',
    'kairos-shared.css',
    'origin-site.css',
    'study-korea-site.css',
    'study-korea-i18n.js',
    'study-korea-locale.js',
    'interactions.js',
  ],
  html,
  copyFavicon: false,
});

console.log('Built public/study-korea/index.html (English HTML + locales in public/locales/study-korea/)');
