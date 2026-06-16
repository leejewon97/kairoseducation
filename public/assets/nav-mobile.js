(function () {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const toggle = nav.querySelector('.nav-toggle');
  if (!toggle) return;

  const panel = nav.querySelector('.nav-panel');
  const STORAGE_KEY = 'kairos-lang';
  // Calibrated max widths; non-multiples of 4 rounded up (vi 1070→1072, en 1043→1044, th 1018→1020, zh 922→924).
  const LANG_BREAKPOINT_MAX_WIDTH = {
    en: 1044,
    th: 1020,
    vi: 1072,
    ko: 900,
    zh: 924,
  };

  function resolveLang() {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored || 'en';
  }

  function resolveBreakpoint(lang) {
    return LANG_BREAKPOINT_MAX_WIDTH[lang] ?? 900;
  }

  function menuOpenLabel() {
    return nav.dataset.menuOpen || 'Open menu';
  }

  function menuCloseLabel() {
    return nav.dataset.menuClose || 'Close menu';
  }

  function updateToggleLabel(expanded) {
    toggle.setAttribute('aria-label', expanded ? menuCloseLabel() : menuOpenLabel());
  }

  function getFocusableInPanel() {
    if (!panel) return [];
    return Array.from(
      panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter((el) => el.offsetParent !== null || el === document.activeElement);
  }

  function closeNav() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    updateToggleLabel(false);
    toggle.focus();
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
    updateToggleLabel(true);
    const focusable = getFocusableInPanel();
    if (focusable.length) focusable[0].focus();
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

  let outsideTouch = null;
  const SCROLL_CLOSE_MOVE_PX = 8;

  document.addEventListener(
    'touchstart',
    (e) => {
      if (!nav.classList.contains('is-open')) return;
      const t = e.touches && e.touches[0];
      if (!t) return;
      if (nav.contains(e.target)) {
        outsideTouch = null;
        return;
      }
      outsideTouch = { x: t.clientX, y: t.clientY };
    },
    { passive: true }
  );

  document.addEventListener(
    'touchmove',
    (e) => {
      if (!outsideTouch) return;
      if (!nav.classList.contains('is-open')) {
        outsideTouch = null;
        return;
      }
      const t = e.touches && e.touches[0];
      if (!t) return;
      const dx = t.clientX - outsideTouch.x;
      const dy = t.clientY - outsideTouch.y;
      if (Math.hypot(dx, dy) >= SCROLL_CLOSE_MOVE_PX) {
        outsideTouch = null;
        closeNav();
      }
    },
    { passive: true }
  );

  document.addEventListener(
    'touchend',
    () => {
      outsideTouch = null;
    },
    { passive: true }
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeNav();
      return;
    }
    if (e.key !== 'Tab' || !nav.classList.contains('is-open')) return;
    const focusable = getFocusableInPanel();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
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
    updateToggleLabel(nav.classList.contains('is-open'));
  });

  updateToggleLabel(false);
  applyResponsiveNavMode(resolveLang());
})();
