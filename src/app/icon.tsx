import { ImageResponse } from "next/og";
import { sifsGoldTheme } from "@/lib/theme";

export const runtime = "edge";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "50%",
          border: `2px solid ${gold}`,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: gold,
            opacity: 0.95,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
