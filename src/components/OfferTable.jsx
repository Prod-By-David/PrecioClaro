import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { eur, timeAgo } from "@/lib/format";
import { formatUnitPrice } from "@/lib/units";

export default function OfferTable({ offers, product }) {
  if (!offers?.length) {
    return (
      <p className="border border-dashed border-border p-6 text-center text-[12.5px] text-muted-foreground">
        Ahora mismo no hay tiendas con stock para este artículo.
      </p>
    );
  }

  return (
    <div className="border-t border-border">
      {offers.map((offer, index) => {
        const unitPrice = formatUnitPrice(offer.price, product);

        return (
          <div
            key={offer.id}
            className={cn(
              "flex flex-col gap-3 border-b border-border py-4 sm:flex-row sm:items-center sm:justify-between",
              index === 0 && "bg-gold/10"
            )}
          >
            <div className="min-w-0 sm:pl-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-heading text-[17px] leading-none">{offer.store_name}</p>
                {index === 0 && (
                  <span className="num bg-gold px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] text-foreground">
                    Mejor precio
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-[11.5px] text-muted-foreground">
                {Number(offer.shipping_cost) > 0 ? `Envío ${eur(offer.shipping_cost)}` : "Envío gratis"} ·{" "}
                {offer.in_stock === false ? "Sin stock" : "En stock"} · {timeAgo(offer.last_checked)}
              </p>
            </div>

            <div className="flex items-center justify-between gap-5 sm:justify-end">
              <div className="text-left sm:text-right">
                <p className="num text-[16px] leading-none">{eur(offer.total_price)}</p>
                {unitPrice && (
                  <p className="num mt-1 text-[10.5px] text-muted-foreground">{unitPrice}</p>
                )}
                {Number(offer.previous_price) > Number(offer.price) && (
                  <p className="num mt-1.5 text-[10.5px] text-muted-foreground line-through">
                    {eur(Number(offer.previous_price) + Number(offer.shipping_cost || 0))}
                  </p>
                )}
              </div>

              <a
                href={offer.url}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex shrink-0 items-center gap-1.5 border border-foreground/25 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-primary hover:text-primary"
              >
                Ir a la tienda
                <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}