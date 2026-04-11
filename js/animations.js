/* ============================================
   animations.js — Intersection Observer Reveals v2
   ============================================ */

(function initScrollReveal() {
  const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealClasses.forEach(cls => {
    document.querySelectorAll(cls).forEach(el => observer.observe(el));
  });
})();

// === Parallax scroll on data-parallax elements ===
(function initScrollParallax() {
  const items = document.querySelectorAll('[data-parallax]');
  if (!items.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    items.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
})();
