import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CONSENT_CATEGORIES,
  applyConsent,
  getConsent,
  saveConsent,
  subscribeConsentOpen,
} from "@/lib/consent";

function draftFrom(saved) {
  return {
    analytics: Boolean(saved?.analytics),
    preferences: Boolean(saved?.preferences),
    marketing: Boolean(saved?.marketing),
  };
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => !getConsent());
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState(() => draftFrom(getConsent()));
  const [savedBefore, setSavedBefore] = useState(() => Boolean(getConsent()));

  useEffect(() => {
    const saved = getConsent();
    if (saved) applyConsent(saved);

    return subscribeConsentOpen(() => {
      setDraft(draftFrom(getConsent()));
      setSavedBefore(Boolean(getConsent()));
      setExpanded(true);
      setVisible(true);
    });
  }, []);

  if (!visible) return null;

  const decide = (choice) => {
    saveConsent(choice);
    setSavedBefore(true);
    setVisible(false);
    setExpanded(false);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      className="fixed inset-x-3 bottom-3 z-[9999] mx-auto max-w-2xl border border-foreground/25 bg-card p-5 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.35)] sm:inset-x-6"
    >
      <h2 id="cookie-title" className="font-heading text-[20px] leading-tight">
        Tu elección sobre cookies
      </h2>
      <p id="cookie-desc" className="mt-2 text-[12.5px] leading-relaxed text-foreground/80">
        Solo usamos almacenamiento técnico para que la cesta y tus avisos funcionen. Si activas la
        analítica, nos ayudas a saber qué comparativas se usan. Puedes cambiar de opinión cuando quieras.{" "}
        <Link to="/cookies" className="text-primary underline underline-offset-2">
          Política de cookies
        </Link>
        .
      </p>

      {expanded && (
        <fieldset className="mt-4 space-y-3 border-t border-border pt-4">
          <legend className="eyebrow">Configuración por categoría</legend>
          {CONSENT_CATEGORIES.map((category) => (
            <div key={category.id} className="flex items-start gap-3">
              <input
                id={`consent-${category.id}`}
                type="checkbox"
                checked={category.required ? true : Boolean(draft[category.id])}
                disabled={category.required}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, [category.id]: event.target.checked }))
                }
                className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
              />
              <label htmlFor={`consent-${category.id}`} className="text-[12.5px] leading-relaxed">
                <span className="font-medium">{category.label}</span>
                {category.required && <span className="text-muted-foreground"> (siempre activas)</span>}
                <span className="block text-muted-foreground">{category.description}</span>
              </label>
            </div>
          ))}
        </fieldset>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => decide({})}
          className="flex-1 border border-foreground/30 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-foreground/70"
        >
          Rechazar todas
        </button>
        <button
          type="button"
          onClick={() => decide({ analytics: true, preferences: true, marketing: true })}
          className="flex-1 border border-foreground/30 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-foreground/70"
        >
          Aceptar todas
        </button>
        {expanded ? (
          <button
            type="button"
            onClick={() => decide(draft)}
            className="flex-1 border border-primary bg-primary px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            Guardar selección
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="flex-1 border border-foreground/30 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-foreground/70"
          >
            Configurar
          </button>
        )}
      </div>

      {savedBefore && (
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          Guardar una nueva selección sustituye la anterior y queda registrada con fecha.
        </p>
      )}
    </div>
  );
}