import LegalShell from "@/components/legal/LegalShell";
import useDocumentMeta from "@/hooks/useDocumentMeta";
import { openConsentSettings } from "@/lib/consent";

const UPDATED = "17 de noviembre de 2026";

const STORAGE_ROWS = [
  {
    name: "precioclaro.cesta.v1",
    owner: "PrecioClaro",
    purpose: "Guardar los artículos y cantidades de tu cesta semanal.",
    duration: "Hasta que la vacías o borras los datos del navegador.",
    type: "Técnico (almacenamiento local)",
  },
  {
    name: "precioclaro.alertas.v1",
    owner: "PrecioClaro",
    purpose: "Guardar los avisos de precio que creas en este dispositivo.",
    duration: "Hasta que los eliminas o borras los datos del navegador.",
    type: "Técnico (almacenamiento local)",
  },
  {
    name: "precioclaro.consent.v1",
    owner: "PrecioClaro",
    purpose: "Registrar tu elección sobre cookies y la fecha en que la hiciste.",
    duration: "12 meses o hasta que la modifiques.",
    type: "Técnico (almacenamiento local)",
  },
];

export default function Cookies() {
  useDocumentMeta({
    title: "Política de cookies — PrecioClaro",
    description:
      "Inventario de cookies y almacenamiento local que usa PrecioClaro, para qué sirve cada uno y cómo aceptar, rechazar o retirar tu consentimiento.",
  });

  const sections = [
    {
      title: "1. Qué son las cookies y el almacenamiento local",
      body: (
        <p>
          Las cookies son pequeños archivos que un sitio guarda en tu dispositivo. El almacenamiento local
          (localStorage) funciona de forma parecida: permite recordar información entre visitas sin
          enviarla al servidor. Usamos este segundo mecanismo, no cookies publicitarias.
        </p>
      ),
    },
    {
      title: "2. Base legal y consentimiento",
      body: (
        <>
          <p>
            El almacenamiento estrictamente técnico y necesario para prestar el servicio que solicitas
            está exento de consentimiento (art. 22.2 LSSI-CE). Cualquier finalidad analítica, de
            personalización o publicitaria requiere tu consentimiento previo, que puedes otorgar, rechazar
            o retirar en cualquier momento con la misma facilidad.
          </p>
          <p>
            Hoy el sitio <strong>no carga herramientas de analítica ni de publicidad</strong>. Si se
            incorporan, solo se activarán después de que aceptes la categoría correspondiente y quedarán
            inventariadas en esta página.
          </p>
        </>
      ),
    },
    {
      title: "3. Inventario de almacenamiento",
      body: (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-[12px]">
            <caption className="sr-only">
              Inventario de cookies y almacenamiento local utilizados por PrecioClaro
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-2 pr-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  Nombre
                </th>
                <th scope="col" className="py-2 pr-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  Titular
                </th>
                <th scope="col" className="py-2 pr-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  Finalidad
                </th>
                <th scope="col" className="py-2 pr-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  Duración
                </th>
                <th scope="col" className="py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  Tipo
                </th>
              </tr>
            </thead>
            <tbody>
              {STORAGE_ROWS.map((row) => (
                <tr key={row.name} className="border-b border-border/70 align-top">
                  <th scope="row" className="py-2.5 pr-3 font-mono text-[11px] font-normal">
                    {row.name}
                  </th>
                  <td className="py-2.5 pr-3">{row.owner}</td>
                  <td className="py-2.5 pr-3">{row.purpose}</td>
                  <td className="py-2.5 pr-3">{row.duration}</td>
                  <td className="py-2.5">{row.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      title: "4. Recursos de terceros",
      body: (
        <p>
          Las tipografías se sirven desde Google Fonts. Es una petición a un dominio externo que recibe tu
          dirección IP para entregar el archivo de fuente; no instala cookies propias de publicidad. Si
          prefieres evitarlo, puedes bloquear el dominio fonts.gstatic.com en tu navegador: la web seguirá
          siendo legible con las tipografías del sistema.
        </p>
      ),
    },
    {
      title: "5. Cómo cambiar o retirar tu consentimiento",
      body: (
        <>
          <p>
            Puedes abrir de nuevo el panel de configuración y modificar tu elección en cualquier momento.
            La nueva selección sustituye a la anterior.
          </p>
          <button
            type="button"
            onClick={openConsentSettings}
            className="border border-foreground/25 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-primary hover:text-primary"
          >
            Configurar cookies
          </button>
          <p>
            Además, puedes borrar el almacenamiento local desde la configuración de tu navegador
            (Privacidad → Borrar datos de navegación). Ten en cuenta que al hacerlo perderás la cesta y los
            avisos guardados.
          </p>
        </>
      ),
    },
    {
      title: "6. Cambios en esta política",
      body: (
        <p>
          Si incorporamos nuevas cookies o cambia su finalidad, actualizaremos este inventario y
          solicitaremos de nuevo el consentimiento cuando sea necesario.
        </p>
      ),
    },
  ];

  return (
    <LegalShell
      title="Política de cookies"
      summary="Qué guardamos en tu dispositivo, para qué y cómo puedes cambiarlo. Sin publicidad y sin rastreo entre sitios."
      updated={UPDATED}
      sections={sections}
      footerNote="Documento informativo conforme al artículo 22.2 de la LSSI-CE y a las directrices de la AEPD sobre uso de cookies."
    />
  );
}