import type { Experience } from "@/types";

export const EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    type: "work",
    title: "Senior Full Stack Developer",
    organization: "Tech Corp",
    location: "San Francisco, CA",
    startDate: "2023",
    endDate: "Present",
    description: [
      "Led development of customer-facing SaaS platform serving 50K+ users",
      "Architected microservices infrastructure reducing latency by 40%",
      "Mentored team of 4 junior developers",
    ],
    techStack: ["React", "Node.js", "PostgreSQL", "AWS", "Docker"],
  },
  {
    id: "exp-2",
    type: "work",
    title: "Full Stack Developer",
    organization: "Digital Agency",
    location: "New York, NY",
    startDate: "2021",
    endDate: "2023",
    description: [
      "Built interactive web experiences for Fortune 500 clients",
      "Developed 3D product configurators using Three.js",
      "Implemented CI/CD pipelines reducing deploy time by 60%",
    ],
    techStack: ["Next.js", "TypeScript", "Three.js", "GraphQL", "Vercel"],
  },
  {
    id: "exp-3",
    type: "work",
    title: "Frontend Developer",
    organization: "Startup Inc",
    location: "Austin, TX",
    startDate: "2019",
    endDate: "2021",
    description: [
      "Developed responsive React applications from ground up",
      "Integrated third-party APIs and payment systems",
      "Improved web vitals scores by 35%",
    ],
    techStack: ["React", "JavaScript", "Tailwind CSS", "Firebase"],
  },
  {
    id: "edu-1",
    type: "education",
    title: "B.S. Computer Science",
    organization: "University of Technology",
    location: "Boston, MA",
    startDate: "2015",
    endDate: "2019",
    description: [
      "Graduated with honors (GPA: 3.8/4.0)",
      "Focus on Software Engineering and AI",
      "Led university hackathon team to 3 regional wins",
    ],
    techStack: ["Python", "Java", "C++", "Machine Learning"],
  },
];
