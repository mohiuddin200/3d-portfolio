import type { Project } from "@/types";

export const PROJECTS: Project[] = [
  {
    slug: "coachhub",
    title: "CoachHub",
    shortDescription:
      "All-in-one SaaS platform for coaching institutes to manage students, teachers, attendance, exams, and finances",
    description:
      "A cloud-based management platform built for coaching institutes and tutorial centers in Bangladesh. CoachHub digitizes day-to-day operations — from student enrollment and batch assignment to attendance tracking with biometric device integration, exam management with automated grade calculation, and a complete finance module for fee tracking, salary management, and expense logging. Features include SMS notifications via MRAM gateway in Bengali/English, professional student ID card generation with barcodes and QR codes, and role-based access control. Currently in beta with 50+ active institutes on the platform.",
    coverImage: "/images/projects/coachhub-cover.jpg",
    screenshots: [
      "/images/projects/coachhub-1.jpg",
      "/images/projects/coachhub-2.jpg",
      "/images/projects/coachhub-3.jpg",
    ],
    techStack: [
      "Next.js",
      "TypeScript",
      "Convex DB",
      "Tailwind CSS",
      "shadcn/ui",
      "SMS Integration",
      "Biometric API",
    ],
    liveUrl: "https://coaching-landingpage-bd.vercel.app",
    featured: true,
    year: 2025,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.featured);
}
