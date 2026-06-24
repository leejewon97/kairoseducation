/** Copied on every landing/contact page build (in addition to page-specific assets). */
export const SHARED_ASSETS = [
  'hash-scroll.js',
  'seo-i18n.js',
  'langs.js',
  'mobile-nav.js',
  'contact-shell.js',
  'kairos-i18n-utils.js',
  'kairos-locale-boot.js',
];

export const PAGE_ASSETS = {
  originLanding: [
    'kairos-tokens.css',
    'kairos-shared.css',
    'origin-site.css',
    'origin-i18n.js',
    'origin-locale.js',
    'interactions.js',
  ],
  originContact: [
    'kairos-tokens.css',
    'kairos-shared.css',
    'origin-site.css',
    'origin-i18n.js',
    'origin-locale.js',
  ],
  studyKoreaLanding: [
    'kairos-tokens.css',
    'kairos-shared.css',
    'origin-site.css',
    'study-korea-site.css',
    'study-korea-i18n.js',
    'study-korea-locale.js',
    'interactions.js',
  ],
  studyKoreaContact: [
    'kairos-tokens.css',
    'kairos-shared.css',
    'origin-site.css',
    'study-korea-site.css',
    'study-korea-i18n.js',
    'study-korea-locale.js',
  ],
  index: [
    'kairos-tokens.css',
    'kairos-shared.css',
    'index-site.css',
    'index-locale.js',
    'interactions.js',
    'langs.js',
    'seo-i18n.js',
  ],
};

export const SYNC_ASSETS = [
  ...new Set([...SHARED_ASSETS, ...Object.values(PAGE_ASSETS).flat()]),
].sort();
