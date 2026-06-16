import { applyLocale } from './study-korea-i18n.js';
import { initHashScrollRestoration, scrollToHashAfterLocale } from './hash-scroll.js';

initHashScrollRestoration();

const STORAGE_KEY = 'kairos-lang';
const SUPPORTED = ['en', 'ko', 'zh', 'th', 'vi'];

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
  const res = await fetch(`/locales/study-korea/${code}.json`);
  if (!res.ok) throw new Error(`Locale ${code} not found`);
  return res.json();
}

function loadFontStylesheet(href) {
  return new Promise((resolve) => {
    const absolute = new URL(href, window.location.href).href;
    let link = document.getElementById('study-korea-fonts');
    if (link && link.href === absolute) {
      resolve();
      return;
    }
    if (!link) {
      link = document.createElement('link');
      link.id = 'study-korea-fonts';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.onload = () => resolve();
    link.onerror = () => resolve();
    link.href = href;
    if (link.sheet) resolve();
  });
}

async function setLang(code) {
  document.body.classList.add('i18n-loading');
  try {
    const data = await loadLocale(code);
    await loadFontStylesheet(data.fontsHref);
    sessionStorage.setItem(STORAGE_KEY, code);
    applyLocale(data);
    syncLangToUrl(code);
    scrollToHashAfterLocale();
  } finally {
    document.body.classList.remove('i18n-loading');
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
