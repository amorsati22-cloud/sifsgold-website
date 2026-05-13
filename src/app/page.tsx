import type { Metadata } from "next";
import { HomeHero } from "@/components/sections/HomeHero";
import { ProblemStatement } from "@/components/sections/ProblemStatement";
import { WhoItsFor } from "@/components/sections/WhoItsFor";
import { WhatsInside } from "@/components/sections/WhatsInside";
import { IndustrySays } from "@/components/sections/IndustrySays";
import { NumbersRow } from "@/components/sections/NumbersRow";
import { SifsCircleCTA } from "@/components/sections/SifsCircleCTA";
import { PreFooterCTA } from "@/components/sections/PreFooterCTA";

export const metadata: Metadata = {
  title: "Sif's Gold — Beauty, Grooming, Fitness, and Fashion in One Platform",
  alternates: {
    canonical: "https://sifsgold.com",
  },
  openGraph: {
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return (
    <article aria-label="Sif's Gold homepage">
      <HomeHero />
      <ProblemStatement />
      <WhoItsFor />
      <WhatsInside />
      <IndustrySays />
      <NumbersRow />
      <SifsCircleCTA />
      <PreFooterCTA />
    </article>
  );
}
