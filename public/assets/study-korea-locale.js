import { applyLocale, applyContactLocale } from './study-korea-i18n.js';
import { createLocaleBoot } from './kairos-locale-boot.js';

createLocaleBoot({
  localeBase: '/locales/study-korea',
  fontLinkId: 'study-korea-fonts',
  applyLocale,
  applyContactLocale,
});
