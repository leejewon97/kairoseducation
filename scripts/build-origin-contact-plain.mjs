import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PATHS } from '../config/paths.mjs';
import { render } from './lib/mini-template.mjs';
import { buildSeoLinks, buildOgTwitterTags } from './lib/seo-head.mjs';
import { buildPage } from './lib/build-page.mjs';
import { renderOriginContactForm } from './lib/netlify-forms.mjs';
import { renderContactChatHtml } from './lib/contact-chat.mjs';
import { loadTemplate } from './lib/expand-includes.mjs';
import { withContacts } from './lib/contacts.mjs';
import { renderPageTemplate } from './lib/render-built.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const PAGE_PATH = PATHS.origin.contact;

const contactBodyTpl = loadTemplate(root, 'includes/contact-body.njk');

const en = JSON.parse(fs.readFileSync(path.join(root, 'locales', 'origin', 'en.json'), 'utf8'));
const formsHtml = renderOriginContactForm(en);
const contactChatHtml = renderContactChatHtml(en.cta);
const contactBodyHtml = render(
  contactBodyTpl,
  withContacts({ ...en, netlifyFormsHtml: formsHtml, contactChatHtml })
);

const html = renderPageTemplate(root, 'origin-contact-page.njk', {
  ...en,
  pageStylesheet: 'origin-site.css',
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
  outputFile: 'origin/contact.html',
  localeDir: 'origin',
  assetFiles: ['kairos-tokens.css', 'kairos-shared.css', 'origin-site.css', 'origin-i18n.js', 'origin-locale.js'],
  html,
});

console.log('Built public/origin/contact.html');
