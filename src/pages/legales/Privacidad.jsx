import LegalShell from "@/components/legal/LegalShell";
import useDocumentMeta from "@/hooks/useDocumentMeta";

const UPDATED = "17 de noviembre de 2026";
const CONTACT = "[EMAIL DE CONTACTO]";

export default function Privacidad() {
  useDocumentMeta({
    title: "Política de privacidad — PrecioClaro",
    description:
      "Qué datos trata PrecioClaro, con qué base jurídica, durante cuánto tiempo y cómo ejercer tus derechos ante el responsable del tratamiento.",
  });

  const sections = [
    {
      title: "1. Responsable del tratamiento",
      body: (
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Responsable:</strong> [RAZÓN SOCIAL], NIF [NIF]
          </li>
          <li>
            <strong>Domicilio:</strong> [DOMICILIO COMPLETO, LOCALIDAD, PROVINCIA, ESPAÑA]
          </li>
          <li>
            <strong>Correo para privacidad:</strong> {CONTACT}
          </li>
          <li>
            <strong>Delegado de Protección de Datos:</strong> no designado por no resultar obligatorio
            conforme al artículo 37 del RGPD. Las consultas se atienden en la dirección indicada.
          </li>
        </ul>
      ),
    },
    {
      title: "2. Qué datos tratamos",
      body: (
        <>
          <p>
            PrecioClaro es un comparador de acceso libre que <strong>no exige registro</strong> y no
            incorpora cuentas de usuario ni pagos.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Cesta semanal y avisos de precio:</strong> se guardan únicamente en el almacenamiento
              local de tu navegador. No se envían a nuestros servidores y no son accesibles para el
              responsable.
            </li>
            <li>
              <strong>Datos técnicos de navegación:</strong> dirección IP, tipo de dispositivo, navegador y
              marcas de tiempo generadas por el proveedor de alojamiento para servir la web y protegerla
              frente a abusos.
            </li>
            <li>
              <strong>Correo electrónico:</strong> solo si decides escribirnos, para atender tu consulta.
            </li>
          </ul>
          <p>
            No tratamos datos de categorías especiales (salud, biométricos, ideología) ni datos de menores
            de 14 años, y no elaboramos perfiles publicitarios ni tomamos decisiones automatizadas con
            efectos jurídicos.
          </p>
        </>
      ),
    },
    {
      title: "3. Finalidades y bases jurídicas",
      body: (
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Prestar el servicio de comparación</strong> y mostrar la información del catálogo —
            interés legítimo en la publicación de contenido informativo (art. 6.1.f RGPD).
          </li>
          <li>
            <strong>Seguridad y prevención de abusos</strong> (registros técnicos, limitación de peticiones)
            — interés legítimo (art. 6.1.f RGPD).
          </li>
          <li>
            <strong>Atender consultas y reclamaciones</strong> que nos dirijas — consentimiento e interés
            legítimo en responder (art. 6.1.a y 6.1.f RGPD).
          </li>
          <li>
            <strong>Medición de audiencia</strong>, solo si aceptas la categoría analítica en el banner de
            cookies — consentimiento (art. 6.1.a RGPD y art. 22.2 LSSI-CE).
          </li>
        </ul>
      ),
    },
    {
      title: "4. Plazos de conservación",
      body: (
        <ul className="list-disc space-y-1 pl-5">
          <li>Registros técnicos del servidor: máximo 12 meses.</li>
          <li>Correos de consulta: el tiempo necesario para resolverla y, después, el plazo de prescripción legal aplicable.</li>
          <li>Cesta, avisos y preferencia de cookies: en tu navegador hasta que los borres o retires el consentimiento.</li>
        </ul>
      ),
    },
    {
      title: "5. Destinatarios y encargados del tratamiento",
      body: (
        <>
          <p>
            No vendemos ni cedemos datos personales. Para operar el servicio utilizamos proveedores que
            actúan como encargados del tratamiento:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Alojamiento y base de datos:</strong> plataforma Base44 / Wix, que presta la
              infraestructura de la aplicación web.
            </li>
            <li>
              <strong>Tipografías:</strong> Google Fonts, que sirve los tipos de letra y recibe la IP del
              visitante al descargarlos.
            </li>
          </ul>
          <p>
            Podrán acceder terceros cuando exista una obligación legal (por ejemplo, requerimiento de una
            autoridad competente).
          </p>
        </>
      ),
    },
    {
      title: "6. Transferencias internacionales",
      body: (
        <p>
          Algunos proveedores están establecidos fuera del Espacio Económico Europeo, principalmente en
          Estados Unidos. En esos casos la transferencia se ampara en el Marco de Privacidad de Datos
          UE-EEUU cuando el proveedor está certificado, o en las Cláusulas Contractuales Tipo aprobadas por
          la Comisión Europea (Decisión 2021/914). Puedes solicitar información sobre la garantía aplicable
          escribiendo a {CONTACT}.
        </p>
      ),
    },
    {
      title: "7. Tus derechos",
      body: (
        <>
          <p>
            Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación del
            tratamiento y portabilidad, así como retirar el consentimiento en cualquier momento, sin que
            ello afecte a la licitud del tratamiento previo.
          </p>
          <p>
            Escríbenos a <strong>{CONTACT}</strong> indicando el derecho que deseas ejercer. Responderemos
            en el plazo máximo de un mes, ampliable dos meses más en casos complejos.
          </p>
          <p>
            Si consideras que no se han atendido correctamente tus derechos, puedes reclamar ante la
            Agencia Española de Protección de Datos (www.aepd.es), C/ Jorge Juan 6, 28001 Madrid.
          </p>
        </>
      ),
    },
    {
      title: "8. Seguridad",
      body: (
        <p>
          Aplicamos medidas técnicas y organizativas proporcionadas al riesgo: cifrado en tránsito
          mediante HTTPS, control de acceso a la base de datos con permisos mínimos (las tablas de
          catálogo solo admiten escritura desde cuentas administradoras), ausencia de secretos en el
          código y limitación de los datos tratados al mínimo imprescindible. Ninguna medida es infalible,
          pero ante un incidente relevante se notificará a la autoridad de control en un plazo máximo de 72
          horas cuando proceda.
        </p>
      ),
    },
    {
      title: "9. Menores de edad",
      body: (
        <p>
          El servicio no está dirigido a menores de 14 años y no se solicitan datos personales para
          utilizarlo. Si detectas que un menor nos ha facilitado datos, escríbenos y procederemos a su
          supresión.
        </p>
      ),
    },
    {
      title: "10. Cambios en esta política",
      body: (
        <p>
          Podemos actualizar esta política para reflejar cambios normativos o del servicio. La versión
          vigente será siempre la publicada en esta página, con su fecha de actualización.
        </p>
      ),
    },
  ];

  return (
    <LegalShell
      title="Política de privacidad"
      summary="Tratamos los mínimos datos posibles: la cesta y los avisos viven en tu navegador, no en nuestros servidores."
      updated={UPDATED}
      draftNotice="completa los datos del responsable y confirma con tu proveedor de alojamiento el régimen de encargados y transferencias antes de publicar."
      sections={sections}
      footerNote="Plantilla alineada con el RGPD (UE 2016/679) y la LOPDGDD (LO 3/2018); requiere revisión jurídica final."
    />
  );
}