import type { Skill, SkillCategory } from "@/types";

export const SKILL_CATEGORIES: {
  id: SkillCategory;
  label: string;
  color: string;
  radius: number;
}[] = [
  { id: "frontend", label: "Frontend", color: "#FFD700", radius: 3 },
  { id: "backend", label: "Backend", color: "#FFD700", radius: 5 },
  { id: "tools", label: "Tools & DevOps", color: "#FFD700", radius: 7 },
  { id: "ai", label: "AI & Data", color: "#FFD700", radius: 9 },
];

export const SKILLS: Skill[] = [
  // Frontend
  { name: "React JS", category: "frontend", icon: "Atom" },
  { name: "Next JS", category: "frontend", icon: "Triangle" },
  { name: "TanStack Start", category: "frontend", icon: "Layers" },
  { name: "React Native", category: "frontend", icon: "Smartphone" },
  { name: "Expo", category: "frontend", icon: "Smartphone" },
  { name: "TypeScript", category: "frontend", icon: "FileCode2" },
  { name: "Tailwind CSS", category: "frontend", icon: "Palette" },
  { name: "Shadcn UI", category: "frontend", icon: "LayoutTemplate" },
  { name: "Zustand", category: "frontend", icon: "Workflow" },
  { name: "HTML/CSS", category: "frontend", icon: "FileCode" },

  // Backend
  { name: "Node.js", category: "backend", icon: "Server" },
  { name: "Express.js", category: "backend", icon: "ServerCog" },
  { name: "Supabase", category: "backend", icon: "DatabaseZap" },
  { name: "PostgreSQL", category: "backend", icon: "Database" },
  { name: "Prisma", category: "backend", icon: "Box" },
  { name: "Convex DB", category: "backend", icon: "DatabaseBackup" },
  { name: "MongoDB", category: "backend", icon: "Leaf" },
  { name: "REST APIs", category: "backend", icon: "Network" },

  // Tools
  { name: "Git", category: "tools", icon: "GitBranch" },
  { name: "GitHub", category: "tools", icon: "Github" },
  { name: "Docker", category: "tools", icon: "Container" },
  { name: "AWS", category: "tools", icon: "Cloud" },
  { name: "Vercel", category: "tools", icon: "Triangle" },
  { name: "Postman", category: "tools", icon: "Send" },
  { name: "Figma", category: "tools", icon: "Figma" },

  // AI
  { name: "AI SDK", category: "ai", icon: "Cpu" },
  { name: "OpenAI API", category: "ai", icon: "Sparkles" },
  { name: "Anthropic API", category: "ai", icon: "Sparkles" },
  { name: "LangChain", category: "ai", icon: "Link" },
  { name: "Vector search", category: "ai", icon: "Search" },
];
