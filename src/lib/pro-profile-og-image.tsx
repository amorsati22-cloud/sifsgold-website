import { ImageResponse } from "next/og";
import { sifsGoldTheme } from "@/lib/theme";

export const proProfileOgSize = { width: 1200, height: 630 } as const;
export const proProfileOgContentType = "image/png";

export function createProProfileOpenGraphImageResponse(
  displayName: string,
  headline?: string | null,
) {
  const { navy, navyDeep, gold, teal, cream } = sifsGoldTheme.colors;
  const subline = headline?.trim() || "Licensed professional on Sif's Gold";

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
        <div style={{ fontSize: 22, color: gold, letterSpacing: 1, marginBottom: 16 }}>Sif&apos;s Gold</div>
        <div
          style={{
            fontFamily: "Playfair Display, serif",
            fontWeight: 900,
            fontSize: 56,
            lineHeight: 1.08,
            maxWidth: "100%",
            backgroundImage: `linear-gradient(90deg, ${cream}, ${gold}, ${teal})`,
            color: "transparent",
            backgroundClip: "text",
          }}
        >
          {displayName}
        </div>
        <div style={{ marginTop: 22, fontSize: 26, color: cream, opacity: 0.88 }}>{subline}</div>
      </div>
    ),
    proProfileOgSize,
  );
}
