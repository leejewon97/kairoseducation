import { updateSeoMeta } from './seo-i18n.js';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setHtml(sel, html) {
  const el = document.querySelector(sel);
  if (el) el.innerHTML = html ?? '';
}

function setText(sel, text) {
  const el = document.querySelector(sel);
  if (el) el.textContent = text ?? '';
}

function renderStats(stats) {
  return stats
    .map(
      (s) => `<div class="stat-item">
      <span class="stat-number">${esc(s.number)}</span>
      <span class="stat-label">${s.label}</span>
    </div>`
    )
    .join('');
}

function renderWhyCards(cards) {
  return cards
    .map(
      (c) => `<div class="why-card">
      <div class="why-icon">${c.icon}</div>
      <div class="why-title">${esc(c.title)}</div>
      <div class="why-desc">${esc(c.desc)}</div>
    </div>`
    )
    .join('');
}

function renderPathways(items) {
  return items
    .map(
      (p) => `<div class="pathway-card">
      <div class="pathway-num">${esc(p.num)}</div>
      <div class="pathway-letter">${esc(p.letter)}</div>
      <div class="pathway-title">${esc(p.title)}</div>
      <div class="pathway-visa">${esc(p.visa)}</div>
      <p class="pathway-desc">${esc(p.desc)}</p>
      <ul class="pathway-details">${p.details.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
    </div>`
    )
    .join('');
}

function renderUniGroups(groups) {
  return groups
    .map(
      (g) => `<p style="font-size:13px;font-weight:600;color:var(--gold);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:16px;">${esc(g.label)}</p>
  <div class="uni-grid" style="margin-bottom:40px;">
    ${g.universities
      .map(
        (u) => `<div class="uni-card">
      <div class="uni-flag">${u.flag}</div>
      <div class="uni-rank">${esc(u.rank)}</div>
      <div class="uni-name">${esc(u.name)}</div>
      <div class="uni-detail">${esc(u.detail)}</div>
    </div>`
      )
      .join('')}
  </div>`
    )
    .join('');
}

function renderPackages(items) {
  return items
    .map((pkg) => {
      const featured = pkg.featured ? ' featured' : '';
      const badge = pkg.badge ? `<div class="pkg-badge">${esc(pkg.badge)}</div>` : '';
      const features = pkg.features
        .map((f) => {
          const cls = f.highlight ? ' class="highlight"' : '';
          return `<li${cls}>${esc(f.text)}</li>`;
        })
        .join('');
      return `<div class="pkg${featured}">
      <div class="pkg-tier">
        <div>
          <div class="pkg-roman">${esc(pkg.roman)}</div>
          <div class="pkg-name">${esc(pkg.name)}</div>
          <div class="pkg-subtitle">${esc(pkg.subtitle)}</div>
          ${badge}
        </div>
        <div class="pkg-duration">${esc(pkg.duration)}</div>
      </div>
      <div class="pkg-features-col">
        <div class="pkg-tagline">${esc(pkg.tagline)}</div>
        <ul class="pkg-feat-list">${features}</ul>
      </div>
      <div class="pkg-price-col">
        <div class="pkg-usd">${esc(pkg.usd)}</div>
        <div class="pkg-krw">${esc(pkg.krw)}</div>
        <div class="pkg-sessions">${pkg.sessions}</div>
        <a href="#contact" class="pkg-cta">${esc(pkg.cta)}</a>
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
        ${esc(f.q)}
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-a">${f.a}</div>
    </div>`
    )
    .join('');
}

function renderFooterLinks(items) {
  return items.map((i) => `<li><a href="${esc(i.href)}">${esc(i.text)}</a></li>`).join('');
}

function renderLangSwitcher(links) {
  return links
    .map(
      (l) =>
        `<a href="#" data-switch-lang="${esc(l.code)}" style="color:rgba(255,255,255,0.5);text-decoration:none;font-size:12px;border:1px solid rgba(255,255,255,0.2);padding:5px 10px;border-radius:4px;transition:all 0.2s" onmouseover="this.style.color='#C9A84C';this.style.borderColor='#C9A84C'" onmouseout="this.style.color='rgba(255,255,255,0.5)';this.style.borderColor='rgba(255,255,255,0.2)'">${esc(l.label)}</a>`
    )
    .join('');
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
  const labels = root.querySelectorAll('.form-group label');
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
  if (submit) submit.textContent = f.submit;
}

function bindFaqToggle() {
  document.querySelectorAll('.faq-q').forEach((btn) => {
    btn.onclick = () => {
      const answer = btn.nextElementSibling;
      const isOpen = answer.classList.contains('open');
      document.querySelectorAll('.faq-q').forEach((b) => b.classList.remove('open'));
      document.querySelectorAll('.faq-a').forEach((a) => a.classList.remove('open'));
      if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
      }
    };
  });
}

export function applyLocale(data) {
  document.documentElement.lang = data.lang;
  document.title = data.title;
  updateSeoMeta(data, '/study-korea.html');
  document.body.style.fontFamily = data.fontFamily;

  setText('#mount-nav-pathways', data.nav.pathways);
  setText('#mount-nav-universities', data.nav.universities);
  setText('#mount-nav-packages', data.nav.packages);
  setText('#mount-nav-faq', data.nav.faq);
  setText('#mount-nav-back', data.nav.back);
  document.getElementById('mount-lang-switcher').innerHTML = renderLangSwitcher(data.langLinks);
  setText('#mount-nav-cta', data.nav.cta);

  setText('#mount-hero-badge', data.hero.badge);
  setHtml('#mount-hero-h1', data.hero.h1);
  setText('#mount-hero-sub', data.hero.sub);
  setText('#mount-hero-primary', data.hero.primaryCta);
  setText('#mount-hero-secondary', data.hero.secondaryCta);

  document.getElementById('mount-stats').innerHTML = renderStats(data.stats);

  setText('#mount-why-tag', data.why.tag);
  setHtml('#mount-why-title', data.why.title);
  setText('#mount-why-sub', data.why.sub);
  document.getElementById('mount-why-grid').innerHTML = renderWhyCards(data.why.cards);

  setText('#mount-pathways-tag', data.pathways.tag);
  setHtml('#mount-pathways-title', data.pathways.title);
  setText('#mount-pathways-sub', data.pathways.sub);
  document.getElementById('mount-pathway-grid').innerHTML = renderPathways(data.pathways.items);

  setText('#mount-uni-tag', data.universities.tag);
  setHtml('#mount-uni-title', data.universities.title);
  setText('#mount-uni-sub', data.universities.sub);
  document.getElementById('mount-uni-groups').innerHTML = renderUniGroups(data.universities.groups);
  setText('#mount-uni-footnote', data.universities.footnote);

  setText('#mount-pkg-tag', data.packages.tag);
  setHtml('#mount-pkg-title', data.packages.title);
  setText('#mount-pkg-sub', data.packages.sub);
  document.getElementById('mount-packages-row').innerHTML = renderPackages(data.packages.items);
  setText('#mount-terms-payment-title', data.packages.terms.payment.title);
  document.getElementById('mount-terms-payment').innerHTML = renderTermsList(
    data.packages.terms.payment.items
  );
  setText('#mount-terms-promise-title', data.packages.terms.promise.title);
  document.getElementById('mount-terms-promise').innerHTML = renderTermsList(
    data.packages.terms.promise.items
  );

  setText('#mount-faq-tag', data.faq.tag);
  setHtml('#mount-faq-title', data.faq.title);
  setText('#mount-faq-sub', data.faq.sub);
  document.getElementById('mount-faq-list').innerHTML = renderFaq(data.faq.items);
  bindFaqToggle();

  setText('#mount-contact-tag', data.contact.tag);
  setHtml('#mount-contact-title', data.contact.title);
  setText('#mount-contact-sub', data.contact.sub);
  setText('#mount-email-label', data.contact.emailLabel);
  setText('#mount-kakao-label', data.contact.kakaoLabel);
  setHtml('#mount-kakao-html', data.contact.kakaoLinkHtml);
  setText('#mount-messaging-label', data.contact.messagingLabel);
  setText('#mount-messaging', data.contact.messaging);
  setText('#mount-location-label', data.contact.locationLabel);
  setText('#mount-location', data.contact.location);
  applyStudyKoreaForm(data.contact, data.lang);

  setText('#mount-footer-tagline', data.footer.tagline);
  setText('#mount-footer-kr-heading', data.footer.studyKoreaHeading);
  document.getElementById('mount-footer-kr').innerHTML = renderFooterLinks(data.footer.studyKorea);
  setText('#mount-footer-kairos-heading', data.footer.kairosHeading);
  document.getElementById('mount-footer-kairos').innerHTML = renderFooterLinks(data.footer.kairos);
  setText('#mount-footer-copyright', data.footer.copyright);
  setHtml('#mount-footer-meta', data.footer.meta);
}
