import { Outlet } from "react-router-dom";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import usePriceEngine from "@/hooks/usePriceEngine";

export default function AppShell() {
  usePriceEngine();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-primary focus:bg-primary focus:px-4 focus:py-2.5 focus:font-mono focus:text-[10px] focus:uppercase focus:tracking-[0.14em] focus:text-primary-foreground"
      >
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}