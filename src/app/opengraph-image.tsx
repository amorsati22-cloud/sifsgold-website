import { ImageResponse } from "next/og";
import { sifsGoldTheme } from "@/lib/theme";

export const runtime = "edge";
export const alt = "Sif's Gold homepage preview";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default function OpenGraphImage() {
  const { navy, navyDeep, gold, teal, cream } = sifsGoldTheme.colors;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "68px",
          background: `linear-gradient(160deg, ${navyDeep}, ${navy})`,
          color: cream,
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: gold,
            letterSpacing: 1,
            marginBottom: 18,
          }}
        >
          Sif&apos;s Gold
        </div>
        <div
          style={{
            fontFamily: "Playfair Display, serif",
            fontWeight: 900,
            fontSize: 72,
            lineHeight: 1.05,
            backgroundImage: `linear-gradient(90deg, ${cream}, ${gold}, ${teal})`,
            color: "transparent",
            backgroundClip: "text",
          }}
        >
          Beauty. Grooming.
          <br />
          Fitness. Fashion.
        </div>
        <div style={{ marginTop: 24, fontSize: 30, color: cream, opacity: 0.9 }}>
          One platform.
        </div>
      </div>
    ),
    size,
  );
}
