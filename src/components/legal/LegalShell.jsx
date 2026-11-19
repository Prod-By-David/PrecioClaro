export default function LegalShell({ title, summary, updated, sections, draftNotice, footerNote }) {
  return (
    <div className="mx-auto max-w-[820px] px-5 py-12 lg:px-10">
      <header className="border-b border-border pb-6">
        <p className="eyebrow">Información legal</p>
        <h1 className="mt-3 font-heading text-[clamp(2rem,3.6vw,3rem)] leading-[1.02] tracking-[-0.015em]">
          {title}
        </h1>
        <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{summary}</p>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Última actualización: {updated}
        </p>
      </header>

      {draftNotice && (
        <div className="mt-6 border border-gold bg-gold/10 p-4 text-[12.5px] leading-relaxed">
          <strong className="font-medium">Antes de publicar:</strong> {draftNotice}
        </div>
      )}

      <div className="mt-8 space-y-8">
        {sections.map((section, index) => (
          <section key={section.title} aria-labelledby={`legal-${index}`}>
            <h2 id={`legal-${index}`} className="font-heading text-[22px] leading-tight">
              {section.title}
            </h2>
            <div className="mt-2.5 space-y-3 text-[13.5px] leading-relaxed text-foreground/80">
              {section.body}
            </div>
          </section>
        ))}
      </div>

      {footerNote && (
        <p className="mt-10 border-t border-border pt-5 text-[12px] leading-relaxed text-muted-foreground">
          {footerNote}
        </p>
      )}
    </div>
  );
}