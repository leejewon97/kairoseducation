import { SITE, LANGS, OG_LOCALE, OG_IMAGE } from './langs.js';

export { SITE, LANGS, OG_LOCALE, OG_IMAGE };

export function pageUrl(pagePath, lang) {
  return `${SITE}${pagePath}?lang=${lang}`;
}

function setMetaProperty(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaName(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function updateSeoMeta(data, pagePath) {
  const lang = data.code || 'en';
  const url = pageUrl(pagePath, lang);

  if (data.metaDescription) {
    setMetaName('description', data.metaDescription);
  }

  setMetaProperty('og:title', data.title);
  if (data.metaDescription) setMetaProperty('og:description', data.metaDescription);
  setMetaProperty('og:image', OG_IMAGE);
  setMetaProperty('og:url', url);
  setMetaProperty('og:type', 'website');
  setMetaProperty('og:locale', OG_LOCALE[lang] || OG_LOCALE.en);

  document.querySelectorAll('meta[property="og:locale:alternate"]').forEach((n) => n.remove());
  LANGS.filter((c) => c !== lang).forEach((c) => {
    const el = document.createElement('meta');
    el.setAttribute('property', 'og:locale:alternate');
    el.setAttribute('content', OG_LOCALE[c]);
    document.head.appendChild(el);
  });

  setMetaName('twitter:card', 'summary');
  setMetaName('twitter:title', data.title);
  if (data.metaDescription) setMetaName('twitter:description', data.metaDescription);
  setMetaName('twitter:image', OG_IMAGE);

  setCanonical(url);
}
