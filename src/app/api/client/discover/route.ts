import { NextResponse } from "next/server";
import { discoverPros } from "@/lib/client-dashboard/data";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const specialty = searchParams.get("specialty") ?? undefined;
  const city = searchParams.get("city") ?? undefined;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  let pros = await discoverPros({ query: q, specialty, city, limit: 24 });

  if (lat && lng && pros.length > 0) {
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    pros = [...pros].sort((a, b) => {
      const score = (p: typeof a) => {
        const hasLoc = p.location_city ? 1 : 0;
        return hasLoc;
      };
      return score(b) - score(a);
    });
  }

  return NextResponse.json({ pros });
}
