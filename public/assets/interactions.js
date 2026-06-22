const REVEAL_SELECTOR = '.reveal';
let revealObserver;

function runReveal() {
  const nodes = document.querySelectorAll(REVEAL_SELECTOR);
  if (!nodes.length) return;

  if (revealObserver) {
    revealObserver.disconnect();
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
    el.classList.remove('is-in');
    revealObserver.observe(el);
  });
}

document.addEventListener('kairos:langchange', () => {
  requestAnimationFrame(runReveal);
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runReveal);
} else {
  runReveal();
}
