export function initHashScrollRestoration() {
  if (!window.location.hash) return;
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
}

export function scrollToCurrentHash() {
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return;
  const id = decodeURIComponent(hash.slice(1));
  const el = document.getElementById(id);
  if (!el) return;
  const navH = document.querySelector('nav')?.offsetHeight ?? 70;
  const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - navH);
  window.scrollTo({ top, behavior: 'auto' });
}

export function scrollToHashAfterLocale() {
  if (!window.location.hash) return;
  // Some browsers apply the native hash jump late (after modules run).
  // Re-apply our offset after the page fully loads.
  window.addEventListener('load', () => scrollToCurrentHash(), { once: true });

  // Fonts can shift layout after locale swap; correct once fonts are ready.
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => scrollToCurrentHash()).catch(() => {});
  }

  // Immediate + slightly delayed correction for stable first paint.
  requestAnimationFrame(() => scrollToCurrentHash());
  setTimeout(() => scrollToCurrentHash(), 50);
}
