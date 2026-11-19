import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Plus } from "lucide-react";
import ProductMedia from "@/components/ProductMedia";
import { addToBasket } from "@/lib/basket";
import { eur } from "@/lib/format";
import { formatUnitPrice } from "@/lib/units";

export default function DealCard({ product }) {
  const [added, setAdded] = useState(false);
  const discount = Math.round(((product.previous - product.best) / product.previous) * 100);
  const unitPrice = formatUnitPrice(product.best, product);

  const add = (event) => {
    event.preventDefault();
    event.stopPropagation();
    addToBasket(product.slug);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <Link
      to={`/producto/${product.slug}`}
      className="group flex flex-col border border-border bg-card transition-colors hover:border-foreground/35"
    >
      <div className="relative">
        <ProductMedia className="aspect-[4/3]" src={product.image} alt={product.name} />
        {discount > 0 && (
          <span className="num absolute left-3 top-3 bg-gold px-1.5 py-1 text-[10px] font-medium text-foreground">
            −{discount}%
          </span>
        )}
        <button
          type="button"
          onClick={add}
          aria-label={`Añadir ${product.name} a la cesta`}
          className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center border border-border bg-card/95 text-foreground/60 backdrop-blur transition-colors hover:border-primary hover:text-primary"
        >
          {added ? <Check className="h-3.5 w-3.5 text-primary" /> : <Plus className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="eyebrow">{product.brand}</p>
        <h3 className="mt-1.5 font-heading text-[19px] leading-[1.15]">{product.name}</h3>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/70 pt-3.5">
          <div>
            <p className="num text-[17px] leading-none">{eur(product.best)}</p>
            <p className="mt-1.5 text-[11px] text-muted-foreground">{product.stores} tiendas · envío incl.</p>
            {unitPrice && <p className="num mt-1 text-[11px] text-foreground/60">{unitPrice}</p>}
          </div>
          <p className="num text-[11px] text-muted-foreground line-through">{eur(product.previous)}</p>
        </div>
      </div>
    </Link>
  );
}