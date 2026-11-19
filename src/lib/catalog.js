import { base44 } from "@/api/base44Client";

export async function fetchCatalog() {
  const [products, offers, stores] = await Promise.all([
    base44.entities.Product.list({ sort: "name", limit: 300 }),
    base44.entities.Offer.list({ sort: "total_price", limit: 500 }),
    base44.entities.Store.list({ sort: "name", limit: 100 }),
  ]);

  return {
    products: products.items || [],
    offers: offers.items || [],
    stores: stores.items || [],
  };
}

export function offersOf(offers, productId) {
  return offers
    .filter((offer) => offer.product_id === productId)
    .sort((a, b) => Number(a.total_price) - Number(b.total_price));
}

export function dropOf(product) {
  const best = Number(product.best_price) || 0;
  const previous = Number(product.previous_best_price) || 0;
  if (!best || !previous || previous <= best) return { discount: 0, previous: 0, amount: 0 };
  return {
    discount: Math.round(((previous - best) / previous) * 100),
    previous,
    amount: previous - best,
  };
}

export function toCard(product) {
  const drop = dropOf(product);
  return {
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category,
    image: product.image_url,
    best: Number(product.best_price) || 0,
    previous: drop.previous || Number(product.best_price) || 0,
    stores: Number(product.store_count) || 0,
    discount: drop.discount,
    unit_size: product.unit_size,
    unit_label: product.unit_label,
  };
}

export const CATEGORY_NOTES = {
  Supermercado: "Despensa y limpieza",
  Hogar: "Cocina, descanso y orden",
  Tecnología: "Móviles y portátiles",
  Audio: "Auriculares y altavoces",
  Deporte: "Running y entrenamiento",
  Moda: "Gafas y relojes",
};

export function categoriesOf(products) {
  const counts = new Map();
  products.forEach((product) => {
    counts.set(product.category, (counts.get(product.category) || 0) + 1);
  });
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count, note: CATEGORY_NOTES[name] || "Comparado en varias tiendas" }))
    .sort((a, b) => b.count - a.count);
}

export const SORTS = [
  { value: "bajada", label: "Mayor bajada" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "nombre", label: "Nombre A–Z" },
];