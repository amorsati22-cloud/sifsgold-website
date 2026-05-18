import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { SEED_AFFIRMATIONS } from "../src/lib/affirmations/seed-data";
import { SEED_BODY_SERVICES, SEED_BODY_ZONES } from "../src/lib/body-map/seed-data";

function esc(s: string) {
  return s.replace(/'/g, "''");
}

function arr(a: string[]) {
  return `ARRAY[${a.map((x) => `'${esc(x)}'`).join(", ")}]::text[]`;
}

const affRows = SEED_AFFIRMATIONS.map(
  (a) =>
    `  ('${a.id}'::uuid, '${esc(a.text)}', '${a.category}', ${arr(a.target_audience)}, ${a.season ? `'${a.season}'` : "NULL"}, ${a.active})`,
).join(",\n");

const zoneRows = SEED_BODY_ZONES.map(
  (z) => `  ('${z.id}', '${esc(z.name)}', '${esc(z.description)}', NULL)`,
).join(",\n");

const serviceRows = SEED_BODY_SERVICES.map((s) => {
  const filter = esc(JSON.stringify(s.finding_pros_filter));
  return `  ('${s.id}'::uuid, '${s.zone_id}', '${esc(s.service_name)}', '${esc(s.description)}', '${esc(s.category)}', ${s.average_duration_minutes}, '${esc(s.average_price_range)}', '${filter}'::jsonb, '${esc(s.what_to_expect ?? "")}', '${esc(s.prep_tips ?? "")}', '${esc(s.aftercare ?? "")}')`;
}).join(",\n");

const seeds = `-- Auto-generated (${SEED_AFFIRMATIONS.length} affirmations, ${SEED_BODY_ZONES.length} zones, ${SEED_BODY_SERVICES.length} services)
INSERT INTO public.daily_affirmations (id, text, category, target_audience, season, active) VALUES
${affRows}
ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, active = EXCLUDED.active;

INSERT INTO public.beauty_body_zones (id, name, description, icon_svg) VALUES
${zoneRows}
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO public.beauty_body_services (
  id, zone_id, service_name, description, category, average_duration_minutes,
  average_price_range, finding_pros_filter, what_to_expect, prep_tips, aftercare
) VALUES
${serviceRows}
ON CONFLICT (id) DO UPDATE SET service_name = EXCLUDED.service_name;
`;

const basePath = join(process.cwd(), "schema-affirmations-body-map-base.sql");
const outGenerated = join(process.cwd(), "schema-affirmations-body-map-seeds.generated.sql");
const outCombined = join(process.cwd(), "schema-affirmations-body-map.sql");

writeFileSync(outGenerated, seeds);
const base = existsSync(basePath) ? readFileSync(basePath, "utf8") : "";
writeFileSync(outCombined, `${base}\n${seeds}`);
console.log(`Wrote ${outGenerated} and ${outCombined}`);
