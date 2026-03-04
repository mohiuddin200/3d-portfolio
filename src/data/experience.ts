import type { Experience } from "@/types";

export const EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    type: "work",
    title: "Next.js Specialist & Full-Stack Developer",
    organization: "AI APP COMPANY",
    location: "Bangkok, Thailand (Remote)",
    startDate: "Nov 2024",
    endDate: "Present",
    description: [
      "Developed responsive AI-powered web applications using Next.js, integrating chatbots and speech-to-text functionalities.",
      "Managed state effectively with Zustand and Server Action for API integration.",
      "Designed and maintained Supabase database schemas, implementing seamless CRUD operations.",
      "Integrated Flowise AI API for conversational AI and handled complex queries.",
      "Enhanced application scalability and performance with SSR and code splitting.",
    ],
    techStack: [
      "Next.js",
      "Zustand",
      "Supabase",
      "Flowise AI",
      "React",
      "TypeScript",
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
