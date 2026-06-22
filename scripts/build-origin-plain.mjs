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
  const formNote = data.contact.formNote || '';
  return `<form name="contact" class="form reveal" data-contact-form method="POST" data-netlify="true" netlify-honeypot="bot-field" style="transition-delay:.1s">
        <input type="hidden" name="form-name" value="contact" />
        <input type="hidden" name="language" value="${data.lang}" />
        <input type="hidden" name="bot-field" />
        <div class="field-row">
          <div class="field">
            <label>${f.nameLabel}</label>
            <input type="text" name="name" placeholder="${f.namePlaceholder}" />
          </div>
          <div class="field">
            <label>${f.gradeLabel}</label>
            <select name="grade">${grades}</select>
          </div>
        </div>
        <div class="field">
          <label>${f.emailLabel}</label>
          <input type="email" name="email" placeholder="${f.emailPlaceholder}" />
        </div>
        <div class="field">
          <label>${f.universitiesLabel}</label>
          <input type="text" name="universities" placeholder="${f.universitiesPlaceholder}" />
        </div>
        <div class="field">
          <label>${f.messageLabel}</label>
          <textarea name="message" placeholder="${f.messagePlaceholder}"></textarea>
        </div>
        <button type="submit" class="btn btn-navy form-submit">${f.submit}</button>
        <p class="form-note">${formNote}</p>
      </form>`;
}

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

console.log('Built public/origin.html (English HTML + locales in public/locales/origin/)');
