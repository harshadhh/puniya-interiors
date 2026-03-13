/**
 * PUNIYA INTERIORS — Main Script
 * Handles: Navigation, Scroll Reveal, Parallax, Before/After Slider, Page Transitions
 */

/* ══════════════════════════════════════════
   1. NAVIGATION — Scroll Effect + Hamburger
══════════════════════════════════════════ */
(function initNav() {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');

  if (!nav) return;

  // Scrolled glass effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = current;
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      // Prevent body scroll when menu open
      document.body.style.overflow =
        mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Mark active nav link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();


/* ══════════════════════════════════════════
   2. SCROLL REVEAL — Intersection Observer
══════════════════════════════════════════ */
(function initScrollReveal() {
  const options = {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, options);

  // Observe all reveal elements
  document.querySelectorAll('.reveal, .curtain-reveal').forEach(el => {
    observer.observe(el);
  });
})();


/* ══════════════════════════════════════════
   3. HERO PARALLAX — Smooth depth illusion
══════════════════════════════════════════ */
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg-image');
  if (!heroBg) return;

  // Only on non-touch devices to save battery
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        // Move image slower than the page scroll (parallax effect)
        heroBg.style.transform = `scale(1.08) translateY(${scrolled * 0.25}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ══════════════════════════════════════════
   4. BEFORE & AFTER SLIDER
══════════════════════════════════════════ */
(function initSlider() {
  const wrapper = document.querySelector('.slider-wrapper');
  if (!wrapper) return;

  const afterEl = wrapper.querySelector('.slider-after');
  const handle  = wrapper.querySelector('.slider-handle');
  let isDragging = false;

  function updateSlider(x) {
    const rect = wrapper.getBoundingClientRect();
    // Clamp percentage between 2% and 98%
    let pct = Math.min(Math.max(((x - rect.left) / rect.width) * 100, 2), 98);

    afterEl.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = `${pct}%`;
  }

  // Mouse events
  wrapper.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  // Touch events
  wrapper.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => { isDragging = false; });

  // Keyboard accessibility
  wrapper.setAttribute('tabindex', '0');
  wrapper.setAttribute('role', 'slider');
  wrapper.setAttribute('aria-label', 'Before and after comparison slider');
  wrapper.addEventListener('keydown', (e) => {
    const handle = wrapper.querySelector('.slider-handle');
    const rect = wrapper.getBoundingClientRect();
    const currentX = (parseFloat(handle.style.left) / 100) * rect.width + rect.left;
    if (e.key === 'ArrowLeft') updateSlider(currentX - 20);
    if (e.key === 'ArrowRight') updateSlider(currentX + 20);
  });
})();


/* ══════════════════════════════════════════
   5. PAGE TRANSITIONS — Cross-fade between pages
══════════════════════════════════════════ */
(function initPageTransitions() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  // On page load — exit animation (reveal page)
  window.addEventListener('load', () => {
    overlay.classList.remove('enter');
    overlay.classList.add('exit');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 450);
  });

  // On link click — enter animation (hide page before navigate)
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Only internal html links
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || href.startsWith('tel') ||
        href.startsWith('https')) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.style.display = 'block';
      overlay.classList.remove('exit');
      overlay.classList.add('enter');

      setTimeout(() => {
        window.location.href = href;
      }, 420);
    });
  });
})();


/* ══════════════════════════════════════════
   6. STATS COUNTER ANIMATION
══════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      let current = 0;
      const increment = Math.ceil(target / 60);

      const tick = () => {
        current = Math.min(current + increment, target);
        el.textContent = current + suffix;
        if (current < target) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ══════════════════════════════════════════
   7. FORM HANDLER (Formspree-ready)
══════════════════════════════════════════ */
(function initForms() {
  const forms = document.querySelectorAll('.inquiry-form');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          form.innerHTML = `
            <div style="text-align:center;padding:3rem 0;">
              <p style="font-family:var(--font-serif);font-size:1.8rem;color:var(--accent);">
                Thank you.
              </p>
              <p style="margin-top:0.5rem;">
                We'll be in touch within 24 hours.
              </p>
            </div>
          `;
        } else {
          throw new Error('Form submission failed');
        }
      } catch (err) {
        btn.textContent = originalText;
        btn.disabled = false;
        alert('Something went wrong. Please WhatsApp us directly.');
      }
    });
  });
})();
