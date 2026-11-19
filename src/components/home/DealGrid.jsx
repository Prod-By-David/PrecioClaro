import SectionHead from "@/components/SectionHead";
import DealCard from "@/components/home/DealCard";

export default function DealGrid({ products }) {
  return (
    <section>
      <SectionHead
        index="03"
        eyebrow="Selección de la semana"
        title="Artículos que hoy están a buen precio"
        description="Ordenados por la diferencia entre el precio actual y la referencia de los últimos 90 días."
      />
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {products.map((product) => (
          <DealCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}