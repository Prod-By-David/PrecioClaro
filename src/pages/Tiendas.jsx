import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import useLiveCatalog from "@/hooks/useLiveCatalog";
import useDocumentMeta from "@/hooks/useDocumentMeta";
import { eur, num, timeAgo } from "@/lib/format";

export default function Tiendas() {
  const { stores, offers, products, loading } = useLiveCatalog();

  useDocumentMeta({
    title: "Tiendas comparadas — PrecioClaro",
    description:
      "Las tiendas españolas que comparamos, con su coste de envío, el umbral de envío gratis y la última revisión de precios.",
  });

  const rows = useMemo(
    () =>
      stores.map((store) => {
        const storeOffers = offers.filter((offer) => offer.store_name === store.name);
        const bestCount = storeOffers.filter((offer) => {
          const product = products.find((item) => item.id === offer.product_id);
          return product && Number(product.best_price) === Number(offer.total_price);
        }).length;
        const lastChecked = storeOffers.reduce(
          (latest, offer) => (offer.last_checked > latest ? offer.last_checked : latest),
          ""
        );
        return { ...store, live: storeOffers.length, bestCount, lastChecked };
      }),
    [stores, offers, products]
  );

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-10 lg:px-10">
      <header className="border-b border-border pb-8">
        <p className="eyebrow">Red de tiendas</p>
        <h1 className="mt-3 font-heading text-[clamp(2.2rem,4vw,3.4rem)] leading-[1] tracking-[-0.015em]">
          Dónde comparamos
        </h1>
        <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">
          <span className="num">{num(rows.length)}</span> tiendas españolas con seguimiento activo. El orden de esta
          lista es alfabético y nunca altera el resultado de una comparación.
        </p>
      </header>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-64 animate-pulse border border-border bg-secondary" />
            ))
          : rows.map((store) => (
              <article key={store.id} className="flex flex-col border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-[22px] leading-none">{store.name}</h2>
                    {store.domain && (
                      <a
                        href={`https://www.${store.domain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground"
                      >
                        {store.domain}
                      </a>
                    )}
                  </div>
                  <span className="num border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    {store.rating ? Number(store.rating).toFixed(1) : "—"}
                  </span>
                </div>

                <dl className="mt-5 divide-y divide-border/70 border-t border-border/70">
                  <div className="flex items-baseline justify-between gap-3 py-2.5">
                    <dt className="text-[12px] text-muted-foreground">Ofertas activas</dt>
                    <dd className="num text-[12.5px]">{num(store.live)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 py-2.5">
                    <dt className="text-[12px] text-muted-foreground">Mejor precio en</dt>
                    <dd className="num text-[12.5px]">{num(store.bestCount)} artículos</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 py-2.5">
                    <dt className="text-[12px] text-muted-foreground">Envío</dt>
                    <dd className="max-w-[60%] text-right text-[11.5px]">{store.shipping_note || "—"}</dd>
                  </div>
                  {Number(store.free_shipping_from) > 0 && (
                    <div className="flex items-baseline justify-between gap-3 py-2.5">
                      <dt className="text-[12px] text-muted-foreground">Envío gratis desde</dt>
                      <dd className="num text-[12.5px]">{eur(store.free_shipping_from)}</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                  <Link
                    to={`/explorar?tienda=${encodeURIComponent(store.name)}`}
                    className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-primary"
                  >
                    Ver artículos
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                    <span className="live-dot text-primary" />
                    {store.lastChecked ? timeAgo(store.lastChecked) : "sin datos"}
                  </span>
                </div>
              </article>
            ))}
      </div>
    </div>
  );
}