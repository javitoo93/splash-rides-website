/**
 * Splash Website — Internationalization (i18n)
 * 
 * Automatically detects browser language and shows Spanish or English.
 * Usage:
 *   1. Add data-i18n="key" attributes to HTML elements
 *   2. Add data-i18n-placeholder="key" for input placeholders
 *   3. Add data-i18n-alt="key" for image alt text
 *   4. Call i18n.init() on page load (auto-called at bottom of this script)
 *   5. Call i18n.setLanguage('es') or i18n.setLanguage('en') to switch manually
 */

const i18n = (() => {
  // ─── Translation Dictionaries ───────────────────────────────────────
  const translations = {
    en: {
      // Nav
      "nav.renters": "For Renters",
      "nav.owners": "For Owners",
      "nav.safety": "Safety",
      "nav.download": "Download",
      "nav.cta": "Get the App",

      // Hero
      "hero.badge": "Now Available Nationwide",
      "hero.title": "The easiest way to get on the <em>water</em>",
      "hero.title.1": "Rent a Boat.",
      "hero.title.2": "List Your Boat.",
      "hero.title.em": "Nationwide.",
      "hero.subtitle": "Splash connects you with verified boats and USCG-licensed captains across the U.S. — book in under a minute from your phone.",

      // Path Cards
      "path.renter.title": "I want to rent a boat",
      "path.renter.desc": "Browse boats near you, pick a date, and we'll match you with a licensed captain. No experience needed.",
      "path.renter.cta": "Explore Splash",
      "path.owner.title": "I want to list my boat",
      "path.owner.desc": "Turn your boat into a business. Set your rates, manage bookings, and get paid — we handle the rest.",
      "path.owner.cta": "Explore Splash Pro",

      // For Renters
      "renters.label": "For Renters",
      "renters.heading": "On the water in three taps",
      "renters.subheading": "No phone calls, no paperwork, no boating license required when you book with a captain.",
      "renters.step1.title": "Browse boats near you",
      "renters.step1.desc": "Filter by type, size, price, and amenities. See real photos, ratings, and reviews from other renters.",
      "renters.step2.title": "Pick a date & book instantly",
      "renters.step2.desc": "Choose your day, time, and duration. Your card is held — you're only charged 24 hours before the trip.",
      "renters.step3.title": "Show up & enjoy",
      "renters.step3.desc": "Meet your USCG-licensed captain at the marina. They handle the driving — you just relax and have fun.",
      "renters.mockup.tagline": "Download free on iOS & Android",

      // Feature Pills
      "pill.captains": "⚓ Verified Captains",
      "pill.payments": "💳 Secure Payments",
      "pill.reviews": "⭐ Real Reviews",
      "pill.chat": "💬 In-App Chat",
      "pill.tracking": "📍 Live Trip Tracking",
      "pill.insured": "🛡️ Insured Boats",
      "pill.cities": "🌊 50+ Cities",
      "pill.cancellation": "❌ Free Cancellation*",

      // Renter Features
      "rf.captains.title": "Licensed Captains Only",
      "rf.captains.desc": "Every captain is verified with a valid U.S. Coast Guard license and government ID before they can accept any booking.",
      "rf.pay.title": "Pay Only When It's Real",
      "rf.pay.desc": "Your card is authorized at booking but only charged 24 hours before departure. Cancel before that — full refund.",
      "rf.insured.title": "Every Boat Insured",
      "rf.insured.desc": "All boats must carry liability insurance that meets their state's requirements before going live on Splash.",
      "rf.chat.title": "Chat in the App",
      "rf.chat.desc": "Message your captain or boat owner directly. Ask questions, coordinate pickup details — all in one place.",
      "rf.reviews.title": "Honest Reviews",
      "rf.reviews.desc": "Every review is from a real renter who completed a real trip. No fakes, no paid reviews.",
      "rf.coast.title": "Coast to Coast",
      "rf.coast.desc": "From Miami to Seattle, the Great Lakes to the Gulf — find boats wherever your next trip takes you.",

      // For Owners
      "owners.label": "For Boat Owners & Captains",
      "owners.heading": "Your boat. Your schedule. Your income.",
      "owners.subheading": "List your boat on Splash Pro and start earning. We handle bookings, payments, and customer support so you can focus on the water.",
      "owners.point1": "Set your own hourly/daily rates and availability",
      "owners.point2": "Get paid within 2–3 days — or instantly for a small fee",
      "owners.point3": "Captain your own boat or assign verified captains",
      "owners.point4": "Full earnings dashboard, payout tracking, and tax reports",
      "owners.point5": "We handle payment processing, disputes, and support",
      "owners.point6": "List from any state — Splash Pro works nationwide",
      "owners.cta": "Download Splash Pro →",
      "owners.earnings.title": "Estimated Monthly Earnings",
      "owners.weekday": "Weekday trips (8×)",
      "owners.weekend": "Weekend trips (8×)",
      "owners.fee": "Platform fee (20%)",
      "owners.takehome": "Your take-home",

      // Safety
      "safety.label": "Safety First",
      "safety.heading": "We take safety seriously",
      "safety.subheading": "Every boat and captain on Splash is verified before they can accept a single booking.",
      "safety.captain.title": "Captain Verification",
      "safety.captain.desc": "USCG license and government ID reviewed and approved by our team before any captain goes live.",
      "safety.vessel.title": "Vessel Requirements",
      "safety.vessel.desc": "Current registration, required safety equipment, and adequate liability insurance — verified before listing.",
      "safety.briefing.title": "Safety Briefings",
      "safety.briefing.desc": "Captains conduct a mandatory pre-departure briefing covering emergency procedures and safety equipment.",
      "safety.weather.title": "Weather Monitoring",
      "safety.weather.desc": "Real-time weather alerts. Captains have full authority to cancel or postpone any trip for safety.",
      "safety.messaging.title": "Secure Messaging",
      "safety.messaging.desc": "All communication is in-app. Personal contact sharing is blocked to protect everyone involved.",
      "safety.compliance.title": "State Compliance",
      "safety.compliance.desc": "Owners must meet their state's insurance and permit requirements. We verify documentation before going live.",

      // Reviews
      "reviews.heading": "What people are saying",
      "review1.text": "So much easier than calling marinas. Found a pontoon, booked in under a minute, captain was amazing. Best sunset cruise ever.",
      "review1.author": "Jessica M.",
      "review1.location": "· St. Petersburg, FL",
      "review2.text": "I list my 28-footer on weekends with Splash Pro. The extra income covers my slip fees and maintenance. Painless.",
      "review2.author": "Captain Tony R.",
      "review2.location": "· San Diego, CA",
      "review3.text": "Family fishing trip on Lake Michigan. Captain knew exactly where to go, kids had a blast. Already booked our next one.",
      "review3.author": "David L.",
      "review3.location": "· Chicago, IL",

      // Download CTA
      "cta.heading": "Ready to make a splash?",
      "cta.subheading": "Download Splash to rent a boat — or Splash Pro to list yours and start earning.",
      "cta.download.splash": "Splash",
      "cta.download.pro": "Splash Pro",
      "cta.download.label": "Download",

      // Footer
      "footer.desc": "The easiest way to rent a boat or list yours in the United States. Browse, book, and earn — all from your phone.",
      "footer.renters": "Renters",
      "footer.howItWorks": "How It Works",
      "footer.browseBoats": "Browse Boats",
      "footer.safety": "Safety",
      "footer.downloadSplash": "Download Splash",
      "footer.owners": "Owners",
      "footer.listYourBoat": "List Your Boat",
      "footer.earnings": "Earnings",
      "footer.downloadPro": "Download Splash Pro",
      "footer.legal": "Legal",
      "footer.terms": "Terms of Service",
      "footer.privacy": "Privacy Policy",
      "footer.contact": "Contact",
      "footer.rights": "© 2026 Splash Inc. All rights reserved.",
      "footer.madeWith": "Made with 🌊 for the boating community"
    },

    es: {
      // Nav
      "nav.renters": "Para Clientes",
      "nav.owners": "Para Propietarios",
      "nav.safety": "Seguridad",
      "nav.download": "Descargar",
      "nav.cta": "Obtener la App",

      // Hero
      "hero.badge": "Disponible en Todo el País",
      "hero.title": "La forma más fácil de estar en el <em>agua</em>",
      "hero.title.1": "Alquila un Barco.",
      "hero.title.2": "Publica Tu Barco.",
      "hero.title.em": "En Todo el País.",
      "hero.subtitle": "Splash te conecta con barcos verificados y capitanes con licencia USCG en todo EE.UU. — reserva en menos de un minuto desde tu teléfono.",

      // Path Cards
      "path.renter.title": "Quiero alquilar un barco",
      "path.renter.desc": "Busca barcos cerca de ti, elige una fecha y te conectaremos con un capitán con licencia. No se necesita experiencia.",
      "path.renter.cta": "Explorar Splash",
      "path.owner.title": "Quiero publicar mi barco",
      "path.owner.desc": "Convierte tu barco en un negocio. Establece tus tarifas, administra reservas y recibe pagos — nosotros nos encargamos del resto.",
      "path.owner.cta": "Explorar Splash Pro",

      // For Renters
      "renters.label": "Para Clientes",
      "renters.heading": "En el agua en tres toques",
      "renters.subheading": "Sin llamadas, sin papeleo, sin licencia de navegación cuando reservas con un capitán.",
      "renters.step1.title": "Busca barcos cerca de ti",
      "renters.step1.desc": "Filtra por tipo, tamaño, precio y comodidades. Ve fotos reales, calificaciones y reseñas de otros clientes.",
      "renters.step2.title": "Elige una fecha y reserva al instante",
      "renters.step2.desc": "Escoge tu día, hora y duración. Tu tarjeta se retiene — solo se cobra 24 horas antes del viaje.",
      "renters.step3.title": "Preséntate y disfruta",
      "renters.step3.desc": "Encuentra a tu capitán con licencia USCG en la marina. Él conduce — tú solo relájate y disfruta.",
      "renters.mockup.tagline": "Descarga gratis en iOS y Android",

      // Feature Pills
      "pill.captains": "⚓ Capitanes Verificados",
      "pill.payments": "💳 Pagos Seguros",
      "pill.reviews": "⭐ Reseñas Reales",
      "pill.chat": "💬 Chat en la App",
      "pill.tracking": "📍 Rastreo en Vivo",
      "pill.insured": "🛡️ Barcos Asegurados",
      "pill.cities": "🌊 50+ Ciudades",
      "pill.cancellation": "❌ Cancelación Gratis*",

      // Renter Features
      "rf.captains.title": "Solo Capitanes con Licencia",
      "rf.captains.desc": "Cada capitán está verificado con una licencia válida de la Guardia Costera de EE.UU. e identificación oficial antes de aceptar reservas.",
      "rf.pay.title": "Paga Solo Cuando Es Real",
      "rf.pay.desc": "Tu tarjeta se autoriza al reservar pero solo se cobra 24 horas antes de la salida. Cancela antes — reembolso total.",
      "rf.insured.title": "Todos los Barcos Asegurados",
      "rf.insured.desc": "Todos los barcos deben tener seguro de responsabilidad que cumpla con los requisitos de su estado antes de publicarse en Splash.",
      "rf.chat.title": "Chatea en la App",
      "rf.chat.desc": "Envía mensajes a tu capitán o dueño del barco directamente. Haz preguntas, coordina detalles — todo en un solo lugar.",
      "rf.reviews.title": "Reseñas Honestas",
      "rf.reviews.desc": "Cada reseña es de un cliente real que completó un viaje real. Sin falsas, sin reseñas pagadas.",
      "rf.coast.title": "De Costa a Costa",
      "rf.coast.desc": "De Miami a Seattle, los Grandes Lagos al Golfo — encuentra barcos donde sea que te lleve tu próximo viaje.",

      // For Owners
      "owners.label": "Para Dueños de Barcos y Capitanes",
      "owners.heading": "Tu barco. Tu horario. Tu ingreso.",
      "owners.subheading": "Publica tu barco en Splash Pro y comienza a ganar. Nosotros nos encargamos de las reservas, pagos y soporte al cliente para que tú te enfoques en el agua.",
      "owners.point1": "Establece tus propias tarifas por hora/día y disponibilidad",
      "owners.point2": "Recibe pagos en 2-3 días — o al instante por una pequeña comisión",
      "owners.point3": "Capitanea tu propio barco o asigna capitanes verificados",
      "owners.point4": "Panel completo de ganancias, seguimiento de pagos e informes fiscales",
      "owners.point5": "Nosotros manejamos el procesamiento de pagos, disputas y soporte",
      "owners.point6": "Publica desde cualquier estado — Splash Pro funciona en todo el país",
      "owners.cta": "Descargar Splash Pro →",
      "owners.earnings.title": "Ganancias Mensuales Estimadas",
      "owners.weekday": "Viajes entre semana (8×)",
      "owners.weekend": "Viajes de fin de semana (8×)",
      "owners.fee": "Comisión de la plataforma (20%)",
      "owners.takehome": "Tu ingreso neto",

      // Safety
      "safety.label": "La Seguridad Primero",
      "safety.heading": "Nos tomamos la seguridad en serio",
      "safety.subheading": "Cada barco y capitán en Splash está verificado antes de que puedan aceptar una sola reserva.",
      "safety.captain.title": "Verificación de Capitanes",
      "safety.captain.desc": "Licencia USCG e identificación oficial revisadas y aprobadas por nuestro equipo antes de que cualquier capitán se active.",
      "safety.vessel.title": "Requisitos de Embarcación",
      "safety.vessel.desc": "Registro vigente, equipo de seguridad requerido y seguro de responsabilidad adecuado — verificado antes de la publicación.",
      "safety.briefing.title": "Sesiones de Seguridad",
      "safety.briefing.desc": "Los capitanes realizan una sesión obligatoria antes de la salida cubriendo procedimientos de emergencia y equipo de seguridad.",
      "safety.weather.title": "Monitoreo del Clima",
      "safety.weather.desc": "Alertas meteorológicas en tiempo real. Los capitanes tienen autoridad total para cancelar o posponer cualquier viaje por seguridad.",
      "safety.messaging.title": "Mensajería Segura",
      "safety.messaging.desc": "Toda la comunicación es dentro de la app. El intercambio de contacto personal está bloqueado para proteger a todos.",
      "safety.compliance.title": "Cumplimiento Estatal",
      "safety.compliance.desc": "Los propietarios deben cumplir con los requisitos de seguro y permisos de su estado. Verificamos la documentación antes de la publicación.",

      // Reviews
      "reviews.heading": "Lo que dice la gente",
      "review1.text": "Mucho más fácil que llamar a las marinas. Encontré un pontón, reservé en menos de un minuto, el capitán fue increíble. El mejor crucero al atardecer.",
      "review1.author": "Jessica M.",
      "review1.location": "· St. Petersburg, FL",
      "review2.text": "Publico mi bote de 28 pies los fines de semana con Splash Pro. El ingreso extra cubre el muelle y el mantenimiento. Sin complicaciones.",
      "review2.author": "Capitán Tony R.",
      "review2.location": "· San Diego, CA",
      "review3.text": "Viaje de pesca familiar en el Lago Michigan. El capitán sabía exactamente adónde ir, los niños se divirtieron mucho. Ya reservamos el siguiente.",
      "review3.author": "David L.",
      "review3.location": "· Chicago, IL",

      // Download CTA
      "cta.heading": "¿Listo para hacer un splash?",
      "cta.subheading": "Descarga Splash para alquilar un barco — o Splash Pro para publicar el tuyo y empezar a ganar.",
      "cta.download.splash": "Splash",
      "cta.download.pro": "Splash Pro",
      "cta.download.label": "Descargar",

      // Footer
      "footer.desc": "La forma más fácil de alquilar un barco o publicar el tuyo en Estados Unidos. Busca, reserva y gana — todo desde tu teléfono.",
      "footer.renters": "Clientes",
      "footer.howItWorks": "Cómo Funciona",
      "footer.browseBoats": "Buscar Barcos",
      "footer.safety": "Seguridad",
      "footer.downloadSplash": "Descargar Splash",
      "footer.owners": "Propietarios",
      "footer.listYourBoat": "Publicar Tu Barco",
      "footer.earnings": "Ganancias",
      "footer.downloadPro": "Descargar Splash Pro",
      "footer.legal": "Legal",
      "footer.terms": "Términos de Servicio",
      "footer.privacy": "Política de Privacidad",
      "footer.contact": "Contacto",
      "footer.rights": "© 2026 Splash Inc. Todos los derechos reservados.",
      "footer.madeWith": "Hecho con 🌊 para la comunidad náutica"
    }
  };

  let currentLang = 'en';

  // ─── Detect browser language ──────────────────────────────────────
  function detectLanguage() {
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    // Check if Spanish variant (es, es-MX, es-ES, es-419, etc.)
    if (browserLang.startsWith('es')) return 'es';
    return 'en';
  }

  // ─── Get translation for a key ────────────────────────────────────
  function t(key) {
    const dict = translations[currentLang] || translations.en;
    return dict[key] || translations.en[key] || key;
  }

  // ─── Apply translations to all data-i18n elements ─────────────────
  function applyTranslations() {
    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });

    // innerHTML (for elements containing HTML like <em>)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (key) el.innerHTML = t(key);
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.placeholder = t(key);
    });

    // Alt text
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key = el.getAttribute('data-i18n-alt');
      if (key) el.alt = t(key);
    });

    // Title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) el.title = t(key);
    });

    // Update html lang attribute
    document.documentElement.lang = currentLang;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = currentLang === 'es'
        ? 'Splash conecta a clientes de barcos con propietarios verificados y capitanes con licencia USCG en todo EE.UU. Descarga la app Splash para alquilar o Splash Pro para ganar.'
        : 'Splash connects boat renters with verified owners and USCG-licensed captains across the U.S. Download the Splash app to rent or the Splash Pro app to earn.';
    }

    // Dispatch event so other scripts can react
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
  }

  // ─── Public: set language ─────────────────────────────────────────
  function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'es') return;
    currentLang = lang;
    localStorage.setItem('splash_lang', lang);
    applyTranslations();
  }

  // ─── Public: get current language ─────────────────────────────────
  function getLanguage() {
    return currentLang;
  }

  // ─── Public: toggle language ──────────────────────────────────────
  function toggleLanguage() {
    setLanguage(currentLang === 'en' ? 'es' : 'en');
  }

  // ─── Currency formatting ─────────────────────────────────────────
  function formatCurrency(amountUSD) {
    const region = localStorage.getItem('splash_region') || 'us';
    const rates = { us: 1, eu: 0.92, uk: 0.79, latam: 1 };
    const symbols = { us: '

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ─── Public API ───────────────────────────────────────────────────
  return { t, setLanguage, getLanguage, toggleLanguage, init };
})();
, eu: '€', uk: '£', latam: '

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ─── Public API ───────────────────────────────────────────────────
  return { t, setLanguage, getLanguage, toggleLanguage, init };
})();
 };
    const codes = { us: 'USD', eu: 'EUR', uk: 'GBP', latam: 'USD' };
    const rate = rates[region] || 1;
    const symbol = symbols[region] || '

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ─── Initialize ───────────────────────────────────────────────────
  function init() {
    const saved = localStorage.getItem('splash_lang');
    currentLang = saved || detectLanguage();
    applyTranslations();
  }

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ─── Public API ───────────────────────────────────────────────────
  return { t, setLanguage, getLanguage, toggleLanguage, init };
})();
