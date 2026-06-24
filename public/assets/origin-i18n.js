import { updateSeoMeta, contactSeoTitle } from './seo-i18n.js';
import { PATHS } from './langs.js';
import { buildMobileMenuHtml, originSectionLinks } from './mobile-nav.js';
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
  renderGradeOptions,
  syncLangUi,
} from './kairos-i18n-utils.js';

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
  return packages
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
        <a href="${PATHS.origin.contact}" class="${btnCls}">${ctaLabel}</a>
      </div>
    </div>`;
    })
    .join('');
}

function renderAlacarte(rows) {
  return rows
    .map((r) => {
      const krw = r.krw ? `<span class="pr krw">${esc(r.krw)}</span>` : '';
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
  const note = testimonials.note ? `<p class="testi-note">${esc(testimonials.note)}</p>` : '';
  return `<div class="sec-head center">
    <div class="eyebrow">${esc(testimonials.eyebrow)}</div>
    <h2>${testimonials.title ?? ''}</h2>
  </div>
  <div class="testi-grid">${cards}</div>
  ${note}`;
}

function renderAbout(about) {
  const paragraphs = (about.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join('');
  const quote = about.quote
    ? `<div class="about-quote">
      <div class="q">${esc(about.quote.text)}</div>
      <div class="by">${esc(about.quote.by)}</div>
    </div>`
    : '';
  const reassure = about.reassure ? `<p class="about-reassure">${esc(about.reassure)}</p>` : '';
  return `${paragraphs}${quote}${reassure}`;
}

function applyContactForm(contact, lang) {
  const f = contact.form;
  const root = document.querySelector('[data-contact-form]');
  if (!root) return;
  const langInput = root.querySelector('input[name="language"]');
  if (langInput) langInput.value = lang;
  const labels = root.querySelectorAll('.field label');
  const fields = [f.nameLabel, f.gradeLabel, f.emailLabel, f.universitiesLabel, f.messageLabel];
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

export function applyLocale(data) {
  document.documentElement.lang = data.lang;
  document.title = data.title;
  updateSeoMeta(data, PATHS.origin.landing);
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
  if (mobileLinks && data.mobileMenu) {
    mobileLinks.innerHTML = buildMobileMenuHtml({
      page: 'origin',
      mobileMenu: data.mobileMenu,
      sectionLinks: originSectionLinks(data.nav),
    });
  }

  setText('#mount-hero-badge', data.hero.badge);
  setHtml('#mount-hero-h1', data.hero.h1);
  setText('#mount-hero-lead', data.hero.lead);
  setHtml(
    '#mount-hero-cta',
    renderHeroCta(PATHS.origin.contact, '#results', data.hero.primaryCta, data.hero.secondaryCta)
  );
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
  setHtml('#mount-packages-grid', renderPackages(data.services.packages, packageCta, packageCtaArrow));

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
  updateSeoMeta({ ...data, seoTitle }, PATHS.origin.contact);
  if (data.fontFamily) {
    document.body.style.fontFamily = data.fontFamily;
  }

  const langSwitcher = document.getElementById('mount-lang-switcher');
  if (langSwitcher) langSwitcher.innerHTML = renderLangSwitcher(data.langLinks);

  const mobileLinks = document.getElementById('mount-mobile-links');
  if (mobileLinks && data.mobileMenu) {
    mobileLinks.innerHTML = buildMobileMenuHtml({
      page: 'origin',
      mobileMenu: data.mobileMenu,
      sectionLinks: originSectionLinks(data.nav, PATHS.origin.landing),
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

  applyContactForm(data.contact, data.lang);

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
