import type { TechName } from "@/data/skill-icons";

export type JourneyStageId = "structure" | "style" | "interaction" | "data" | "ai" | "ship";

export interface JourneyStage {
  id: JourneyStageId;
  /** Short label for the rail, e.g. "Structure". */
  label: string;
  /** Caption headline. */
  title: string;
  /** One-sentence caption body. */
  line: string;
  /** Keys of SKILL_ICON_MAP so every chip has an icon. */
  techs: TechName[];
}

export const JOURNEY = {
  heading: "What I build",
  subline: "From a blank page to an AI-powered product. Scroll to watch it come together.",
  cta: "See full stack",
} as const;

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: "structure",
    label: "Structure",
    title: "It starts as boxes.",
    line: "Semantic markup first, so every layer after it has something solid to stand on.",
    techs: ["HTML/CSS"],
  },
  {
    id: "style",
    label: "Style",
    title: "Then it gets a face.",
    line: "Dark, consistent, on brand. Tailwind and shadcn/ui, no design drift.",
    techs: ["Tailwind CSS", "Shadcn UI", "Figma"],
  },
  {
    id: "interaction",
    label: "Interaction",
    title: "Then it responds.",
    line: "Typed React components, routes and state that stay predictable as the app grows.",
    techs: ["React JS", "TypeScript", "Next JS", "TanStack Start", "Zustand"],
  },
  {
    id: "data",
    label: "Data & auth",
    title: "Then it remembers.",
    line: "Real users, real rows. Auth, a Postgres schema and a typed data layer.",
    techs: ["Supabase", "Convex DB", "PostgreSQL", "Prisma"],
  },
  {
    id: "ai",
    label: "AI",
    title: "Then it thinks.",
    line: "An assistant that answers from your own data, streamed and grounded by vector search.",
    techs: ["OpenAI API", "Anthropic API", "Vector search"],
  },
  {
    id: "ship",
    label: "Ship",
    title: "Then it ships. Everywhere.",
    line: "One codebase to web, Android and desktop. Deployed, monitored, in use.",
    techs: ["React Native", "Expo", "Vercel", "Docker"],
  },
];
