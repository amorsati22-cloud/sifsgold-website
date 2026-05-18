import type { ReactNode } from "react";

export function ProProfileShell({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-4 flex min-w-0 flex-1 flex-col sm:-mx-6 md:-mx-8">
      <a href="#pro-profile-main" className="skip-link">
        Skip to profile content
      </a>
      <div id="pro-profile-main" tabIndex={-1} className="outline-none">
        {children}
      </div>
    </div>
  );
}
