const MARQUEE_SPEED = 80; // px/s
const ADMIT_INTERVAL_MS = 4000;
const HEADER_SCROLL_THRESHOLD = 20;
const STICKY_SCROLL_THRESHOLD = 620;

let revealObserver;
let admitIntervalId = null;
let currentView = 'us';

function hasSpaViews() {
  return Boolean(document.querySelector('.view'));
}

function getRevealNodes() {
  if (hasSpaViews()) {
    return document.querySelectorAll('.view.active .reveal');
  }
  return document.querySelectorAll('.reveal');
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function closeMobileMenu() {
  document.getElementById('mobileMenu')?.classList.remove('show');
  document.body.classList.remove('no-scroll');
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const headerH = document.getElementById('header')?.offsetHeight ?? 80;
  const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerH - 12);
  window.scrollTo({ top, behavior: 'smooth' });
}

export function showView(name) {
  if (!document.getElementById(`view-${name}`)) return;
  currentView = name;
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  document.getElementById(`view-${name}`).classList.add('active');
  document.body.classList.toggle('view-contact-active', name === 'contact');

  if (window.history.replaceState) {
    const url = new URL(window.location.href);
    if (name === 'contact') url.hash = 'contact';
    else url.hash = '';
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
  }

  window.scrollTo(0, 0);
  closeMobileMenu();

  const sticky = document.getElementById('sticky');
  const chatFab = document.getElementById('chatFab');
  if (sticky) sticky.classList.remove('show');
  if (chatFab) chatFab.classList.remove('lifted');

  requestAnimationFrame(() => {
    document.querySelectorAll(`#view-${name} .hero .reveal`).forEach((el) => el.classList.add('is-in'));
    runReveal();
    if (name === 'us') {
      tuneMarquees();
      startAdmitShowcase();
    } else {
      stopAdmitShowcase();
    }
  });
}

function initViewRouting() {
  if (!hasSpaViews()) return;

  document.addEventListener('click', (e) => {
    const viewEl = e.target.closest('[data-view]');
    if (viewEl) {
      e.preventDefault();
      showView(viewEl.getAttribute('data-view'));
      return;
    }

    const contactLink = e.target.closest('a[href="#contact"]');
    if (contactLink) {
      e.preventDefault();
      showView('contact');
      return;
    }

    const sectionLink = e.target.closest('a[href^="#"]');
    if (!sectionLink) return;
    const id = sectionLink.getAttribute('href').slice(1);
    if (!id || id === 'contact') return;
    if (currentView !== 'us') {
      e.preventDefault();
      showView('us');
      setTimeout(() => scrollToSection(id), 120);
    }
  });

  const syncFromHash = () => {
    if (window.location.hash === '#contact') showView('contact');
    else if (currentView === 'contact') showView('us');
  };

  syncFromHash();
  window.addEventListener('hashchange', syncFromHash);
}

function runReveal() {
  const nodes = getRevealNodes();
  if (!nodes.length) return;

  if (revealObserver) {
    revealObserver.disconnect();
  }

  if (prefersReducedMotion()) {
    nodes.forEach((el) => el.classList.add('is-in'));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  nodes.forEach((el) => {
    if (!el.classList.contains('is-in')) {
      revealObserver.observe(el);
    }
  });
}

function tuneMarquees() {
  document.querySelectorAll('.view.active .marquee-track').forEach((track) => {
    const setWidth = track.scrollWidth / 2;
    if (setWidth > 0) {
      track.style.animationDuration = (setWidth / MARQUEE_SPEED).toFixed(1) + 's';
    }
  });
}

function stopAdmitShowcase() {
  if (admitIntervalId != null) {
    clearInterval(admitIntervalId);
    admitIntervalId = null;
  }
}

function startAdmitShowcase() {
  if (currentView !== 'us') return;
  stopAdmitShowcase();

  const showcase = document.getElementById('admitShowcase');
  if (!showcase) return;

  const slides = showcase.querySelectorAll('.admit');
  if (!slides.length) return;

  slides.forEach((slide, index) => {
    slide.classList.toggle('is-active', index === 0);
  });

  if (prefersReducedMotion() || slides.length < 2) return;

  let index = 0;
  admitIntervalId = setInterval(() => {
    slides[index].classList.remove('is-active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('is-active');
  }, ADMIT_INTERVAL_MS);
}

function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  function update() {
    header.classList.toggle('scrolled', window.scrollY > HEADER_SCROLL_THRESHOLD);
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initSticky() {
  const sticky = document.getElementById('sticky');
  if (!sticky) return;

  const chatFab = document.getElementById('chatFab');

  function update() {
    if (currentView === 'contact') {
      sticky.classList.remove('show');
      if (chatFab) chatFab.classList.remove('lifted');
      return;
    }

    const show = window.scrollY > STICKY_SCROLL_THRESHOLD;
    sticky.classList.toggle('show', show);
    if (chatFab) chatFab.classList.toggle('lifted', show);
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initLangDropdown() {
  const lang = document.getElementById('lang');
  const btn = document.querySelector('.lang-btn');
  if (!lang || !btn) return;

  function setOpen(open) {
    lang.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!lang.classList.contains('open'));
  });

  document.addEventListener('click', () => setOpen(false));

  lang.addEventListener('click', (e) => {
    if (e.target.closest('[data-switch-lang]')) setOpen(false);
  });
}

function initMobileMenu() {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  const closeBtn = menu.querySelector('.mm-close');

  burger.addEventListener('click', () => {
    menu.classList.add('show');
    document.body.classList.add('no-scroll');
  });
  if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);

  menu.addEventListener('click', (e) => {
    const section = e.target.closest('[data-mm-section]');
    if (section) {
      e.preventDefault();
      e.stopPropagation();
      const id = section.getAttribute('href').slice(1);
      closeMobileMenu();
      if (hasSpaViews() && currentView === 'contact') {
        showView('us');
        setTimeout(() => scrollToSection(id), 120);
      } else {
        scrollToSection(id);
      }
      return;
    }

    const book = e.target.closest('[data-mm-book]');
    if (book) {
      e.preventDefault();
      e.stopPropagation();
      showView('contact');
      return;
    }

    if (e.target.closest('[data-mm-kakao]') || e.target.closest('.mm-route')) {
      closeMobileMenu();
    }
  });
}

function onLangChange() {
  requestAnimationFrame(() => {
    tuneMarquees();
    runReveal();
    startAdmitShowcase();
    if (window.location.hash === '#contact') showView('contact');
  });
}

function initPage() {
  initViewRouting();
  runReveal();
  requestAnimationFrame(tuneMarquees);
  startAdmitShowcase();
  initHeaderScroll();
  initSticky();
  initLangDropdown();
  initMobileMenu();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(tuneMarquees);
  }
}

window.addEventListener('kairos:langchange', onLangChange);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}
