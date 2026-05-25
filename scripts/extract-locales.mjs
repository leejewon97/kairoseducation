/**
 * Deprecated. Use extract-locales-plain.mjs (public/origin.html → locales/origin/{lang}.json).
 * Run after editing legacy HTML, or to refresh JSON from hand-edited pages.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

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

function text($el) {
  return $el.html()?.trim() ?? '';
}

function innerText($el) {
  return $el.text().replace(/\s+/g, ' ').trim();
}

function extractUniCards($) {
  const tiers = [];
  $('#results > p').each((_, el) => {
    const $el = $(el);
    if (!$el.hasClass('tier-label') && !$el.attr('style')?.includes('text-transform')) return;
    const label = innerText($el);
    const $grid = $el.next('.results-grid');
    if (!$grid.length) return;
    const tierIndex = tiers.length;
    const tier = tierIndex >= 3 ? 0 : tierIndex + 1;
    const universities = [];
    $grid.find('.uni-card').each((__, card) => {
      const $card = $(card);
      const tierClass = $card.find('.tier-dot').attr('class') || '';
      let uniTier = tier;
      if (tierClass.includes('tier-2')) uniTier = 2;
      else if (tierClass.includes('tier-3')) uniTier = 3;
      else if ($card.find('.tier-dot').attr('style')) uniTier = 0;
      universities.push({
        name: innerText($card.find('.uni-name')),
        detail: innerText($card.find('.uni-detail')),
        tier: uniTier,
      });
    });
    tiers.push({ label, tier, universities });
  });
  return tiers;
}

function extractPackages($) {
  const packages = [];
  $('#services .package-card').each((_, el) => {
    const $p = $(el);
    const features = [];
    $p.find('.package-features li').each((__, li) => {
      features.push(innerText($(li)));
    });
    packages.push({
      featured: $p.hasClass('featured'),
      badge: innerText($p.find('.package-badge')),
      name: innerText($p.find('.package-name')),
      schools: innerText($p.find('.package-schools')),
      price: innerText($p.find('.package-price')),
      max: innerText($p.find('.package-max')),
      features,
    });
  });
  return packages;
}

function extractAlacarte($) {
  const rows = [];
  $('#services .alc-table tbody tr').each((_, tr) => {
    const cells = $(tr)
      .find('td')
      .map((__, td) => innerText($(td)))
      .get();
    if (cells.length === 3) rows.push({ service: cells[0], usd: cells[1], krw: cells[2] });
  });
  return rows;
}

function extractMethod($) {
  const cards = [];
  $('#methodology .method-card').each((_, el) => {
    const $c = $(el);
    cards.push({
      num: innerText($c.find('.method-num')),
      title: innerText($c.find('.method-title')),
      desc: innerText($c.find('.method-desc')),
    });
  });
  return cards;
}

function extractLangLinks(code) {
  const all = [
    { code: 'en', href: '/en/', label: 'English' },
    { code: 'ko', href: '/ko/', label: '한국어' },
    { code: 'zh', href: '/zh/', label: '中文' },
    { code: 'th', href: '/th/', label: 'ภาษาไทย' },
  ];
  return all.filter((l) => l.code !== code);
}

for (const code of langs) {
  const htmlPath = path.join(root, 'public', code, 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  const stats = [];
  $('.stats-banner .stat-item').each((_, el) => {
    const $s = $(el);
    stats.push({
      number: innerText($s.find('.stat-number')),
      label: text($s.find('.stat-label')),
    });
  });

  const grades = [];
  $('select[name="grade"] option').each((_, opt) => {
    grades.push(innerText($(opt)));
  });

  const footerAdmits = [];
  $('footer .footer-links')
    .last()
    .find('li a')
    .each((_, a) => {
      footerAdmits.push({ href: $(a).attr('href'), text: innerText($(a)) });
    });

  const footerNav = [];
  $('footer .footer-links')
    .first()
    .find('li a')
    .each((_, a) => {
      footerNav.push({ href: $(a).attr('href'), text: innerText($(a)) });
    });

  const data = {
    code,
    lang: $('html').attr('lang') || code,
    title: $('title').text().trim(),
    formName: FORM_NAMES[code],
    ...FONT[code],
    langLinks: extractLangLinks(code),
    nav: {
      results: innerText($('.nav-links a[href="#results"]')),
      services: innerText($('.nav-links a[href="#services"]')),
      methodology: innerText($('.nav-links a[href="#methodology"]')),
      about: innerText($('.nav-links a[href="#about"]')),
      cta: innerText($('.nav-cta')),
    },
    hero: {
      badge: innerText($('.hero-badge')),
      h1: text($('.hero h1')),
      sub: innerText($('.hero p')),
      primaryCta: innerText($('.hero .btn-primary')),
      secondaryCta: innerText($('.hero .btn-secondary')),
    },
    stats,
    results: {
      tag: innerText($('#results .section-tag')),
      title: text($('#results .section-title')),
      sub: innerText($('#results .section-sub')),
      tiers: extractUniCards($),
    },
    services: {
      tag: innerText($('#services .section-tag')),
      title: text($('#services .section-title')),
      sub: innerText($('#services .section-sub')),
      packages: extractPackages($),
      alacarteHeading: innerText($('#services .alc-heading')),
      alacarteSub: innerText($('#services .alc-sub')),
      alacarteTable: {
        service: innerText($('#services .alc-table thead th').eq(0)),
        usd: innerText($('#services .alc-table thead th').eq(1)),
        krw: innerText($('#services .alc-table thead th').eq(2)),
      },
      alacarte: extractAlacarte($),
      disclaimer: innerText($('#services > p').last()),
    },
    methodology: {
      tag: innerText($('#methodology .section-tag')),
      title: text($('#methodology .section-title')),
      sub: innerText($('#methodology .section-sub')),
      cards: extractMethod($),
    },
    about: {
      name: innerText($('.about-name')),
      role: innerText($('.about-title, .about-title-text')),
      credentials: $('.credentials li')
        .map((_, li) => innerText($(li)))
        .get(),
      tag: innerText($('#about .about-content .section-tag')),
      title: text($('#about .about-content .section-title')),
      blocks: (() => {
        const blocks = [];
        $('#about .about-content')
          .children()
          .each((_, el) => {
            const $el = $(el);
            if ($el.is('p')) blocks.push({ type: 'p', html: text($el) });
            if ($el.hasClass('about-quote')) blocks.push({ type: 'quote', text: innerText($el.find('p')) });
          });
        return blocks;
      })(),
    },
    contact: {
      tag: innerText($('#contact .section-tag')),
      title: text($('#contact h2')),
      sub: innerText($('#contact .contact-info > p')),
      emailLabel: innerText($('#contact .contact-item').eq(0).find('strong')),
      kakaoLabel: innerText($('#contact .contact-item').eq(1).find('strong')),
      kakaoLinkHtml: text($('#contact .contact-item').eq(1).find('span')),
      locationLabel: innerText($('#contact .contact-item').eq(2).find('strong')),
      location: innerText($('#contact .contact-item').eq(2).find('span')),
      form: {
        nameLabel: innerText($('label').first()),
        namePlaceholder: $('input[name="name"]').attr('placeholder') || '',
        gradeLabel: innerText($('select[name="grade"]').prev('label').length ? '' : $('select[name="grade"]').parent().find('label')),
        emailLabel: $('input[name="email"]').parent().find('label').text().trim(),
        emailPlaceholder: $('input[name="email"]').attr('placeholder') || '',
        universitiesLabel: $('input[name="universities"]').parent().find('label').text().trim(),
        universitiesPlaceholder: $('input[name="universities"]').attr('placeholder') || '',
        messageLabel: $('textarea[name="message"]').parent().find('label').text().trim(),
        messagePlaceholder: $('textarea[name="message"]').attr('placeholder') || '',
        submit: innerText($('.form-submit')),
        grades,
      },
    },
    footer: {
      tagline: innerText($('footer .footer-brand p')),
      navigateHeading: innerText($('footer .footer-links').first().find('h4')),
      admitsHeading: innerText($('footer .footer-links').last().find('h4')),
      nav: footerNav,
      admits: footerAdmits,
      copyright: innerText($('.footer-bottom p').first()),
      meta: innerText($('.footer-bottom p').last()),
    },
  };

  // Fix results legend (last p in results section)
  const resultPs = $('#results').children('p');
  data.results.legend = innerText(resultPs.last());

  // Fix contact form labels (cheerio prev sibling)
  const $form = $('.contact-form');
  data.contact.form.gradeLabel = innerText($form.find('select[name="grade"]').closest('.form-group').find('label'));
  data.contact.form.nameLabel = innerText($form.find('input[name="name"]').closest('.form-group').find('label'));
  data.contact.form.emailLabel = innerText($form.find('input[name="email"]').closest('.form-group').find('label'));
  data.contact.form.universitiesLabel = innerText($form.find('input[name="universities"]').closest('.form-group').find('label'));
  data.contact.form.messageLabel = innerText($form.find('textarea[name="message"]').closest('.form-group').find('label'));

  const outPath = path.join(root, 'locales', 'us', `${code}.json`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Wrote', outPath, `(${data.results.tiers.reduce((n, t) => n + t.universities.length, 0)} universities)`);
}
