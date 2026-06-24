import { applyLocale, applyContactLocale } from './origin-i18n.js';
import { createLocaleBoot } from './kairos-locale-boot.js';

createLocaleBoot({
  localeBase: '/locales/origin',
  fontLinkId: 'origin-fonts',
  applyLocale,
  applyContactLocale,
});
