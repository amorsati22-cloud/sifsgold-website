/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { sifsGoldTheme } from "@/lib/theme";

export const runtime = "nodejs";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const { navy, gold } = sifsGoldTheme.colors;
  const logoPath = join(process.cwd(), "public", "logo.png");
  const hasLogo = existsSync(logoPath);
  const logoDataUrl = hasLogo
    ? `data:image/png;base64,${readFileSync(logoPath).toString("base64")}`
    : null;

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
        {logoDataUrl ? (
          <img
            src={logoDataUrl}
            width={26}
            height={26}
            alt="Sif's Gold logo"
            style={{ objectFit: "contain" }}
          />
        ) : (
          <span
            style={{
              color: gold,
              fontWeight: 900,
              fontSize: 12,
              fontFamily: "Arial, sans-serif",
              lineHeight: 1,
            }}
          >
            SG
          </span>
        )}
      </div>
    ),
    { ...size },
  );
}
