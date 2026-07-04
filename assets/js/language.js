/* ═══════════════════════════════════════════════════════
   GravinGo — Language System
   JSON-based i18n with no page reload
   ═══════════════════════════════════════════════════════ */

const Language = (() => {
  let currentLang = 'en';
  let translations = {};
  const listeners = [];

  function getNestedValue(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
  }

  async function load(lang) {
    if (translations[lang]) return translations[lang];
    const resp = await fetch(`assets/lang/${lang}.json`);
    translations[lang] = await resp.json();
    return translations[lang];
  }

  async function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('gravingo-lang', lang);
    const data = await load(lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = getNestedValue(data, key);
      if (val) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const val = getNestedValue(data, key);
      if (val) el.innerHTML = val;
    });

    document.querySelectorAll('.lang-switch button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.documentElement.lang = lang;
    listeners.forEach(fn => fn(data, lang));
  }

  function onLangChange(fn) {
    listeners.push(fn);
  }

  function getLang() {
    return currentLang;
  }

  function getData() {
    return translations[currentLang] || {};
  }

  async function init() {
    const saved = localStorage.getItem('gravingo-lang');
    const browserLang = navigator.language.slice(0, 2);
    const lang = saved || (['tr', 'en'].includes(browserLang) ? browserLang : 'en');
    await setLang(lang);
  }

  return { init, setLang, onLangChange, getLang, getData };
})();
