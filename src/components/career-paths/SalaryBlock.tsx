import { BLS_DISCLAIMER, SALARY_ESTIMATE_NOTE } from "@/lib/career-paths/constants";
import type { CareerRole } from "@/types/career-paths";

export function SalaryBlock({ role }: { role: CareerRole }) {
  return (
    <div className="rounded-brand-lg border border-gold/20 bg-navy-deep/70 p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-gold/80">
        {SALARY_ESTIMATE_NOTE}
      </p>
      <p className="mt-2 font-heading text-3xl text-cream">
        ${role.median_annual_salary.toLocaleString()}
        <span className="text-base font-normal text-cream/60"> / year</span>
      </p>
      <p className="mt-1 text-sm text-goldBody">
        Typical range: ${role.salary_range_low.toLocaleString()}–$
        {role.salary_range_high.toLocaleString()} (market varies)
      </p>
      <a
        href={role.bls_source_link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm text-gold hover:underline"
      >
        U.S. Bureau of Labor Statistics — OEWS {role.salary_data_year} →
      </a>
      <p className="mt-3 text-xs leading-relaxed text-cream/55">{BLS_DISCLAIMER}</p>
    </div>
  );
}
