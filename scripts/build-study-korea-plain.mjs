import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { render } from './lib/mini-template.mjs';
import { buildSeoLinks, buildOgTwitterTags } from './lib/seo-head.mjs';
import { buildPage } from './lib/build-page.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const tpl = fs.readFileSync(path.join(root, 'src', 'templates', 'study-korea-page.njk'), 'utf8');

function renderStudyKoreaForm(data) {
  const f = data.contact.form;
  const goals = f.goals.map((g) => `<option>${g}</option>`).join('');
  const levels = f.koreanLevels.map((l) => `<option>${l}</option>`).join('');
  const formNote = data.contact.formNote || '';
  return `<form name="study-korea" class="form reveal" data-study-korea-form method="POST" data-netlify="true" netlify-honeypot="bot-field" style="transition-delay:.1s">
        <input type="hidden" name="form-name" value="study-korea" />
        <input type="hidden" name="language" value="${data.lang}" />
        <input type="hidden" name="bot-field" />
        <div class="field-row">
          <div class="field">
            <label>${f.nameLabel}</label>
            <input type="text" name="name" placeholder="${f.namePlaceholder}" required />
          </div>
          <div class="field">
            <label>${f.countryLabel}</label>
            <input type="text" name="country" placeholder="${f.countryPlaceholder}" />
          </div>
        </div>
        <div class="field">
          <label>${f.emailLabel}</label>
          <input type="email" name="email" placeholder="${f.emailPlaceholder}" required />
        </div>
        <div class="field-row">
          <div class="field">
            <label>${f.goalLabel}</label>
            <select name="goal">
              <option value="">${f.goalPlaceholder}</option>
              ${goals}
            </select>
          </div>
          <div class="field">
            <label>${f.koreanLevelLabel}</label>
            <select name="korean_level">
              <option value="">${f.koreanLevelPlaceholder}</option>
              ${levels}
            </select>
          </div>
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
const formsHtml = renderStudyKoreaForm(enBuilt);
const html = render(tpl, {
  ...enBuilt,
  netlifyFormsHtml: formsHtml,
  seoLinks: buildSeoLinks('/study-korea.html'),
  ogTwitterTags: buildOgTwitterTags({
    title: enBuilt.title,
    metaDescription: enBuilt.metaDescription,
    pagePath: '/study-korea.html',
    lang: 'en',
  }),
});

buildPage(root, {
  outputFile: 'study-korea.html',
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

console.log('Built public/study-korea.html (English HTML + locales in public/locales/study-korea/)');
