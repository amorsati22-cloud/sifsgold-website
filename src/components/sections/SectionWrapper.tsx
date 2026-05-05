import type { ReactNode } from "react";

export type SectionWrapperProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  fullWidth?: boolean;
};

export function SectionWrapper({
  children,
  id,
  className = "",
  fullWidth = false,
}: SectionWrapperProps) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`.trim()}>
      {fullWidth ? (
        children
      ) : (
        <div className="mx-auto max-w-7xl px-6">{children}</div>
      )}
    </section>
  );
}
