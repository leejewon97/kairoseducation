import { updateSeoMeta } from './seo-i18n.js';
import { PATHS } from './langs.js';
import { buildMobileMenuHtml, studyKoreaSectionLinks } from './mobile-nav.js';

function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const PACKAGE_CTA_FALLBACK = {
  en: 'Get started',
  ko: '시작하기',
  zh: 'Get started',
  th: 'Get started',
  vi: 'Get started',
};

const PKG_ROMANS = ['I', 'II', 'III', 'IV'];

const WA_ICON_PATH =
  'M16.04 4C9.96 4 5 8.94 5 15.02c0 2.13.6 4.1 1.64 5.8L5 28l7.36-1.6c1.13.62 2.4.95 3.68.95h.01C22.12 27.35 27 22.4 27 16.33 27 10.25 22.12 4 16.04 4zm0 21.35h-.01c-1.16 0-2.3-.31-3.3-.9l-.24-.14-3.9.85.83-3.8-.16-.25a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.16 8.16 0 0 1 2.42 5.83c0 4.54-3.7 8.24-8.25 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.69-.8-.23-.08-.39-.12-.56.13-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.38-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.25 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z';

function whatsappIconSvg(size) {
  return `<svg class="btn-ic" viewBox="0 0 32 32" width="${size}" height="${size}" fill="currentColor" aria-hidden="true"><path d="${WA_ICON_PATH}"/></svg>`;
}

const LANG_FLAGS = {
  en: '🇺🇸',
  ko: '🇰🇷',
  zh: '🇨🇳',
  th: '🇹🇭',
  vi: '🇻🇳',
};

function setHtml(sel, html) {
  const el = document.querySelector(sel);
  if (el) el.innerHTML = html ?? '';
}

function setText(sel, text) {
  const el = document.querySelector(sel);
  if (el) el.textContent = text ?? '';
}

function setTextAll(sel, text) {
  document.querySelectorAll(sel).forEach((el) => {
    el.textContent = text ?? '';
  });
}

function renderMarqueeTrack(items) {
  if (!items?.length) return '';
  const segment = items
    .map((name) => `<span class="sep">◆</span><span class="ms">${esc(name)}</span>`)
    .join('');
  return `${segment}<span class="marquee-dup" aria-hidden="true">${segment}</span>`;
}

function renderWorries(items) {
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

function renderWhyCards(cards) {
  return cards
    .map((card, i) => {
      const delay =
        i % 3 === 1 ? ' style="transition-delay:.08s"' : i % 3 === 2 ? ' style="transition-delay:.16s"' : '';
      return `<div class="step reveal"${delay}>
      <div class="step-n" style="font-size:1.1rem">${esc(card.icon)}</div>
      <div>
        <h3>${esc(card.title)}</h3>
        <p>${esc(card.desc)}</p>
      </div>
    </div>`;
    })
    .join('');
}

function renderProofStats(stats) {
  return stats
    .map(
      (s) => `<div class="stat">
      <div class="sk">${esc(s.value)}</div>
      <div class="sl">${esc(s.label)}</div>
    </div>`
    )
    .join('');
}

function renderPathways(items) {
  return items
    .map((p, i) => {
      const featureCls = p.featured ? ' feature' : '';
      const details = (p.details || [])
        .map((d) => `<li>${esc(d)}</li>`)
        .join('');
      const delay = i % 2 === 1 ? ' style="transition-delay:.08s"' : i === 2 ? ' style="transition-delay:.16s"' : '';
      return `<div class="pkg${featureCls} reveal"${delay}>
      <span class="pkg-num">${esc(p.num)}</span>
      <div class="pkg-name">${esc(p.name)}</div>
      <div class="pkg-best">${esc(p.best)}</div>
      <div class="pkg-desc">${esc(p.desc)}</div>
      <ul class="pkg-list">${details}</ul>
    </div>`;
    })
    .join('');
}

function renderUniChips(groups) {
  return groups
    .map(
      (group) => `<div class="uni-group reveal">
      <p class="uni-group-label">${esc(group.label)}</p>
      <div class="uni-grid">${(group.universities || [])
        .map(
          (u) => `<div class="uni-card">
        <div class="uni-flag">${esc(u.flag)}</div>
        <div class="uni-rank">${esc(u.rank)}</div>
        <div class="uni-name">${esc(u.name)}</div>
        <div class="uni-detail">${esc(u.detail)}</div>
      </div>`
        )
        .join('')}</div>
    </div>`
    )
    .join('');
}

function renderPackages(packages, packageCta, packageCtaArrow) {
  return packages
    .map((pkg, i) => {
      const featureCls = pkg.featured ? ' feature' : '';
      const badge = pkg.badge ? `<span class="pkg-tag">${esc(pkg.badge)}</span>` : '';
      const features = pkg.features.map((f) => `<li>${esc(f)}</li>`).join('');
      const roman = PKG_ROMANS[i] ?? '';
      const btnCls = pkg.featured ? 'btn btn-light' : 'btn btn-ghost';
      const ctaLabel = pkg.featured ? packageCtaArrow : esc(packageCta);
      const krw = pkg.max ? `<div class="pkg-krw">${esc(pkg.max)}</div>` : '';
      const delay = i % 2 === 1 ? ' style="transition-delay:.08s"' : i === 2 ? ' style="transition-delay:.16s"' : '';
      return `<div class="pkg${featureCls} reveal"${delay}>
      ${badge}
      <span class="pkg-num">${roman}</span>
      <div class="pkg-name">${esc(pkg.name)}</div>
      <div class="pkg-best">${esc(pkg.best)}</div>
      <div class="pkg-desc">${esc(pkg.desc)}</div>
      <ul class="pkg-list">${features}</ul>
      <div class="pkg-foot">
        <div class="pkg-price">${esc(pkg.price)}</div>
        ${krw}
        <div class="pkg-meta">${esc(pkg.meta)}</div>
        <a href="${PATHS.studyKorea.contact}" class="${btnCls}">${ctaLabel}</a>
      </div>
    </div>`;
    })
    .join('');
}

function renderTermsList(items) {
  return items.map((t) => `<li>${esc(t)}</li>`).join('');
}

function renderFaq(items) {
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

function bindFaqToggle() {
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

function renderContactChat(cta) {
  return `<a class="btn btn-kakao" href="http://pf.kakao.com/_uWJKX" target="_blank" rel="noopener">${cta.kakaoConsult}</a>
    <a class="btn btn-whatsapp" href="https://wa.me/0000000000" target="_blank" rel="noopener" aria-label="${esc(cta.whatsappConsult)}">${whatsappIconSvg(17)} <span>${esc(cta.whatsappConsult)}</span></a>`;
}

function renderStickyWhatsApp(label) {
  return `${whatsappIconSvg(16)} ${esc(label)}`;
}

function renderExpectSteps(steps) {
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

function renderFooterLinks(items) {
  return items.map((i) => `<a href="${esc(i.href)}">${esc(i.text)}</a>`).join('');
}

function renderLangSwitcher(links) {
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

function renderHeroCta(primaryCta, secondaryCta) {
  return `<a href="${PATHS.studyKorea.contact}" class="btn btn-navy">${primaryCta}</a>
    <a href="#pathways" class="btn btn-ghost">${esc(secondaryCta)}</a>`;
}

function renderSelectOptions(options, placeholder) {
  const ph = placeholder ? `<option value="">${esc(placeholder)}</option>` : '';
  return ph + options.map((o) => `<option>${esc(o)}</option>`).join('');
}

function applyStudyKoreaForm(contact, lang) {
  const f = contact.form;
  const root = document.querySelector('[data-study-korea-form]');
  if (!root) return;
  const langInput = root.querySelector('input[name="language"]');
  if (langInput) langInput.value = lang;
  const labels = root.querySelectorAll('.field label');
  const labelTexts = [
    f.nameLabel,
    f.countryLabel,
    f.emailLabel,
    f.goalLabel,
    f.koreanLevelLabel,
    f.universitiesLabel,
    f.messageLabel,
  ];
  let li = 0;
  labels.forEach((el) => {
    if (labelTexts[li]) el.textContent = labelTexts[li];
    li += 1;
  });
  const nameIn = root.querySelector('input[name="name"]');
  const countryIn = root.querySelector('input[name="country"]');
  const emailIn = root.querySelector('input[name="email"]');
  const uniIn = root.querySelector('input[name="universities"]');
  const msgIn = root.querySelector('textarea[name="message"]');
  if (nameIn) nameIn.placeholder = f.namePlaceholder;
  if (countryIn) countryIn.placeholder = f.countryPlaceholder;
  if (emailIn) emailIn.placeholder = f.emailPlaceholder;
  if (uniIn) uniIn.placeholder = f.universitiesPlaceholder;
  if (msgIn) msgIn.placeholder = f.messagePlaceholder;
  const goalSel = root.querySelector('select[name="goal"]');
  if (goalSel) goalSel.innerHTML = renderSelectOptions(f.goals, f.goalPlaceholder);
  const levelSel = root.querySelector('select[name="korean_level"]');
  if (levelSel) levelSel.innerHTML = renderSelectOptions(f.koreanLevels, f.koreanLevelPlaceholder);
  const submit = root.querySelector('.form-submit');
  if (submit) submit.innerHTML = f.submit;
  const formNote = root.querySelector('.form-note');
  if (formNote && contact.formNote) formNote.textContent = contact.formNote;
}

const LANG_UI = {
  en: { flag: '🇺🇸', label: 'English' },
  ko: { flag: '🇰🇷', label: '한국어' },
  zh: { flag: '🇨🇳', label: '中文' },
  th: { flag: '🇹🇭', label: 'ภาษาไทย' },
  vi: { flag: '🇻🇳', label: 'Tiếng Việt' },
};

function syncLangUi(code) {
  const ui = LANG_UI[code] || LANG_UI.en;
  const flag = document.querySelector('.lang-btn .flag');
  const cur = document.getElementById('langCur');
  if (flag) flag.textContent = ui.flag;
  if (cur) cur.textContent = ui.label;
  document.querySelectorAll('.lang-opt').forEach((opt) => {
    opt.classList.toggle('sel', opt.getAttribute('data-switch-lang') === code);
  });
}

export function applyLocale(data) {
  document.documentElement.lang = data.lang;
  document.title = data.title;
  updateSeoMeta(data, PATHS.studyKorea.landing);
  if (data.fontFamily) {
    document.body.style.fontFamily = data.fontFamily;
  }

  if (data.scarcity) {
    setHtml('#mount-scarcity', data.scarcity);
  }

  setText('#mount-nav-why-korea', data.nav.whyKorea);
  setText('#mount-nav-pathways', data.nav.pathways);
  setText('#mount-nav-packages', data.nav.packages);
  setText('#mount-nav-faq', data.nav.faq);
  setTextAll('[data-nav-cta]', data.nav.cta);

  const langSwitcher = document.getElementById('mount-lang-switcher');
  if (langSwitcher) langSwitcher.innerHTML = renderLangSwitcher(data.langLinks);

  const mobileLinks = document.getElementById('mount-mobile-links');
  if (mobileLinks && data.mobileMenu) {
    mobileLinks.innerHTML = buildMobileMenuHtml({
      page: 'study-korea',
      mobileMenu: data.mobileMenu,
      sectionLinks: studyKoreaSectionLinks(data.nav),
    });
  }

  setText('#mount-hero-badge', data.hero.badge);
  setHtml('#mount-hero-h1', data.hero.h1);
  setText('#mount-hero-lead', data.hero.lead);
  setHtml('#mount-hero-cta', renderHeroCta(data.hero.primaryCta, data.hero.secondaryCta));
  setText('#mount-hero-authority', data.hero.authority);
  const marqueeTrack = document.querySelector('#mount-hero-marquee .marquee-track');
  if (marqueeTrack) marqueeTrack.innerHTML = renderMarqueeTrack(data.hero.marquee);

  setText('#mount-worries-tag', data.worries.tag);
  setHtml('#mount-worries-title', data.worries.title);
  setText('#mount-worries-lead', data.worries.lead);
  setHtml('#mount-worries-grid', renderWorries(data.worries.items));
  setText('#mount-worries-foot', data.worries.foot);

  setText('#mount-why-tag', data.why.tag);
  setHtml('#mount-why-title', data.why.title);
  setText('#mount-why-sub', data.why.sub);
  setHtml('#mount-why-grid', renderWhyCards(data.why.cards));

  setText('#mount-proof-eyebrow', data.proof.eyebrow);
  setText('#mount-proof-title', data.proof.title);
  setText('#mount-proof-sub', data.proof.sub);
  setHtml('#mount-proof-stats', renderProofStats(data.proof.stats));
  setText('#mount-proof-note', data.proof.note);

  setText('#mount-pathways-tag', data.pathways.tag);
  setHtml('#mount-pathways-title', data.pathways.title);
  setText('#mount-pathways-sub', data.pathways.sub);
  setHtml('#mount-pathway-grid', renderPathways(data.pathways.items));

  setText('#mount-uni-tag', data.universities.tag);
  setHtml('#mount-uni-title', data.universities.title);
  setText('#mount-uni-sub', data.universities.sub);
  setHtml('#mount-uni-groups', renderUniChips(data.universities.groups));
  setText('#mount-uni-footnote', data.universities.footnote);

  setText('#mount-packages-tag', data.packages.tag);
  setHtml('#mount-packages-title', data.packages.title);
  setText('#mount-packages-sub', data.packages.sub);
  setText('#mount-packages-note', data.packages.priceNote);

  const packageCta =
    data.packages?.packageCta ?? PACKAGE_CTA_FALLBACK[data.lang] ?? PACKAGE_CTA_FALLBACK.en;
  const packageCtaArrow =
    data.packages?.packageCtaArrow ?? `${packageCta} <span class="arrow">→</span>`;
  setHtml(
    '#mount-packages-grid',
    renderPackages(data.packages.items, packageCta, packageCtaArrow)
  );

  setText('#mount-terms-payment-title', data.packages.terms.payment.title);
  setHtml('#mount-terms-payment', renderTermsList(data.packages.terms.payment.items));
  setText('#mount-terms-promise-title', data.packages.terms.promise.title);
  setHtml('#mount-terms-promise', renderTermsList(data.packages.terms.promise.items));

  if (data.faq) {
    setText('#mount-faq-tag', data.faq.tag);
    setHtml('#mount-faq-title', data.faq.title);
    setHtml('#mount-faq-list', renderFaq(data.faq.items));
    bindFaqToggle();
  }

  if (data.videoCta) {
    setText('#mount-video-cta-title', data.videoCta.title);
    setText('#mount-video-cta-sub', data.videoCta.sub);
    setText('#mount-video-cta-btn', data.videoCta.cta);
    const poster = document.querySelector('#video-cta .video-cta-bg');
    if (poster && data.videoCta.poster) {
      poster.src = data.videoCta.poster;
    }
  }

  if (data.sticky) {
    setHtml('#mount-sticky-msg', data.sticky.msg);
    setText('#mount-sticky-get-started', data.sticky.getStarted);
    setText('#mount-sticky-book', data.sticky.bookFree);
    setHtml('#mount-sticky-kakao', data.sticky.kakao);
    setHtml('#mount-sticky-whatsapp', renderStickyWhatsApp(data.sticky.whatsapp));
  }

  setText('#mount-footer-tagline', data.footer.tagline);
  setText('#mount-footer-col1-heading', data.footer.col1Heading);
  setHtml('#mount-footer-col1', renderFooterLinks(data.footer.col1));
  setText('#mount-footer-col2-heading', data.footer.col2Heading);
  setHtml('#mount-footer-col2', renderFooterLinks(data.footer.col2));
  setText('#mount-footer-copyright', data.footer.copyright);
  setHtml('#mount-footer-meta', data.footer.meta);
  setText('#mount-footer-disc', data.footer.disc);

  syncLangUi(data.lang);
}

export function applyContactLocale(data) {
  document.documentElement.lang = data.lang;
  document.title = data.title;
  updateSeoMeta(data, PATHS.studyKorea.contact);
  if (data.fontFamily) {
    document.body.style.fontFamily = data.fontFamily;
  }

  const langSwitcher = document.getElementById('mount-lang-switcher');
  if (langSwitcher) langSwitcher.innerHTML = renderLangSwitcher(data.langLinks);

  const mobileLinks = document.getElementById('mount-mobile-links');
  if (mobileLinks && data.mobileMenu) {
    mobileLinks.innerHTML = buildMobileMenuHtml({
      page: 'study-korea',
      mobileMenu: data.mobileMenu,
      sectionLinks: studyKoreaSectionLinks(data.nav, PATHS.studyKorea.landing),
      hideBookCta: true,
    });
  }

  setText('#mount-contact-tag', data.contact.tag);
  setHtml('#mount-contact-title', data.contact.title);
  setText('#mount-contact-sub', data.contact.sub);
  setText('#mount-expect-title', data.contact.expect.title);
  setHtml('#mount-expect-steps', renderExpectSteps(data.contact.expect.steps));
  setText('#mount-email-label', data.contact.emailLabel);
  setText('#mount-location-label', data.contact.locationLabel);
  setText('#mount-location', data.contact.location);

  const chatEl = document.getElementById('mount-contact-chat');
  if (chatEl && data.cta) chatEl.innerHTML = renderContactChat(data.cta);

  applyStudyKoreaForm(data.contact, data.lang);

  setText('#mount-footer-tagline', data.footer.tagline);
  setText('#mount-footer-col1-heading', data.footer.col1Heading);
  setHtml('#mount-footer-col1', renderFooterLinks(data.footer.col1));
  setText('#mount-footer-col2-heading', data.footer.col2Heading);
  setHtml('#mount-footer-col2', renderFooterLinks(data.footer.col2));
  setText('#mount-footer-copyright', data.footer.copyright);
  setHtml('#mount-footer-meta', data.footer.meta);
  setText('#mount-footer-disc', data.footer.disc);

  syncLangUi(data.lang);
}
