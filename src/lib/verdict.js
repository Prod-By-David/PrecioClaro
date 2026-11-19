import { eur } from "@/lib/format";

export function priceVerdict({ best, low, high }) {
  const current = Number(best);
  const floor = Number(low);
  const ceiling = Number(high);

  if (!Number.isFinite(current) || !Number.isFinite(floor) || floor <= 0) return null;

  const above = Math.round(((current - floor) / floor) * 100);
  const span =
    Number.isFinite(ceiling) && ceiling > floor ? (current - floor) / (ceiling - floor) : 0;

  if (above <= 2) {
    return {
      label: "Mínimo histórico",
      tone: "good",
      detail: `Es el precio más bajo registrado hasta ahora (${eur(floor)}).`,
      above,
    };
  }

  const detail = `Está un ${above} % por encima del mínimo histórico (${eur(floor)}).`;

  if (span <= 0.15) return { label: "Muy buen momento", tone: "good", detail, above };
  if (span <= 0.4) return { label: "Buen momento", tone: "ok", detail, above };
  if (span <= 0.7) return { label: "Precio medio", tone: "neutral", detail, above };
  return { label: "Caro para su histórico", tone: "bad", detail, above };
}