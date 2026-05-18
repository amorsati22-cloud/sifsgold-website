import type { BodyZoneId } from "@/types/affirmations";

/** Simplified front-view silhouette zones for hover/click (viewBox 0 0 200 420). */
export const ZONE_PATHS: Record<
  BodyZoneId,
  { d: string; labelX: number; labelY: number }
> = {
  head: {
    d: "M 70 18 Q 100 8 130 18 Q 142 40 130 58 Q 100 68 70 58 Q 58 40 70 18 Z",
    labelX: 100,
    labelY: 38,
  },
  face: {
    d: "M 72 42 Q 100 36 128 42 Q 132 72 128 92 Q 100 98 72 92 Q 68 72 72 42 Z",
    labelX: 100,
    labelY: 68,
  },
  hair: {
    d: "M 62 14 Q 100 2 138 14 Q 148 32 145 52 Q 100 62 55 52 Q 52 32 62 14 Z",
    labelX: 100,
    labelY: 28,
  },
  neck: {
    d: "M 88 94 L 112 94 L 118 118 L 82 118 Z",
    labelX: 100,
    labelY: 108,
  },
  hands: {
    d: "M 28 200 L 48 200 L 52 248 L 24 248 Z M 152 200 L 172 200 L 176 248 L 148 248 Z",
    labelX: 38,
    labelY: 224,
  },
  body: {
    d: "M 72 118 Q 100 112 128 118 L 140 280 Q 100 290 60 280 Z",
    labelX: 100,
    labelY: 200,
  },
  feet: {
    d: "M 68 340 L 92 340 L 94 400 L 66 400 Z M 108 340 L 132 340 L 134 400 L 106 400 Z",
    labelX: 100,
    labelY: 372,
  },
  nails: {
    d: "M 20 252 L 56 252 L 58 272 L 18 272 Z M 144 252 L 180 252 L 182 272 L 142 272 Z",
    labelX: 100,
    labelY: 262,
  },
};
