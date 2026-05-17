import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HomeHero } from "@/components/sections/HomeHero";
import { ProblemStatement } from "@/components/sections/ProblemStatement";
import { WhoItsFor } from "@/components/sections/WhoItsFor";
import { WhatsInside } from "@/components/sections/WhatsInside";
import { SifsCircleCTA } from "@/components/sections/SifsCircleCTA";

const IndustrySays = dynamic(() =>
  import("@/components/sections/IndustrySays").then((m) => m.IndustrySays),
);
const TrustStrip = dynamic(() => import("@/components/sections/TrustStrip").then((m) => m.TrustStrip));
const NumbersRow = dynamic(() => import("@/components/sections/NumbersRow").then((m) => m.NumbersRow));
const NewsletterSignup = dynamic(() =>
  import("@/components/sections/NewsletterSignup").then((m) => m.NewsletterSignup),
);

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
      <TrustStrip />
      <NumbersRow />
      <SifsCircleCTA />
      <NewsletterSignup />
    </article>
  );
}
