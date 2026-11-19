import { Link } from "react-router-dom";
import { BellOff, Trash2 } from "lucide-react";
import ProductMedia from "@/components/ProductMedia";
import useAlerts from "@/hooks/useAlerts";
import useLiveCatalog from "@/hooks/useLiveCatalog";
import { cn } from "@/lib/utils";
import { eur, num } from "@/lib/format";

const STATUS = {
  alcanzado: { label: "Objetivo alcanzado", className: "bg-gold text-foreground" },
  cerca: { label: "Muy cerca", className: "border border-primary/40 text-primary" },
  pendiente: { label: "En seguimiento", className: "border border-border text-muted-foreground" },
};

export default function Alertas() {
  const { alerts, remove } = useAlerts();
  const { products } = useLiveCatalog();

  const rows = alerts
    .map((alert) => {
      const product = products.find((item) => item.slug === alert.slug);
      const best = Number(product?.best_price) || 0;
      let status = "pendiente";
      if (best && best <= alert.target) status = "alcanzado";
      else if (best && best <= alert.target * 1.05) status = "cerca";
      return { alert, product, best, status };
    })
    .sort((a, b) => {
      const order = { alcanzado: 0, cerca: 1, pendiente: 2 };
      return order[a.status] - order[b.status];
    });

  const reached = rows.filter((row) => row.status === "alcanzado").length;

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-10 lg:px-10">
      <header className="flex flex-col gap-4 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Tus avisos</p>
          <h1 className="mt-3 font-heading text-[clamp(2.2rem,4vw,3.4rem)] leading-[1] tracking-[-0.015em]">
            Mis avisos de precio
          </h1>
          <p className="mt-3 max-w-lg text-[13.5px] leading-relaxed text-muted-foreground">
            Se guardan en este navegador y se comprueban con los precios en directo del catálogo.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <p className="eyebrow">Avisos</p>
            <p className="num mt-1.5 text-[22px] leading-none">{num(rows.length)}</p>
          </div>
          <div>
            <p className="eyebrow">Alcanzados</p>
            <p className="num mt-1.5 text-[22px] leading-none text-primary">{num(reached)}</p>
          </div>
        </div>
      </header>

      {rows.length === 0 ? (
        <div className="mt-12 grid min-h-[320px] place-items-center border border-dashed border-border px-6 text-center">
          <div>
            <BellOff className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="mt-4 font-heading text-[26px]">Todavía no sigues ningún precio</p>
            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
              Abre cualquier artículo y fija el precio al que te interesa comprarlo. Lo vigilamos por ti.
            </p>
            <Link
              to="/explorar"
              className="mt-6 inline-flex border border-foreground/25 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] hover:border-primary hover:text-primary"
            >
              Explorar catálogo
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 border-t border-border">
          {rows.map(({ alert, product, best, status }) => (
            <div
              key={`${alert.slug}-${alert.target}`}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-border py-4 md:grid-cols-[auto_1fr_auto_auto_auto]"
            >
              <ProductMedia
                className="h-14 w-14 border border-border/70"
                src={product?.image_url || alert.image}
                alt={alert.name}
              />

              <div className="min-w-0">
                {product ? (
                  <Link to={`/producto/${product.slug}`} className="block truncate font-heading text-[18px] leading-tight hover:text-primary">
                    {alert.name}
                  </Link>
                ) : (
                  <p className="truncate font-heading text-[18px] leading-tight">{alert.name}</p>
                )}
                <p className="mt-1 text-[11.5px] text-muted-foreground">
                  Objetivo <span className="num text-foreground">{eur(alert.target)}</span>
                  {product?.best_store ? ` · ahora en ${product.best_store}` : ""}
                </p>
              </div>

              <div className="text-right">
                <p className="num text-[15px] leading-none">{best ? eur(best) : "—"}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">precio actual</p>
              </div>

              <span
                className={cn(
                  "num hidden whitespace-nowrap px-2 py-1 text-[9px] uppercase tracking-[0.12em] md:inline-block",
                  STATUS[status].className
                )}
              >
                {STATUS[status].label}
              </span>

              <button
                type="button"
                onClick={() => remove(alert.slug, alert.target)}
                aria-label={`Eliminar aviso de ${alert.name}`}
                className="grid h-8 w-8 place-items-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}