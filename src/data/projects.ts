import type { Project } from "@/types";

export const PROJECTS: Project[] = [
  {
    slug: "ecommerce-platform",
    title: "E-Commerce Platform",
    shortDescription: "Full-stack marketplace with real-time inventory and AI recommendations",
    description:
      "A modern e-commerce platform built with Next.js and Node.js featuring real-time inventory management, AI-powered product recommendations, and a seamless checkout experience. The platform handles thousands of concurrent users with optimized database queries and edge caching.",
    coverImage: "/images/projects/ecommerce-cover.jpg",
    screenshots: [
      "/images/projects/ecommerce-1.jpg",
      "/images/projects/ecommerce-2.jpg",
      "/images/projects/ecommerce-3.jpg",
    ],
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Redis", "Stripe", "OpenAI"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/ecommerce",
    featured: true,
    year: 2024,
  },
  {
    slug: "3d-product-configurator",
    title: "3D Product Configurator",
    shortDescription: "Interactive 3D product customization tool with real-time rendering",
    description:
      "An interactive 3D product configurator that allows users to customize products in real-time. Built with Three.js and React Three Fiber, featuring physically-based rendering, dynamic lighting, and smooth camera transitions.",
    coverImage: "/images/projects/configurator-cover.jpg",
    screenshots: [
      "/images/projects/configurator-1.jpg",
      "/images/projects/configurator-2.jpg",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    techStack: ["Three.js", "React", "TypeScript", "GSAP", "WebGL"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/configurator",
    featured: true,
    year: 2024,
  },
  {
    slug: "ai-dashboard",
    title: "AI Analytics Dashboard",
    shortDescription: "Real-time ML monitoring dashboard with interactive visualizations",
    description:
      "A comprehensive AI/ML monitoring dashboard providing real-time insights into model performance, data drift detection, and automated alerting. Features interactive D3.js visualizations and WebSocket-powered live updates.",
    coverImage: "/images/projects/dashboard-cover.jpg",
    screenshots: [
      "/images/projects/dashboard-1.jpg",
      "/images/projects/dashboard-2.jpg",
      "/images/projects/dashboard-3.jpg",
    ],
    techStack: ["React", "Python", "FastAPI", "D3.js", "WebSocket", "TensorFlow"],
    githubUrl: "https://github.com/example/dashboard",
    featured: true,
    year: 2023,
  },
  {
    slug: "devtools-cli",
    title: "Developer CLI Toolkit",
    shortDescription: "Productivity CLI for scaffolding, testing, and deploying projects",
    description:
      "A developer productivity CLI toolkit that automates common development workflows including project scaffolding, test generation, and deployment pipelines. Built with Node.js and featuring plugin architecture for extensibility.",
    coverImage: "/images/projects/cli-cover.jpg",
    screenshots: ["/images/projects/cli-1.jpg"],
    techStack: ["Node.js", "TypeScript", "Commander.js", "Docker", "GitHub Actions"],
    githubUrl: "https://github.com/example/devtools",
    featured: false,
    year: 2023,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.featured);
}
