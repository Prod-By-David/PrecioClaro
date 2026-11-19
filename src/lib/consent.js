const KEY = "precioclaro.consent.v1";
const CHANGE_EVENT = "precioclaro:consent";
const OPEN_EVENT = "precioclaro:consent-open";

export const CONSENT_CATEGORIES = [
  {
    id: "necessary",
    label: "Técnicas",
    description: "Imprescindibles para que la cesta, los avisos y esta elección funcionen. No se pueden desactivar.",
    required: true,
  },
  {
    id: "analytics",
    label: "Analítica",
    description: "Medir visitas y uso de forma agregada para mejorar el comparador.",
  },
  {
    id: "preferences",
    label: "Preferencias",
    description: "Recordar ajustes como el filtro o el orden del catálogo.",
  },
  {
    id: "marketing",
    label: "Publicidad",
    description: "Mostrar y medir campañas publicitarias. Hoy no se usa.",
  },
];

export function getConsent() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function applyConsent(choice) {
  window.dataLayer = window.dataLayer || [];
  const gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };

  const state = (granted) => (granted ? "granted" : "denied");

  gtag("consent", "update", {
    analytics_storage: state(choice?.analytics),
    ad_storage: state(choice?.marketing),
    ad_user_data: state(choice?.marketing),
    ad_personalization: state(choice?.marketing),
  });
}

export function saveConsent(choice) {
  const value = {
    necessary: true,
    analytics: Boolean(choice?.analytics),
    preferences: Boolean(choice?.preferences),
    marketing: Boolean(choice?.marketing),
    saved_at: new Date().toISOString(),
  };
  window.localStorage.setItem(KEY, JSON.stringify(value));
  applyConsent(value);
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return value;
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function subscribeConsent(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

export function subscribeConsentOpen(callback) {
  window.addEventListener(OPEN_EVENT, callback);
  return () => window.removeEventListener(OPEN_EVENT, callback);
}