import fs from 'fs';
import path from 'path';
import { render } from './mini-template.mjs';
import { buildSeoLinks, buildOgTwitterTags } from './seo-head.mjs';
import { buildPage, getPageAssets } from './build-page.mjs';
import { renderPageTemplate } from './render-built.mjs';
import { enrichOriginEn, enrichStudyKoreaEn } from './enrich-packages.mjs';
import { renderOriginContactForm, renderStudyKoreaContactForm } from './netlify-forms.mjs';
import { renderContactChatHtml } from './contact-chat.mjs';
import { loadTemplate } from './expand-includes.mjs';
import { withContacts } from './contacts.mjs';

function readEnLocale(root, localeDir) {
  return JSON.parse(
    fs.readFileSync(path.join(root, 'locales', localeDir, 'en.json'), 'utf8')
  );
}

function enrichEn(en, kind) {
  if (kind === 'origin') return enrichOriginEn(en);
  if (kind === 'studyKorea') return enrichStudyKoreaEn(en);
  return en;
}

function buildContactBodyHtml(root, en, formKind) {
  const contactBodyTpl = loadTemplate(root, 'includes/contact-body.njk');
  const formsHtml =
    formKind === 'origin' ? renderOriginContactForm(en) : renderStudyKoreaContactForm(en);
  const contactChatHtml = renderContactChatHtml(en.cta);
  return render(
    contactBodyTpl,
    withContacts({ ...en, netlifyFormsHtml: formsHtml, contactChatHtml })
  );
}

function buildPageHtml(root, page, en) {
  const metaDescription = page.useOgDescription
    ? en.ogDescription || en.metaDescription
    : en.metaDescription;

  const templateData = {
    ...en,
    pageStylesheet: page.pageStylesheet,
    ...(page.extraStylesheet ? { extraStylesheet: page.extraStylesheet } : {}),
    ...(page.contactPath ? { contactPath: page.contactPath } : {}),
    ...(page.contactForm
      ? { contactBodyHtml: buildContactBodyHtml(root, en, page.contactForm) }
      : {}),
    seoLinks: buildSeoLinks(page.pagePath),
    ogTwitterTags: buildOgTwitterTags({
      title: en.title,
      metaDescription,
      pagePath: page.pagePath,
      lang: 'en',
    }),
  };

  if (page.useIncludes) {
    return renderPageTemplate(root, page.template, templateData);
  }

  const tpl = fs.readFileSync(
    path.join(root, 'src', 'templates', page.template),
    'utf8'
  );
  return render(tpl, templateData);
}

export function buildSitePage(root, page, { copyAssets = true } = {}) {
  let en = readEnLocale(root, page.localeDir);
  if (page.enrich) en = enrichEn(en, page.enrich);

  const html = buildPageHtml(root, page, en);
  const assetFiles = getPageAssets(page.assetKey);

  buildPage(root, {
    outputFile: page.outputFile,
    localeDir: page.localeDir,
    assetFiles,
    html,
    copyAssets,
  });

  return page.outputFile;
}
