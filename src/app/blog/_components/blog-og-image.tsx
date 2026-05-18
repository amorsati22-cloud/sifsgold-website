import { ImageResponse } from "next/og";
import { sifsGoldTheme } from "@/lib/theme";

export const blogOgSize = { width: 1200, height: 630 } as const;
export const blogOgContentType = "image/png";

export function createBlogOpenGraphImageResponse(title: string, tag?: string) {
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
          background: `linear-gradient(145deg, ${navyDeep}, ${navy} 40%, ${teal}22 100%)`,
          color: cream,
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 18,
            color: gold,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          {tag ? tag : "The Sif's Gold Journal"}
        </div>
        <div
          style={{
            fontFamily: "Playfair Display, serif",
            fontWeight: 700,
            fontSize: title.length > 48 ? 44 : 52,
            lineHeight: 1.1,
            maxWidth: "100%",
          }}
        >
          {title}
        </div>
        <div style={{ marginTop: 28, fontSize: 22, color: cream, opacity: 0.85 }}>
          sifsgold.com
        </div>
      </div>
    ),
    blogOgSize,
  );
}
