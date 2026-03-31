import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mohiuddin Portfolio",
    short_name: "Portfolio",
    description:
      "Full Stack Developer crafting immersive digital experiences with modern web technologies.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#FFD700",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
