import type { Skill, SkillCategory } from "@/types";

export const SKILL_CATEGORIES: { id: SkillCategory; label: string; color: string; radius: number }[] = [
  { id: "frontend", label: "Frontend", color: "#FFD700", radius: 3 },
  { id: "backend", label: "Backend", color: "#FFFFFF", radius: 5 },
  { id: "tools", label: "Tools & DevOps", color: "#A0A0A0", radius: 7 },
  { id: "ai", label: "AI & Data", color: "#FFE44D", radius: 9 },
];

export const SKILLS: Skill[] = [
  // Frontend
  { name: "React", category: "frontend", proficiency: 95 },
  { name: "Next.js", category: "frontend", proficiency: 90 },
  { name: "TypeScript", category: "frontend", proficiency: 92 },
  { name: "Three.js", category: "frontend", proficiency: 75 },
  { name: "Tailwind CSS", category: "frontend", proficiency: 95 },
  { name: "GSAP", category: "frontend", proficiency: 80 },
  // Backend
  { name: "Node.js", category: "backend", proficiency: 88 },
  { name: "Python", category: "backend", proficiency: 85 },
  { name: "PostgreSQL", category: "backend", proficiency: 82 },
  { name: "REST APIs", category: "backend", proficiency: 90 },
  { name: "GraphQL", category: "backend", proficiency: 78 },
  // Tools
  { name: "Git", category: "tools", proficiency: 92 },
  { name: "Docker", category: "tools", proficiency: 80 },
  { name: "AWS", category: "tools", proficiency: 75 },
  { name: "CI/CD", category: "tools", proficiency: 82 },
  { name: "Linux", category: "tools", proficiency: 85 },
  // AI
  { name: "TensorFlow", category: "ai", proficiency: 70 },
  { name: "LangChain", category: "ai", proficiency: 72 },
  { name: "OpenAI API", category: "ai", proficiency: 80 },
  { name: "Data Viz", category: "ai", proficiency: 78 },
];
