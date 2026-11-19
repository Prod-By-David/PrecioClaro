import LegalShell from "@/components/legal/LegalShell";
import useDocumentMeta from "@/hooks/useDocumentMeta";

const UPDATED = "17 de noviembre de 2026";

export default function Terminos() {
  useDocumentMeta({
    title: "Términos de uso — PrecioClaro",
    description:
      "Condiciones de acceso y uso del comparador PrecioClaro: uso permitido y prohibido, propiedad intelectual, disponibilidad y responsabilidad.",
  });

  const sections = [
    {
      title: "1. Objeto",
      body: (
        <p>
          Estos términos regulan el acceso y uso del sitio web PrecioClaro, un servicio informativo de
          comparación de precios. El acceso implica la aceptación plena de estas condiciones. Si no estás
          de acuerdo, debes abstenerte de utilizar el sitio.
        </p>
      ),
    },
    {
      title: "2. Naturaleza del servicio",
      body: (
        <>
          <p>
            PrecioClaro <strong>no vende productos</strong> ni interviene en la contratación: muestra
            información pública sobre ofertas de tiendas de terceros y enlaza a sus páginas, donde se
            formaliza la compra bajo sus propias condiciones.
          </p>
          <p>
            No existe relación comercial, mandato ni intermediación entre PrecioClaro y las tiendas
            comparadas, y el orden de las ofertas responde exclusivamente al precio total calculado.
          </p>
        </>
      ),
    },
    {
      title: "3. Uso permitido y prohibido",
      body: (
        <>
          <p>Se permite el uso personal del comparador y la consulta de sus datos con fines informativos.</p>
          <p>Queda prohibido:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Extraer, replicar o revender de forma masiva los datos del catálogo.</li>
            <li>Automatizar peticiones que degraden el servicio o eludan sus límites técnicos.</li>
            <li>Introducir código malicioso, intentar acceder a áreas restringidas o realizar pruebas de penetración sin autorización escrita.</li>
            <li>Suplantar la identidad del titular o de terceros.</li>
            <li>Utilizar el sitio para fines ilícitos o contrarios a la buena fe.</li>
          </ul>
        </>
      ),
    },
    {
      title: "4. Precios e información",
      body: (
        <>
          <p>
            La información se recopila de fuentes públicas y se actualiza automáticamente. Los precios son
            orientativos: pueden incluir o excluir gastos según se indique y variar por promociones,
            disponibilidad o errores de la tienda.
          </p>
          <p>
            El precio y las condiciones aplicables son los que figuren en la tienda en el momento de la
            compra. PrecioClaro no responde de las diferencias entre la información mostrada y la oferta
            vigente en la tienda.
          </p>
        </>
      ),
    },
    {
      title: "5. Propiedad intelectual",
      body: (
        <p>
          El código, el diseño, la estructura y los textos originales del sitio pertenecen a su titular.
          Las marcas, denominaciones comerciales e imágenes de producto pertenecen a sus respectivos
          propietarios y se utilizan con finalidad identificativa. No se concede licencia alguna sobre
          ellos por el mero uso del sitio.
        </p>
      ),
    },
    {
      title: "6. Disponibilidad y modificaciones",
      body: (
        <p>
          El servicio se presta «tal cual» y puede interrumpirse por mantenimiento, fallos técnicos o
          causas ajenas. El titular puede modificar, suspender o retirar contenidos y funcionalidades sin
          previo aviso, así como actualizar estos términos. La versión vigente será la publicada en esta
          página.
        </p>
      ),
    },
    {
      title: "7. Responsabilidad",
      body: (
        <p>
          El titular no responde de daños indirectos, lucro cesante o decisiones de compra adoptadas a
          partir de la información del comparador, salvo dolo o negligencia grave. Nada en estos términos
          limita los derechos que la normativa de consumo reconoce a las personas consumidoras.
        </p>
      ),
    },
    {
      title: "8. Nulidad parcial y ley aplicable",
      body: (
        <p>
          Si alguna cláusula resultara nula, el resto mantendrá su validez. Estas condiciones se rigen por
          la legislación española y, para consumidores, por la jurisdicción que corresponda conforme a la
          normativa aplicable.
        </p>
      ),
    },
  ];

  return (
    <LegalShell
      title="Términos de uso"
      summary="Las reglas del comparador: qué puedes hacer, qué no, y por qué el precio válido es siempre el de la tienda."
      updated={UPDATED}
      sections={sections}
      footerNote="No existe venta directa en este sitio, por lo que no se aplican condiciones de venta ni derecho de desistimiento propio."
    />
  );
}