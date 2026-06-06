import fs from 'fs';
import path from 'path';

const ASSET_FILES = ['favicon-48x48.png', 'apple-touch-icon.png', 'kairos_logo-web.png', 'og-image.png'];

export function copyFavicons(root) {
  const srcDir = path.join(root, 'src', 'assets');
  const publicAssets = path.join(root, 'public', 'assets');
  fs.mkdirSync(publicAssets, { recursive: true });

  for (const name of ASSET_FILES) {
    fs.copyFileSync(path.join(srcDir, name), path.join(publicAssets, name));
  }

  fs.copyFileSync(path.join(srcDir, 'favicon.ico'), path.join(root, 'public', 'favicon.ico'));
}
