import { updateSeoMeta, contactSeoTitle } from './seo-i18n.js';
import { PATHS } from './langs.js';
import { buildMobileMenuHtml, studyKoreaSectionLinks } from './mobile-nav.js';
import {
  esc,
  PACKAGE_CTA_FALLBACK,
  PKG_ROMANS,
  setHtml,
  setText,
  setTextAll,
  renderMarqueeTrack,
  renderWorries,
  renderProofStats,
  renderFaq,
  bindFaqToggle,
  renderContactChat,
  renderStickyWhatsApp,
  renderExpectSteps,
  renderFooterLinks,
  renderLangSwitcher,
  renderHeroCta,
  renderSelectOptions,
  syncLangUi,
} from './kairos-i18n-utils.js';

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

function renderPathways(items) {
  return items
    .map((p, i) => {
      const featureCls = p.featured ? ' feature' : '';
      const details = (p.details || []).map((d) => `<li>${esc(d)}</li>`).join('');
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
  setHtml(
    '#mount-hero-cta',
    renderHeroCta(
      PATHS.studyKorea.contact,
      '#pathways',
      data.hero.primaryCta,
      data.hero.secondaryCta
    )
  );
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
  setHtml('#mount-packages-grid', renderPackages(data.packages.items, packageCta, packageCtaArrow));

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
  const seoTitle = contactSeoTitle(data);
  document.title = seoTitle;
  updateSeoMeta({ ...data, seoTitle }, PATHS.studyKorea.contact);
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
