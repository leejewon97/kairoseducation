import { loadTemplate } from './expand-includes.mjs';
import { withContacts } from './contacts.mjs';
import { render } from './mini-template.mjs';

export function renderPageTemplate(root, relPath, data) {
  const tpl = loadTemplate(root, relPath);
  return render(tpl, withContacts(data));
}
