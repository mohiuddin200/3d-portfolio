import type { Experience } from "@/types";

export const EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    type: "work",
    title: "Full-Stack Developer",
    organization: "KI-Quadrat Systemhaus GmbH",
    location: "Vienna, Austria (Remote)",
    startDate: "Nov 2024",
    endDate: "Present",
    roles: [
      { title: "Full-Stack Developer", period: "Jan 2026 — Present" },
      { title: "Next JS Specialist", period: "Nov 2024 — Dec 2025" },
    ],
    description: [
      "Designed a multi-tenant Convex real-time database schema powering role-based access control across municipalities, departments, and teams for a German government SaaS platform.",
      "Built a RAG-powered AI chatbot with Qdrant vector search and OpenAI embeddings, enabling municipalities to deploy knowledge-base-backed helpdesk assistants.",
      "Developed a document ingestion pipeline supporting web crawling, PDF/DOCX parsing, PII detection, and automated vector embedding for municipal knowledge base indexing.",
      "Implemented an embeddable JavaScript chat widget with configurable theming, session management, and a token-based billing system with automated invoice generation.",
    ],
    techStack: [
      "Next.js",
      "TypeScript",
      "Convex DB",
      "OpenAI",
      "Qdrant",
      "shadcn/ui",
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
