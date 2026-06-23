import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PATHS } from '../config/paths.mjs';
import { render } from './lib/mini-template.mjs';
import { buildSeoLinks, buildOgTwitterTags } from './lib/seo-head.mjs';
import { buildPage } from './lib/build-page.mjs';
import { renderStudyKoreaContactForm } from './lib/netlify-forms.mjs';
import { renderContactChatHtml } from './lib/contact-chat.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const PAGE_PATH = PATHS.studyKorea.contact;

const tpl = fs.readFileSync(path.join(root, 'src', 'templates', 'study-korea-contact-page.njk'), 'utf8');
const contactBodyTpl = fs.readFileSync(
  path.join(root, 'src', 'templates', 'includes', 'contact-body.njk'),
  'utf8'
);

const en = JSON.parse(fs.readFileSync(path.join(root, 'locales', 'study-korea', 'en.json'), 'utf8'));
const formsHtml = renderStudyKoreaContactForm(en);
const contactChatHtml = renderContactChatHtml(en.cta);
const contactBodyHtml = render(contactBodyTpl, { ...en, netlifyFormsHtml: formsHtml, contactChatHtml });

const html = render(tpl, {
  ...en,
  contactBodyHtml,
  seoLinks: buildSeoLinks(PAGE_PATH),
  ogTwitterTags: buildOgTwitterTags({
    title: en.title,
    metaDescription: en.metaDescription,
    pagePath: PAGE_PATH,
    lang: 'en',
  }),
});

buildPage(root, {
  outputFile: 'study-korea/contact.html',
  localeDir: 'study-korea',
  assetFiles: [
    'kairos-tokens.css',
    'kairos-shared.css',
    'origin-site.css',
    'study-korea-site.css',
    'study-korea-i18n.js',
    'study-korea-locale.js',
  ],
  html,
  copyFavicon: false,
});

console.log('Built public/study-korea/contact.html');
