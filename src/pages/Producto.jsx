import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, RefreshCw, Star } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ProductMedia from "@/components/ProductMedia";
import OfferTable from "@/components/OfferTable";
import PriceChart from "@/components/PriceChart";
import AlertForm from "@/components/AlertForm";
import AddToBasket from "@/components/cesta/AddToBasket";
import Alternatives from "@/components/product/Alternatives";
import ProductJsonLd from "@/components/product/ProductJsonLd";
import DealCard from "@/components/home/DealCard";
import useLiveCatalog from "@/hooks/useLiveCatalog";
import useDocumentMeta from "@/hooks/useDocumentMeta";
import { dropOf, offersOf, toCard } from "@/lib/catalog";
import { eur, num, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { formatUnitPrice } from "@/lib/units";
import { priceVerdict } from "@/lib/verdict";

export default function Producto() {
  const { slug } = useParams();
  const { products, offers, loading } = useLiveCatalog();
  const [points, setPoints] = useState([]);

  const product = products.find((item) => item.slug === slug);

  useDocumentMeta({
    title: product ? `${product.name} desde ${eur(product.best_price)} — PrecioClaro` : undefined,
    description: product
      ? `${product.name} (${product.brand}) comparado en ${num(product.store_count || 0)} tiendas. Mejor precio ${eur(product.best_price)} en ${product.best_store}.`
      : undefined,
  });

  useEffect(() => {
    if (!product?.id) return;
    let active = true;
    base44.entities.PricePoint.filter(
      { product_id: product.id },
      { sort: "recorded_at", limit: 120 }
    )
      .then((page) => {
        if (active) setPoints(page.items || []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [product?.id]);

  useEffect(() => {
    if (loading || product) return;
    const meta = document.createElement("meta");
    meta.name = "prerender-status-code";
    meta.content = "404";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, [loading, product]);

  const productOffers = useMemo(() => offersOf(offers, product?.id), [offers, product?.id]);

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((item) => item.category === product.category && item.id !== product.id)
      .slice(0, 4)
      .map(toCard);
  }, [products, product]);

  const bounds = useMemo(() => {
    const values = points
      .map((point) => Number(point.price))
      .concat([
        Number(product?.lowest_90d) || 0,
        Number(product?.highest_90d) || 0,
        Number(product?.best_price) || 0,
      ])
      .filter((value) => Number.isFinite(value) && value > 0);

    if (!values.length) return { low: 0, high: 0 };
    return { low: Math.min(...values), high: Math.max(...values) };
  }, [points, product]);

  if (!loading && !product) {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-[1240px] place-items-center px-5 text-center">
        <div>
          <p className="eyebrow">Error 404</p>
          <h1 className="mt-3 font-heading text-[38px] leading-tight">Este artículo ya no está en el catálogo</h1>
          <Link
            to="/explorar"
            className="mt-6 inline-flex border border-foreground/25 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] hover:border-primary hover:text-primary"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !product) {
    return (
      <div className="mx-auto max-w-[1240px] px-5 py-16 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-[4/3] animate-pulse bg-secondary" />
          <div className="space-y-4">
            <div className="h-2 w-24 animate-pulse bg-secondary" />
            <div className="h-8 w-3/4 animate-pulse bg-secondary" />
            <div className="h-20 w-full animate-pulse bg-secondary" />
          </div>
        </div>
      </div>
    );
  }

  const drop = dropOf(product);
  const bestOffer = productOffers[0];
  const unitPriceText = formatUnitPrice(product.best_price, product);
  const verdict = priceVerdict({ best: product.best_price, low: bounds.low, high: bounds.high });

  const priceRows = [
    { label: "Precio actual", value: eur(product.best_price) },
    { label: "Mínimo histórico", value: eur(bounds.low || product.lowest_90d) },
    { label: "Máximo 90 días", value: eur(product.highest_90d) },
    { label: "En tiendas", value: num(product.store_count) },
  ];

  const TONES = {
    good: "bg-primary text-primary-foreground",
    ok: "bg-secondary text-primary",
    neutral: "bg-muted text-foreground/70",
    bad: "bg-destructive text-destructive-foreground",
  };

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-8 lg:px-10">
      <ProductJsonLd product={product} offers={productOffers} />
      <nav className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        <Link to="/explorar" className="hover:text-foreground">
          Explorar
        </Link>
        <span>/</span>
        <Link to={`/explorar?cat=${encodeURIComponent(product.category)}`} className="hover:text-foreground">
          {product.category}
        </Link>
        <span>/</span>
        <span className="max-w-[220px] truncate text-foreground/70">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
        <div className="min-w-0">
          <ProductMedia
            className="aspect-[4/3] border border-border"
            src={product.image_url}
            alt={product.name}
            imgClassName="group-hover:scale-100"
          />

          <div className="mt-6 border-t border-border">
            <p className="eyebrow pt-4">Especificaciones</p>
            <dl className="mt-3 divide-y divide-border/70">
              {(product.specs || []).map((spec) => (
                <div key={spec.label} className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="text-[12.5px] text-muted-foreground">{spec.label}</dt>
                  <dd className="text-right text-[12.5px]">{spec.value}</dd>
                </div>
              ))}
              {product.unit && !(product.specs || []).some((spec) => spec.value === product.unit) && (
                <div className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="text-[12.5px] text-muted-foreground">Formato</dt>
                  <dd className="text-right text-[12.5px]">{product.unit}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow">
              {product.brand} · {product.category}
            </p>
            {product.rating ? (
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                <Star className="h-3 w-3 fill-gold text-gold" />
                {Number(product.rating).toFixed(1)} · {num(product.reviews_count || 0)}
              </span>
            ) : null}
          </div>

          <h1 className="mt-3 font-heading text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.02] tracking-[-0.015em]">
            {product.name}
          </h1>

          <p className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-6 border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Mejor precio disponible</p>
                <p className="num mt-2 text-[38px] leading-none tracking-[-0.04em]">
                  {eur(product.best_price)}
                </p>
                {unitPriceText && (
                  <p className="num mt-1.5 text-[12px] text-foreground/70">{unitPriceText}</p>
                )}
                <p className="mt-2 text-[12px] text-muted-foreground">
                  en {product.best_store} · envío incluido
                </p>
              </div>
              {drop.discount > 0 && (
                <span className="num bg-gold px-2 py-1 text-[10px] uppercase tracking-[0.1em]">
                  −{drop.discount}%
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <RefreshCw className="h-3 w-3 text-primary" />
                {product.last_sync ? `Revisado ${timeAgo(product.last_sync)}` : "Pendiente de revision"}
              </p>
              {bestOffer && (
                <a
                  href={bestOffer.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Ir a {product.best_store}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="mt-4">
            <AddToBasket slug={product.slug} />
          </div>

          <div className="mt-4">
            <AlertForm product={product} />
          </div>
        </div>
      </div>

      <section className="mt-14">
        <div className="flex items-end justify-between border-t border-foreground/20 pt-5">
          <div>
            <p className="eyebrow">Comparativa de tiendas</p>
            <h2 className="mt-2 font-heading text-[clamp(1.7rem,2.6vw,2.2rem)] leading-tight">
              Dónde comprarlo
            </h2>
          </div>
          <p className="num hidden text-[11px] text-muted-foreground sm:block">
            {productOffers.length} ofertas · ordenadas por precio total
          </p>
        </div>
        <div className="mt-6">
          <OfferTable offers={productOffers} product={product} />
        </div>
      </section>

      <section className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:gap-14">
        <div>
          <p className="eyebrow">Histórico de precio</p>
          <h2 className="mt-2 font-heading text-[clamp(1.7rem,2.6vw,2.2rem)] leading-tight">
            Últimos 90 días
          </h2>
          <div className="mt-5 border border-border bg-card p-4">
            <PriceChart points={points} />
          </div>
        </div>

        <aside className="border border-border bg-card p-5">
          <p className="eyebrow">Lectura del precio</p>
          <dl className="mt-4 divide-y divide-border/70">
            {priceRows.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className="text-[12px] text-muted-foreground">{row.label}</dt>
                <dd className="num text-[12.5px]">{row.value}</dd>
              </div>
            ))}
          </dl>
          {verdict && (
            <div className="mt-4 border-t border-border/70 pt-4">
              <span
                className={cn(
                  "inline-flex px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em]",
                  TONES[verdict.tone]
                )}
              >
                {verdict.label}
              </span>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{verdict.detail}</p>
            </div>
          )}
        </aside>
      </section>

      <Alternatives product={product} products={products} />

      {related.length > 0 && (
        <section className="mt-16">
          <p className="eyebrow">Misma categoría</p>
          <h2 className="mt-2 font-heading text-[clamp(1.7rem,2.6vw,2.2rem)] leading-tight">
            También en {product.category}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((item) => (
              <DealCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}