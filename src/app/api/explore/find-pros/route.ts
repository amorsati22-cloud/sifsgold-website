import { NextResponse } from "next/server";
import { getBodyService } from "@/lib/body-map/data";
import { findProsForBodyService } from "@/lib/body-map/find-pros";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get("serviceId");
  const city = searchParams.get("city") ?? undefined;
  const state = searchParams.get("state") ?? undefined;

  if (!serviceId) {
    return NextResponse.json({ error: "serviceId required" }, { status: 400 });
  }

  const service = await getBodyService(serviceId);
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const pros = await findProsForBodyService(service, { city, state, limit: 24 });
  return NextResponse.json({ pros, service: { id: service.id, name: service.service_name } });
}
