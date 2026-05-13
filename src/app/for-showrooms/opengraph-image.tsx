import { audienceOgContentType, audienceOgSize, createAudienceOpenGraphImageResponse } from "@/lib/audience-og-image";
import { getAudienceLanding } from "@/data/audience-landings";

export const runtime = "edge";
export const alt = "Sif's Gold — audience preview";
export const contentType = audienceOgContentType;
export const size = audienceOgSize;

export default function OpenGraphImage() {
  const landing = getAudienceLanding("for-showrooms");
  const title = landing?.openGraphTitle ?? "Sif's Gold";
  return createAudienceOpenGraphImageResponse(title);
}
