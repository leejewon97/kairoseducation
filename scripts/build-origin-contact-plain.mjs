import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PATHS } from '../config/paths.mjs';
import { render } from './lib/mini-template.mjs';
import { buildSeoLinks, buildOgTwitterTags } from './lib/seo-head.mjs';
import { buildPage } from './lib/build-page.mjs';
import { renderOriginContactForm } from './lib/netlify-forms.mjs';
import { renderContactChatHtml } from './lib/contact-chat.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const PAGE_PATH = PATHS.origin.contact;

const tpl = fs.readFileSync(path.join(root, 'src', 'templates', 'origin-contact-page.njk'), 'utf8');
const contactBodyTpl = fs.readFileSync(
  path.join(root, 'src', 'templates', 'includes', 'contact-body.njk'),
  'utf8'
);

const en = JSON.parse(fs.readFileSync(path.join(root, 'locales', 'origin', 'en.json'), 'utf8'));
const formsHtml = renderOriginContactForm(en);
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
  outputFile: 'origin/contact.html',
  localeDir: 'origin',
  assetFiles: ['kairos-tokens.css', 'kairos-shared.css', 'origin-site.css', 'origin-i18n.js', 'origin-locale.js'],
  html,
});

console.log('Built public/origin/contact.html');
