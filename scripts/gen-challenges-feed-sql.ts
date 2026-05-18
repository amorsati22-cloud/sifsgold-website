import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { SEED_CHALLENGES } from "../src/lib/challenges/seed-data";
import { SEED_ADVOCATE_POSTS, SEED_ADVOCATE_ID } from "../src/lib/advocate-feed/seed-data";

function esc(s: string) {
  return s.replace(/'/g, "''");
}

function jsonb(obj: unknown) {
  return `'${esc(JSON.stringify(obj))}'::jsonb`;
}

function arr(a: string[]) {
  return `ARRAY[${a.map((x) => `'${esc(x)}'`).join(", ")}]::text[]`;
}

const challengeRows = SEED_CHALLENGES.map(
  (c) =>
    `  ('${c.id}'::uuid, '${esc(c.name)}', '${esc(c.description)}', '${c.challenge_type}', ${c.duration_days}, '${c.start_date}', '${c.end_date}', ${c.cover_image_url ? `'${esc(c.cover_image_url)}'` : "NULL"}, ${c.prize ? `'${esc(c.prize)}'` : "NULL"}, ${c.sponsor_brand_id ? `'${c.sponsor_brand_id}'::uuid` : "NULL"}, ${c.ftc_disclosure_required}, ${c.active}, ${c.participant_count}, ${jsonb(c.daily_prompts)})`,
).join(",\n");

const postRows = SEED_ADVOCATE_POSTS.map(
  (p) =>
    `  ('${p.id}'::uuid, '${SEED_ADVOCATE_ID}'::uuid, '${p.post_type}', '${esc(p.title)}', '${esc(p.body)}', ${arr(p.image_urls)}, ${p.video_url ? `'${esc(p.video_url)}'` : "NULL"}, ${p.linked_brand_deal_id ? `'${p.linked_brand_deal_id}'::uuid` : "NULL"}, ${p.ftc_disclosure_text ? `'${esc(p.ftc_disclosure_text)}'` : "NULL"}, '${p.status}', ${p.published_at ? `'${p.published_at}'::timestamptz` : "NULL"}, ${p.view_count}, ${p.like_count})`,
).join(",\n");

const seeds = `-- Auto-generated (${SEED_CHALLENGES.length} challenges, ${SEED_ADVOCATE_POSTS.length} advocate posts)
-- advocate_id in posts must exist in advocate_profiles before running post seeds.

INSERT INTO public.beauty_challenges (
  id, name, description, challenge_type, duration_days, start_date, end_date,
  cover_image_url, prize, sponsor_brand_id, ftc_disclosure_required, active, participant_count, daily_prompts
) VALUES
${challengeRows}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  active = EXCLUDED.active,
  participant_count = EXCLUDED.participant_count,
  daily_prompts = EXCLUDED.daily_prompts;

INSERT INTO public.advocate_posts (
  id, advocate_id, post_type, title, body, image_urls, video_url,
  linked_brand_deal_id, ftc_disclosure_text, status, published_at, view_count, like_count
) VALUES
${postRows}
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  ftc_disclosure_text = EXCLUDED.ftc_disclosure_text;
`;

const basePath = join(process.cwd(), "schema-challenges-feed-base.sql");
const outGenerated = join(process.cwd(), "schema-challenges-feed-seeds.generated.sql");
const outCombined = join(process.cwd(), "schema-challenges-feed.sql");

writeFileSync(outGenerated, seeds);
const base = existsSync(basePath) ? readFileSync(basePath, "utf8") : "";
writeFileSync(outCombined, `${base}\n${seeds}`);
console.log(`Wrote ${outGenerated} and ${outCombined}`);
