import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RefreshCw, Search, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import DealCard from "@/components/home/DealCard";
import useLiveCatalog from "@/hooks/useLiveCatalog";
import useSyncStatus from "@/hooks/useSyncStatus";
import useDocumentMeta from "@/hooks/useDocumentMeta";
import { categoriesOf, dropOf, SORTS, toCard } from "@/lib/catalog";
import { searchScore } from "@/lib/search";
import { setSyncState } from "@/lib/syncStatus";
import { cn } from "@/lib/utils";
import { num, timeAgo } from "@/lib/format";

export default function Explorar() {
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState("bajada");
  const [term, setTerm] = useState(params.get("q") || "");
  const [busy, setBusy] = useState(false);
  const { products, offers, stores, loading } = useLiveCatalog();
  const sync = useSyncStatus();

  useDocumentMeta({
    title: "Catálogo de precios — PrecioClaro",
    description:
      "Compara el precio de la compra de cada semana en tiendas españolas, con envío incluido y actualización en directo.",
  });

  const q = params.get("q") || "";
  const category = params.get("cat") || "";
  const storeName = params.get("tienda") || "";

  const categories = useMemo(() => categoriesOf(products), [products]);

  const visible = useMemo(() => {
    const needle = q.trim();
    const scored = products
      .filter((product) => {
        if (category && product.category !== category) return false;
        if (storeName && !offers.some((offer) => offer.product_id === product.id && offer.store_name === storeName))
          return false;
        if (!needle) return true;
        return searchScore(product, needle) > 0;
      })
      .map((product) => ({ product, score: needle ? searchScore(product, needle) : 0 }));

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (sort === "precio-asc") return Number(a.product.best_price) - Number(b.product.best_price);
      if (sort === "precio-desc") return Number(b.product.best_price) - Number(a.product.best_price);
      if (sort === "nombre") return a.product.name.localeCompare(b.product.name, "es");
      return dropOf(b.product).discount - dropOf(a.product).discount;
    });

    return scored.map(({ product }) => toCard(product));
  }, [products, offers, q, category, storeName, sort]);

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => {
      if (!value) next.delete(key);
      else next.set(key, value);
    });
    setParams(next, { replace: true });
  };

  const submitSearch = (event) => {
    event.preventDefault();
    update({ q: term.trim() });
  };

  const refresh = async () => {
    setBusy(true);
    try {
      const response = await base44.functions.invoke("syncPrices", {});
      setSyncState({
        running: false,
        updated: Number(response.data?.updated) || 0,
        at: response.data?.checkedAt || new Date().toISOString(),
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1240px] px-5 lg:px-10">
      <header className="border-b border-border py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Catálogo completo</p>
            <h1 className="mt-3 font-heading text-[clamp(2.2rem,4vw,3.4rem)] leading-[1] tracking-[-0.015em]">
              Explorar precios
            </h1>
            <p className="mt-3 text-[13.5px] text-muted-foreground">
              <span className="num">{num(visible.length)}</span> artículos ·{" "}
              <span className="num">{num(stores.length)}</span> tiendas · precios con envío incluido
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <button
              type="button"
              onClick={refresh}
              className="inline-flex items-center gap-2 border border-foreground/25 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-primary hover:text-primary"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", (busy || sync.running) && "animate-spin")} />
              {busy || sync.running ? "Sincronizando" : "Sincronizar ahora"}
            </button>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {sync.at ? `Último cambio ${timeAgo(sync.at)}` : "Motor listo"}
            </p>
          </div>
        </div>

        <form
          onSubmit={submitSearch}
          className="mt-7 flex items-stretch border border-foreground/25 bg-card transition-colors focus-within:border-primary"
        >
          <Search className="ml-4 h-4 w-4 self-center text-muted-foreground" />
          <input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Producto, marca o categoría"
            aria-label="Buscar en el catálogo"
            className="h-12 min-w-0 flex-1 bg-transparent px-3 text-[14px] outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="m-1 bg-primary px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            Buscar
          </button>
        </form>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => update({ cat: "" })}
            className={cn(
              "border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
              category
                ? "border-border text-foreground/70 hover:border-foreground/40"
                : "border-primary bg-primary text-primary-foreground"
            )}
          >
            Todos
          </button>
          {categories.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => update({ cat: item.name })}
              className={cn(
                "border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
                category === item.name
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground/70 hover:border-foreground/40"
              )}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {storeName && (
              <button
                type="button"
                onClick={() => update({ tienda: "" })}
                className="inline-flex items-center gap-1.5 border border-border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/70 hover:border-foreground/40"
              >
                {storeName}
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Orden
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="border border-border bg-card px-2 py-1.5 text-[10px] uppercase tracking-[0.12em] text-foreground outline-none"
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <div className="py-10">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="border border-border bg-card">
                <div className="aspect-[4/3] animate-pulse bg-secondary" />
                <div className="space-y-2 p-4">
                  <div className="h-2 w-14 animate-pulse bg-secondary" />
                  <div className="h-3 w-3/4 animate-pulse bg-secondary" />
                  <div className="h-2 w-1/2 animate-pulse bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {visible.map((product) => (
              <DealCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid min-h-[320px] place-items-center border border-dashed border-border px-6 text-center">
            <div>
              <p className="font-heading text-[26px]">Sin resultados</p>
              <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
                No hemos encontrado artículos con esos filtros. Prueba con otra búsqueda o quita la categoría.
              </p>
              <button
                type="button"
                onClick={() => {
                  setTerm("");
                  setParams(new URLSearchParams(), { replace: true });
                }}
                className="mt-5 border border-foreground/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-primary hover:text-primary"
              >
                Ver todo el catálogo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}