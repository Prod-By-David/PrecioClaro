import { cn } from "@/lib/utils";
import { eur } from "@/lib/format";

export default function StoreTotals({ rows, itemCount }) {
  const winner = rows.find((row) => row.complete);

  return (
    <div className="border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <p className="eyebrow">Total por supermercado</p>
        <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted-foreground">
          Artículos más el envío de una sola compra.
        </p>
      </div>

      <ul className="divide-y divide-border/70">
        {rows.map((row) => {
          const isWinner = winner && row.store.id === winner.store.id;
          return (
            <li key={row.store.id} className={cn("px-5 py-4", isWinner && "bg-gold/10")}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-heading text-[17px] leading-none">{row.store.name}</p>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    {row.covered}/{itemCount} artículos
                    {row.missing.length > 0 && ` · faltan ${row.missing.length}`}
                  </p>
                </div>
                {isWinner && (
                  <span className="num shrink-0 bg-gold px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em]">
                    Más barata
                  </span>
                )}
              </div>

              <dl className="mt-3 space-y-1 text-[11.5px]">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-muted-foreground">Artículos</dt>
                  <dd className="num">{eur(row.subtotal)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-muted-foreground">
                    Envío
                    {Number(row.store.free_shipping_from) > 0 &&
                      ` (gratis desde ${eur(row.store.free_shipping_from)})`}
                  </dt>
                  <dd className="num">{row.shipping > 0 ? eur(row.shipping) : "Gratis"}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 border-t border-border/70 pt-1.5">
                  <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Total</dt>
                  <dd className="num text-[15px]">{eur(row.total)}</dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
    </div>
  );
}