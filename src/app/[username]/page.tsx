import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProProfileShell } from "@/components/pro-profile/ProProfileShell";
import { ProProfileHero } from "@/components/pro-profile/ProProfileHero";
import { ProProfileBio } from "@/components/pro-profile/ProProfileBio";
import { ProProfileSpecialties } from "@/components/pro-profile/ProProfileSpecialties";
import { PortfolioGallery } from "@/components/pro-profile/PortfolioGallery";
import { ProServicesSection } from "@/components/pro-profile/ProServicesSection";
import { ProCredentialsSection } from "@/components/pro-profile/ProCredentialsSection";
import { ProTestimonialsSection } from "@/components/pro-profile/ProTestimonialsSection";
import { ProSocialFooter } from "@/components/pro-profile/ProSocialFooter";
import { BRAND } from "@/lib/constants";
import { generatePersonSchema } from "@/lib/pro-profile-schema";
import { ProProfileClientActions } from "@/components/client-dashboard/ProProfileClientActions";
import { createClient } from "@/lib/supabase/server";
import { getPublicProProfileByUsername, getVisibleProUsernames } from "@/lib/pro-profiles";

type PageProps = {
  params: { username: string };
};

export async function generateStaticParams() {
  const usernames = await getVisibleProUsernames();
  return usernames.map((username) => ({ username }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const bundle = await getPublicProProfileByUsername(params.username);
  if (!bundle) {
    return { title: "Profile not found" };
  }

  const { profile } = bundle;
  const title = `${profile.display_name} — ${profile.headline ?? "Licensed professional"}`;
  const description =
    profile.bio?.slice(0, 160) ??
    `Book ${profile.display_name} on Sif's Gold. View portfolio, services, credentials, and client reviews.`;
  const url = `${BRAND.url}/${profile.username}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "profile",
      images: [{ url: `/${profile.username}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/${profile.username}/opengraph-image`],
    },
    alternates: { canonical: `/${profile.username}` },
  };
}

export default async function ProProfilePage({ params }: PageProps) {
  const bundle = await getPublicProProfileByUsername(params.username);
  if (!bundle) {
    notFound();
  }

  const { profile, portfolio, services, credentials, testimonials } = bundle;
  const personSchema = generatePersonSchema(profile, testimonials);

  let favorited = false;
  const supabase = await createClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("client_favorites")
        .select("id")
        .eq("client_id", user.id)
        .eq("pro_id", profile.id)
        .maybeSingle();
      favorited = Boolean(data);
    }
  }

  return (
    <ProProfileShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <ProProfileHero
        profile={profile}
        clientActions={<ProProfileClientActions proId={profile.id} initialFavorited={favorited} />}
      />
      <ProProfileBio profile={profile} />
      <ProProfileSpecialties profile={profile} />
      <PortfolioGallery username={profile.username} items={portfolio} maxItems={8} />
      <ProServicesSection profile={profile} services={services} />
      <ProCredentialsSection profile={profile} credentials={credentials} />
      <ProTestimonialsSection profile={profile} testimonials={testimonials} />
      <ProSocialFooter profile={profile} />
    </ProProfileShell>
  );
}
