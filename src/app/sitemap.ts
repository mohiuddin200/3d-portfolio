import type { MetadataRoute } from "next";
import { PROJECTS } from "@/data/projects";
import { SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectRoutes = PROJECTS.map((project) => ({
    url: `${SITE.url}/projects/${project.slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: SITE.url,
      lastModified: new Date(),
    },
    ...projectRoutes,
  ];
}
