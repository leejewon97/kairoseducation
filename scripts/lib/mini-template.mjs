function get(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function renderBlock(tpl, data) {
  tpl = tpl.replace(/\{\{\{\s*([\w.]+)\s*\}\}\}/g, (_, p) => get(data, p) ?? '');
  tpl = tpl.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, p) => {
    const v = get(data, p);
    return v == null ? '' : String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  });
  return tpl;
}

function processIf(tpl, data) {
  return tpl.replace(/\{%\s*if\s+([\w.]+)\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g, (_, cond, body) => {
    return get(data, cond) ? body : '';
  });
}

function findForBlock(tpl) {
  const open = tpl.match(/\{%\s*for\s+(\w+)\s+in\s+([\w.]+)\s*%\}/);
  if (!open) return null;
  const start = open.index;
  const bodyStart = start + open[0].length;
  let depth = 1;
  let pos = bodyStart;
  while (pos < tpl.length && depth > 0) {
    const slice = tpl.slice(pos);
    const nextFor = slice.match(/\{%\s*for\s+/);
    const nextEnd = slice.match(/\{%\s*endfor\s*%\}/);
    if (!nextEnd) break;
    const forAt = nextFor ? nextFor.index : Infinity;
    const endAt = nextEnd.index;
    if (forAt < endAt) {
      depth += 1;
      pos += forAt + nextFor[0].length;
      continue;
    } else {
      const bodyEnd = pos + endAt;
      depth -= 1;
      if (depth === 0) {
        return {
          item: open[1],
          arrPath: open[2],
          body: tpl.slice(bodyStart, bodyEnd),
          end: bodyEnd + nextEnd[0].length,
          start,
        };
      }
      pos = bodyEnd + nextEnd[0].length;
    }
  }
  return null;
}

function processFor(tpl, data) {
  let block = findForBlock(tpl);
  while (block) {
    const arr = get(data, block.arrPath);
    const rendered = !Array.isArray(arr)
      ? ''
      : arr
          .map((entry, index) => {
            const ctx = {
              ...data,
              [block.item]: entry,
              loop: { index, first: index === 0, last: index === arr.length - 1 },
            };
            return render(block.body, ctx);
          })
          .join('');
    tpl = tpl.slice(0, block.start) + rendered + tpl.slice(block.end);
    block = findForBlock(tpl);
  }
  return tpl;
}

export function render(tpl, data) {
  let out = tpl;
  for (let i = 0; i < 16; i++) {
    out = processFor(out, data);
    out = processIf(out, data);
  }
  return renderBlock(out, data);
}
