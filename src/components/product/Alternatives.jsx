import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { eur } from "@/lib/format";
import { normalize } from "@/lib/search";
import { formatUnitPrice } from "@/lib/units";

function keywordsOf(product) {
  const brandWords = new Set(normalize(product.brand).split(" ").filter(Boolean));
  return normalize(product.name)
    .split(" ")
    .filter((word) => word.length > 3 && !brandWords.has(word));
}

export default function Alternatives({ product, products }) {
  const sourceKeywords = keywordsOf(product);

  const list = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .filter((item) => Number(item.best_price) > 0 && Number(item.best_price) < Number(product.best_price))
    .filter((item) => {
      const sharedKeyword = keywordsOf(item).some((word) => sourceKeywords.includes(word));
      const sameFormat = Boolean(item.unit) && item.unit === product.unit;
      return sharedKeyword || sameFormat;
    })
    .sort((a, b) => Number(a.best_price) - Number(b.best_price))
    .slice(0, 3);

  if (!list.length) return null;

  return (
    <section className="mt-14">
      <div className="border-t border-foreground/20 pt-5">
        <p className="eyebrow">Si buscas ahorrar</p>
        <h2 className="mt-2 font-heading text-[clamp(1.7rem,2.6vw,2.2rem)] leading-tight">
          Equivalentes más baratos
        </h2>
        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
          Mismo tipo de artículo o mismo formato, con mejor precio. Donde el tamaño cambia, manda el
          precio por unidad.
        </p>
      </div>

      <ul className="mt-5 border-t border-border">
        {list.map((item) => {
          const unit = formatUnitPrice(item.best_price, item);
          const saving = Number(product.best_price) - Number(item.best_price);
          return (
            <li key={item.id} className="border-b border-border">
              <Link
                to={`/producto/${item.slug}`}
                className="group flex items-center justify-between gap-4 py-4"
              >
                <div className="min-w-0">
                  <p className="font-heading text-[17px] leading-tight transition-colors group-hover:text-primary">
                    {item.name}
                  </p>
                  <p className="mt-1 text-[11.5px] text-muted-foreground">
                    {item.best_store} · {unit || item.unit}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="num text-[15px] leading-none">{eur(item.best_price)}</p>
                  <p className="num mt-1.5 text-[10.5px] text-muted-foreground">{eur(saving)} menos</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}