import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BellRing, RefreshCw } from "lucide-react";
import Hero from "@/components/home/Hero";
import PriceTicker from "@/components/home/PriceTicker";
import LiveDrops from "@/components/home/LiveDrops";
import CategoryRail from "@/components/home/CategoryRail";
import DealGrid from "@/components/home/DealGrid";
import HowItWorks from "@/components/home/HowItWorks";
import StoreStrip from "@/components/home/StoreStrip";
import SectionHead from "@/components/SectionHead";
import useLiveCatalog from "@/hooks/useLiveCatalog";
import useSyncStatus from "@/hooks/useSyncStatus";
import useDocumentMeta from "@/hooks/useDocumentMeta";
import { categoriesOf, dropOf, toCard } from "@/lib/catalog";
import { num, timeAgo } from "@/lib/format";

const SUGGESTIONS = ["Leche", "Detergente", "Café", "iPhone", "Freidora"];

export default function Inicio() {
  const { products, offers, stores } = useLiveCatalog();
  const sync = useSyncStatus();

  useDocumentMeta({
    title: "PrecioClaro — Comparador de precios en España",
    description:
      "Compara el precio de la compra de cada día en tiendas españolas, con envío incluido, histórico de 90 días y avisos de bajada.",
  });

  const drops = useMemo(() => {
    const images = new Map(products.map((product) => [product.id, product.image_url]));
    return offers
      .filter((offer) => Number(offer.previous_price) > Number(offer.price) && offer.in_stock !== false)
      .sort(
        (a, b) =>
          Number(b.previous_price) - Number(b.price) - (Number(a.previous_price) - Number(a.price))
      )
      .slice(0, 6)
      .map((offer) => ({
        slug: offer.product_slug,
        product: offer.product_name,
        store: offer.store_name,
        from: Number(offer.previous_price),
        to: Number(offer.price),
        when: timeAgo(offer.last_checked),
        image: images.get(offer.product_id),
      }));
  }, [offers, products]);

  const stats = useMemo(() => {
    const savings = products
      .map((product) => Number(product.highest_90d) - Number(product.best_price))
      .filter((value) => Number.isFinite(value) && value > 0);
    const average = savings.length ? savings.reduce((a, b) => a + b, 0) / savings.length : 0;
    return {
      watched: products.length,
      dropsToday: offers.filter((offer) => Number(offer.previous_price) > Number(offer.price)).length,
      stores: stores.length,
      averageSaving: Math.round(average * 100) / 100,
    };
  }, [products, offers, stores]);

  const sparkline = useMemo(
    () =>
      products
        .map((product) => Math.max(0, Number(product.highest_90d) - Number(product.best_price)))
        .sort((a, b) => b - a)
        .slice(0, 15),
    [products]
  );

  const categories = useMemo(() => categoriesOf(products), [products]);

  const deals = useMemo(
    () =>
      [...products]
        .sort((a, b) => dropOf(b).discount - dropOf(a).discount)
        .slice(0, 4)
        .map(toCard),
    [products]
  );

  const radar = [
    { label: "Ofertas monitorizadas", value: num(offers.length) },
    { label: "Última pasada", value: sync.at ? timeAgo(sync.at) : "en espera" },
    { label: "Cambios aplicados", value: num(sync.updated) },
    { label: "Tiendas comparadas", value: num(stores.length) },
  ];

  return (
    <>
      <Hero stats={stats} sparkline={sparkline} suggestions={SUGGESTIONS} />
      <PriceTicker drops={drops} />

      <div className="mx-auto max-w-[1240px] px-5 lg:px-10">
        <section className="py-16">
          <SectionHead
            index="01"
            eyebrow="En directo"
            title="Bajadas registradas en la última hora"
            description="Cada cambio llega desde la ficha de la tienda y se aplica al instante en el catálogo."
            action={
              <Link
                to="/explorar"
                className="inline-flex items-center gap-2 border border-foreground/25 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors hover:border-foreground/60"
              >
                Explorar catálogo
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.7fr_0.8fr] lg:gap-14">
            {drops.length ? (
              <LiveDrops drops={drops} />
            ) : (
              <div className="grid min-h-[240px] place-items-center border border-dashed border-border">
                <p className="max-w-xs text-center text-[12.5px] leading-relaxed text-muted-foreground">
                  El radar está midiendo el mercado. En cuanto una tienda baje un precio, aparecerá aquí.
                </p>
              </div>
            )}

            <aside className="border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 text-primary" />
                <p className="eyebrow">Motor de precios</p>
              </div>
              <p className="mt-3 font-heading text-[24px] leading-tight">Radar activo</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                Revisamos cada oferta de forma cíclica y conservamos cada variación en el histórico.
              </p>

              <dl className="mt-5 divide-y divide-border/70 border-t border-border/70">
                {radar.map((item) => (
                  <div key={item.label} className="flex items-baseline justify-between gap-4 py-2.5">
                    <dt className="text-[12px] text-muted-foreground">{item.label}</dt>
                    <dd className="num text-[12.5px]">{item.value}</dd>
                  </div>
                ))}
              </dl>

              <Link
                to="/alertas"
                className="mt-5 flex items-center justify-between gap-3 bg-primary px-4 py-3 text-primary-foreground transition-opacity hover:opacity-90"
              >
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em]">
                  <BellRing className="h-3.5 w-3.5" />
                  Crear un aviso
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </section>

        <section className="pb-16">
          <SectionHead
            index="02"
            eyebrow="Categorías"
            title="La compra de cada semana, ordenada"
            description="De la despensa al escritorio: comparamos lo que se repone a menudo."
          />
          <CategoryRail categories={categories} />
        </section>

        <div className="pb-16">
          <DealGrid products={deals} />
        </div>
      </div>

      <StoreStrip stores={stores} />

      <div className="mx-auto max-w-[1240px] px-5 lg:px-10">
        <section className="py-16">
          <SectionHead
            index="04"
            eyebrow="Método"
            title="Información precisa para elegir mejor"
            description="Sin acuerdos que alteren el orden: la oferta más barata aparece siempre arriba."
          />
          <div className="mt-8">
            <HowItWorks />
          </div>
        </section>
      </div>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-5 py-14 lg:flex-row lg:items-end lg:justify-between lg:px-10">
          <div>
            <p className="eyebrow text-primary-foreground/60">PrecioClaro</p>
            <h2 className="mt-3 max-w-2xl font-heading text-[clamp(2rem,4vw,3.2rem)] leading-[1] tracking-[-0.02em]">
              Que el precio lo ponga la tienda, no la prisa.
            </h2>
            <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-primary-foreground/70">
              Elige un artículo, fija tu precio objetivo y deja que el radar haga el resto.
            </p>
          </div>
          <Link
            to="/explorar"
            className="inline-flex items-center gap-2 self-start border border-primary-foreground/30 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors hover:bg-primary-foreground hover:text-primary lg:self-auto"
          >
            Empezar a comparar
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </>
  );
}