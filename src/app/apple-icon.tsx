/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { sifsGoldTheme } from "@/lib/theme";

export const runtime = "nodejs";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          borderRadius: 72,
          border: `4px solid ${gold}`,
        }}
      >
        {logoDataUrl ? (
          <img
            src={logoDataUrl}
            width={136}
            height={136}
            alt="Sif's Gold logo"
            style={{ objectFit: "contain" }}
          />
        ) : (
          <span
            style={{
              color: gold,
              fontWeight: 900,
              fontSize: 64,
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
