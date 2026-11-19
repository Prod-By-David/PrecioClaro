import { eur } from "@/lib/format";

function TickerGroup({ items, hidden }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((drop) => (
        <span
          key={`${drop.product}-${drop.store}`}
          className="flex items-center gap-2.5 whitespace-nowrap px-6 font-mono text-[11px] uppercase tracking-[0.1em]"
        >
          <span className="text-background/40">↓</span>
          <span className="text-background/85">{drop.product}</span>
          <span className="text-background/35">·</span>
          <span className="text-background/55">{drop.store}</span>
          <span className="text-background/35 line-through">{eur(drop.from)}</span>
          <span className="text-background">{eur(drop.to)}</span>
        </span>
      ))}
    </div>
  );
}

export default function PriceTicker({ drops }) {
  const items = (drops || []).slice(0, 8);

  if (!items.length) {
    return (
      <div className="border-b border-foreground/20 bg-foreground py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-background/70">
        Radar de precios activo · esperando el primer movimiento
      </div>
    );
  }

  return (
    <div className="border-b border-foreground/20 bg-foreground text-background">
      <div className="flex items-center overflow-hidden py-2.5">
        <div className="animate-ticker flex w-max">
          <TickerGroup items={items} />
          <TickerGroup items={items} hidden />
        </div>
      </div>
    </div>
  );
}