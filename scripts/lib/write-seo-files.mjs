import fs from 'fs';
import path from 'path';
import { SITE, LANGS } from '../../config/langs.mjs';
import { PATHS } from '../../config/paths.mjs';

function langUrl(pagePath, lang) {
  const base = `${SITE}${pagePath}`;
  if (lang === 'en') return base;
  const sep = pagePath.includes('?') ? '&' : '?';
  return `${base}${sep}lang=${lang}`;
}

export function writeSeoFiles(root) {
  const publicDir = path.join(root, 'public');

  fs.writeFileSync(
    path.join(publicDir, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`
  );

  const pages = [
    '/',
    PATHS.origin.landing,
    PATHS.origin.contact,
    PATHS.studyKorea.landing,
    PATHS.studyKorea.contact,
  ];

  const urls = [];
  for (const pagePath of pages) {
    for (const lang of LANGS) {
      urls.push(langUrl(pagePath, lang));
    }
  }

  const body = urls
    .map((loc) => `  <url>\n    <loc>${loc}</loc>\n  </url>`)
    .join('\n');

  fs.writeFileSync(
    path.join(publicDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
  );
}
