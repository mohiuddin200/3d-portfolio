import type { ComponentType, CSSProperties } from "react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiShadcnui,
  SiHtml5,
  SiNodedotjs,
  SiExpress,
  SiSupabase,
  SiPostgresql,
  SiPrisma,
  SiMongodb,
  SiGit,
  SiGithub,
  SiDocker,
  SiPostman,
  SiFigma,
  SiOpenai,
  SiAnthropic,
  SiLangchain,
  SiExpo,
  SiVercel,
} from "react-icons/si";
import { VscJson } from "react-icons/vsc";
import { TbBrandAws, TbBrandFramerMotion, TbDatabaseSearch, TbStack2 } from "react-icons/tb";
import { BsCpu } from "react-icons/bs";

export type IconComponent = ComponentType<{ className?: string; style?: CSSProperties }>;

/** Icon per skill name. Keys double as the canonical tech names used by journey stages. */
export const SKILL_ICON_MAP = {
  "React JS": SiReact,
  "Next JS": SiNextdotjs,
  "TanStack Start": TbStack2,
  "React Native": SiReact,
  "Expo": SiExpo,
  "TypeScript": SiTypescript,
  "Tailwind CSS": SiTailwindcss,
  "Shadcn UI": SiShadcnui,
  "Zustand": TbBrandFramerMotion,
  "HTML/CSS": SiHtml5,
  "Node.js": SiNodedotjs,
  "Express.js": SiExpress,
  "Supabase": SiSupabase,
  "PostgreSQL": SiPostgresql,
  "Prisma": SiPrisma,
  "Convex DB": VscJson,
  "MongoDB": SiMongodb,
  "REST APIs": VscJson,
  "Git": SiGit,
  "GitHub": SiGithub,
  "Docker": SiDocker,
  "AWS": TbBrandAws,
  "Vercel": SiVercel,
  "Postman": SiPostman,
  "Figma": SiFigma,
  "AI SDK": BsCpu,
  "OpenAI API": SiOpenai,
  "Anthropic API": SiAnthropic,
  "LangChain": SiLangchain,
  "Vector search": TbDatabaseSearch,
} satisfies Record<string, IconComponent>;

export type TechName = keyof typeof SKILL_ICON_MAP;

export function TechIcon({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: CSSProperties;
}) {
  const Icon = (SKILL_ICON_MAP as Record<string, IconComponent | undefined>)[name];
  if (!Icon) return <span className={`inline-block rounded-full bg-gold/20 ${className ?? ""}`} style={style} />;
  return <Icon className={className} style={style} />;
}
