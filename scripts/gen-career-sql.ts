import { writeFileSync } from "fs";
import { join } from "path";
import { SEED_PATHS, SEED_ROLES_WITH_IDS } from "../src/lib/career-paths/seed-data";

function esc(s: string) {
  return s.replace(/'/g, "''");
}

function arr(a: string[]) {
  return `ARRAY[${a.map((x) => `'${esc(x)}'`).join(", ")}]::text[]`;
}

const roleRows = SEED_ROLES_WITH_IDS.map(
  (r) =>
    `  ('${r.id}'::uuid, '${esc(r.name)}', '${r.category}', '${esc(r.description)}', ${r.median_annual_salary}, ${r.salary_range_low}, ${r.salary_range_high}, '${esc(r.bls_source_link)}', ${r.salary_data_year}, ${arr(r.required_license_types)}, '${esc(r.required_education)}', '${esc(r.typical_continuing_education)}', ${arr(r.specialty_certifications)}, '${esc(r.career_advancement)}', '${esc(r.icon)}')`,
).join(",\n");

const pathRows = SEED_PATHS.map(
  (p) =>
    `  ('${p.id}'::uuid, '${p.starting_point}', '${p.end_role}', '${esc(p.name)}', '${esc(p.description)}', ${p.estimated_total_years}, ${p.estimated_total_investment}, ${p.order_index})`,
).join(",\n");

const milestoneRows: string[] = [];
const pathRoleRows: string[] = [];
let mi = 0;

for (const p of SEED_PATHS) {
  for (const ms of p.milestones) {
    mi += 1;
    const mid = `m${String(mi).padStart(6, "0")}0000-4000-8000-${String(mi).padStart(12, "0")}`;
    milestoneRows.push(
      `  ('${mid}'::uuid, '${p.id}'::uuid, ${ms.milestone_order}, '${esc(ms.name)}', '${esc(ms.description)}', ${ms.estimated_duration_months}, ${ms.estimated_cost}, ${arr(ms.requirements)}, ${arr(ms.typical_outcomes)})`,
    );
    if (ms.role_id) {
      pathRoleRows.push(
        `  ('${p.id}'::uuid, '${ms.role_id}'::uuid, ${ms.milestone_order})`,
      );
    }
  }
}

const sql = `-- Auto-generated (${SEED_ROLES_WITH_IDS.length} roles, ${SEED_PATHS.length} paths)
INSERT INTO public.career_roles (
  id, name, category, description, median_annual_salary, salary_range_low, salary_range_high,
  bls_source_link, salary_data_year, required_license_types, required_education,
  typical_continuing_education, specialty_certifications, career_advancement, icon
) VALUES
${roleRows}
ON CONFLICT (id) DO UPDATE SET median_annual_salary = EXCLUDED.median_annual_salary;

INSERT INTO public.career_paths (
  id, starting_point, end_role, name, description, estimated_total_years, estimated_total_investment, order_index
) VALUES
${pathRows}
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.career_milestones (
  id, path_id, milestone_order, name, description, estimated_duration_months, estimated_cost, requirements, typical_outcomes
) VALUES
${milestoneRows.join(",\n")}
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.career_path_roles (path_id, role_id, milestone_order) VALUES
${pathRoleRows.join(",\n")}
ON CONFLICT (path_id, role_id, milestone_order) DO NOTHING;
`;

writeFileSync(join(__dirname, "..", "schema-career-paths-seeds.generated.sql"), sql);
console.log(`Generated ${SEED_ROLES_WITH_IDS.length} roles, ${milestoneRows.length} milestones`);
