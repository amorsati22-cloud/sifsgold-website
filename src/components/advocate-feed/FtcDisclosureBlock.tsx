export function FtcDisclosureBlock({ text, prominent }: { text: string; prominent?: boolean }) {
  return (
    <aside
      className={`mt-4 rounded-brand border text-xs leading-relaxed ${
        prominent
          ? "border-gold/50 bg-gold/10 p-4 text-cream"
          : "border-gold/25 bg-navy-deep/90 p-3 text-goldBody"
      }`}
      role="note"
      aria-label="FTC disclosure"
    >
      <p className="font-semibold uppercase tracking-wide text-gold">FTC disclosure</p>
      <p className="mt-1">{text}</p>
    </aside>
  );
}
