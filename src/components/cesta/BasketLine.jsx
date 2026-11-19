import { Link } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import ProductMedia from "@/components/ProductMedia";
import { eur } from "@/lib/format";
import { formatUnitPrice } from "@/lib/units";

export default function BasketLine({ product, qty, price, storeName, onQty, onRemove }) {
  const unitPrice = formatUnitPrice(price, product);

  return (
    <li className="flex items-start gap-4 border-b border-border py-4">
      <Link to={`/producto/${product.slug}`} className="group w-16 shrink-0">
        <ProductMedia className="aspect-square border border-border" src={product.image_url} alt={product.name} />
      </Link>

      <div className="min-w-0 flex-1">
        <Link to={`/producto/${product.slug}`} className="font-heading text-[16px] leading-tight hover:text-primary">
          {product.name}
        </Link>
        <p className="mt-1 text-[11.5px] text-muted-foreground">
          {unitPrice || product.unit} · desde {eur(price)} en {storeName}
        </p>

        <div className="mt-2.5 flex items-center gap-3">
          <div className="flex items-center border border-border">
            <button
              type="button"
              onClick={() => onQty(qty - 1)}
              aria-label="Quitar una unidad"
              className="grid h-8 w-7 place-items-center text-foreground/70 hover:text-primary"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="num w-6 text-center text-[12px]">{qty}</span>
            <button
              type="button"
              onClick={() => onQty(qty + 1)}
              aria-label="Añadir una unidad"
              className="grid h-8 w-7 place-items-center text-foreground/70 hover:text-primary"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <span className="num text-[12px] text-muted-foreground">{eur(price * qty)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Quitar ${product.name} de la cesta`}
        className="mt-1 grid h-7 w-7 place-items-center text-muted-foreground transition-colors hover:text-destructive"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </li>
  );
}