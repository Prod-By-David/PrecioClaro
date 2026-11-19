export function hasUnit(product) {
  return Number(product?.unit_size) > 0 && Boolean(product?.unit_label);
}

export function unitPrice(price, product) {
  if (!hasUnit(product)) return null;
  const value = Number(price) / Number(product.unit_size);
  return Number.isFinite(value) ? value : null;
}

export function formatUnitPrice(price, product) {
  const value = unitPrice(price, product);
  if (value == null) return null;
  const amount = value.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${amount} €/${product.unit_label}`;
}