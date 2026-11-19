const eurFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactFormatter = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 });

export function eur(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  return eurFormatter.format(n);
}

export function num(value) {
  return compactFormatter.format(Number(value) || 0);
}

export function pct(drop, base) {
  const d = Number(drop);
  const b = Number(base);
  if (!b || Number.isNaN(d) || Number.isNaN(b)) return "";
  return `${Math.round((d / b) * 100)} %`;
}

export function timeAgo(value) {
  if (!value) return "ahora";
  const then = new Date(value).getTime();
  const seconds = Math.max(1, Math.round((Date.now() - then) / 1000));
  if (seconds < 60) return `hace ${seconds} s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.round(hours / 24);
  return `hace ${days} d`;
}

export function slugify(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
}