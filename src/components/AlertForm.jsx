import { useState } from "react";
import { Link } from "react-router-dom";
import { BellRing, Check } from "lucide-react";
import { saveAlert } from "@/lib/alerts";
import { eur } from "@/lib/format";

export default function AlertForm({ product }) {
  const best = Number(product.best_price) || 0;
  const [target, setTarget] = useState(best ? (best * 0.95).toFixed(2).replace(".", ",") : "");
  const [saved, setSaved] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    const value = Number(String(target).replace(",", "."));
    if (!value || value <= 0) return;
    saveAlert({
      slug: product.slug,
      name: product.name,
      image: product.image_url,
      target: value,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <BellRing className="h-3.5 w-3.5 text-primary" />
        <p className="eyebrow">Aviso de precio</p>
      </div>
      <p className="mt-3 font-heading text-[21px] leading-tight">Avísame si baja de…</p>
      <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
        Precio más bajo ahora: <span className="num text-foreground">{eur(best)}</span>. Los avisos se guardan en este
        navegador.
      </p>

      <form onSubmit={submit} className="mt-4 flex items-stretch border border-foreground/25 bg-background focus-within:border-primary">
        <input
          value={target}
          onChange={(event) => setTarget(event.target.value)}
          inputMode="decimal"
          aria-label="Precio objetivo"
          className="h-11 min-w-0 flex-1 bg-transparent px-3 text-[14px] outline-none"
        />
        <span className="grid place-items-center border-l border-border px-3 font-mono text-[12px] text-muted-foreground">
          €
        </span>
        <button
          type="submit"
          className="m-1 flex items-center gap-1.5 bg-primary px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90"
        >
          {saved ? <Check className="h-3.5 w-3.5" /> : null}
          {saved ? "Creado" : "Crear aviso"}
        </button>
      </form>

      <div className="mt-3 flex items-center justify-between">
        <Link to="/alertas" className="link-underline font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/60 hover:text-foreground">
          Ver mis avisos
        </Link>
        <span className="font-mono text-[10px] text-muted-foreground">Sin registro</span>
      </div>
    </div>
  );
}