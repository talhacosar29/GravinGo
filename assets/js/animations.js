/* ═══════════════════════════════════════════════════════
   GravinGo — Animations
   Intersection Observer, parallax, ripple, stars
   ═══════════════════════════════════════════════════════ */

const Animations = (() => {

  /* ── Stars Background ───────────────────────────── */
  function initStars() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let mouse = { x: 0, y: 0 };
    let raf;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createStars() {
      stars = [];
      const count = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.4 + 0.3,
          speed: Math.random() * 0.3 + 0.05,
          opacity: Math.random() * 0.6 + 0.2,
          flicker: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const px = (mouse.x / window.innerWidth - 0.5) * 8;
      const py = (mouse.y / window.innerHeight - 0.5) * 8;

      for (const s of stars) {
        s.flicker += 0.008;
        const o = s.opacity + Math.sin(s.flicker) * 0.15;
        ctx.beginPath();
        ctx.arc(s.x + px * s.r, s.y + py * s.r, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${Math.max(0, o)})`;
        ctx.fill();
        s.y += s.speed;
        if (s.y > canvas.height + 5) {
          s.y = -5;
          s.x = Math.random() * canvas.width;
        }
      }
      raf = requestAnimationFrame(draw);
    }

    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('resize', () => {
      resize();
      createStars();
    });

    resize();
    createStars();
    draw();
  }

  /* ── Scroll Reveal (Intersection Observer) ──────── */
  function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale, .stagger-children');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(el => observer.observe(el));
  }

  /* ── Button Ripple ──────────────────────────────── */
  function initRipple() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.ripple');
      if (!btn) return;

      const circle = document.createElement('span');
      circle.classList.add('ripple-effect');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(circle);
      circle.addEventListener('animationend', () => circle.remove());
    });
  }

  /* ── Navbar Scroll ──────────────────────────────── */
  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          navbar.classList.toggle('scrolled', window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ── Gallery Slider ─────────────────────────────── */
  function initGallerySlider() {
    const slider = document.querySelector('.gallery-slider');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    if (!slider) return;

    const scrollAmount = 300;

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    }
  }

  /* ── Mobile Nav Toggle ──────────────────────────── */
  function initMobileNav() {
    const hamburger = document.querySelector('.nav-hamburger');
    const links = document.querySelector('.nav-links');
    if (!hamburger || !links) return;

    function closeMenu() {
      hamburger.classList.remove('active');
      links.classList.remove('open');
      document.body.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }

    function openMenu() {
      hamburger.classList.add('active');
      links.classList.add('open');
      document.body.classList.add('nav-open');
      hamburger.setAttribute('aria-expanded', 'true');
    }

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (links.classList.contains('open')) closeMenu();
      else openMenu();
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (!links.classList.contains('open')) return;
      if (!links.contains(e.target) && !hamburger.contains(e.target)) {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 992) closeMenu();
    });
  }

  /* ── Smooth Scroll ──────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        e.preventDefault();
        const id = anchor.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ── Init All ───────────────────────────────────── */
  function init() {
    initStars();
    initNavbarScroll();
    initScrollReveal();
    initRipple();
    initGallerySlider();
    initMobileNav();
    initSmoothScroll();
  }

  return { init };
})();
