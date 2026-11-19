const KEY = "precioclaro.cesta.v1";
const EVENT = "precioclaro:cesta";

export function getBasket() {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
}

export function addToBasket(slug, qty = 1) {
  const items = getBasket();
  const existing = items.find((item) => item.slug === slug);
  if (existing) {
    existing.qty = Math.min(99, existing.qty + qty);
  } else {
    items.push({ slug, qty: Math.min(99, Math.max(1, qty)) });
  }
  write(items);
}

export function setQty(slug, qty) {
  const value = Number(qty) || 0;
  if (value <= 0) {
    write(getBasket().filter((item) => item.slug !== slug));
    return;
  }
  write(getBasket().map((item) => (item.slug === slug ? { ...item, qty: Math.min(99, value) } : item)));
}

export function removeFromBasket(slug) {
  write(getBasket().filter((item) => item.slug !== slug));
}

export function clearBasket() {
  write([]);
}

export function countBasket(items) {
  return items.reduce((total, item) => total + (Number(item.qty) || 0), 0);
}

export function subscribeBasket(callback) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}