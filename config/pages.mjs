import { PATHS } from './paths.mjs';

/** @typedef {'origin' | 'studyKorea' | null} EnrichKind */
/** @typedef {'origin' | 'studyKorea' | null} ContactFormKind */

export const PAGE_BUILDS = [
  {
    id: 'origin',
    template: 'origin-page.njk',
    localeDir: 'origin',
    outputFile: 'origin/index.html',
    pagePath: PATHS.origin.landing,
    assetKey: 'originLanding',
    enrich: 'origin',
    pageStylesheet: 'origin-site.css',
    contactPath: PATHS.origin.contact,
    useIncludes: true,
  },
  {
    id: 'origin-contact',
    template: 'origin-contact-page.njk',
    localeDir: 'origin',
    outputFile: 'origin/contact.html',
    pagePath: PATHS.origin.contact,
    assetKey: 'originContact',
    contactForm: 'origin',
    pageStylesheet: 'origin-site.css',
    useIncludes: true,
  },
  {
    id: 'study-korea',
    template: 'study-korea-page.njk',
    localeDir: 'study-korea',
    outputFile: 'study-korea/index.html',
    pagePath: PATHS.studyKorea.landing,
    assetKey: 'studyKoreaLanding',
    enrich: 'studyKorea',
    pageStylesheet: 'origin-site.css',
    extraStylesheet: 'study-korea-site.css',
    contactPath: PATHS.studyKorea.contact,
    useIncludes: true,
  },
  {
    id: 'study-korea-contact',
    template: 'study-korea-contact-page.njk',
    localeDir: 'study-korea',
    outputFile: 'study-korea/contact.html',
    pagePath: PATHS.studyKorea.contact,
    assetKey: 'studyKoreaContact',
    contactForm: 'studyKorea',
    pageStylesheet: 'origin-site.css',
    extraStylesheet: 'study-korea-site.css',
    useIncludes: true,
  },
  {
    id: 'index',
    template: 'index-page.njk',
    localeDir: 'index',
    outputFile: 'index.html',
    pagePath: '/',
    assetKey: 'index',
    useIncludes: false,
    useOgDescription: true,
  },
];

export function getPageBuild(id) {
  const page = PAGE_BUILDS.find((p) => p.id === id);
  if (!page) throw new Error(`Unknown page id: ${id}`);
  return page;
}
