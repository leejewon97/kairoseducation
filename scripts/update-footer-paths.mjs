import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LANGS } from '../config/langs.mjs';
import { PATHS } from '../config/paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function updateOriginFooter(data) {
  data.footer.col1 = data.footer.col1.map((item) => ({
    ...item,
    href: item.href.startsWith('#')
      ? `${PATHS.origin.landing}${item.href}`
      : item.href.replace('/origin#', '/origin/#'),
  }));
  data.footer.col2 = data.footer.col2.map((item) => ({
    ...item,
    href: item.href
      .replace('/study-korea.html#', `${PATHS.studyKorea.landing}#`)
      .replace('/study-korea#', `${PATHS.studyKorea.landing}#`),
  }));
  return data;
}

function updateStudyKoreaFooter(data) {
  data.footer.col1 = data.footer.col1.map((item) => ({
    ...item,
    href: item.href.startsWith('#')
      ? `${PATHS.studyKorea.landing}${item.href}`
      : item.href.replace('/study-korea#', '/study-korea/#'),
  }));
  data.footer.col2 = data.footer.col2.map((item) => ({
    ...item,
    href: item.href
      .replace('/origin.html#', `${PATHS.origin.landing}#`)
      .replace('/origin#', `${PATHS.origin.landing}#`),
  }));
  return data;
}

for (const code of LANGS) {
  const originPath = path.join(root, 'locales', 'origin', `${code}.json`);
  const origin = JSON.parse(fs.readFileSync(originPath, 'utf8'));
  fs.writeFileSync(originPath, JSON.stringify(updateOriginFooter(origin), null, 2) + '\n');

  const krPath = path.join(root, 'locales', 'study-korea', `${code}.json`);
  const kr = JSON.parse(fs.readFileSync(krPath, 'utf8'));
  fs.writeFileSync(krPath, JSON.stringify(updateStudyKoreaFooter(kr), null, 2) + '\n');
}

console.log('Updated footer hrefs in origin and study-korea locales (5 languages).');
