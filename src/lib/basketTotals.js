const round2 = (value) => Math.round(Number(value) * 100) / 100;

export function storeTotals({ items, products, offers, stores }) {
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  const lines = items
    .map((item) => ({ qty: Number(item.qty) || 0, product: bySlug.get(item.slug) }))
    .filter((line) => line.product && line.qty > 0);

  if (!lines.length) return [];

  const rows = stores.map((store) => {
    const cheapest = new Map();
    offers
      .filter((offer) => offer.store_name === store.name && offer.in_stock !== false)
      .forEach((offer) => {
        const current = cheapest.get(offer.product_id);
        if (!current || Number(offer.price) < Number(current.price)) cheapest.set(offer.product_id, offer);
      });

    let subtotal = 0;
    let covered = 0;
    const missing = [];

    lines.forEach((line) => {
      const offer = cheapest.get(line.product.id);
      if (offer) {
        subtotal += Number(offer.price) * line.qty;
        covered += 1;
      } else {
        missing.push(line.product.name);
      }
    });

    if (!covered) return null;

    subtotal = round2(subtotal);
    const threshold = Number(store.free_shipping_from) || 0;
    const base = Number(store.shipping_cost) || 0;
    const shipping = threshold > 0 && subtotal >= threshold ? 0 : base;

    return {
      store,
      subtotal,
      shipping,
      total: round2(subtotal + shipping),
      covered,
      missing,
      complete: covered === lines.length,
    };
  });

  return rows
    .filter(Boolean)
    .sort((a, b) => Number(b.complete) - Number(a.complete) || a.total - b.total);
}