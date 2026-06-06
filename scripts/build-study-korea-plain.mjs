import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { render } from './lib/mini-template.mjs';
import { buildSeoLinks, buildOgTwitterTags } from './lib/seo-head.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const langs = ['en', 'ko', 'zh', 'th', 'vi'];

const tpl = fs.readFileSync(path.join(root, 'src', 'templates', 'study-korea-page.njk'), 'utf8');

function renderStudyKoreaForm(data) {
  const f = data.contact.form;
  const goals = f.goals.map((g) => `<option>${g}</option>`).join('');
  const levels = f.koreanLevels.map((l) => `<option>${l}</option>`).join('');
  return `<form name="study-korea" class="contact-form" data-study-korea-form method="POST" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="study-korea" />
        <input type="hidden" name="language" value="${data.lang}" />
        <input type="hidden" name="bot-field" />
        <div class="form-row">
          <div class="form-group">
            <label>${f.nameLabel}</label>
            <input type="text" name="name" placeholder="${f.namePlaceholder}" required />
          </div>
          <div class="form-group">
            <label>${f.countryLabel}</label>
            <input type="text" name="country" placeholder="${f.countryPlaceholder}" />
          </div>
        </div>
        <div class="form-group">
          <label>${f.emailLabel}</label>
          <input type="email" name="email" placeholder="${f.emailPlaceholder}" required />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>${f.goalLabel}</label>
            <select name="goal">
              <option value="">${f.goalPlaceholder}</option>
              ${goals}
            </select>
          </div>
          <div class="form-group">
            <label>${f.koreanLevelLabel}</label>
            <select name="korean_level">
              <option value="">${f.koreanLevelPlaceholder}</option>
              ${levels}
            </select>
          </div>
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

const en = JSON.parse(fs.readFileSync(path.join(root, 'locales', 'study-korea', 'en.json'), 'utf8'));
const formsHtml = renderStudyKoreaForm(en);
const html = render(tpl, {
  ...en,
  netlifyFormsHtml: formsHtml,
  seoLinks: buildSeoLinks('/study-korea.html'),
  ogTwitterTags: buildOgTwitterTags({
    title: en.title,
    metaDescription: en.metaDescription,
    pagePath: '/study-korea.html',
    lang: 'en',
  }),
});

fs.mkdirSync(path.join(root, 'public', 'assets'), { recursive: true });
fs.mkdirSync(path.join(root, 'public', 'locales', 'study-korea'), { recursive: true });

fs.copyFileSync(
  path.join(root, 'src', 'assets', 'study-korea-site.css'),
  path.join(root, 'public', 'assets', 'study-korea-site.css')
);
fs.copyFileSync(
  path.join(root, 'src', 'assets', 'study-korea-i18n.js'),
  path.join(root, 'public', 'assets', 'study-korea-i18n.js')
);
fs.copyFileSync(
  path.join(root, 'src', 'assets', 'study-korea-locale.js'),
  path.join(root, 'public', 'assets', 'study-korea-locale.js')
);
fs.copyFileSync(path.join(root, 'src', 'assets', 'seo-i18n.js'), path.join(root, 'public', 'assets', 'seo-i18n.js'));
fs.copyFileSync(path.join(root, 'src', 'assets', 'kairos_logo.png'), path.join(root, 'public', 'assets', 'kairos_logo.png'));

for (const code of langs) {
  fs.copyFileSync(
    path.join(root, 'locales', 'study-korea', `${code}.json`),
    path.join(root, 'public', 'locales', 'study-korea', `${code}.json`)
  );
}

fs.writeFileSync(path.join(root, 'public', 'study-korea.html'), html);
console.log('Built public/study-korea.html (English HTML + locales in public/locales/study-korea/)');
