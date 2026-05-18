import { writeFileSync } from "fs";
import { join } from "path";
import { SEED_GUIDES } from "../src/lib/study-guides/seed-data";

function esc(s: string) {
  return s.replace(/'/g, "''");
}

const rows: string[] = [];
let n = 0;

for (const g of SEED_GUIDES) {
  for (const d of g.decks) {
    d.cards.forEach((c, i) => {
      n += 1;
      const id = `c${String(n).padStart(6, "0")}0000-4000-8000-${String(n).padStart(12, "0")}`;
      const mnemonic = c.mnemonic ? `, '${esc(c.mnemonic)}'` : ", NULL";
      rows.push(
        `  ('${id}'::uuid, '${d.id}'::uuid, '${esc(c.front)}', '${esc(c.back)}'${mnemonic}, ${c.examRelevance}, ${i + 1})`,
      );
    });
  }
}

const header = `-- Auto-generated from src/lib/study-guides/seed-data.ts (${n} cards)\n`;
const insert = `${header}INSERT INTO public.flashcards (id, deck_id, front_text, back_text, mnemonics, exam_relevance, order_index)\nVALUES\n${rows.join(",\n")}\nON CONFLICT (id) DO NOTHING;\n`;

writeFileSync(join(__dirname, "..", "schema-study-guides-cards.generated.sql"), insert);
console.log(`Generated ${n} flashcard inserts`);
