import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { render } from './lib/mini-template.mjs';
import { buildSeoLinks, buildOgTwitterTags } from './lib/seo-head.mjs';
import { buildPage } from './lib/build-page.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const tpl = fs.readFileSync(path.join(root, 'src', 'templates', 'origin-page.njk'), 'utf8');

function renderNetlifyForm(data) {
  const f = data.contact.form;
  const grades = f.grades.map((g) => `<option>${g}</option>`).join('');
  return `<form name="contact" class="contact-form" data-contact-form method="POST" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="contact" />
        <input type="hidden" name="language" value="${data.lang}" />
        <input type="hidden" name="bot-field" />
        <div class="form-row">
          <div class="form-group">
            <label>${f.nameLabel}</label>
            <input type="text" name="name" placeholder="${f.namePlaceholder}" />
          </div>
          <div class="form-group">
            <label>${f.gradeLabel}</label>
            <select name="grade">${grades}</select>
          </div>
        </div>
        <div class="form-group">
          <label>${f.emailLabel}</label>
          <input type="email" name="email" placeholder="${f.emailPlaceholder}" />
        </div>
        <div class="form-group">
          <label>${f.universitiesLabel}</label>
          <input type="text" name="universities" placeholder="${f.universitiesPlaceholder}" />
        </div>
        <div class="form-group">
          <label>${f.messageLabel}</label>
          <textarea name="message" placeholder="${f.messagePlaceholder}"></textarea>
        </div>
        <button type="submit" class="form-submit">${f.submit}</button>
      </form>`;
}

const PKG_ROMANS = ['I', 'II', 'III', 'IV'];
const en = JSON.parse(fs.readFileSync(path.join(root, 'locales', 'origin', 'en.json'), 'utf8'));
const enBuilt = {
  ...en,
  services: {
    ...en.services,
    packages: en.services.packages.map((p, i) => ({ ...p, roman: PKG_ROMANS[i] ?? '' })),
  },
};
const formsHtml = renderNetlifyForm(enBuilt);

const html = render(tpl, {
  ...enBuilt,
  netlifyFormsHtml: formsHtml,
  seoLinks: buildSeoLinks('/origin.html'),
  ogTwitterTags: buildOgTwitterTags({
    title: enBuilt.title,
    metaDescription: enBuilt.metaDescription,
    pagePath: '/origin.html',
    lang: 'en',
  }),
});

buildPage(root, {
  outputFile: 'origin.html',
  localeDir: 'origin',
  assetFiles: ['origin-site.css', 'origin-i18n.js', 'origin-locale.js'],
  html,
});

console.log('Built public/origin.html (English HTML + locales in public/locales/origin/)');
