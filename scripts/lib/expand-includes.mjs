import fs from 'fs';
import path from 'path';

const INCLUDE_RE = /\{\{\{\s*@include\s+([\w./-]+)\s*\}\}\}/g;

/** Recursively expand {{{ @include path.njk }}} before mini-template render. */
export function expandIncludes(tpl, templatesDir) {
  return tpl.replace(INCLUDE_RE, (_, rel) => {
    const filePath = path.join(templatesDir, rel);
    const content = fs.readFileSync(filePath, 'utf8');
    return expandIncludes(content, templatesDir);
  });
}

export function loadTemplate(root, relPath) {
  const templatesDir = path.join(root, 'src', 'templates');
  const raw = fs.readFileSync(path.join(templatesDir, relPath), 'utf8');
  return expandIncludes(raw, templatesDir);
}
