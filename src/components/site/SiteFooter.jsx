import { Link } from "react-router-dom";
import { openConsentSettings } from "@/lib/consent";

const LINKS = [
  { to: "/explorar", label: "Explorar catálogo" },
  { to: "/tiendas", label: "Tiendas comparadas" },
  { to: "/alertas", label: "Mis avisos de precio" },
];

const LEGAL_LINKS = [
  { to: "/aviso-legal", label: "Aviso legal" },
  { to: "/privacidad", label: "Privacidad" },
  { to: "/cookies", label: "Cookies" },
  { to: "/terminos", label: "Términos de uso" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto max-w-[1240px] px-5 py-14 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center bg-primary font-heading text-[15px] leading-none text-primary-foreground">
                €
              </span>
              <span className="font-heading text-[23px] leading-none tracking-tight">PrecioClaro</span>
            </div>
            <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-muted-foreground">
              El comparador de precios de la compra de cada día: el mismo producto, en todas las tiendas que lo
              venden, con envío e impuestos incluidos.
            </p>
          </div>

          <div>
            <p className="eyebrow">Comparar</p>
            <ul className="mt-4 space-y-2.5">
              {LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="link-underline text-[13.5px] text-foreground/80 hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Cómo trabajamos</p>
            <ul className="mt-4 space-y-2.5 text-[13.5px] leading-relaxed text-muted-foreground">
              <li>Precios con IVA y envío incluidos</li>
              <li>Actualización automática cada minuto</li>
              <li>Histórico de 90 días por producto</li>
              <li>Sin coste para quien compara</li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">Legal</p>
            <ul className="mt-4 space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="link-underline text-[13.5px] text-foreground/80 hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={openConsentSettings}
                  className="link-underline text-left text-[13.5px] text-foreground/80 hover:text-foreground"
                >
                  Configurar cookies
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            © {new Date().getFullYear()} PrecioClaro · España
          </p>
          <p className="max-w-xl text-[11.5px] leading-relaxed text-muted-foreground">
            Catálogo de demostración: los precios se gestionan desde el motor de sincronización de PrecioClaro. Al
            conectar las fuentes de cada tienda, las ofertas se actualizan con sus tarifas reales.
          </p>
        </div>
      </div>
    </footer>
  );
}