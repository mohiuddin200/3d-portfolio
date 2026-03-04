import type { Skill, SkillCategory } from "@/types";

export const SKILL_CATEGORIES: {
  id: SkillCategory;
  label: string;
  color: string;
  radius: number;
}[] = [
  { id: "frontend", label: "Frontend", color: "#FFD700", radius: 3 },
  { id: "backend", label: "Backend", color: "#FFFFFF", radius: 5 },
  { id: "tools", label: "Tools & DevOps", color: "#A0A0A0", radius: 7 },
  { id: "ai", label: "AI & Data", color: "#FFE44D", radius: 9 },
];

export const SKILLS: Skill[] = [
  // Frontend
  { name: "React JS", category: "frontend", proficiency: 95, icon: "Atom" },
  { name: "Next JS", category: "frontend", proficiency: 92, icon: "Triangle" },
  {
    name: "TypeScript",
    category: "frontend",
    proficiency: 90,
    icon: "FileCode2",
  },
  {
    name: "Tailwind CSS",
    category: "frontend",
    proficiency: 95,
    icon: "Palette",
  },
  {
    name: "Shadcn UI",
    category: "frontend",
    proficiency: 90,
    icon: "LayoutTemplate",
  },
  { name: "Zustand", category: "frontend", proficiency: 85, icon: "Workflow" },
  {
    name: "Redux Toolkit",
    category: "frontend",
    proficiency: 88,
    icon: "Boxes",
  },
  { name: "HTML/CSS", category: "frontend", proficiency: 96, icon: "FileCode" },

  // Backend
  { name: "Node.js", category: "backend", proficiency: 88, icon: "Server" },
  {
    name: "Express.js",
    category: "backend",
    proficiency: 85,
    icon: "ServerCog",
  },
  {
    name: "Supabase",
    category: "backend",
    proficiency: 90,
    icon: "DatabaseZap",
  },
  {
    name: "PostgreSQL",
    category: "backend",
    proficiency: 85,
    icon: "Database",
  },
  { name: "Prisma", category: "backend", proficiency: 88, icon: "Box" },
  {
    name: "Convex DB",
    category: "backend",
    proficiency: 80,
    icon: "DatabaseBackup",
  },
  { name: "MongoDB", category: "backend", proficiency: 82, icon: "Leaf" },
  { name: "REST APIs", category: "backend", proficiency: 92, icon: "Network" },

  // Tools
  { name: "Git", category: "tools", proficiency: 92, icon: "GitBranch" },
  { name: "GitHub", category: "tools", proficiency: 90, icon: "Github" },
  { name: "Docker", category: "tools", proficiency: 75, icon: "Container" },
  { name: "AWS", category: "tools", proficiency: 70, icon: "Cloud" },
  { name: "Postman", category: "tools", proficiency: 88, icon: "Send" },
  { name: "Figma", category: "tools", proficiency: 80, icon: "Figma" },

  // AI
  { name: "Flowise AI", category: "ai", proficiency: 85, icon: "Bot" },
  { name: "AI SDK", category: "ai", proficiency: 80, icon: "Cpu" },
  { name: "OpenAI API", category: "ai", proficiency: 85, icon: "Sparkles" },
  { name: "LangChain", category: "ai", proficiency: 75, icon: "Link" },
];
