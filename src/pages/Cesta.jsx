import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBasket, Trash2 } from "lucide-react";
import useLiveCatalog from "@/hooks/useLiveCatalog";
import useBasket from "@/hooks/useBasket";
import useDocumentMeta from "@/hooks/useDocumentMeta";
import BasketLine from "@/components/cesta/BasketLine";
import StoreTotals from "@/components/cesta/StoreTotals";
import { clearBasket, removeFromBasket, setQty } from "@/lib/basket";
import { storeTotals } from "@/lib/basketTotals";
import { eur } from "@/lib/format";

export default function Cesta() {
  useDocumentMeta({
    title: "Cesta semanal — PrecioClaro",
    description:
      "Suma tu compra de la semana y compara el total real en cada supermercado, con envío incluido.",
  });

  const items = useBasket();
  const { products, offers, stores, loading } = useLiveCatalog();

  const lines = useMemo(() => {
    const bySlug = new Map(products.map((product) => [product.slug, product]));
    return items
      .map((item) => {
        const product = bySlug.get(item.slug);
        if (!product) return null;
        const cheapest = [...offers]
          .filter((offer) => offer.product_id === product.id && offer.in_stock !== false)
          .sort((a, b) => Number(a.price) - Number(b.price))[0];
        return {
          product,
          qty: Number(item.qty) || 1,
          price: Number(cheapest?.price ?? product.best_price) || 0,
          storeName: cheapest?.store_name || product.best_store || "—",
        };
      })
      .filter(Boolean);
  }, [items, products, offers]);

  const rows = useMemo(
    () => storeTotals({ items, products, offers, stores }),
    [items, products, offers, stores]
  );

  const complete = rows.filter((row) => row.complete);
  const winner = complete[0];
  const bestCoverage = rows[0];
  const priciest = complete[complete.length - 1];
  const saving = winner && priciest && priciest.total > winner.total ? priciest.total - winner.total : 0;

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-10 lg:px-10">
      <header className="flex flex-col gap-5 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Compra de la semana</p>
          <h1 className="mt-3 font-heading text-[clamp(2.2rem,4vw,3.4rem)] leading-[1] tracking-[-0.015em]">
            Cesta semanal
          </h1>
          <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">
            <span className="num">{lines.length}</span> artículos. Comparamos el total de la compra entera
            en cada supermercado, con el envío contado una sola vez.
          </p>
        </div>

        {lines.length > 0 && (
          <button
            type="button"
            onClick={clearBasket}
            className="inline-flex items-center gap-2 self-start border border-foreground/25 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/70 transition-colors hover:border-destructive hover:text-destructive md:self-auto"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Vaciar cesta
          </button>
        )}
      </header>

      {loading && !lines.length ? (
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="h-64 animate-pulse border border-border bg-secondary" />
          <div className="h-64 animate-pulse border border-border bg-secondary" />
        </div>
      ) : !lines.length ? (
        <div className="mt-8 grid min-h-[320px] place-items-center border border-dashed border-border px-6 text-center">
          <div>
            <ShoppingBasket className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="mt-4 font-heading text-[26px]">Tu cesta está vacía</p>
            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
              Añade los artículos que compras cada semana y verás dónde sale más barata la compra completa.
            </p>
            <Link
              to="/explorar"
              className="mt-5 inline-flex items-center gap-2 border border-foreground/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-primary hover:text-primary"
            >
              Ir al catálogo
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-14">
          <section>
            <ul className="border-t border-border">
              {lines.map((line) => (
                <BasketLine
                  key={line.product.slug}
                  product={line.product}
                  qty={line.qty}
                  price={line.price}
                  storeName={line.storeName}
                  onQty={(qty) => setQty(line.product.slug, qty)}
                  onRemove={() => removeFromBasket(line.product.slug)}
                />
              ))}
            </ul>

            <Link
              to="/explorar"
              className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-primary"
            >
              Añadir más artículos
              <ArrowRight className="h-3 w-3" />
            </Link>
          </section>

          <aside className="space-y-4">
            <StoreTotals rows={rows} itemCount={lines.length} />

            {winner ? (
              <div className="border border-primary/25 bg-primary/5 p-5">
                <p className="eyebrow">Dónde sale más barata</p>
                <p className="mt-2 font-heading text-[22px] leading-tight">{winner.store.name}</p>
                <p className="num mt-1 text-[26px] leading-none">{eur(winner.total)}</p>
                {saving > 0 && (
                  <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                    {eur(saving)} menos que en {priciest.store.name}, la opción más cara con la cesta
                    completa.
                  </p>
                )}
              </div>
            ) : bestCoverage ? (
              <div className="border border-border bg-card p-5">
                <p className="eyebrow">Cesta incompleta</p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                  Ningún supermercado tiene ahora mismo los {lines.length} artículos. La que más se
                  acerca es {bestCoverage.store.name}, con {bestCoverage.covered} de {lines.length}.
                </p>
              </div>
            ) : null}

            <p className="text-[11.5px] leading-relaxed text-muted-foreground">
              Los precios se actualizan con cada pasada del motor. El envío se calcula según el umbral de
              cada tienda; recogida en tienda se cuenta como gratuita cuando la tienda lo indica.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}