import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FullPortfolioView } from "@/components/pro-profile/FullPortfolioView";
import { BRAND } from "@/lib/constants";
import { getPublicProProfileByUsername } from "@/lib/pro-profiles";

type PageProps = {
  params: { username: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const bundle = await getPublicProProfileByUsername(params.username);
  if (!bundle) return { title: "Portfolio not found" };
  const title = `${bundle.profile.display_name} — Portfolio`;
  return {
    title,
    description: `Full portfolio from ${bundle.profile.display_name} on Sif's Gold.`,
    alternates: { canonical: `/${bundle.profile.username}/portfolio` },
    openGraph: {
      title,
      url: `${BRAND.url}/${bundle.profile.username}/portfolio`,
      images: [{ url: `/${bundle.profile.username}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}

export default async function ProPortfolioPage({ params }: PageProps) {
  const bundle = await getPublicProProfileByUsername(params.username);
  if (!bundle) notFound();
  return <FullPortfolioView profile={bundle.profile} items={bundle.portfolio} />;
}
