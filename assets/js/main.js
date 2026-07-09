/* ═══════════════════════════════════════════════════════
   GravinGo — Main Entry
   Orchestrates language system, dynamic content, animations
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {
  await Language.init();
  buildDynamicContent(Language.getData());
  Animations.init();

  Language.onLangChange((data) => {
    buildDynamicContent(data);
  });

  document.querySelectorAll('.lang-switch button').forEach(btn => {
    btn.addEventListener('click', () => {
      Language.setLang(btn.dataset.lang);
    });
  });
});

/* ── Build dynamic sections from translation data ─── */
function buildDynamicContent(data) {
  buildHeroPhones(data);
  buildFeatures(data);
  buildModes(data);
  buildGallery(data);
  buildFAQ(data);
}

/* ── Hero screenshots ─────────────────────────────── */
function buildHeroPhones(data) {
  const left = document.getElementById('hero-phone-left');
  const right = document.getElementById('hero-phone-right');
  if (!left || !right || !data.hero) return;

  const { phone_left: phoneLeft, phone_right: phoneRight } = data.hero;
  if (phoneLeft?.src) {
    left.innerHTML = `<img src="${phoneLeft.src}" alt="${phoneLeft.alt}" width="1242" height="2688" loading="eager">`;
  }
  if (phoneRight?.src) {
    right.innerHTML = `<img src="${phoneRight.src}" alt="${phoneRight.alt}" width="1242" height="2688" loading="eager">`;
  }
}

/* ── Features ─────────────────────────────────────── */
function buildFeatures(data) {
  const grid = document.getElementById('features-grid');
  if (!grid || !data.features) return;

  grid.innerHTML = data.features.items.map(item => `
    <div class="feature-card">
      <span class="feature-icon">${item.icon}</span>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
    </div>
  `).join('');

  reobserveStagger(grid);
}

/* ── Game Modes ───────────────────────────────────── */
function buildModes(data) {
  const grid = document.getElementById('modes-grid');
  if (!grid || !data.modes) return;

  grid.innerHTML = data.modes.items.map(item => `
    <div class="mode-card">
      <span class="mode-icon">${item.icon}</span>
      <span class="mode-tag">${item.tag}</span>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
    </div>
  `).join('');

  reobserveStagger(grid);
}

/* ── Gallery ──────────────────────────────────────── */
function buildGallery(data) {
  const slider = document.getElementById('gallery-slider');
  if (!slider) return;

  const screenshots = data.gallery?.screenshots ?? [];
  if (screenshots.length === 0) return;

  slider.innerHTML = screenshots.map((shot, index) => `
    <div class="gallery-item gallery-item--screenshot">
      <img
        src="${shot.src}"
        alt="${shot.alt}"
        width="1242"
        height="2688"
        loading="${index < 2 ? 'eager' : 'lazy'}"
        decoding="async"
      >
    </div>
  `).join('');
}

/* ── FAQ ──────────────────────────────────────────── */
function buildFAQ(data) {
  const list = document.getElementById('faq-list');
  if (!list || !data.faq) return;

  list.innerHTML = data.faq.items.map(item => `
    <div class="faq-item">
      <button class="faq-question">
        <span>${item.q}</span>
        <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div class="faq-answer">
        <p>${item.a}</p>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── Re-observe stagger children after rebuild ────── */
function reobserveStagger(el) {
  if (!el.classList.contains('stagger-children')) return;
  el.classList.remove('visible');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  observer.observe(el);
}
