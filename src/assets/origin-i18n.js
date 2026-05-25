function get(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

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
          return `<div class="uni-card">
        <div class="uni-tier">${dot}</div>
        <div class="uni-name">${esc(uni.name)}</div>
        <div class="uni-detail">${esc(uni.detail)}</div>
      </div>`;
        })
        .join('')}
    </div>`
    )
    .join('');
}

function renderPackages(packages) {
  return packages
    .map((pkg) => {
      const featured = pkg.featured ? ' featured' : '';
      const badge = pkg.badge ? `<div class="package-badge">${esc(pkg.badge)}</div>` : '';
      const features = pkg.features.map((f) => `<li>${esc(f)}</li>`).join('');
      return `<div class="package-card${featured}">
        ${badge}
        <div class="package-name">${esc(pkg.name)}</div>
        <div class="package-schools">${esc(pkg.schools)}</div>
        <div class="package-price">${esc(pkg.price)}</div>
        <div class="package-max">${esc(pkg.max)}</div>
        <ul class="package-features">${features}</ul>
      </div>`;
    })
    .join('');
}

function renderAlacarte(rows) {
  return rows
    .map((r) => `<tr><td>${esc(r.service)}</td><td>${esc(r.usd)}</td><td>${esc(r.krw)}</td></tr>`)
    .join('');
}

function renderMethodology(cards) {
  return cards
    .map(
      (c) => `<div class="method-card">
        <div class="method-num">${esc(c.num)}</div>
        <div class="method-title">${esc(c.title)}</div>
        <div class="method-desc">${esc(c.desc)}</div>
      </div>`
    )
    .join('');
}

function renderAboutBlocks(blocks) {
  return blocks
    .map((b) =>
      b.isP
        ? `<p>${b.html}</p>`
        : `<div class="about-quote"><p>${esc(b.text)}</p></div>`
    )
    .join('');
}

function renderCredentials(creds) {
  return creds.map((c) => `<li>${esc(c)}</li>`).join('');
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

function renderGradeOptions(grades) {
  return grades.map((g) => `<option>${esc(g)}</option>`).join('');
}

function switchVisibleForm(formName) {
  document.querySelectorAll('[data-contact-form]').forEach((f) => {
    f.hidden = f.getAttribute('name') !== formName;
  });
}

function applyFormLabels(formName, contact) {
  const f = contact.form;
  const root = document.querySelector(`form[name="${formName}"]`);
  if (!root) return;
  const labels = root.querySelectorAll('.form-group label');
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
  if (submit) submit.textContent = f.submit;
}

export function applyLocale(data) {
  document.documentElement.lang = data.lang;
  document.title = data.title;
  document.body.style.fontFamily = data.fontFamily;

  setText('#mount-nav-results', data.nav.results);
  setText('#mount-nav-services', data.nav.services);
  setText('#mount-nav-methodology', data.nav.methodology);
  setText('#mount-nav-about', data.nav.about);
  setText('#mount-nav-cta', data.nav.cta);
  document.getElementById('mount-lang-switcher').innerHTML = renderLangSwitcher(data.langLinks);

  setText('#mount-hero-badge', data.hero.badge);
  setHtml('#mount-hero-h1', data.hero.h1);
  setText('#mount-hero-sub', data.hero.sub);
  setText('#mount-hero-primary', data.hero.primaryCta);
  setText('#mount-hero-secondary', data.hero.secondaryCta);

  document.getElementById('mount-stats').innerHTML = renderStats(data.stats);

  setText('#mount-results-tag', data.results.tag);
  setHtml('#mount-results-title', data.results.title);
  setText('#mount-results-sub', data.results.sub);
  document.getElementById('mount-results-tiers').innerHTML = renderResults(data.results.tiers);
  setHtml('#mount-results-legend', data.results.legend);

  setText('#mount-services-tag', data.services.tag);
  setHtml('#mount-services-title', data.services.title);
  setText('#mount-services-sub', data.services.sub);
  document.getElementById('mount-packages').innerHTML = renderPackages(data.services.packages);
  setText('#mount-alc-heading', data.services.alacarteHeading);
  setText('#mount-alc-sub', data.services.alacarteSub);
  setText('#mount-alc-th-service', data.services.alacarteTable.service);
  setText('#mount-alc-th-usd', data.services.alacarteTable.usd);
  setText('#mount-alc-th-krw', data.services.alacarteTable.krw);
  document.getElementById('mount-alacarte').innerHTML = renderAlacarte(data.services.alacarte);
  setText('#mount-services-disclaimer', data.services.disclaimer);

  setText('#mount-method-tag', data.methodology.tag);
  setHtml('#mount-method-title', data.methodology.title);
  setText('#mount-method-sub', data.methodology.sub);
  document.getElementById('mount-method-cards').innerHTML = renderMethodology(data.methodology.cards);

  setText('#mount-about-name', data.about.name);
  setText('#mount-about-role', data.about.role);
  document.getElementById('mount-credentials').innerHTML = renderCredentials(data.about.credentials);
  setText('#mount-about-tag', data.about.tag);
  setHtml('#mount-about-title', data.about.title);
  document.getElementById('mount-about-blocks').innerHTML = renderAboutBlocks(data.about.blocks);

  setText('#mount-contact-tag', data.contact.tag);
  setHtml('#mount-contact-title', data.contact.title);
  setText('#mount-contact-sub', data.contact.sub);
  setText('#mount-email-label', data.contact.emailLabel);
  setHtml('#mount-kakao-html', data.contact.kakaoLinkHtml);
  setText('#mount-kakao-label', data.contact.kakaoLabel);
  setText('#mount-location-label', data.contact.locationLabel);
  setText('#mount-location', data.contact.location);

  switchVisibleForm(data.formName);
  applyFormLabels(data.formName, data.contact);

  setText('#mount-footer-tagline', data.footer.tagline);
  setText('#mount-footer-nav-heading', data.footer.navigateHeading);
  document.getElementById('mount-footer-nav').innerHTML = renderFooterLinks(data.footer.nav);
  setText('#mount-footer-admits-heading', data.footer.admitsHeading);
  document.getElementById('mount-footer-admits').innerHTML = renderFooterLinks(data.footer.admits);
  setText('#mount-footer-copyright', data.footer.copyright);
  setText('#mount-footer-meta', data.footer.meta);
}
