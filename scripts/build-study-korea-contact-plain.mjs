import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PATHS } from '../config/paths.mjs';
import { render } from './lib/mini-template.mjs';
import { buildSeoLinks, buildOgTwitterTags } from './lib/seo-head.mjs';
import { buildPage } from './lib/build-page.mjs';
import { renderStudyKoreaContactForm } from './lib/netlify-forms.mjs';
import { renderContactChatHtml } from './lib/contact-chat.mjs';
import { loadTemplate } from './lib/expand-includes.mjs';
import { withContacts } from './lib/contacts.mjs';
import { renderPageTemplate } from './lib/render-built.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const PAGE_PATH = PATHS.studyKorea.contact;

const contactBodyTpl = loadTemplate(root, 'includes/contact-body.njk');

const en = JSON.parse(fs.readFileSync(path.join(root, 'locales', 'study-korea', 'en.json'), 'utf8'));
const formsHtml = renderStudyKoreaContactForm(en);
const contactChatHtml = renderContactChatHtml(en.cta);
const contactBodyHtml = render(
  contactBodyTpl,
  withContacts({ ...en, netlifyFormsHtml: formsHtml, contactChatHtml })
);

const html = renderPageTemplate(root, 'study-korea-contact-page.njk', {
  ...en,
  pageStylesheet: 'origin-site.css',
  extraStylesheet: 'study-korea-site.css',
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
