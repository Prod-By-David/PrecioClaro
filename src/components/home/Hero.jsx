import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { eur, num } from "@/lib/format";

function Sparkline({ values }) {
  const data = values?.length > 1 ? values : [4, 6, 5, 7, 6, 8, 7, 9];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((value, index) => `${(index / (data.length - 1)) * 100},${28 - ((value - min) / (max - min || 1)) * 24}`)
    .join(" ");

  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-14 w-full text-gold" aria-hidden="true">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function Hero({ stats, sparkline, suggestions }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const submit = (event) => {
    event.preventDefault();
    navigate(`/explorar${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  };

  const rows = [
    { label: "Artículos vigilados", value: num(stats.watched) },
    { label: "Bajadas detectadas", value: num(stats.dropsToday) },
    { label: "Tiendas comparadas", value: num(stats.stores) },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 paper-grid [mask-image:linear-gradient(to_bottom,black_10%,transparent_90%)]" />

      <div className="relative mx-auto max-w-[1240px] px-5 lg:px-10">
        <div className="grid items-start gap-12 py-14 lg:grid-cols-[1.25fr_0.85fr] lg:gap-16 lg:py-20">
          <div className="rise min-w-0">
            <div className="flex items-center gap-2.5 text-primary">
              <span className="live-dot" />
              <span className="eyebrow text-primary">Comparador de precios · España</span>
            </div>

            <h1 className="mt-6 font-heading text-[clamp(2.6rem,5.6vw,4.4rem)] leading-[0.94] tracking-[-0.015em]">
              Compra lo de siempre.
              <br />
              Paga <em className="text-primary">lo justo</em>.
            </h1>

            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              Cotejamos el mismo producto en las tiendas que lo venden en España —supermercado, droguería, hogar,
              tecnología— con envío e impuestos incluidos. Y lo actualizamos en directo.
            </p>

            <form
              onSubmit={submit}
              className="mt-8 flex items-stretch border border-foreground/25 bg-card transition-colors focus-within:border-primary"
            >
              <Search className="ml-4 h-4 w-4 self-center text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Busca un producto, marca o categoría"
                aria-label="Buscar producto"
                className="h-14 min-w-0 flex-1 bg-transparent px-3 text-[15px] outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="m-1 flex items-center gap-2 bg-primary px-4 font-mono text-[10px] uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-primary/90 sm:px-5"
              >
                Comparar
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="eyebrow">Lo más buscado</span>
              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => navigate(`/explorar?q=${encodeURIComponent(item)}`)}
                  className="border border-border px-2.5 py-1 text-[12px] text-foreground/75 transition-colors hover:border-foreground/40 hover:text-foreground"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <aside className="rise min-w-0 border border-border bg-card p-6 [animation-delay:120ms] lg:mt-2">
            <div className="flex items-center justify-between">
              <p className="eyebrow">Ahorro medio por compra</p>
              <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                <span className="live-dot" />
                En directo
              </span>
            </div>

            <p className="num mt-4 text-[46px] leading-none tracking-[-0.05em]">
              {stats.averageSaving ? eur(stats.averageSaving) : "—"}
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
              Diferencia media entre el precio más alto y el más bajo del mismo artículo.
            </p>

            <div className="mt-4 border-y border-border/70 py-2">
              <Sparkline values={sparkline} />
            </div>

            <dl className="mt-4 divide-y divide-border/70">
              {rows.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between py-2.5">
                  <dt className="text-[12.5px] text-muted-foreground">{row.label}</dt>
                  <dd className="num text-[14px]">{row.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <span className="live-dot text-primary" />
              Sincronización automática
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}