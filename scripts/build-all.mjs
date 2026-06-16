import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeLangsJs } from './lib/write-langs-js.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

writeLangsJs(root);

const scripts = [
  'build-origin-plain.mjs',
  'build-study-korea-plain.mjs',
  'build-index-plain.mjs',
];

for (const script of scripts) {
  const result = spawnSync(process.execPath, [path.join(__dirname, script)], {
    cwd: root,
    stdio: 'inherit',
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const verify = spawnSync(process.execPath, [path.join(__dirname, 'verify-sync.mjs')], {
  cwd: root,
  stdio: 'inherit',
});
process.exit(verify.status ?? 1);
