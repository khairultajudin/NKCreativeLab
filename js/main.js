/* ============================================
   main.js — NK Creative Lab v2
   ============================================ */

// === Dark Mode Toggle ===
(function initTheme() {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('nk-theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('nk-theme', theme);
  }

  // Toggle click handler — attach to all toggle buttons on page
  function attachToggles() {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    });
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachToggles);
  } else {
    attachToggles();
  }
})();

// === Navbar Scroll Effect ===
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Active link highlighting
  const navLinks = document.querySelectorAll('.navbar-links a, .mobile-menu a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// === Mobile Menu ===
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

// === Smooth Scroll ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// === Animated Counter ===
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const suffix   = el.dataset.suffix || '';
  const start    = performance.now();

  (function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  })(start);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// === Hero Mouse Parallax ===
(function initParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const layers = hero.querySelectorAll('[data-depth]');
  if (!layers.length) return;

  let ticking = false;
  let mouseX = 0, mouseY = 0;

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    mouseX = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
    mouseY = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);

    if (!ticking) {
      requestAnimationFrame(() => {
        layers.forEach(el => {
          const depth = parseFloat(el.dataset.depth) || 0.04;
          const tx = mouseX * depth * 35;
          const ty = mouseY * depth * 20;
          el.style.transform = `translate(${tx}px, ${ty}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  hero.addEventListener('mouseleave', () => {
    layers.forEach(el => {
      el.style.transition = 'transform 1s ease';
      el.style.transform  = 'translate(0, 0)';
      setTimeout(() => { el.style.transition = ''; }, 1000);
    });
  });
})();

// === Tooltip ===
function initTooltips() {
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.addEventListener('mouseenter', function() {
      const tip = document.createElement('div');
      tip.className = 'tooltip-bubble';
      tip.textContent = this.dataset.tooltip;
      tip.style.cssText = `
        position:absolute; background:var(--bg-card);
        border:1px solid var(--border-hover); color:var(--text-primary);
        padding:6px 12px; border-radius:8px; font-size:0.8rem;
        white-space:nowrap; pointer-events:none; z-index:999;
        top:calc(100% + 8px); left:50%; transform:translateX(-50%);
        box-shadow:var(--shadow-glow);
      `;
      this.style.position = 'relative';
      this.appendChild(tip);
    });
    el.addEventListener('mouseleave', function() {
      const tip = this.querySelector('.tooltip-bubble');
      if (tip) tip.remove();
    });
  });
}

document.addEventListener('DOMContentLoaded', initTooltips);
