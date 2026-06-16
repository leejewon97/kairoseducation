import { LANGS } from './langs.js';

const STORAGE_KEY = 'kairos-lang';

const stepLang = document.getElementById('step-lang');
const stepTrack = document.getElementById('step-track');
let selectedLang = 'en';
const localeCache = new Map();

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

function applyTrackStep(data, lang) {
  const t = data.track;
  document.getElementById('lang-pill').textContent = t.pill;
  document.getElementById('track-subtitle').textContent = t.subtitle;
  const backBtn = document.getElementById('btn-back');
  backBtn.textContent = '← ' + t.back;
  backBtn.setAttribute('aria-label', data.backAria);
  document.getElementById('label-us').textContent = t.us;
  document.getElementById('sublabel-us').textContent = t.usSub;
  document.getElementById('label-kr').textContent = t.kr;
  document.getElementById('sublabel-kr').textContent = t.krSub;
  document.getElementById('track-origin').href = `/origin.html?lang=${lang}`;
  document.getElementById('track-kr').href = `/study-korea.html?lang=${lang}`;
}

async function showTrackStep(lang) {
  if (!LANGS.includes(lang)) return;
  selectedLang = lang;
  sessionStorage.setItem(STORAGE_KEY, selectedLang);
  const data = await loadLocale(lang);
  preloadOriginFont(data.fontsHref);
  applyTrackStep(data, selectedLang);
  stepLang.classList.remove('active');
  stepTrack.classList.add('active');
}

document.querySelectorAll('.lang-card').forEach((btn) => {
  btn.addEventListener('click', () => showTrackStep(btn.dataset.lang));
});

document.getElementById('btn-back').addEventListener('click', () => {
  stepTrack.classList.remove('active');
  stepLang.classList.add('active');
});

const langParam = new URLSearchParams(window.location.search).get('lang');
if (langParam && LANGS.includes(langParam)) {
  showTrackStep(langParam).catch(() => {});
}
