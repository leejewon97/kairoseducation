import { updateSeoMeta } from './seo-i18n.js';

function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const PACKAGE_CTA_FALLBACK = {
  en: 'Get Started',
  ko: '시작하기',
  zh: '立即开始',
  th: 'เริ่มต้น',
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
    .map(
      (item, i) => {
        const delay = i % 2 === 1 ? ' style="transition-delay:.08s"' : '';
        return `<div class="worry reveal"${delay}>
      <div class="wic">✓</div>
      <div>
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.desc)}</p>
      </div>
    </div>`;
      }
    )
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

function renderAdmitShowcase(showcase, admitLabel) {
  return showcase
    .map((item, i) => {
      const active = i === 0 ? ' is-active' : '';
      const meta = `${esc(item.school)} · ${esc(item.year)} · ${esc(admitLabel)}`;
      return `<figure class="admit${active}">
      <img src="${esc(item.image)}" alt="${esc(item.imageAlt || '')}" loading="lazy" />
      <figcaption>
        <span class="admit-name">${esc(item.name)}</span>
        <span class="admit-meta">${meta}</span>
      </figcaption>
    </figure>`;
    })
    .join('');
}

function renderResults(tiers) {
  return tiers
    .map(
      (tier) => `<p class="tier-label">${esc(tier.label)}</p>
    <div class="results-grid" style="margin-bottom: 40px;">
      ${tier.universities
        .map((uni) => {
          const dot = uni.intl
            ? '<div class="tier-dot" style="background:#6B7280"></div>'
            : `<div class="tier-dot tier-${uni.tier}"></div>`;
          const inner = `<div class="uni-tier">${dot}</div>
        <div class="uni-name">${esc(uni.name)}</div>
        <div class="uni-detail">${esc(uni.detail)}</div>`;
          if (uni.nicheUrl) {
            return `<a class="uni-card" href="${esc(uni.nicheUrl)}" target="_blank" rel="noopener">${inner}</a>`;
          }
          return `<div class="uni-card">${inner}</div>`;
        })
        .join('')}
    </div>`
    )
    .join('');
}

function renderPackages(packages, packageCta, packageCtaArrow) {
  const cards = packages
    .map((pkg, i) => {
      const featureCls = pkg.featured ? ' feature' : '';
      const badge = pkg.badge ? `<div class="pkg-tag">${esc(pkg.badge)}</div>` : '';
      const features = pkg.features.map((f) => `<li>${esc(f)}</li>`).join('');
      const roman = PKG_ROMANS[i] ?? '';
      const btnCls = pkg.featured ? 'btn btn-light' : 'btn btn-ghost';
      const ctaLabel = pkg.featured ? packageCtaArrow : esc(packageCta);
      const krw = pkg.max ? `<div class="pkg-krw">${esc(pkg.max)}</div>` : '';
      const delay = i % 2 === 1 ? ' style="transition-delay:.08s"' : '';
      return `<div class="pkg${featureCls} reveal"${delay}>
      ${badge}
      <div class="pkg-num">${roman}</div>
      <div class="pkg-name">${esc(pkg.name)}</div>
      <div class="pkg-best">${esc(pkg.best)}</div>
      <div class="pkg-desc">${esc(pkg.desc)}</div>
      <ul class="pkg-list">${features}</ul>
      <div class="pkg-foot">
        <div class="pkg-price">${esc(pkg.price)}</div>
        ${krw}
        <div class="pkg-meta">${esc(pkg.meta)}</div>
        <a href="#contact" data-view="contact" class="${btnCls}">${ctaLabel}</a>
      </div>
    </div>`;
    })
    .join('');
  return cards;
}

function renderAlacarte(rows) {
  return rows
    .map((r) => {
      const krw = r.krw
        ? `<span class="pr krw">${esc(r.krw)}</span>`
        : '';
      return `<div class="ala-row">
      <span class="nm">${esc(r.service)}</span>
      <span class="ldr"></span>
      <span class="pr">${esc(r.usd)}</span>
      ${krw}
    </div>`;
    })
    .join('');
}

function renderProcessSteps(steps) {
  return steps
    .map((step, i) => {
      const num = String(i + 1).padStart(2, '0');
      return `<div class="step reveal">
      <div class="step-n">${num}</div>
      <div>
        <h3>${esc(step.title)}</h3>
        <p>${esc(step.desc)}</p>
      </div>
    </div>`;
    })
    .join('');
}

function renderTestimonials(testimonials) {
  const cards = testimonials.items
    .map((t) => {
      const initial = (t.by || '?').trim().charAt(0).toUpperCase();
      return `<div class="testi">
      <div class="qt">${esc(t.quote)}</div>
      <div class="who">
        <div class="av">${esc(initial)}</div>
        <div class="at">${esc(t.by)}</div>
      </div>
    </div>`;
    })
    .join('');
  const note = testimonials.note
    ? `<p class="testi-note">${esc(testimonials.note)}</p>`
    : '';
  return `<div class="sec-head center">
    <div class="eyebrow">${esc(testimonials.eyebrow)}</div>
    <h2>${testimonials.title ?? ''}</h2>
  </div>
  <div class="testi-grid">${cards}</div>
  ${note}`;
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

function renderAbout(about) {
  const paragraphs = (about.paragraphs || [])
    .map((p) => `<p>${esc(p)}</p>`)
    .join('');
  const quote = about.quote
    ? `<div class="about-quote">
      <div class="q">${esc(about.quote.text)}</div>
      <div class="by">${esc(about.quote.by)}</div>
    </div>`
    : '';
  const reassure = about.reassure
    ? `<p class="about-reassure">${esc(about.reassure)}</p>`
    : '';
  return `${paragraphs}${quote}${reassure}`;
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

function renderMobileNavLinks(nav) {
  const links = [
    { href: '#results', label: nav.results },
    { href: '#us-worries', label: nav.why },
    { href: '#about', label: nav.about },
    { href: '#us-process', label: nav.process },
    { href: '#packages', label: nav.packages },
    { href: '#faq', label: nav.faq },
    { href: '#contact', label: nav.contact, view: 'contact' },
  ];
  return links.map((l) => `<a href="${esc(l.href)}" class="mm-link"${l.view ? ` data-view="${esc(l.view)}"` : ''}>${esc(l.label)}</a>`).join('');
}

function renderHeroCta(primaryCta, secondaryCta) {
  return `<a href="#contact" data-view="contact" class="btn btn-navy">${primaryCta}</a>
    <a href="#results" class="btn btn-ghost">${esc(secondaryCta)}</a>`;
}

function renderGradeOptions(grades) {
  return grades.map((g) => `<option>${esc(g)}</option>`).join('');
}

function applyContactForm(contact, lang) {
  const f = contact.form;
  const root = document.querySelector('[data-contact-form]');
  if (!root) return;
  const langInput = root.querySelector('input[name="language"]');
  if (langInput) langInput.value = lang;
  const labels = root.querySelectorAll('.field label');
  const fields = [
    f.nameLabel,
    f.gradeLabel,
    f.emailLabel,
    f.universitiesLabel,
    f.messageLabel,
  ];
  labels.forEach((el, i) => {
    if (fields[i]) el.textContent = fields[i];
  });
  const nameIn = root.querySelector('input[name="name"]');
  const emailIn = root.querySelector('input[name="email"]');
  const uniIn = root.querySelector('input[name="universities"]');
  const msgIn = root.querySelector('textarea[name="message"]');
  if (nameIn) nameIn.placeholder = f.namePlaceholder;
  if (emailIn) emailIn.placeholder = f.emailPlaceholder;
  if (uniIn) uniIn.placeholder = f.universitiesPlaceholder;
  if (msgIn) msgIn.placeholder = f.messagePlaceholder;
  const sel = root.querySelector('select[name="grade"]');
  if (sel) sel.innerHTML = renderGradeOptions(f.grades);
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
  updateSeoMeta(data, '/origin.html');
  if (data.fontFamily) {
    document.body.style.fontFamily = data.fontFamily;
  }

  setHtml('#mount-scarcity', data.scarcity);

  setText('#mount-nav-why', data.nav.why);
  setText('#mount-nav-results', data.nav.results);
  setText('#mount-nav-process', data.nav.process);
  setText('#mount-nav-packages', data.nav.packages);
  setText('#mount-nav-about', data.nav.about);
  setText('#mount-nav-faq', data.nav.faq);
  setText('#mount-nav-contact', data.nav.contact);
  setTextAll('[data-nav-cta]', data.nav.cta);

  const langSwitcher = document.getElementById('mount-lang-switcher');
  if (langSwitcher) langSwitcher.innerHTML = renderLangSwitcher(data.langLinks);

  const mobileLinks = document.getElementById('mount-mobile-links');
  if (mobileLinks) mobileLinks.innerHTML = renderMobileNavLinks(data.nav);

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

  setText('#mount-proof-eyebrow', data.proof.eyebrow);
  setHtml('#mount-proof-title', data.proof.title);
  setText('#mount-proof-sub', data.proof.sub);
  setHtml('#mount-proof-stats', renderProofStats(data.proof.stats));
  setText('#mount-proof-note', data.proof.note);

  setText('#mount-results-tag', data.results.tag);
  setHtml('#mount-results-title', data.results.title);
  setText('#mount-results-sub', data.results.sub);

  const admitEl = document.getElementById('admitShowcase');
  if (admitEl) {
    admitEl.innerHTML = renderAdmitShowcase(data.results.admitShowcase, data.results.admit);
  }

  setHtml('#mount-results-tiers', renderResults(data.results.tiers));
  setText('#mount-results-note', data.results.legend);

  setText('#mount-process-tag', data.process.tag);
  setHtml('#mount-process-title', data.process.title);
  setText('#mount-process-lead', data.process.lead);
  setHtml('#mount-process-steps', renderProcessSteps(data.process.steps));

  const testiSection = document.getElementById('us-testimonials');
  if (testiSection && data.testimonials?.hidden) {
    testiSection.style.display = 'none';
  }

  setText('#mount-packages-tag', data.services.tag);
  setHtml('#mount-packages-title', data.services.title);
  setText('#mount-packages-sub', data.services.sub);
  setText('#mount-packages-note', data.services.priceNote);

  const packageCta =
    data.services?.packageCta ?? PACKAGE_CTA_FALLBACK[data.lang] ?? PACKAGE_CTA_FALLBACK.en;
  const packageCtaArrow =
    data.services?.packageCtaArrow ?? `${packageCta} <span class="arrow">→</span>`;
  setHtml(
    '#mount-packages-grid',
    renderPackages(data.services.packages, packageCta, packageCtaArrow)
  );

  setText('#mount-alc-title', data.services.alacarteHeading);
  setText('#mount-alc-sub', data.services.alacarteSub);
  const alaList = document.querySelector('#mount-alacarte .ala-list');
  if (alaList) alaList.innerHTML = renderAlacarte(data.services.alacarte);

  const noteEl = document.getElementById('mount-alacarte-foot');
  if (noteEl) {
    const note = data.services.alacarteNote ?? '';
    noteEl.textContent = note;
    noteEl.style.display = note ? '' : 'none';
  }

  setText('#mount-about-name', data.about.name);
  setText('#mount-about-role', data.about.role);
  setText('#mount-about-tag', data.about.tag);
  setHtml('#mount-about-title', data.about.title);
  setHtml('#mount-about-blocks', renderAbout(data.about));

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

  applyContactForm(data.contact, data.lang);

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
