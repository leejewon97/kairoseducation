/**
 * Zero-dependency locale extractor (no npm). Run: node scripts/extract-locales-plain.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const langs = ['en', 'ko', 'zh', 'th'];

const FONT = {
  en: {
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,500&display=swap',
    fontFamily: "'Inter', sans-serif",
  },
  ko: {
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,500&display=swap',
    fontFamily: "'Noto Sans KR', sans-serif",
  },
  zh: {
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,500&display=swap',
    fontFamily: "'Noto Sans SC', sans-serif",
  },
  th: {
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,500&display=swap',
    fontFamily: "'Sarabun', sans-serif",
  },
};

const FORM_NAMES = { en: 'contact', ko: 'contact-kr', zh: 'contact-zh', th: 'contact-th' };

function decode(s) {
  return s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
}

function stripTags(s) {
  return decode(s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function innerHtml(s, re) {
  const m = s.match(re);
  return m ? m[1].trim() : '';
}

function labelBeforeInput(html, inputName) {
  const after = innerHtml(
    html,
    new RegExp(`<input[^>]*name="${inputName}"[^>]*>[\\s\\S]*?<label>([^<]*)</label>`)
  );
  if (after) return stripTags(after);
  return stripTags(
    innerHtml(html, new RegExp(`<label>([^<]*)</label>[\\s\\S]*?<input[^>]*name="${inputName}"`))
  );
}

function labelBeforeSelect(html, selectName) {
  const after = innerHtml(
    html,
    new RegExp(`<select[^>]*name="${selectName}"[^>]*>[\\s\\S]*?<label>([^<]*)</label>`)
  );
  if (after) return stripTags(after);
  return stripTags(
    innerHtml(html, new RegExp(`<label>([^<]*)</label>[\\s\\S]*?<select[^>]*name="${selectName}"`))
  );
}

function labelBeforeTextarea(html, name) {
  const after = innerHtml(
    html,
    new RegExp(`<textarea[^>]*name="${name}"[^>]*>[\\s\\S]*?<label>([^<]*)</label>`)
  );
  if (after) return stripTags(after);
  return stripTags(
    innerHtml(html, new RegExp(`<label>([^<]*)</label>[\\s\\S]*?<textarea[^>]*name="${name}"`))
  );
}

function extractUniversities(html) {
  const section = innerHtml(html, /<section class="results"[^>]*>([\s\S]*?)<\/section>/);
  const tiers = [];
  const labelRe =
    /<p(?: class="tier-label"| style="font-size: 13px; font-weight: 600; color: var\(--gold\);[^"]*")>([^<]*)<\/p>\s*<div class="results-grid"[^>]*>([\s\S]*?)<\/div>\s*(?=\s*<p )/g;
  let m;
  let i = 0;
  while ((m = labelRe.exec(section)) !== null) {
    const label = stripTags(m[1]);
    const grid = m[2];
    const tier = i >= 3 ? 0 : i + 1;
    const universities = [];
    const cardRe =
      /<div class="uni-card">[\s\S]*?<div class="uni-name">([\s\S]*?)<\/div>[\s\S]*?<div class="uni-detail">([\s\S]*?)<\/div>[\s\S]*?<\/div>/g;
    let cm;
    while ((cm = cardRe.exec(grid)) !== null) {
      const card = cm[0];
      const name = stripTags(cm[1]);
      const detail = stripTags(cm[2]);
      let uniTier = tier;
      if (card.includes('tier-2')) uniTier = 2;
      else if (card.includes('tier-3')) uniTier = 3;
      else if (card.includes('background:#6B7280')) uniTier = 0;
      universities.push({ name, detail, tier: uniTier, intl: uniTier === 0 });
    }
    tiers.push({ label, tier, universities });
    i++;
  }
  return tiers;
}

function extractPackages(html) {
  const section = innerHtml(html, /<section id="services"[^>]*>([\s\S]*?)<\/section>/);
  const packages = [];
  const re = /<div class="package-card(?: featured)?">([\s\S]*?)<\/div>\s*(?=<div class="package-card|<h3 class="alc-heading")/g;
  let m;
  while ((m = re.exec(section)) !== null) {
    const block = m[0];
    const inner = m[1];
    const features = [...inner.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((x) => stripTags(x[1]));
    packages.push({
      featured: block.includes('package-card featured'),
      badge: stripTags(innerHtml(inner, /<div class="package-badge">([\s\S]*?)<\/div>/)),
      name: stripTags(innerHtml(inner, /<div class="package-name">([\s\S]*?)<\/div>/)),
      schools: stripTags(innerHtml(inner, /<div class="package-schools">([\s\S]*?)<\/div>/)),
      price: stripTags(innerHtml(inner, /<div class="package-price">([\s\S]*?)<\/div>/)),
      max: stripTags(innerHtml(inner, /<div class="package-max">([\s\S]*?)<\/div>/)),
      features,
    });
  }
  return packages;
}

/** en과 동일한 33개 대학 구조를 유지하고, 기존 번역 name/detail만 보존 */
function syncResultsFromEn(all) {
  const en = all.en;
  if (!en?.results?.tiers) return;
  for (const code of ['ko', 'zh', 'th']) {
    const loc = all[code];
    if (!loc) continue;
    loc.results.tiers = en.results.tiers.map((enTier, ti) => {
      const locTier = loc.results.tiers[ti];
      return {
        label: locTier?.label || enTier.label,
        tier: enTier.tier,
        universities: enTier.universities.map((enUni, ui) => {
          const locUni =
            locTier?.universities?.find((u) => u.name === enUni.name) || locTier?.universities?.[ui];
          return locUni
            ? { ...enUni, name: enUni.name, detail: locUni.detail }
            : { ...enUni };
        }),
      };
    });
  }
}

const originHtmlPath = path.join(root, 'public', 'origin.html');
if (!fs.existsSync(originHtmlPath)) {
  console.error('Missing public/origin.html — run: node scripts/build-origin-plain.mjs');
  process.exit(1);
}
const originHtml = fs.readFileSync(originHtmlPath, 'utf8');

const extracted = {};

for (const code of langs) {
  if (code !== 'en') {
    const existing = path.join(root, 'locales', 'origin', `${code}.json`);
    extracted[code] = JSON.parse(fs.readFileSync(existing, 'utf8'));
    continue;
  }
  const html = originHtml;
  const langLinks = [
    { code: 'en', label: 'English' },
    { code: 'ko', label: '한국어' },
    { code: 'zh', label: '中文' },
    { code: 'th', label: 'ภาษาไทย' },
  ].filter((l) => l.code !== code);

  const stats = [...html.matchAll(/<div class="stat-item">[\s\S]*?<span class="stat-number">([\s\S]*?)<\/span>[\s\S]*?<span class="stat-label">([\s\S]*?)<\/span>/g)].map(
    (m) => ({ number: stripTags(m[1]), label: m[2].trim() })
  );

  const grades = [...html.matchAll(/<option>([^<]*)<\/option>/g)].map((m) => m[1]);

  const aboutContent = innerHtml(html, /<div class="about-content">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>\s*<!--/);
  const aboutBlocks = [];
  const blockRe = /<(p|div class="about-quote")[^>]*>([\s\S]*?)<\/\1>/g;
  let bm;
  while ((bm = blockRe.exec(aboutContent)) !== null) {
    if (bm[1] === 'p') aboutBlocks.push({ isP: true, html: bm[2].trim() });
    else aboutBlocks.push({ isP: false, text: stripTags(bm[2]) });
  }

  const methodCards = [...html.matchAll(/<div class="method-card">[\s\S]*?<div class="method-num">([^<]*)<\/div>[\s\S]*?<div class="method-title">([^<]*)<\/div>[\s\S]*?<div class="method-desc">([\s\S]*?)<\/div>/g)].map(
    (m) => ({ num: m[1].trim(), title: stripTags(m[2]), desc: stripTags(m[3]) })
  );

  const alacarte = [...html.matchAll(/<tr><td>([^<]*)<\/td><td>([^<]*)<\/td><td>([^<]*)<\/td><\/tr>/g)]
    .slice(0, 5)
    .map((m) => ({ service: m[1], usd: m[2], krw: m[3] }));

  const data = {
    code,
    lang: innerHtml(html, /<html lang="([^"]*)">/) || code,
    title: innerHtml(html, /<title>([\s\S]*?)<\/title>/),
    formName: FORM_NAMES[code],
    ...FONT[code],
    langLinks,
    nav: {
      results: stripTags(innerHtml(html, /<a href="#results">([\s\S]*?)<\/a>/)),
      services: stripTags(innerHtml(html, /<a href="#services">([\s\S]*?)<\/a>/)),
      methodology: stripTags(innerHtml(html, /<a href="#methodology">([\s\S]*?)<\/a>/)),
      about: stripTags(innerHtml(html, /<a href="#about">([\s\S]*?)<\/a>/)),
      cta: stripTags(innerHtml(html, /<a href="#contact" class="nav-cta">([\s\S]*?)<\/a>/)),
    },
    hero: {
      badge: stripTags(innerHtml(html, /<div class="hero-badge">([\s\S]*?)<\/div>/)),
      h1: innerHtml(html, /<h1>([\s\S]*?)<\/h1>/),
      sub: stripTags(innerHtml(html, /<section class="hero">[\s\S]*?<p>([\s\S]*?)<\/p>/)),
      primaryCta: stripTags(innerHtml(html, /<a href="#contact" class="btn-primary">([\s\S]*?)<\/a>/)),
      secondaryCta: stripTags(innerHtml(html, /<a href="#results" class="btn-secondary">([\s\S]*?)<\/a>/)),
    },
    stats,
    results: {
      tag: stripTags(innerHtml(html, /<section class="results"[^>]*>[\s\S]*?<div class="section-tag">([\s\S]*?)<\/div>/)),
      title: innerHtml(html, /<section class="results"[^>]*>[\s\S]*?<h2 class="section-title">([\s\S]*?)<\/h2>/),
      sub: stripTags(innerHtml(html, /<section class="results"[^>]*>[\s\S]*?<p class="section-sub">([\s\S]*?)<\/p>/)),
      tiers: extractUniversities(html),
      legend: stripTags(
        innerHtml(html, /<section class="results"[^>]*>[\s\S]*<div class="results-grid"[^>]*>[\s\S]*<\/div>\s*<p style="font-size: 13px; color: var\(--text-muted\);">([\s\S]*?)<\/p>/)
      ),
    },
    services: {
      tag: stripTags(innerHtml(html, /<section id="services"[^>]*>[\s\S]*?<div class="section-tag">([\s\S]*?)<\/div>/)),
      title: innerHtml(html, /<section id="services"[^>]*>[\s\S]*?<h2 class="section-title">([\s\S]*?)<\/h2>/),
      sub: stripTags(innerHtml(html, /<section id="services"[^>]*>[\s\S]*?<p class="section-sub">([\s\S]*?)<\/p>/)),
      packages: extractPackages(html),
      alacarteHeading: stripTags(innerHtml(html, /<h3 class="alc-heading">([\s\S]*?)<\/h3>/)),
      alacarteSub: stripTags(innerHtml(html, /<p class="alc-sub">([\s\S]*?)<\/p>/)),
      alacarteTable: {
        service: stripTags(innerHtml(html, /<th>([^<]*)<\/th>/)),
        usd: 'USD',
        krw: 'KRW',
      },
      alacarte,
      disclaimer: stripTags(
        innerHtml(html, /<section id="services"[^>]*>[\s\S]*<table class="alc-table">[\s\S]*<\/table>\s*<p style="font-size: 13px[^"]*">([\s\S]*?)<\/p>/)
      ),
    },
    methodology: {
      tag: stripTags(innerHtml(html, /<section class="method"[^>]*>[\s\S]*?<div class="section-tag"[^>]*>([\s\S]*?)<\/div>/)),
      title: innerHtml(html, /<section class="method"[^>]*>[\s\S]*?<h2 class="section-title">([\s\S]*?)<\/h2>/),
      sub: stripTags(innerHtml(html, /<section class="method"[^>]*>[\s\S]*?<p class="section-sub">([\s\S]*?)<\/p>/)),
      cards: methodCards,
    },
    about: {
      name: stripTags(innerHtml(html, /<div class="about-name">([\s\S]*?)<\/div>/)),
      role: stripTags(innerHtml(html, /<div class="about-title[^"]*">([\s\S]*?)<\/div>/)),
      credentials: [...html.matchAll(/<ul class="credentials">[\s\S]*?<li>([\s\S]*?)<\/li>/g)].map((m) => stripTags(m[1])),
      tag: stripTags(innerHtml(html, /<div class="about-content">[\s\S]*?<div class="section-tag">([\s\S]*?)<\/div>/)),
      title: innerHtml(html, /<div class="about-content">[\s\S]*?<h2 class="section-title">([\s\S]*?)<\/h2>/),
      blocks: aboutBlocks,
    },
    contact: {
      tag: stripTags(innerHtml(html, /<section class="contact"[^>]*>[\s\S]*?<div class="section-tag">([\s\S]*?)<\/div>/)),
      title: innerHtml(html, /<section class="contact"[^>]*>[\s\S]*?<h2>([\s\S]*?)<\/h2>/),
      sub: stripTags(innerHtml(html, /<div class="contact-info">[\s\S]*?<p>([\s\S]*?)<\/p>/)),
      emailLabel: 'Email',
      kakaoLabel: 'KakaoTalk Channel',
      kakaoLinkHtml: innerHtml(html, /<div class="contact-item">[\s\S]*?💬[\s\S]*?<span>([\s\S]*?)<\/span>/),
      locationLabel: 'Based in',
      location: stripTags(innerHtml(html, /<div class="contact-item">[\s\S]*?📍[\s\S]*?<span>([\s\S]*?)<\/span>/)),
      form: {
        nameLabel: labelBeforeInput(html, 'name'),
        namePlaceholder: innerHtml(html, /<input type="text" name="name" placeholder="([^"]*)"/),
        gradeLabel: labelBeforeSelect(html, 'grade'),
        emailLabel: labelBeforeInput(html, 'email'),
        emailPlaceholder: innerHtml(html, /<input type="email"[^>]*placeholder="([^"]*)"/),
        universitiesLabel: labelBeforeInput(html, 'universities'),
        universitiesPlaceholder: innerHtml(html, /name="universities" placeholder="([^"]*)"/),
        messageLabel: labelBeforeTextarea(html, 'message'),
        messagePlaceholder: innerHtml(html, /<textarea name="message" placeholder="([^"]*)"/),
        submit: stripTags(innerHtml(html, /<button type="submit"[^>]*>([\s\S]*?)<\/button>/)),
        grades,
      },
    },
    footer: {
      tagline: stripTags(innerHtml(html, /<div class="footer-brand">[\s\S]*?<p>([\s\S]*?)<\/p>/)),
      navigateHeading: stripTags(innerHtml(html, /<footer[\s\S]*?<h4>([\s\S]*?)<\/h4>[\s\S]*?<li><a href="#results">/)),
      admitsHeading: stripTags(innerHtml(html, /<footer[\s\S]*?<h4>([\s\S]*?)<\/h4>[\s\S]*?Harvard/)),
      nav: [...html.matchAll(/<footer[\s\S]*?<div class="footer-links">[\s\S]*?<li><a href="([^"]*)">([^<]*)<\/a>/g)]
        .slice(0, 5)
        .map((m) => ({ href: m[1], text: m[2] })),
      admits: [...html.matchAll(/<footer[\s\S]*?Admits[\s\S]*?<li><a href="([^"]*)">([^<]*)<\/a>/g)].map((m) => ({
        href: m[1],
        text: m[2],
      })),
      copyright: stripTags(innerHtml(html, /<div class="footer-bottom">[\s\S]*?<p>([\s\S]*?)<\/p>/)),
      meta: stripTags(innerHtml(html, /<div class="footer-bottom">[\s\S]*?<p>[\s\S]*?<\/p>\s*<p>([\s\S]*?)<\/p>/)),
    },
  };

  // Fix contact labels from form groups (more reliable)
  const formBlock = innerHtml(html, /<form name="[^"]*"[^>]*>([\s\S]*?)<\/form>/);
  const fg = (field) => {
    const m = formBlock.match(new RegExp(`<label>([^<]*)</label>[\\s\\S]*?name="${field}"`));
    return m ? stripTags(m[1]) : '';
  };
  data.contact.form.nameLabel = fg('name');
  data.contact.form.gradeLabel = fg('grade');
  data.contact.form.emailLabel = fg('email');
  data.contact.form.universitiesLabel = fg('universities');
  data.contact.form.messageLabel = fg('message');

  extracted[code] = data;
}

syncResultsFromEn(extracted);

for (const code of langs) {
  const data = extracted[code];
  const out = path.join(root, 'locales', 'origin', `${code}.json`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(data, null, 2));
  const n = data.results.tiers.reduce((a, t) => a + t.universities.length, 0);
  console.log(`Wrote ${out} (${n} universities, ${data.services.packages.length} packages)`);
}
