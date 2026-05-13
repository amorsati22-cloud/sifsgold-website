/** Deterministic star positions for StarfieldBackground (SSR-safe, 80 points). */
export const STARFIELD_PARTICLES: { x: number; y: number; r: number; d: number }[] =
  Array.from({ length: 80 }, (_, i) => {
    const x = ((i * 47 + 13) % 991) / 10;
    const y = ((i * 83 + 29) % 991) / 10;
    const r = 0.55 + ((i * 7) % 9) / 10;
    const d = ((i * 3) % 30) / 10;
    return { x, y, r, d };
  });
