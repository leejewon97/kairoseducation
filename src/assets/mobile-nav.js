import { PATHS, CONTACTS } from './langs.js';
import { whatsappIconSvg } from './kairos-i18n-utils.js';

function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function langQuery() {
  try {
    const lang =
      sessionStorage.getItem('kairos-lang') ||
      new URLSearchParams(window.location.search).get('lang');
    if (lang && lang !== 'en') return `?lang=${encodeURIComponent(lang)}`;
  } catch (_) {
    /* ignore */
  }
  return '';
}

export function originSectionLinks(nav, base = '') {
  return [
    { href: `${base}#results`, label: nav.results },
    { href: `${base}#us-worries`, label: nav.why },
    { href: `${base}#about`, label: nav.about },
    { href: `${base}#us-process`, label: nav.process },
    { href: `${base}#packages`, label: nav.packages },
    { href: `${base}#faq`, label: nav.faq },
  ];
}

export function studyKoreaSectionLinks(nav, base = '') {
  return [
    { href: `${base}#why-korea`, label: nav.whyKorea },
    { href: `${base}#pathways`, label: nav.pathways },
    { href: `${base}#packages`, label: nav.packages },
    { href: `${base}#faq`, label: nav.faq },
  ];
}

/**
 * @param {{ page: 'origin' | 'study-korea', mobileMenu: object, sectionLinks: Array<{href:string,label:string}>, hideBookCta?: boolean }} opts
 */
export function buildMobileMenuHtml({ page, mobileMenu, sectionLinks, hideBookCta = false }) {
  const q = langQuery();
  const usActive = page === 'origin' ? ' active' : '';
  const krActive = page === 'study-korea' ? ' active' : '';
  const contactUrl = page === 'origin' ? PATHS.origin.contact : PATHS.studyKorea.contact;

  let html =
    `<div class="mm-routes">` +
    `<a class="mm-route${usActive}" href="${PATHS.origin.landing}${q}">${esc(mobileMenu.studyUs)}</a>` +
    `<a class="mm-route${krActive}" href="${PATHS.studyKorea.landing}${q}">${esc(mobileMenu.studyKorea)}</a>` +
    `</div><div class="mm-div"></div>`;

  html += sectionLinks
    .map((l) => `<a href="${esc(l.href)}" class="mm-link" data-mm-section>${esc(l.label)}</a>`)
    .join('');

  html += `<div class="mm-cta-wrap">`;
  if (!hideBookCta) {
    html += `<a class="btn btn-navy" href="${contactUrl}" data-mm-book>${esc(mobileMenu.bookCta)}</a>`;
  }
  html +=
    `<a class="btn btn-kakao" href="${CONTACTS.kakao}" target="_blank" rel="noopener" data-mm-kakao>💬 ${esc(mobileMenu.kakaoCta)}</a>` +
    `<a class="btn btn-whatsapp" href="${CONTACTS.whatsapp}" target="_blank" rel="noopener" data-mm-whatsapp aria-label="${esc(mobileMenu.whatsappCta)}">${whatsappIconSvg(17)} <span>${esc(mobileMenu.whatsappCta)}</span></a>` +
    `</div>`;

  return html;
}
