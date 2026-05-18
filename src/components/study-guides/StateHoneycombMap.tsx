import { ALL_STATE_SLUGS, STATE_BOARD_STUBS } from "@/data/states";

const COLS = 9;
const HEX_R = 34;
const DX = HEX_R * 1.55;
const DY = HEX_R * 1.35;

function hexPath(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 6; i += 1) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `${pts.join(" ")} Z`;
}

export function StateHoneycombMap() {
  const ordered = [...ALL_STATE_SLUGS].sort((a, b) => a.localeCompare(b));

  return (
    <figure className="mx-auto max-w-5xl">
      <svg
        viewBox="0 0 1260 520"
        className="h-auto w-full text-gold"
        role="img"
        aria-label="Schematic map: select a state or district for its study guide summary"
      >
        <title>State and district study guides</title>
        {ordered.map((slug, index) => {
          const row = Math.floor(index / COLS);
          const col = index % COLS;
          const stagger = row % 2 === 1 ? DX / 2 : 0;
          const cx = 70 + col * DX + stagger;
          const cy = 60 + row * DY;
          const abbr = slug.toUpperCase();
          const label = STATE_BOARD_STUBS[slug]?.displayName ?? abbr;
          return (
            <a key={slug} href={`/study-guides/state/${slug}`} className="group cursor-pointer focus:outline-none">
              <path
                d={hexPath(cx, cy, HEX_R)}
                className="fill-navy-deep/90 stroke-gold/40 stroke-[1.5] transition group-hover:fill-gold/15 group-hover:stroke-gold group-focus-visible:fill-gold/20"
              />
              <text
                x={cx}
                y={cy + 5}
                textAnchor="middle"
                className="fill-cream font-mono text-[11px] font-bold uppercase group-hover:fill-gold"
                style={{ pointerEvents: "none" }}
              >
                {abbr}
              </text>
              <title>{label}</title>
            </a>
          );
        })}
      </svg>
      <figcaption className="mt-3 text-center text-xs text-cream/65">
        Schematic layout — tap a code to open that jurisdiction&apos;s summary. Geography is approximate; requirements are
        summarized for orientation only.
      </figcaption>
    </figure>
  );
}
