import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { num } from "@/lib/format";

export default function CategoryRail({ categories }) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-3 lg:grid-cols-6">
      {categories.map((category, index) => (
        <Link
          key={category.name}
          to={`/explorar?cat=${encodeURIComponent(category.name)}`}
          className="group flex flex-col justify-between gap-8 bg-background p-4 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
        >
          <div className="flex items-start justify-between">
            <span className="num text-[10px] text-muted-foreground transition-colors group-hover:text-primary-foreground/60">
              {String(index + 1).padStart(2, "0")}
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          <div>
            <h3 className="font-heading text-[20px] leading-tight">{category.name}</h3>
            <p className="mt-1 text-[11px] leading-snug text-muted-foreground transition-colors group-hover:text-primary-foreground/60">
              {category.note}
            </p>
            <p className="num mt-4 text-[10px] uppercase tracking-[0.1em] text-muted-foreground transition-colors group-hover:text-primary-foreground/70">
              {num(category.count)} artículos
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}