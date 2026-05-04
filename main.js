/* ============================================
   VISTA MARE ARENELLA – Main JavaScript
   ============================================ */

(() => {
  'use strict';

  /* ------------------------------------------
     NAVBAR – scroll & mobile menu
  ------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ------------------------------------------
     HERO PARTICLES
  ------------------------------------------ */
  function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const count = window.innerWidth < 768 ? 12 : 24;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 80 + 20;
      const dx = (Math.random() - 0.5) * 80;
      const dy = (Math.random() - 0.5) * 80;
      Object.assign(p.style, {
        width: size + 'px',
        height: size + 'px',
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        '--dur': (Math.random() * 10 + 8) + 's',
        '--delay': (Math.random() * 6) + 's',
        '--dx': dx + 'px',
        '--dy': dy + 'px',
        opacity: Math.random() * 0.2 + 0.05,
      });
      container.appendChild(p);
    }
  }

  createParticles();

  /* ------------------------------------------
     SCROLL REVEAL ANIMATION
  ------------------------------------------ */
  const revealEls = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right, .reveal-scale'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  /* ------------------------------------------
     COUNTER ANIMATION (stats bar)
  ------------------------------------------ */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const step = duration / target;
    let current = 0;
    const timer = setInterval(() => {
      current += Math.ceil(target / 60);
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current;
    }, step);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const nums = entry.target.querySelectorAll('.stat-number');
          nums.forEach(animateCounter);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) counterObserver.observe(statsBar);

  /* ------------------------------------------
     TESTIMONIALS SLIDER
  ------------------------------------------ */
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('tDots');
  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');

  if (track && dotsContainer) {
    const cards = track.querySelectorAll('.testimonial-card');
    const total = cards.length;
    let current = 0;
    let autoplayTimer;

    const isMobile = () => window.innerWidth <= 768;
    const visibleCount = () => isMobile() ? 1 : 2;

    function getMaxIndex() {
      return Math.ceil(total / visibleCount()) - 1;
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      const max = getMaxIndex();
      for (let i = 0; i <= max; i++) {
        const dot = document.createElement('button');
        dot.className = 't-dot' + (i === current ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      dotsContainer.querySelectorAll('.t-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    function goTo(index) {
      const max = getMaxIndex();
      current = Math.max(0, Math.min(index, max));
      const cardWidth = cards[0].offsetWidth + 24;
      const offset = current * visibleCount() * cardWidth;
      track.style.transform = `translateX(-${offset}px)`;
      updateDots();
    }

    function next() { goTo(current < getMaxIndex() ? current + 1 : 0); }
    function prev() { goTo(current > 0 ? current - 1 : getMaxIndex()); }

    function startAutoplay() {
      autoplayTimer = setInterval(next, 5000);
    }

    function stopAutoplay() {
      clearInterval(autoplayTimer);
    }

    nextBtn.addEventListener('click', () => { stopAutoplay(); next(); startAutoplay(); });
    prevBtn.addEventListener('click', () => { stopAutoplay(); prev(); startAutoplay(); });

    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);

    let touchStartX = 0;
    track.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      stopAutoplay();
    }, { passive: true });

    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
      startAutoplay();
    }, { passive: true });

    window.addEventListener('resize', () => {
      buildDots();
      goTo(0);
    });

    buildDots();
    startAutoplay();
  }

  /* ------------------------------------------
     SMOOTH SCROLL for anchor links
  ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ------------------------------------------
     BOOKING FORM
  ------------------------------------------ */
  const form = document.getElementById('bookingForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form && formSuccess) {
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');

    const today = new Date().toISOString().split('T')[0];
    if (checkinInput) checkinInput.min = today;
    if (checkoutInput) checkoutInput.min = today;

    checkinInput && checkinInput.addEventListener('change', () => {
      if (checkoutInput && checkinInput.value) {
        const next = new Date(checkinInput.value);
        next.setDate(next.getDate() + 1);
        checkoutInput.min = next.toISOString().split('T')[0];
        if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
          checkoutInput.value = '';
        }
      }
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.querySelector('span').textContent = 'Invio in corso...';

      setTimeout(() => {
        form.style.display = 'none';
        formSuccess.classList.add('visible');
      }, 1200);
    });
  }

  /* ------------------------------------------
     NAVBAR ACTIVE LINK – highlight on scroll
  ------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach(a => {
            a.style.fontWeight = a.getAttribute('href') === `#${id}` ? '700' : '500';
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => sectionObserver.observe(s));

  /* ------------------------------------------
     GALLERY LIGHTBOX (minimal)
  ------------------------------------------ */
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const caption = item.querySelector('.gallery-caption span');
      const placeholder = item.querySelector('.gallery-placeholder');
      if (!caption || !placeholder) return;

      const lightbox = document.createElement('div');
      lightbox.style.cssText = `
        position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.9);
        display:flex;align-items:center;justify-content:center;cursor:pointer;
        animation:fadeIn 0.3s ease;
      `;

      const inner = document.createElement('div');
      inner.style.cssText = `
        background:${getComputedStyle(placeholder).background};
        width:min(800px,90vw);height:min(500px,60vh);border-radius:16px;
        display:flex;align-items:center;justify-content:center;flex-direction:column;
        gap:16px;color:white;font-size:1.2rem;font-weight:600;position:relative;
        animation:scaleIn 0.35s cubic-bezier(0.34,1.56,0.64,1);
      `;

      inner.innerHTML = `
        <span style="font-size:4rem">🏖️</span>
        <p>${caption.textContent}</p>
        <small style="opacity:0.6;font-size:0.85rem;font-weight:400">Vista Mare Arenella</small>
      `;

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕';
      closeBtn.style.cssText = `
        position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.2);
        border:none;color:white;width:36px;height:36px;border-radius:50%;
        font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;
      `;
      inner.appendChild(closeBtn);
      lightbox.appendChild(inner);
      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';

      const close = () => {
        lightbox.remove();
        document.body.style.overflow = '';
      };

      lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
      closeBtn.addEventListener('click', close);
      document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); }, { once: true });
    });
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `;
  document.head.appendChild(style);

})();
