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
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">{children}</div>
      )}
    </section>
  );
}
