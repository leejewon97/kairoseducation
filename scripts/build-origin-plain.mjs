import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { render } from './lib/mini-template.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const langs = ['en', 'ko', 'zh', 'th'];

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

const en = JSON.parse(fs.readFileSync(path.join(root, 'locales', 'origin', 'en.json'), 'utf8'));
const formsHtml = renderNetlifyForm(en);

const html = render(tpl, { ...en, netlifyFormsHtml: formsHtml });

fs.mkdirSync(path.join(root, 'public', 'assets'), { recursive: true });
fs.mkdirSync(path.join(root, 'public', 'locales', 'origin'), { recursive: true });

fs.copyFileSync(path.join(root, 'src', 'assets', 'origin-site.css'), path.join(root, 'public', 'assets', 'origin-site.css'));
fs.copyFileSync(path.join(root, 'src', 'assets', 'origin-i18n.js'), path.join(root, 'public', 'assets', 'origin-i18n.js'));
fs.copyFileSync(path.join(root, 'src', 'assets', 'origin-locale.js'), path.join(root, 'public', 'assets', 'origin-locale.js'));
fs.copyFileSync(path.join(root, 'src', 'assets', 'kairos_logo.png'), path.join(root, 'public', 'assets', 'kairos_logo.png'));

for (const code of langs) {
  fs.copyFileSync(
    path.join(root, 'locales', 'origin', `${code}.json`),
    path.join(root, 'public', 'locales', 'origin', `${code}.json`)
  );
}

fs.writeFileSync(path.join(root, 'public', 'origin.html'), html);
console.log('Built public/origin.html (English HTML + locales in public/locales/origin/)');
