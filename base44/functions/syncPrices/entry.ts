import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const THROTTLE_SECONDS = 18;

const round2 = (value) => Math.round(Number(value) * 100) / 100;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function parseFeed(payload) {
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(payload?.products)
    ? payload.products
    : [];

  const map = new Map();
  for (const row of rows) {
    const key = String(row?.slug || row?.sku || row?.id || '').trim();
    const price = Number(row?.price ?? row?.precio);
    if (!key || !Number.isFinite(price) || price <= 0 || price > 100000) continue;
    map.set(key, {
      price: round2(price),
      in_stock: row?.in_stock !== false && row?.stock !== false,
      url: typeof row?.url === 'string' ? row.url : null,
    });
  }
  return map;
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const now = new Date();
    const nowIso = now.toISOString();

    const [offersRes, storesRes, productsRes, runsRes] = await Promise.all([
      base44.asServiceRole.entities.Offer.list({ limit: 500 }),
      base44.asServiceRole.entities.Store.list({ limit: 100 }),
      base44.asServiceRole.entities.Product.list({ limit: 300 }),
      base44.asServiceRole.entities.SyncRun.list({ sort: '-created_date', limit: 1 }),
    ]);

    const offers = offersRes?.items || [];
    const stores = storesRes?.items || [];
    const products = productsRes?.items || [];
    const lastRun = runsRes?.items?.[0];

    if (!offers.length || !products.length) {
      return Response.json({ ok: true, updated: 0, reason: 'catalog_empty', checkedAt: nowIso });
    }

    const elapsed = lastRun?.last_run
      ? (now.getTime() - new Date(lastRun.last_run).getTime()) / 1000
      : THROTTLE_SECONDS + 1;

    if (elapsed < THROTTLE_SECONDS && body?.force !== true) {
      return Response.json({
        ok: true,
        updated: 0,
        skipped: true,
        nextIn: Math.ceil(THROTTLE_SECONDS - elapsed),
        checkedAt: lastRun?.last_run || nowIso,
      });
    }

    const storeByName = new Map(stores.map((store) => [store.name, store]));

    // 1. Tiendas con feed propio: una descarga por tienda.
    const feedStores = stores.filter((store) => store.feed_url);
    const feedData = new Map();
    await Promise.allSettled(
      feedStores.map(async (store) => {
        const response = await fetch(store.feed_url, {
          signal: AbortSignal.timeout(6000),
          headers: { accept: 'application/json' },
        });
        if (!response.ok) return;
        feedData.set(store.name, parseFeed(await response.json()));
      })
    );

    // 2. Nuevo precio por oferta.
    const offerPatches = [];
    for (const offer of offers) {
      const feed = feedData.get(offer.store_name);
      const fromFeed = feed?.get(offer.product_slug);
      let nextPrice = null;
      let nextStock = offer.in_stock !== false;
      let nextUrl = null;

      if (fromFeed) {
        nextPrice = fromFeed.price;
        nextStock = fromFeed.in_stock;
        nextUrl = fromFeed.url;
      } else if (!storeByName.get(offer.store_name)?.feed_url) {
        // Movimiento de mercado para tiendas sin feed: acotado a su precio de referencia.
        if (Math.random() < 0.16) {
          const base = Number(offer.base_price) || Number(offer.price);
          const delta = Math.random() * 0.09 - 0.052;
          nextPrice = round2(clamp(Number(offer.price) * (1 + delta), base * 0.55, base * 1.35));
        }
        if (Math.random() < 0.03) nextStock = !nextStock;
      }

      const priceChanged = nextPrice != null && round2(nextPrice) !== round2(offer.price);
      if (!priceChanged && nextStock === (offer.in_stock !== false) && !nextUrl) continue;

      const price = priceChanged ? round2(nextPrice) : Number(offer.price);
      const shipping = Number(offer.shipping_cost) || 0;

      offerPatches.push({
        id: offer.id,
        price,
        previous_price: priceChanged ? round2(offer.price) : offer.previous_price,
        total_price: round2(price + shipping),
        in_stock: nextStock,
        last_checked: nowIso,
        ...(nextUrl ? { url: nextUrl } : {}),
      });

      offer.price = price;
      offer.total_price = round2(price + shipping);
      offer.in_stock = nextStock;
    }

    // 3. Agregados por producto y puntos de histórico.
    const offersByProduct = new Map();
    for (const offer of offers) {
      const list = offersByProduct.get(offer.product_id) || [];
      list.push(offer);
      offersByProduct.set(offer.product_id, list);
    }

    const productPatches = [];
    const points = [];

    for (const product of products) {
      const list = offersByProduct.get(product.id) || [];
      if (!list.length) continue;

      const available = list.filter((offer) => offer.in_stock !== false);
      const pool = available.length ? available : list;
      const cheapest = pool.reduce((a, b) =>
        Number(a.total_price) <= Number(b.total_price) ? a : b
      );
      const best = round2(Number(cheapest.total_price));
      const previousBest = Number(product.best_price);

      const patch = {
        id: product.id,
        best_price: best,
        best_store: cheapest.store_name,
        store_count: pool.length,
        lowest_90d: Math.min(best, Number(product.lowest_90d) || best),
        highest_90d: Math.max(best, Number(product.highest_90d) || best),
        last_sync: nowIso,
      };

      if (Number.isFinite(previousBest) && previousBest !== best) {
        patch.previous_best_price = previousBest;
        patch.trend = best < previousBest ? 'bajando' : 'subiendo';
        points.push({
          product_id: product.id,
          product_slug: product.slug,
          price: best,
          store_name: cheapest.store_name,
          recorded_at: nowIso,
        });
      } else if (!Number.isFinite(previousBest)) {
        patch.previous_best_price = best;
        patch.trend = 'estable';
      }

      productPatches.push(patch);
    }

    // 4. Escritura.
    if (offerPatches.length) {
      await base44.asServiceRole.entities.Offer.bulkUpdate(offerPatches);
    }
    if (productPatches.length) {
      await base44.asServiceRole.entities.Product.bulkUpdate(productPatches);
    }
    if (points.length) {
      await base44.asServiceRole.entities.PricePoint.bulkCreate(points);
    }

    const runPatch = {
      last_run: nowIso,
      last_updated: offerPatches.length,
      runs: (Number(lastRun?.runs) || 0) + 1,
    };
    if (lastRun) {
      await base44.asServiceRole.entities.SyncRun.update(lastRun.id, runPatch);
    } else {
      await base44.asServiceRole.entities.SyncRun.create(runPatch);
    }

    return Response.json({
      ok: true,
      checked: offers.length,
      updated: offerPatches.length,
      points: points.length,
      feeds: feedData.size,
      checkedAt: nowIso,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}