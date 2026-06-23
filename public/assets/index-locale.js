import { LANGS } from './langs.js';

const STORAGE_KEY = 'kairos-lang';

const localeCache = new Map();
let selectedLang = 'en';

const els = {
  h1: document.getElementById('landing-h1'),
  tag: document.getElementById('landing-tag'),
  langLabel: document.getElementById('lang-label'),
  pathLabel: document.getElementById('path-label'),
  enterLabels: document.querySelectorAll('.path-enter'),
  pathUs: document.getElementById('path-us'),
  pathKorea: document.getElementById('path-korea'),
  pathUsFlag: document.getElementById('path-us-flag'),
  pathUsTitle: document.getElementById('path-us-title'),
  pathUsDesc: document.getElementById('path-us-desc'),
  pathKoreaFlag: document.getElementById('path-korea-flag'),
  pathKoreaTitle: document.getElementById('path-korea-title'),
  pathKoreaDesc: document.getElementById('path-korea-desc'),
  langRow: document.getElementById('lang-row'),
  fontsLink: document.getElementById('fonts-link'),
};

async function loadLocale(code) {
  if (localeCache.has(code)) return localeCache.get(code);
  const res = await fetch(`/locales/index/${code}.json`);
  if (!res.ok) throw new Error(`Locale ${code} not found`);
  const data = await res.json();
  localeCache.set(code, data);
  return data;
}

function preloadOriginFont(href) {
  if (!href) return;
  let link = document.getElementById('origin-font-preload');
  if (!link) {
    link = document.createElement('link');
    link.id = 'origin-font-preload';
    link.rel = 'preload';
    link.as = 'style';
    document.head.appendChild(link);
  }
  link.href = href;
}

function syncLangToUrl(code) {
  if (!window.history.replaceState) return;
  const url = new URL(window.location.href);
  url.searchParams.set('lang', code);
  window.history.replaceState({}, '', url.pathname + url.search + url.hash);
}

function applyLocale(data, lang) {
  selectedLang = lang;
  sessionStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  syncLangToUrl(lang);

  if (data.fontsHref && els.fontsLink) {
    els.fontsLink.href = data.fontsHref;
  }
  preloadOriginFont(data.fontsHref);

  if (els.h1) els.h1.innerHTML = data.h1;
  if (els.tag) els.tag.textContent = data.tagline;
  if (els.langLabel) els.langLabel.textContent = data.langLabel;
  if (els.pathLabel) els.pathLabel.textContent = data.pathLabel;
  els.enterLabels.forEach((el) => {
    el.textContent = data.enter;
  });

  if (data.pathUs) {
    if (els.pathUsFlag) els.pathUsFlag.textContent = data.pathUs.flag;
    if (els.pathUsTitle) els.pathUsTitle.textContent = data.pathUs.title;
    if (els.pathUsDesc) els.pathUsDesc.textContent = data.pathUs.desc;
  }
  if (data.pathKorea) {
    if (els.pathKoreaFlag) els.pathKoreaFlag.textContent = data.pathKorea.flag;
    if (els.pathKoreaTitle) els.pathKoreaTitle.textContent = data.pathKorea.title;
    if (els.pathKoreaDesc) els.pathKoreaDesc.textContent = data.pathKorea.desc;
  }

  if (els.pathUs) els.pathUs.href = `/origin/?lang=${lang}`;
  if (els.pathKorea) els.pathKorea.href = `/study-korea/?lang=${lang}`;

  document.querySelectorAll('.lang-chip').forEach((chip) => {
    const isSel = chip.dataset.lang === lang;
    chip.classList.toggle('sel', isSel);
    chip.setAttribute('aria-pressed', isSel ? 'true' : 'false');
  });

  document.dispatchEvent(new CustomEvent('kairos:langchange', { detail: { lang } }));
}

async function setLanguage(lang) {
  if (!LANGS.includes(lang)) return;
  const data = await loadLocale(lang);
  applyLocale(data, lang);
}

els.langRow.addEventListener('click', (e) => {
  const chip = e.target.closest('[data-lang]');
  if (!chip) return;
  setLanguage(chip.dataset.lang).catch(() => {});
});

els.langRow.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const chip = e.target.closest('[data-lang]');
  if (!chip) return;
  e.preventDefault();
  setLanguage(chip.dataset.lang).catch(() => {});
});

const langParam = new URLSearchParams(window.location.search).get('lang');
const stored = sessionStorage.getItem(STORAGE_KEY);
const initial =
  (langParam && LANGS.includes(langParam) && langParam) ||
  (stored && LANGS.includes(stored) && stored) ||
  'en';

setLanguage(initial).catch(() => {});
