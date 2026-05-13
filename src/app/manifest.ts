import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sif's Gold",
    short_name: "Sif's Gold",
    description: "Beauty, grooming, fitness, and fashion in one platform.",
    start_url: "/",
    display: "standalone",
    background_color: "#04101E",
    theme_color: "#04101E",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

