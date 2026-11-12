/**
 * Splash Rides — shared script for the landing, waitlist and guide pages.
 * Load it synchronously in <head>:  <script src="/js/site.js"></script>
 *
 * What it does:
 *   1. Cookie consent (banner + Google Consent Mode v2). Same storage key
 *      as the homepage banner ('splash_cookies'), so a choice made on either
 *      carries over.
 *   2. Loads Plausible and the Meta Pixel ONLY after the visitor accepts.
 *   3. Remembers UTM tags for the visit and sends them with form submits.
 *   4. Posts the owner-lead and waitlist forms to the backend.
 *   5. Switches affiliate links on once partner IDs are filled in below.
 *
 * Everything Javier needs to paste lives in CONFIG. Empty value = feature off.
 */
(function () {
  'use strict';

  var CONFIG = {
    apiBase: window.SPLASH_API_BASE || 'https://boatride-api.onrender.com',
    googleAdsId: 'AW-18309350236',
    plausibleDomain: 'splash-inc.com',

    // Meta Pixel ID (Events Manager → Data sources). Empty = Pixel never loads.
    metaPixelId: '',

    // Affiliate partner IDs. Empty = that partner's links stay hidden.
    affiliates: {
      gyg: { partnerId: '' },                 // GetYourGuide Partner ID
      viator: { pid: '', mcid: '42383' }      // Viator PID, e.g. P00123456
    },

    // Affiliate links only show for cities with NO live Splash boats.
    // Set a city to false the day its first boat goes live.
    affiliateCities: { ibiza: true, cartagena: true }
  };
  window.SPLASH_CONFIG = CONFIG;

  var LANG = (document.documentElement.lang || 'en').toLowerCase().indexOf('es') === 0 ? 'es' : 'en';
  var KEY = 'splash_cookies';
  var T = {
    en: {
      cookie: 'We use essential storage to make this site work. With your OK we also use analytics and advertising cookies (Google, Meta) to measure our ads. <a href="/privacy-policy.html">Privacy Policy</a>',
      accept: 'Accept', decline: 'Decline',
      sending: 'Sending…',
      errGeneric: 'Something went wrong. Please try again, or email support@splash-inc.com.',
      errFields: 'Please check the highlighted fields.',
      errRate: 'Too many attempts from this connection. Please try again in an hour.',
      preview: 'Preview: affiliate IDs not set, these links are hidden on the live site'
    },
    es: {
      cookie: 'Usamos almacenamiento esencial para que la web funcione. Si aceptas, también usamos cookies de analítica y publicidad (Google, Meta) para medir nuestros anuncios. <a href="/privacy-policy.html">Política de privacidad</a>',
      accept: 'Aceptar', decline: 'Rechazar',
      sending: 'Enviando…',
      errGeneric: 'Algo ha fallado. Inténtalo de nuevo o escribe a support@splash-inc.com.',
      errFields: 'Revisa los campos marcados.',
      errRate: 'Demasiados intentos desde esta conexión. Inténtalo de nuevo en una hora.',
      preview: 'Vista previa: faltan los ID de afiliado, estos enlaces no se ven en la web real'
    }
  }[LANG];

  function store(kind) { try { return window[kind]; } catch (e) { return null; } }
  function getChoice() { try { return store('localStorage').getItem(KEY); } catch (e) { return null; } }
  function setChoice(v) { try { store('localStorage').setItem(KEY, v); } catch (e) {} }

  // ── 1. Google Consent Mode v2 (same defaults as the homepage) ───────────
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () { window.dataLayer.push(arguments); };
    var gtag = window.gtag;
    gtag('consent', 'default', {
      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied',
      region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH'],
      wait_for_update: 500
    });
    gtag('consent', 'default', {
      ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted'
    });
    var c0 = getChoice();
    if (c0 === 'accept' || c0 === 'decline') updateGoogleConsent(c0);
    var gs = document.createElement('script');
    gs.async = true;
    gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.googleAdsId;
    document.head.appendChild(gs);
    gtag('js', new Date());
    gtag('config', CONFIG.googleAdsId);
  }
  function updateGoogleConsent(choice) {
    var v = choice === 'accept' ? 'granted' : 'denied';
    window.gtag('consent', 'update', { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
  }

  // ── 2. Plausible + Meta Pixel, only after Accept ────────────────────────
  // plausible() calls made before the script loads are queued and replayed.
  window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
  var plausibleLoaded = false;
  function loadPlausible() {
    if (plausibleLoaded || document.querySelector('script[data-domain]')) return;
    plausibleLoaded = true;
    var s = document.createElement('script');
    s.defer = true;
    s.setAttribute('data-domain', CONFIG.plausibleDomain);
    s.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(s);
  }
  function loadPixel() {
    if (!CONFIG.metaPixelId || window.fbq) return;
    /* Meta's standard loader */
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = true; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', CONFIG.metaPixelId);
    window.fbq('track', 'PageView');
  }
  function track(name, props) {
    try { window.plausible(name, props ? { props: props } : undefined); } catch (e) {}
  }

  function applyConsent(choice) {
    updateGoogleConsent(choice);
    if (choice === 'accept') {
      loadPlausible();
      loadPixel();
      persistUtm();
    } else if (window.fbq) {
      window.fbq('consent', 'revoke');
    }
  }
  if (getChoice() === 'accept') { loadPlausible(); loadPixel(); }

  // ── 3. UTM tags ─────────────────────────────────────────────────────────
  // Kept in memory for this page; written to sessionStorage (so they survive
  // a click to another page) only once the visitor has accepted cookies.
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
  var utm = (function () {
    var saved = null;
    try { saved = JSON.parse(store('sessionStorage').getItem('splash_utm') || 'null'); } catch (e) {}
    if (saved) return saved;
    var out = { referrer: document.referrer || null, landing_page: location.pathname };
    try {
      var qs = new URLSearchParams(location.search);
      UTM_KEYS.forEach(function (k) { var v = qs.get(k); if (v) out[k] = v.slice(0, 120); });
    } catch (e) {}
    return out;
  })();
  function persistUtm() {
    try { store('sessionStorage').setItem('splash_utm', JSON.stringify(utm)); } catch (e) {}
  }
  if (getChoice() === 'accept') persistUtm();

  function cookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }

  // ── Cookie banner ───────────────────────────────────────────────────────
  function showBanner() {
    var el = document.getElementById('splashCookie');
    if (!el) {
      el = document.createElement('div');
      el.id = 'splashCookie';
      el.className = 'sp-cookie';
      el.setAttribute('role', 'region');
      el.setAttribute('aria-label', 'Cookies');
      el.innerHTML = '<p>' + T.cookie + '</p><div class="sp-cookie-btns">' +
        '<button type="button" data-c="decline">' + T.decline + '</button>' +
        '<button type="button" data-c="accept">' + T.accept + '</button></div>';
      el.addEventListener('click', function (e) {
        var c = e.target && e.target.getAttribute && e.target.getAttribute('data-c');
        if (!c) return;
        setChoice(c);
        applyConsent(c);
        el.classList.remove('show');
      });
      document.body.appendChild(el);
    }
    el.classList.add('show');
  }

  // ── 4. Forms ────────────────────────────────────────────────────────────
  function initForm(form) {
    var kind = form.getAttribute('data-splash-form');           // owner-lead | waitlist
    var btn = form.querySelector('button[type="submit"]');
    var btnText = btn ? btn.textContent : '';
    var errBox = form.querySelector('[data-form-error]');
    var success = document.querySelector('[data-form-success="' + kind + '"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var payload = { lang: LANG };
      new FormData(form).forEach(function (v, k) { payload[k] = typeof v === 'string' ? v.trim() : v; });
      UTM_KEYS.concat(['referrer', 'landing_page']).forEach(function (k) { if (utm[k]) payload[k] = utm[k]; });
      payload.landing_page = payload.landing_page || location.pathname;
      var consented = getChoice() === 'accept';
      var eventId = 'sp-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
      if (consented) {
        payload.ad_consent = true;
        payload.event_id = eventId;
        if (cookie('_fbp')) payload.fbp = cookie('_fbp');
        if (cookie('_fbc')) payload.fbc = cookie('_fbc');
      }

      if (errBox) errBox.hidden = true;
      form.querySelectorAll('.sp-invalid').forEach(function (el) { el.classList.remove('sp-invalid'); });
      if (btn) { btn.disabled = true; btn.textContent = T.sending; }

      fetch(CONFIG.apiBase + '/api/marketing/' + kind, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (body) { return { status: r.status, ok: r.ok, body: body }; });
      }).then(function (res) {
        if (!res.ok) {
          var msg = T.errGeneric;
          if (res.status === 429) msg = T.errRate;
          if (res.status === 400) {
            msg = T.errFields;
            Object.keys(res.body.fields || {}).forEach(function (f) {
              var el = form.querySelector('[name="' + f + '"]');
              if (el) el.classList.add('sp-invalid');
            });
          }
          throw new Error(msg);
        }
        var props = { lang: LANG, source: utm.utm_source || 'direct' };
        if (kind === 'owner-lead') {
          track('Lead Submitted', props);
          if (window.fbq) window.fbq('track', 'Lead', {}, { eventID: eventId });
        } else {
          props.city = payload.city || '';
          track('Waitlist Joined', props);
          if (window.fbq) window.fbq('track', 'CompleteRegistration', {}, { eventID: eventId });
        }
        form.hidden = true;
        if (success) {
          success.hidden = false;
          success.setAttribute('tabindex', '-1');
          success.focus();
        }
      }).catch(function (err) {
        if (btn) { btn.disabled = false; btn.textContent = btnText; }
        if (errBox) {
          errBox.textContent = (err && err.message && err.message !== 'Failed to fetch') ? err.message : T.errGeneric;
          errBox.hidden = false;
        }
      });
    });
  }

  // ── 5. Affiliate links ──────────────────────────────────────────────────
  function affiliateUrl(provider, url, campaign) {
    var a = CONFIG.affiliates, u;
    try { u = new URL(url); } catch (e) { return null; }
    if (provider === 'gyg') {
      if (!a.gyg.partnerId) return null;
      u.searchParams.set('partner_id', a.gyg.partnerId);
      u.searchParams.set('utm_medium', 'online_publisher');
      if (campaign) u.searchParams.set('cmp', campaign);
      return u.toString();
    }
    if (provider === 'viator') {
      if (!a.viator.pid) return null;
      u.searchParams.set('pid', a.viator.pid);
      u.searchParams.set('mcid', a.viator.mcid);
      u.searchParams.set('medium', 'link');
      if (campaign) u.searchParams.set('campaign', campaign.replace(/[^A-Za-z0-9_-]/g, ''));
      return u.toString();
    }
    return null;
  }
  function initAffiliates() {
    var preview = /[?&]aff_preview=1/.test(location.search);
    document.querySelectorAll('[data-aff-block]').forEach(function (block) {
      var city = block.getAttribute('data-aff-block');
      var live = 0;
      block.querySelectorAll('a[data-aff]').forEach(function (a) {
        var provider = a.getAttribute('data-aff');
        var url = CONFIG.affiliateCities[city] ? affiliateUrl(provider, a.getAttribute('data-aff-url'), a.getAttribute('data-aff-campaign')) : null;
        var item = a.closest('[data-aff-item]') || a;
        if (url) {
          a.href = url;
          live++;
          a.addEventListener('click', function () { track('Affiliate Click', { provider: provider, city: city, lang: LANG }); });
        } else if (preview) {
          a.href = a.getAttribute('data-aff-url');
        } else {
          item.hidden = true;
          return;
        }
        a.rel = 'sponsored nofollow noopener';
        a.target = '_blank';
      });
      if (preview && !live) {
        var note = document.createElement('p');
        note.className = 'aff-preview';
        note.textContent = T.preview;
        block.insertBefore(note, block.firstChild);
      }
      block.hidden = !(live || preview);
    });
  }

  function init() {
    if (!getChoice() && !document.getElementById('cookieBanner')) showBanner();
    document.querySelectorAll('[data-cookie-settings]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); showBanner(); });
    });
    document.querySelectorAll('form[data-splash-form]').forEach(initForm);
    initAffiliates();

    // Preselect the waitlist city from ?city=ibiza
    try {
      var city = new URLSearchParams(location.search).get('city');
      var sel = document.querySelector('form[data-splash-form="waitlist"] [name="city"]');
      city = (city || '').toLowerCase().replace(/[^a-z]/g, '');
      if (city && sel && sel.querySelector('option[value="' + city + '"]')) sel.value = city;
    } catch (e) {}

    // App Store clicks: Plausible goal + the existing Google Ads conversion for Splash Pro.
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href*="apps.apple.com"]') : null;
      if (!a) return;
      var pro = a.href.indexOf('id6768137397') !== -1;
      track('App Store Click', { app: pro ? 'pro' : 'rides', lang: LANG });
      if (pro) window.gtag('event', 'conversion', { send_to: CONFIG.googleAdsId + '/AcnUCK_OgoUdENyGyppE', transport_type: 'beacon' });
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.SplashSite = { track: track, showCookieBanner: showBanner, affiliateUrl: affiliateUrl };
})();
