import type { Metadata } from "next";
import { CartProvider } from "@/components/shop/CartProvider";

export const metadata: Metadata = {
  title: "Beauty Supply Store | Sif's Gold",
  description:
    "Shop curated beauty supply from Gold Partners on Sif's Gold. Licensed pros access professional-only products in The Gold Collective marketplace.",
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
