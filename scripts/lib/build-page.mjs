import fs from 'fs';
import path from 'path';
import { LANGS } from '../../config/langs.mjs';
import { PAGE_ASSETS, SHARED_ASSETS, SYNC_ASSETS } from '../../config/assets.mjs';
import { copyFavicons } from './copy-favicons.mjs';

export function copyAssetFiles(root, names) {
  const publicAssets = path.join(root, 'public', 'assets');
  fs.mkdirSync(publicAssets, { recursive: true });
  for (const name of names) {
    fs.copyFileSync(path.join(root, 'src', 'assets', name), path.join(publicAssets, name));
  }
}

export function copyIndexImages(root) {
  const srcDir = path.join(root, 'src', 'assets', 'img');
  const destDir = path.join(root, 'public', 'assets', 'img');
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const name of fs.readdirSync(srcDir)) {
    fs.copyFileSync(path.join(srcDir, name), path.join(destDir, name));
  }
}

/** Copy all site assets once (full build or single-page build). */
export function copyAllAssets(root) {
  copyAssetFiles(root, SYNC_ASSETS);
  copyFavicons(root);
  copyIndexImages(root);
}

export function copyAssets(root, assetFiles) {
  copyAssetFiles(root, [...assetFiles, ...SHARED_ASSETS]);
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

export function buildPage(root, { outputFile, localeDir, assetFiles, html, copyAssets: shouldCopyAssets = true }) {
  if (shouldCopyAssets) copyAssets(root, assetFiles);
  copyLocales(root, localeDir);
  writeHtml(root, outputFile, html);
}

export function getPageAssets(assetKey) {
  return PAGE_ASSETS[assetKey] ?? [];
}
