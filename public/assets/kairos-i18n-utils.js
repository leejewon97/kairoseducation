import { CONTACTS, PKG_ROMANS } from './langs.js';

export { PKG_ROMANS };

export function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const PACKAGE_CTA_FALLBACK = {
  en: 'Get started',
  ko: '시작하기',
  zh: '立即开始',
  th: 'เริ่มต้น',
  vi: 'Bắt đầu',
};

const WA_ICON_PATH =
  'M16.04 4C9.96 4 5 8.94 5 15.02c0 2.13.6 4.1 1.64 5.8L5 28l7.36-1.6c1.13.62 2.4.95 3.68.95h.01C22.12 27.35 27 22.4 27 16.33 27 10.25 22.12 4 16.04 4zm0 21.35h-.01c-1.16 0-2.3-.31-3.3-.9l-.24-.14-3.9.85.83-3.8-.16-.25a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.16 8.16 0 0 1 2.42 5.83c0 4.54-3.7 8.24-8.25 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.69-.8-.23-.08-.39-.12-.56.13-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.38-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.25 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z';

export function whatsappIconSvg(size) {
  return `<svg class="btn-ic" viewBox="0 0 32 32" width="${size}" height="${size}" fill="currentColor" aria-hidden="true"><path d="${WA_ICON_PATH}"/></svg>`;
}

export const LANG_FLAGS = {
  en: '🇺🇸',
  ko: '🇰🇷',
  zh: '🇨🇳',
  th: '🇹🇭',
  vi: '🇻🇳',
};

const LANG_UI = {
  en: { flag: '🇺🇸', label: 'English' },
  ko: { flag: '🇰🇷', label: '한국어' },
  zh: { flag: '🇨🇳', label: '中文' },
  th: { flag: '🇹🇭', label: 'ภาษาไทย' },
  vi: { flag: '🇻🇳', label: 'Tiếng Việt' },
};

export function setHtml(sel, html) {
  const el = document.querySelector(sel);
  if (el) el.innerHTML = html ?? '';
}

export function setText(sel, text) {
  const el = document.querySelector(sel);
  if (el) el.textContent = text ?? '';
}

export function setTextAll(sel, text) {
  document.querySelectorAll(sel).forEach((el) => {
    el.textContent = text ?? '';
  });
}

export function renderMarqueeTrack(items) {
  if (!items?.length) return '';
  const segment = items
    .map((name) => `<span class="sep">◆</span><span class="ms">${esc(name)}</span>`)
    .join('');
  return `${segment}<span class="marquee-dup" aria-hidden="true">${segment}</span>`;
}

export function renderWorries(items) {
  return items
    .map((item, i) => {
      const delay = i % 2 === 1 ? ' style="transition-delay:.08s"' : '';
      return `<div class="worry reveal"${delay}>
      <div class="wic">✓</div>
      <div>
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.desc)}</p>
      </div>
    </div>`;
    })
    .join('');
}

export function renderProofStats(stats) {
  return stats
    .map(
      (s) => `<div class="stat">
      <div class="sk">${esc(s.value)}</div>
      <div class="sl">${esc(s.label)}</div>
    </div>`
    )
    .join('');
}

export function renderFaq(items) {
  return items
    .map(
      (f) => `<div class="faq-item">
      <button class="faq-q" type="button">
        <span>${esc(f.q)}</span>
        <span class="faq-ic" aria-hidden="true"></span>
      </button>
      <div class="faq-a"><p>${f.a}</p></div>
    </div>`
    )
    .join('');
}

export function bindFaqToggle() {
  document.querySelectorAll('.faq-q').forEach((btn) => {
    btn.onclick = () => {
      const item = btn.closest('.faq-item');
      const answer = item?.querySelector('.faq-a');
      if (!item || !answer) return;

      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach((el) => {
        el.classList.remove('open');
        const a = el.querySelector('.faq-a');
        if (a) a.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    };
  });
}

export function renderContactChat(cta) {
  return `<a class="btn btn-kakao" href="${CONTACTS.kakao}" target="_blank" rel="noopener">${cta.kakaoConsult}</a>
    <a class="btn btn-whatsapp" href="${CONTACTS.whatsapp}" target="_blank" rel="noopener" aria-label="${esc(cta.whatsappConsult)}">${whatsappIconSvg(17)} <span>${esc(cta.whatsappConsult)}</span></a>`;
}

export function renderStickyWhatsApp(label) {
  return `${whatsappIconSvg(16)} ${esc(label)}`;
}

export function renderExpectSteps(steps) {
  return steps
    .map((step, i) => {
      const num = String(i + 1).padStart(2, '0');
      return `<div class="expect-step">
      <span class="expect-n">${num}</span>
      <div>
        <h4>${esc(step.title)}</h4>
        <p>${esc(step.desc)}</p>
      </div>
    </div>`;
    })
    .join('');
}

export function renderFooterLinks(items) {
  return items.map((i) => `<a href="${esc(i.href)}">${esc(i.text)}</a>`).join('');
}

export function renderLangSwitcher(links) {
  return links
    .map((l) => {
      const flag = LANG_FLAGS[l.code] || '';
      return `<div class="lang-opt" data-switch-lang="${esc(l.code)}" role="button" tabindex="0">
        <span class="flag">${flag}</span>
        <span>${esc(l.label)}</span>
      </div>`;
    })
    .join('');
}

export function renderHeroCta(contactUrl, secondaryHref, primaryCta, secondaryCta) {
  return `<a href="${contactUrl}" class="btn btn-navy">${primaryCta}</a>
    <a href="${secondaryHref}" class="btn btn-ghost">${esc(secondaryCta)}</a>`;
}

export function renderSelectOptions(options, placeholder) {
  const ph = placeholder ? `<option value="">${esc(placeholder)}</option>` : '';
  return ph + options.map((o) => `<option>${esc(o)}</option>`).join('');
}

export function renderGradeOptions(grades) {
  return grades.map((g) => `<option>${esc(g)}</option>`).join('');
}

export function syncLangUi(code) {
  const ui = LANG_UI[code] || LANG_UI.en;
  const flag = document.querySelector('.lang-btn .flag');
  const cur = document.getElementById('langCur');
  if (flag) flag.textContent = ui.flag;
  if (cur) cur.textContent = ui.label;
  document.querySelectorAll('.lang-opt').forEach((opt) => {
    opt.classList.toggle('sel', opt.getAttribute('data-switch-lang') === code);
  });
}
