export default function SectionHead({ index, eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-5 border-t border-foreground/20 pt-5 md:flex-row md:items-end md:justify-between">
      <div className="flex items-start gap-4">
        {index && <span className="num mt-1.5 text-[11px] text-muted-foreground">{index}</span>}
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-2 max-w-2xl font-heading text-[clamp(1.9rem,3.1vw,2.6rem)] leading-[1.04] tracking-[-0.01em]">
            {title}
          </h2>
          {description && (
            <p className="mt-2.5 max-w-lg text-[13.5px] leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}