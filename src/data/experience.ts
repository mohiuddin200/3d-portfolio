import type { Experience } from "@/types";

export const EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    type: "work",
    title: "Full-Stack Developer",
    organization: "KI Quadrat",
    location: "Gablitz, Austria (Remote)",
    startDate: "Nov 2024",
    endDate: "Present",
    roles: [
      { title: "Full-Stack Developer", period: "Jan 2026 — Present" },
      { title: "Front-End Developer", period: "Nov 2024 — Dec 2025" },
    ],
    description: [
      "Building sovereign AI-powered web applications for municipalities across Austria, Romania, and Germany.",
      "Developing full-stack features using Next.js, integrating chatbots, grant assistants, and legal AI tools.",
      "Designing and maintaining database schemas, implementing seamless CRUD operations with Supabase.",
      "Integrated Flowise AI API for conversational AI and handled complex municipal queries.",
      "Enhanced application scalability and performance with SSR and code splitting.",
    ],
    techStack: [
      "Next.js",
      "TypeScript",
      "Convex DB",
      "PostgreSQL",
      "shadcn/ui",
      "AI Integration",
      "Tailwind CSS",
    ],
  },
  {
    id: "exp-2",
    type: "work",
    title: "Front-End Web Developer",
    organization: "ABSS",
    location: "Beirut, Lebanon (Remote)",
    startDate: "Sep 2023",
    endDate: "Jun 2024",
    description: [
      "Developed responsive web applications using React.js and Next.js.",
      "Managed state using Redux Toolkit and improved API integration with RTK Query.",
      "Increased user engagement by 15% through UI/UX improvements.",
      "Collaborated with backend teams to ensure seamless integration of RESTful APIs.",
      "Enhanced website loading time by 20% through optimization strategies like SSR.",
    ],
    techStack: [
      "React.js",
      "Next.js",
      "Redux Toolkit",
      "RTK Query",
      "TypeScript",
      "Tailwind CSS",
    ],
  },
];
