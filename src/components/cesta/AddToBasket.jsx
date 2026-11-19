import { useState } from "react";
import { Check, Minus, Plus, ShoppingBasket } from "lucide-react";
import { addToBasket } from "@/lib/basket";

export default function AddToBasket({ slug }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const add = () => {
    addToBasket(slug, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  const step = (delta) => setQty((current) => Math.min(99, Math.max(1, current + delta)));

  return (
    <div className="flex items-stretch gap-2">
      <div className="flex items-center border border-foreground/25">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Quitar una unidad"
          className="grid h-11 w-9 place-items-center text-foreground/70 transition-colors hover:text-primary"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="num w-7 text-center text-[13px]">{qty}</span>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Añadir una unidad"
          className="grid h-11 w-9 place-items-center text-foreground/70 transition-colors hover:text-primary"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <button
        type="button"
        onClick={add}
        className="flex flex-1 items-center justify-center gap-2 border border-foreground/25 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-primary hover:text-primary"
      >
        {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingBasket className="h-3.5 w-3.5" />}
        {added ? "En la cesta" : "Añadir a la cesta"}
      </button>
    </div>
  );
}