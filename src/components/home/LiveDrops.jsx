import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ProductMedia from "@/components/ProductMedia";
import { eur } from "@/lib/format";

export default function LiveDrops({ drops }) {
  return (
    <div className="border-t border-border">
      {drops.map((drop) => (
        <Link
          key={`${drop.slug}-${drop.store}`}
          to={`/producto/${drop.slug}`}
          className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-border py-3.5 transition-colors hover:bg-card md:grid-cols-[auto_1fr_auto_auto_auto]"
        >
          <ProductMedia className="h-11 w-11 border border-border/70" src={drop.image} alt={drop.product} />

          <div className="min-w-0">
            <p className="truncate font-heading text-[17px] leading-tight">{drop.product}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
              <span className="live-dot text-primary" />
              {drop.store} · {drop.when}
            </p>
          </div>

          <p className="num hidden text-[11.5px] text-muted-foreground line-through md:block">{eur(drop.from)}</p>
          <p className="num text-[15px] text-primary">{eur(drop.to)}</p>
          <span className="num min-w-[54px] border border-primary/25 bg-primary/5 px-2 py-1 text-center text-[10px] text-primary">
            −{Math.round(((drop.from - drop.to) / drop.from) * 100)}%
          </span>
        </Link>
      ))}

      <Link
        to="/explorar"
        className="group mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:text-foreground"
      >
        Ver el catálogo completo
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}