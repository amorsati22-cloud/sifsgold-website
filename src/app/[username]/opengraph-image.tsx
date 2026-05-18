import {
  createProProfileOpenGraphImageResponse,
  proProfileOgContentType,
  proProfileOgSize,
} from "@/lib/pro-profile-og-image";
import { getPublicProProfileByUsername } from "@/lib/pro-profiles";

export const runtime = "edge";
export const alt = "Professional profile on Sif's Gold";
export const size = proProfileOgSize;
export const contentType = proProfileOgContentType;

type Props = {
  params: { username: string };
};

export default async function OpenGraphImage({ params }: Props) {
  const bundle = await getPublicProProfileByUsername(params.username);
  const name = bundle?.profile.display_name ?? "Professional";
  const headline = bundle?.profile.headline;
  return createProProfileOpenGraphImageResponse(name, headline);
}
