import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Montserrat, Playfair_Display, Space_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";
import { StarfieldBackground } from "@/components/decorative/StarfieldBackground";
import { AnalyticsGate } from "@/components/analytics/AnalyticsGate";
import { CookieBanner } from "@/components/cookies/CookieBanner";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { GoddessProfile } from "@/components/decorative/GoddessProfile";
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/schema";
import { sifsGoldTheme } from "@/lib/theme";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["700", "900"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
  display: "swap",
});

function MainLoadingFallback() {
  return (
    <div
      className="flex min-h-[50vh] w-full flex-1 flex-col items-center justify-center bg-navy"
      aria-live="polite"
    >
      <GoddessProfile className="h-12 w-12 text-gold/80" aria-hidden />
      <span className="mt-4 font-body text-sm text-cream/60">Loading…</span>
    </div>
  );
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://sifsgold.com";
const defaultTitle = "Sif's Gold";
const defaultDescription =
  "The beauty, grooming, fitness, and fashion platform serving students, professionals, salons, brands, and clients.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Sif's Gold",
  },
  description: defaultDescription,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: "/",
    siteName: "Sif's Gold",
    locale: "en_US",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  themeColor: sifsGoldTheme.colors.navy,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = `${playfair.variable} ${montserrat.variable} ${spaceMono.variable}`;
  const organizationSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();

  return (
    <html lang="en" className={fontVars}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body className="relative flex min-h-screen flex-col">
        <ThemeProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <StarfieldBackground />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Navigation />
            <main
              id="main-content"
              tabIndex={-1}
              className="flex min-h-0 flex-1 flex-col outline-none"
            >
              <div className="mx-auto w-full max-w-content flex-1 px-4 sm:px-6 md:px-8">
                <Suspense fallback={<MainLoadingFallback />}>
                  <div className="animate-in flex min-h-0 flex-1 flex-col">
                    {children}
                  </div>
                </Suspense>
              </div>
            </main>
            <Footer />
          </div>
          <CookieBanner />
          <AnalyticsGate />
        </ThemeProvider>
      </body>
    </html>
  );
}
