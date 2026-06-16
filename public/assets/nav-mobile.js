(function () {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const toggle = nav.querySelector('.nav-toggle');
  if (!toggle) return;

  const STORAGE_KEY = 'kairos-lang';
  const LANG_BREAKPOINT_MAX_WIDTH = {
    en: 1029,
    th: 1004,
    vi: 1056,
    ko: 900,
    zh: 900,
  };

  function resolveLang() {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored || 'en';
  }

  function resolveBreakpoint(lang) {
    return LANG_BREAKPOINT_MAX_WIDTH[lang] ?? 900;
  }

  function closeNav() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  function applyResponsiveNavMode(lang) {
    const bp = resolveBreakpoint(lang);
    const shouldUseMobileNav = window.innerWidth <= bp;
    document.body.classList.toggle('nav-mobile', shouldUseMobileNav);
    if (!shouldUseMobileNav) closeNav();
  }

  function openNav() {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (nav.classList.contains('is-open')) closeNav();
    else openNav();
  });

  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('is-open')) return;
    if (!nav.contains(e.target)) closeNav();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  nav.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link || !nav.contains(link)) return;
    if (link.getAttribute('href') === '#') return;
    closeNav();
  });

  let resizeRaf = 0;
  function onResize() {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      resizeRaf = 0;
      applyResponsiveNavMode(resolveLang());
    });
  }

  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  window.addEventListener('kairos:langchange', (e) => {
    applyResponsiveNavMode(e?.detail?.lang || resolveLang());
  });

  applyResponsiveNavMode(resolveLang());
})();
