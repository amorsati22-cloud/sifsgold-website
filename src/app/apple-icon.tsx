import { ImageResponse } from "next/og";
import { sifsGoldTheme } from "@/lib/theme";

export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const { navy, gold } = sifsGoldTheme.colors;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: navy,
          borderRadius: 72,
          border: `4px solid ${gold}`,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: gold,
            opacity: 0.92,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
