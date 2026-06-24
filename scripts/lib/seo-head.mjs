import { SITE, LANGS, HREFLANG, OG_LOCALE, OG_IMAGE } from '../../config/langs.mjs';

export { SITE, LANGS, HREFLANG, OG_LOCALE, OG_IMAGE };

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

export function pageUrl(pagePath, lang = 'en') {
  const base = `${SITE}${pagePath}`;
  return lang === 'en' ? `${base}?lang=en` : `${base}?lang=${lang}`;
}

export function buildSeoLinks(pagePath) {
  const lines = LANGS.map(
    (code) =>
      `  <link rel="alternate" hreflang="${HREFLANG[code]}" href="${pageUrl(pagePath, code)}" />`
  );
  lines.push(`  <link rel="alternate" hreflang="x-default" href="${pageUrl(pagePath, 'en')}" />`);
  lines.push(`  <link rel="canonical" href="${pageUrl(pagePath, 'en')}" />`);
  return lines.join('\n');
}

export function buildOgTwitterTags({ title, metaDescription, pagePath, lang = 'en' }) {
  const url = pageUrl(pagePath, lang);
  const t = escapeAttr(title);
  const d = escapeAttr(metaDescription);
  const locale = OG_LOCALE[lang] || OG_LOCALE.en;
  const alternates = LANGS.filter((c) => c !== lang)
    .map((c) => `  <meta property="og:locale:alternate" content="${OG_LOCALE[c]}" />`)
    .join('\n');

  return [
    `  <meta property="og:title" content="${t}" />`,
    `  <meta property="og:description" content="${d}" />`,
    `  <meta property="og:image" content="${OG_IMAGE}" />`,
    `  <meta property="og:image:width" content="1200" />`,
    `  <meta property="og:image:height" content="630" />`,
    `  <meta property="og:image:type" content="image/png" />`,
    `  <meta property="og:url" content="${url}" />`,
    `  <meta property="og:type" content="website" />`,
    `  <meta property="og:locale" content="${locale}" />`,
    alternates,
    `  <meta name="twitter:card" content="summary" />`,
    `  <meta name="twitter:title" content="${t}" />`,
    `  <meta name="twitter:description" content="${d}" />`,
    `  <meta name="twitter:image" content="${OG_IMAGE}" />`,
  ]
    .filter(Boolean)
    .join('\n');
}
