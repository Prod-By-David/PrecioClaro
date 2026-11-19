export default function StoreStrip({ stores }) {
  return (
    <section className="border-y border-border">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 py-9 lg:px-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="eyebrow">Red de tiendas</p>
          <p className="mt-2 font-heading text-[22px] leading-none">Comparamos allí donde compras</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5">
          {stores.map((store) => (
            <span key={store.name} className="text-[13px] text-foreground/60 transition-colors hover:text-foreground">
              {store.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}