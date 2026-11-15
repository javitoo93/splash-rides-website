/**
 * Splash Rides — floating "List your boat" button.
 * Include on any page:  <script src="/js/owner-cta.js" defer></script>
 *
 * - Shows a pill button, bottom right, that opens the owner form
 *   (/list-your-boat, or /publica-tu-barco when the page is in Spanish).
 * - Follows the page language, including the homepage EN/ES toggle.
 * - Sits above the cookie banner while the banner is showing.
 * - Also keeps any link with data-lang-href-es pointing at the Spanish page
 *   when the page is in Spanish.
 *
 * Not included on the owner form pages themselves or on the legal pages.
 */
(function () {
  'use strict';

  var TXT = {
    en: { title: 'List your boat', sub: "We'll set it up for you", href: '/list-your-boat' },
    es: { title: 'Publica tu barco', sub: 'Te lo montamos nosotros', href: '/publica-tu-barco' }
  };

  function lang() {
    return (document.documentElement.lang || 'en').toLowerCase().indexOf('es') === 0 ? 'es' : 'en';
  }

  // Keep ad tags if the visitor arrived with them; otherwise tag the lead as
  // coming from this button so it can be told apart from ad traffic.
  function query() {
    var out = [];
    try {
      var qs = new URLSearchParams(location.search);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach(function (k) {
        var v = qs.get(k);
        if (v) out.push(k + '=' + encodeURIComponent(v.slice(0, 120)));
      });
    } catch (e) {}
    if (!out.length) {
      out.push('utm_source=website', 'utm_medium=floating_button',
        'utm_content=' + encodeURIComponent(location.pathname.slice(0, 80)));
    }
    return '?' + out.join('&');
  }

  var CSS =
    '.sp-fab{position:fixed;right:18px;z-index:9990;display:flex;align-items:center;gap:10px;' +
    'bottom:calc(18px + env(safe-area-inset-bottom, 0px) + var(--sp-fab-lift, 0px));' +
    'padding:11px 20px 11px 14px;border-radius:999px;background:#ffb703;color:#0b1d3a;text-decoration:none;' +
    "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;" +
    'box-shadow:0 10px 30px rgba(11,29,58,.3);transition:transform .15s ease,bottom .2s ease}' +
    '.sp-fab:hover{transform:translateY(-2px)}' +
    '.sp-fab:focus-visible{outline:3px solid #0b1d3a;outline-offset:3px}' +
    '.sp-fab svg{flex:none;width:30px;height:30px}' +
    '.sp-fab b{display:block;font-size:.95rem;font-weight:700;line-height:1.2}' +
    '.sp-fab small{display:block;font-size:.76rem;font-weight:500;line-height:1.25;opacity:.85}' +
    '@media(max-width:640px){.sp-fab{right:12px;padding:9px 16px 9px 11px;gap:8px}' +
    '.sp-fab svg{width:26px;height:26px}.sp-fab b{font-size:.88rem}.sp-fab small{font-size:.7rem}}' +
    '@media(prefers-reduced-motion:reduce){.sp-fab{transition:none}}' +
    '@media print{.sp-fab{display:none}}';

  var ICON =
    '<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="#0b1d3a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M16 4v16"/><path d="M16 6l9 12h-9"/><path d="M13 9l-6 9h6"/>' +
    '<path d="M4 22h24l-3 5H7z" fill="#0b1d3a"/></svg>';

  var fab;

  function render() {
    var t = TXT[lang()];
    if (fab) {
      fab.href = t.href + query() + '#form';
      fab.querySelector('b').textContent = t.title;
      fab.querySelector('small').textContent = t.sub;
    }
    // Language-aware links elsewhere on the page.
    document.querySelectorAll('[data-lang-href-es]').forEach(function (a) {
      if (!a.hasAttribute('data-lang-href-en')) a.setAttribute('data-lang-href-en', a.getAttribute('href'));
      a.setAttribute('href', a.getAttribute(lang() === 'es' ? 'data-lang-href-es' : 'data-lang-href-en'));
    });
  }

  // Lift the button above whichever cookie banner is showing.
  function place() {
    if (!fab) return;
    var lift = 0;
    ['cookieBanner', 'splashCookie'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.classList.contains('show')) lift = Math.max(lift, el.offsetHeight);
    });
    fab.style.setProperty('--sp-fab-lift', lift + 'px');
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    fab = document.createElement('a');
    fab.className = 'sp-fab';
    fab.innerHTML = ICON + '<span><b></b><small></small></span>';
    fab.addEventListener('click', function () {
      try { if (window.plausible) window.plausible('List Boat Button Click', { props: { page: location.pathname, lang: lang() } }); } catch (e) {}
    });
    document.body.appendChild(fab);

    render();
    place();

    // Language switch (the homepage toggle changes <html lang>).
    try {
      new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    } catch (e) {}

    // Cookie banners appear and disappear by toggling a class, or are added later.
    try {
      new MutationObserver(place).observe(document.body, {
        attributes: true, attributeFilter: ['class'], childList: true, subtree: true
      });
    } catch (e) {}
    window.addEventListener('resize', place);
    window.addEventListener('load', place);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
