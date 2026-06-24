import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PATHS } from '../config/paths.mjs';
import { render } from './lib/mini-template.mjs';
import { buildSeoLinks, buildOgTwitterTags } from './lib/seo-head.mjs';
import { buildPage } from './lib/build-page.mjs';
import { renderPageTemplate } from './lib/render-built.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const PAGE_PATH = PATHS.origin.landing;

const PKG_ROMANS = ['I', 'II', 'III', 'IV'];
const en = JSON.parse(fs.readFileSync(path.join(root, 'locales', 'origin', 'en.json'), 'utf8'));
const enBuilt = {
  ...en,
  services: {
    ...en.services,
    packages: en.services.packages.map((p, i) => ({
      ...p,
      roman: PKG_ROMANS[i] ?? '',
      btnClass: p.featured ? 'btn btn-light' : 'btn btn-ghost',
      btnHtml: p.featured ? en.services.packageCtaArrow : en.services.packageCta,
    })),
  },
};

const html = renderPageTemplate(root, 'origin-page.njk', {
  ...enBuilt,
  pageStylesheet: 'origin-site.css',
  contactPath: PATHS.origin.contact,
  seoLinks: buildSeoLinks(PAGE_PATH),
  ogTwitterTags: buildOgTwitterTags({
    title: enBuilt.title,
    metaDescription: enBuilt.metaDescription,
    pagePath: PAGE_PATH,
    lang: 'en',
  }),
});

buildPage(root, {
  outputFile: 'origin/index.html',
  localeDir: 'origin',
  assetFiles: [
    'kairos-tokens.css',
    'kairos-shared.css',
    'origin-site.css',
    'origin-i18n.js',
    'origin-locale.js',
    'interactions.js',
  ],
  html,
});

console.log('Built public/origin/index.html (English HTML + locales in public/locales/origin/)');
