import type { Metadata } from "next";
import { MarketingTools } from "@/components/pro-ops/MarketingTools";

export const metadata: Metadata = {
  title: "Marketing",
  robots: { index: false, follow: false },
};

export default function ProMarketingPage() {
  return <MarketingTools />;
}
