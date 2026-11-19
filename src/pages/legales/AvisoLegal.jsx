import { Link } from "react-router-dom";
import LegalShell from "@/components/legal/LegalShell";
import useDocumentMeta from "@/hooks/useDocumentMeta";

const UPDATED = "17 de noviembre de 2026";
const CONTACT = "[EMAIL DE CONTACTO]";

export default function AvisoLegal() {
  useDocumentMeta({
    title: "Aviso legal — PrecioClaro",
    description:
      "Datos identificativos del titular de PrecioClaro, condiciones de acceso, propiedad intelectual y responsabilidad sobre la información publicada.",
  });

  const sections = [
    {
      title: "1. Datos identificativos del titular",
      body: (
        <>
          <p>
            En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la
            Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del
            titular de este sitio web:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Denominación social:</strong> [RAZÓN SOCIAL]
            </li>
            <li>
              <strong>NIF/CIF:</strong> [NIF]
            </li>
            <li>
              <strong>Domicilio:</strong> [DOMICILIO COMPLETO, CÓDIGO POSTAL, LOCALIDAD, PROVINCIA, ESPAÑA]
            </li>
            <li>
              <strong>Correo electrónico:</strong> {CONTACT}
            </li>
            <li>
              <strong>Teléfono:</strong> [TELÉFONO]
            </li>
            <li>
              <strong>Datos registrales:</strong> [REGISTRO MERCANTIL, TOMO, FOLIO, HOJA]
            </li>
            <li>
              <strong>Actividad:</strong> comparación informativa de precios de productos de terceros.
              PrecioClaro no vende los productos que compara.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "2. Objeto",
      body: (
        <>
          <p>
            Este sitio web tiene como finalidad mostrar, de forma informativa, la evolución y la
            comparación de precios de productos comercializados por tiendas de terceros. La información
            se obtiene de fuentes públicas y se actualiza de forma automática.
          </p>
          <p>
            El acceso al sitio atribuye la condición de usuario e implica la aceptación de las
            condiciones recogidas en este aviso legal.
          </p>
        </>
      ),
    },
    {
      title: "3. Condiciones de acceso y uso",
      body: (
        <>
          <p>
            El acceso es libre y gratuito. El usuario se compromete a hacer un uso diligente del sitio y a
            no emplearlo para actividades ilícitas, lesivas de derechos de terceros o contrarias al orden
            público.
          </p>
          <p>
            Queda prohibida la extracción masiva y automatizada de datos (incluida la recolección de
            precios por medios automatizados) sin autorización previa y por escrito del titular, así como
            cualquier uso que comprometa la disponibilidad del servicio.
          </p>
        </>
      ),
    },
    {
      title: "4. Propiedad intelectual e industrial",
      body: (
        <>
          <p>
            El diseño, el código fuente, la estructura de navegación, los textos originales y los
            elementos gráficos propios de PrecioClaro están protegidos por la normativa de propiedad
            intelectual e industrial. Las marcas y denominaciones de las tiendas y productos citados
            pertenecen a sus respectivos titulares y se emplean únicamente con finalidad identificativa e
            informativa.
          </p>
          <p>
            No se autoriza la reproducción total o parcial del contenido propio sin autorización
            expresa.
          </p>
        </>
      ),
    },
    {
      title: "5. Exactitud de la información y precios",
      body: (
        <>
          <p>
            Los precios mostrados son orientativos y pueden variar en la tienda en cualquier momento por
            cambios de disponibilidad, promociones o errores de terceros.{" "}
            <strong>
              El precio válido es siempre el que figure en la página de la tienda en el momento de la
              compra
            </strong>
            , junto con sus condiciones de envío, impuestos y disponibilidad.
          </p>
          <p>
            La fecha de la última revisión de cada oferta se indica en la propia comparativa. PrecioClaro
            no garantiza la ausencia de errores ni la disponibilidad continuada de las ofertas mostradas.
          </p>
        </>
      ),
    },
    {
      title: "6. Enlaces a sitios de terceros",
      body: (
        <p>
          El sitio incluye enlaces a páginas de tiendas ajenas. PrecioClaro no controla esos contenidos ni
          asume responsabilidad alguna sobre ellos, sus condiciones de venta o sus políticas de
          privacidad. El acceso a través de esos enlaces se realiza bajo la responsabilidad del usuario.
        </p>
      ),
    },
    {
      title: "7. Responsabilidad",
      body: (
        <p>
          El titular no será responsable de los daños derivados de un uso indebido del sitio, de
          interrupciones del servicio por causas ajenas, ni de decisiones de compra adoptadas a partir de
          la información mostrada. Se adopta un esfuerzo razonable para mantener el servicio disponible y
          la información actualizada, sin que ello constituya una garantía de disponibilidad permanente.
        </p>
      ),
    },
    {
      title: "8. Protección de datos",
      body: (
        <p>
          El tratamiento de datos personales se describe en la{" "}
          <Link to="/privacidad" className="text-primary underline underline-offset-2">
            Política de privacidad
          </Link>
          . El uso de cookies y almacenamiento local se detalla en la{" "}
          <Link to="/cookies" className="text-primary underline underline-offset-2">
            Política de cookies
          </Link>
          .
        </p>
      ),
    },
    {
      title: "9. Legislación aplicable y resolución de conflictos",
      body: (
        <>
          <p>
            Estas condiciones se rigen por la legislación española. Para las personas consumidoras, la
            competencia judicial será la que determine la normativa de consumo aplicable.
          </p>
          <p>
            La Comisión Europea facilita una plataforma de resolución de litigios en línea, disponible en
            https://ec.europa.eu/consumers/odr. Puedes dirigir cualquier reclamación previa a {CONTACT}.
          </p>
        </>
      ),
    },
  ];

  return (
    <LegalShell
      title="Aviso legal"
      summary="Quién está detrás de PrecioClaro, bajo qué condiciones puedes usar el comparador y hasta dónde llega su responsabilidad."
      updated={UPDATED}
      draftNotice="sustituye todos los campos entre corchetes por los datos reales de tu empresa. Este texto es una plantilla revisable, no un dictamen jurídico."
      sections={sections}
      footerNote="Documento informativo sujeto a revisión legal antes de su publicación definitiva."
    />
  );
}