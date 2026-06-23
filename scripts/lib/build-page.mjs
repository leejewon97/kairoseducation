import fs from 'fs';
import path from 'path';
import { LANGS } from '../../config/langs.mjs';
import { copyFavicons } from './copy-favicons.mjs';

const SHARED_ASSETS = ['hash-scroll.js', 'seo-i18n.js', 'langs.js', 'mobile-nav.js', 'contact-shell.js'];

export function copyAssets(root, assetFiles, copyFavicon = true) {
  const publicAssets = path.join(root, 'public', 'assets');
  fs.mkdirSync(publicAssets, { recursive: true });

  for (const name of [...assetFiles, ...SHARED_ASSETS]) {
    fs.copyFileSync(path.join(root, 'src', 'assets', name), path.join(publicAssets, name));
  }

  if (copyFavicon) copyFavicons(root);
}

export function copyLocales(root, localeDir) {
  const dest = path.join(root, 'public', 'locales', localeDir);
  fs.mkdirSync(dest, { recursive: true });

  for (const code of LANGS) {
    fs.copyFileSync(
      path.join(root, 'locales', localeDir, `${code}.json`),
      path.join(dest, `${code}.json`)
    );
  }
}

export function writeHtml(root, outputFile, html) {
  const dest = path.join(root, 'public', outputFile);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
}

export function buildPage(root, { outputFile, localeDir, assetFiles, html, copyFavicon = true }) {
  copyAssets(root, assetFiles, copyFavicon);
  copyLocales(root, localeDir);
  writeHtml(root, outputFile, html);
}
