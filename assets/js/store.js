/* ═══════════════════════════════════════════════════════
   GravinGo — Store Links & Device Detection
   ═══════════════════════════════════════════════════════ */

const STORE = {
  appStore: 'https://apps.apple.com/us/app/gravingo/id6787402316',
  playStore: 'https://play.google.com/store/apps/details?id=com.talhacosar.gravingo',

  detectPlatform() {
    const ua = navigator.userAgent || '';
    if (/android/i.test(ua)) return 'android';
    if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      return 'ios';
    }
    return 'other';
  },

  getUrl(platform = this.detectPlatform()) {
    if (platform === 'ios') return this.appStore;
    if (platform === 'android') return this.playStore;
    return null;
  },

  applyLinks() {
    document.querySelectorAll('[data-store="appstore"]').forEach(el => {
      el.href = this.appStore;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    });
    document.querySelectorAll('[data-store="googleplay"]').forEach(el => {
      el.href = this.playStore;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    });
  },

  redirectIfMobile(delay = 1200) {
    const url = this.getUrl();
    if (!url) return false;
    window.setTimeout(() => {
      window.location.replace(url);
    }, delay);
    return true;
  }
};
