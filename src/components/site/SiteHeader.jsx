import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import useBasket from "@/hooks/useBasket";
import { countBasket } from "@/lib/basket";

const NAV = [
  { to: "/explorar", label: "Explorar" },
  { to: "/cesta", label: "Cesta" },
  { to: "/tiendas", label: "Tiendas" },
  { to: "/alertas", label: "Mis avisos" },
];

export default function SiteHeader() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const count = countBasket(useBasket());

  const submit = (event) => {
    event.preventDefault();
    navigate(`/explorar${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1240px] items-center gap-8 px-5 lg:px-10">
        <Link to="/" className="flex items-center gap-2.5" aria-label="PrecioClaro, inicio">
          <span className="grid h-7 w-7 place-items-center bg-primary font-heading text-[15px] leading-none text-primary-foreground">
            €
          </span>
          <span className="font-heading text-[23px] leading-none tracking-tight">PrecioClaro</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="link-underline pb-1 text-[13.5px] text-foreground/75 transition-colors hover:text-foreground"
            >
              {item.label}
              {item.to === "/cesta" && count > 0 && (
                <span className="num ml-1.5 bg-primary px-1 text-[9px] leading-4 text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <form
          onSubmit={submit}
          className="ml-auto hidden h-9 items-center gap-2 border border-border bg-card px-3 transition-colors focus-within:border-foreground/40 md:flex"
        >
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Buscar producto"
            aria-label="Buscar producto"
            className="w-40 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
          />
          <kbd className="border border-border px-1 font-mono text-[10px] text-muted-foreground">↵</kbd>
        </form>

        <Link
          to="/explorar"
          aria-label="Buscar"
          className="ml-auto grid h-9 w-9 place-items-center border border-border text-foreground/80 md:hidden"
        >
          <Search className="h-4 w-4" />
        </Link>

        <Link
          to="/alertas"
          className="hidden items-center gap-2 border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground sm:flex"
        >
          <Bell className="h-3.5 w-3.5" />
          Avisos
        </Link>
      </div>

      <div className="border-t border-border/70 lg:hidden">
        <nav className="mx-auto flex max-w-[1240px] items-center gap-6 overflow-x-auto px-5 py-2.5">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/70"
            >
              {item.label}
              {item.to === "/cesta" && count > 0 && (
                <span className="num ml-1 bg-primary px-1 text-[9px] leading-4 text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export { Outlet };