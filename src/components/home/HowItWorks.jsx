const STEPS = [
  {
    title: "Reunimos cada oferta",
    text: "Buscamos el mismo artículo en todas las tiendas españolas que lo venden y normalizamos el precio: IVA, envío y disponibilidad.",
  },
  {
    title: "Leemos el histórico",
    text: "Guardamos 90 días de precios por producto para saber si la oferta de hoy es real o un descuento de escaparate.",
  },
  {
    title: "Te avisamos al bajar",
    text: "Fijas tu precio objetivo una vez y te avisamos en cuanto alguna tienda lo cruce. Sin revisar la web cada mañana.",
  },
];

export default function HowItWorks() {
  return (
    <div className="grid gap-px border border-border bg-border md:grid-cols-3">
      {STEPS.map((step, index) => (
        <div key={step.title} className="bg-card p-6">
          <span className="num text-[11px] text-primary">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="mt-6 font-heading text-[22px] leading-tight">{step.title}</h3>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{step.text}</p>
        </div>
      ))}
    </div>
  );
}