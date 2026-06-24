import fs from 'fs';
import path from 'path';

/** mini-template unsupported — Nunjucks-style syntax that must not appear in .njk files. */
const FORBIDDEN = [
  { pattern: /\{%-?\s*else\b/, label: '{% else %}' },
  { pattern: /\{%-?\s*elif\b/, label: '{% elif %}' },
  { pattern: /\{%-?\s*macro\b/, label: '{% macro %}' },
  { pattern: /\{%-?\s*set\b/, label: '{% set %}' },
  { pattern: /\{%-?\s*extends\b/, label: '{% extends %}' },
  { pattern: /\{%-?\s*block\b/, label: '{% block %}' },
  { pattern: /\{%-?\s*include\s+/, label: '{% include %} (use {{{ @include path.njk }}})' },
  { pattern: /\{\{[^}]*\|\s*[a-zA-Z_]/, label: 'filter syntax (|) in {{ }}' },
];

function walkNjk(dir, base = dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkNjk(full, base));
    else if (entry.name.endsWith('.njk')) files.push(path.relative(base, full).replace(/\\/g, '/'));
  }
  return files;
}

/** @returns {string[]} error messages */
export function verifyTemplates(root) {
  const templatesDir = path.join(root, 'src', 'templates');
  if (!fs.existsSync(templatesDir)) return ['missing src/templates/'];

  const errors = [];
  for (const rel of walkNjk(templatesDir)) {
    const content = fs.readFileSync(path.join(templatesDir, rel), 'utf8');
    const lines = content.split(/\r?\n/);
    for (const { pattern, label } of FORBIDDEN) {
      lines.forEach((line, i) => {
        if (pattern.test(line)) {
          errors.push(`${rel}:${i + 1} — unsupported ${label}`);
        }
      });
    }
  }
  return errors;
}
