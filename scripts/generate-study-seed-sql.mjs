/**
 * Generates flashcard INSERT SQL from seed-data (run: node scripts/generate-study-seed-sql.mjs)
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Inline minimal seed mirror — keeps generator runnable without TS paths
const guides = JSON.parse(
  readFileSync(join(root, "src/lib/study-guides/seed-export.json"), "utf8"),
);

function esc(s) {
  return s.replace(/'/g, "''");
}

const rows = [];
let n = 0;
for (const g of guides) {
  for (const d of g.decks) {
    for (let i = 0; i < d.cards.length; i++) {
      n += 1;
      const c = d.cards[i];
      const id = `c${String(n).padStart(6, "0")}0000-4000-8000-${String(n).padStart(12, "0")}`;
      rows.push(
        `  ('${id}'::uuid, '${d.id}'::uuid, '${esc(c.front)}', '${esc(c.back)}', ${c.examRelevance}, ${i + 1})`,
      );
    }
  }
}

const sql = `-- Auto-generated flashcard seeds (${n} cards)\nINSERT INTO public.flashcards (id, deck_id, front_text, back_text, exam_relevance, order_index)\nVALUES\n${rows.join(",\n")}\nON CONFLICT (id) DO NOTHING;\n`;

writeFileSync(join(root, "schema-study-guides-cards.generated.sql"), sql);
console.log(`Wrote ${n} cards to schema-study-guides-cards.generated.sql`);
