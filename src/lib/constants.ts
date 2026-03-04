export const SITE = {
  name: "Portfolio",
  title: "Full Stack Developer | Creative Technologist",
  description:
    "Full Stack Developer crafting immersive digital experiences with modern web technologies.",
  url: "https://portfolio.dev",
  ogImage: "/og-image.png",
} as const;

export const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;

export const SECTION_IDS = {
  hero: "hero",
  about: "about",
  skills: "skills",
  experience: "experience",
  projects: "projects",
  contact: "contact",
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;
