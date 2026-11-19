const KEY = "precioclaro.alertas.v1";
const EVENT = "precioclaro:alertas";

export function getAlerts() {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(list) {
  window.localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVENT));
}

export function saveAlert(alert) {
  const list = getAlerts().filter((item) => !(item.slug === alert.slug && item.target === alert.target));
  write([{ ...alert, created: new Date().toISOString() }, ...list].slice(0, 60));
}

export function removeAlert(slug, target) {
  write(getAlerts().filter((item) => !(item.slug === slug && item.target === target)));
}

export function subscribeAlerts(callback) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}