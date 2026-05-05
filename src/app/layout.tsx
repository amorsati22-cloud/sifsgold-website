import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";

function MainLoadingFallback() {
  return (
    <div
      className="flex min-h-[50vh] w-full flex-1 flex-col items-center justify-center bg-navy"
      aria-live="polite"
    >
      <span className="text-5xl text-gold" aria-hidden>
        👑
      </span>
    </div>
  );
}

const defaultTitle = "Sif's Gold — The Beauty Platform Built for Everyone";
const defaultDescription =
  "The all-in-one platform for beauty students, licensed professionals, salons, schools, clients, and fashion talent.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://sifsgold.com",
  ),
  title: defaultTitle,
  description: defaultDescription,
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: "/",
    siteName: "Sif's Gold",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-navy font-body text-white antialiased">
        <Header />
        <main className="flex min-h-0 flex-1 flex-col">
          <Suspense fallback={<MainLoadingFallback />}>
            <div className="animate-in fade-in duration-300 flex min-h-0 flex-1 flex-col">
              {children}
            </div>
          </Suspense>
        </main>
        <Footer />
      </body>
    </html>
  );
}
