import { applyLocale } from './origin-i18n.js';
import { initHashScrollRestoration, scrollToHashAfterLocale } from './hash-scroll.js';
import { LANGS } from './langs.js';

initHashScrollRestoration();

const STORAGE_KEY = 'kairos-lang';
const SUPPORTED = LANGS;

function resolveLang() {
  const q = new URLSearchParams(window.location.search).get('lang');
  if (q && SUPPORTED.includes(q)) {
    sessionStorage.setItem(STORAGE_KEY, q);
    return q;
  }
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED.includes(stored)) return stored;
  return 'en';
}

async function loadLocale(code) {
  const res = await fetch(`/locales/origin/${code}.json`);
  if (!res.ok) throw new Error(`Locale ${code} not found`);
  return res.json();
}

function loadFontStylesheet(href) {
  return new Promise((resolve) => {
    const absolute = new URL(href, window.location.href).href;
    let link = document.getElementById('origin-fonts');
    if (link && link.href === absolute) {
      resolve();
      return;
    }
    if (!link) {
      link = document.createElement('link');
      link.id = 'origin-fonts';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.onload = () => resolve();
    link.onerror = () => resolve();
    link.href = href;
    if (link.sheet) resolve();
  });
}

let langLoadSeq = 0;

async function setLang(code) {
  const seq = ++langLoadSeq;
  document.body.classList.add('i18n-loading');
  try {
    const data = await loadLocale(code);
    if (seq !== langLoadSeq) return;
    await loadFontStylesheet(data.fontsHref);
    if (seq !== langLoadSeq) return;
    sessionStorage.setItem(STORAGE_KEY, code);
    applyLocale(data);
    syncLangToUrl(code);
    scrollToHashAfterLocale();
    window.dispatchEvent(new CustomEvent('kairos:langchange', { detail: { lang: code } }));
  } finally {
    if (seq === langLoadSeq) document.body.classList.remove('i18n-loading');
  }
}

function syncLangToUrl(code) {
  if (!window.history.replaceState) return;
  const url = new URL(window.location.href);
  url.searchParams.set('lang', code);
  window.history.replaceState({}, '', url.pathname + url.search + url.hash);
}

document.getElementById('mount-lang-switcher')?.addEventListener('click', (e) => {
  const link = e.target.closest('[data-switch-lang]');
  if (!link) return;
  e.preventDefault();
  setLang(link.getAttribute('data-switch-lang'));
});

setLang(resolveLang()).catch(() => setLang('en'));
