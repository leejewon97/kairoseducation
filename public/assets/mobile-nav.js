const KAKAO_URL = 'http://pf.kakao.com/_uWJKX';

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

export function originSectionLinks(nav) {
  return [
    { href: '#results', label: nav.results },
    { href: '#us-worries', label: nav.why },
    { href: '#about', label: nav.about },
    { href: '#us-process', label: nav.process },
    { href: '#packages', label: nav.packages },
    { href: '#faq', label: nav.faq },
  ];
}

export function studyKoreaSectionLinks(nav) {
  return [
    { href: '#why-korea', label: nav.whyKorea },
    { href: '#pathways', label: nav.pathways },
    { href: '#packages', label: nav.packages },
    { href: '#faq', label: nav.faq },
  ];
}

/**
 * @param {{ page: 'origin' | 'study-korea', mobileMenu: object, sectionLinks: Array<{href:string,label:string}> }} opts
 */
export function buildMobileMenuHtml({ page, mobileMenu, sectionLinks }) {
  const q = langQuery();
  const usActive = page === 'origin' ? ' active' : '';
  const krActive = page === 'study-korea' ? ' active' : '';

  let html =
    `<div class="mm-routes">` +
    `<a class="mm-route${usActive}" href="/origin.html${q}">${esc(mobileMenu.studyUs)}</a>` +
    `<a class="mm-route${krActive}" href="/study-korea.html${q}">${esc(mobileMenu.studyKorea)}</a>` +
    `</div><div class="mm-div"></div>`;

  html += sectionLinks
    .map((l) => `<a href="${esc(l.href)}" class="mm-link" data-mm-section>${esc(l.label)}</a>`)
    .join('');

  html +=
    `<div class="mm-cta-wrap">` +
    `<a class="btn btn-navy" href="#contact" data-view="contact" data-mm-book>${esc(mobileMenu.bookCta)}</a>` +
    `<a class="btn btn-kakao" href="${KAKAO_URL}" target="_blank" rel="noopener" data-mm-kakao>💬 ${esc(mobileMenu.kakaoCta)}</a>` +
    `</div>`;

  return html;
}
