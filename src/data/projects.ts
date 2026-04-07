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
  {
    slug: "cashflow",
    title: "CashFlow",
    shortDescription:
      "Offline-first personal finance PWA with AI-powered insights, loan tracking, and multi-currency support",
    description:
      "A Progressive Web App for personal financial management built with a mobile-first, offline-first architecture. CashFlow helps users track income and expenses across 20+ currencies, manage loans given and received, set monthly spending goals with daily budget recommendations, and get AI-powered financial advice via Google Gemini. Features real-time Firestore sync with IndexedDB offline fallback, automatic conflict resolution, push notifications for loan reminders, and a comprehensive dashboard with spending analytics. Supports Google OAuth and email/password authentication with per-user data isolation.",
    coverImage: "/images/projects/cashflow-cover.jpg",
    screenshots: [],
    techStack: [
      "React",
      "TypeScript",
      "Firebase",
      "Tailwind CSS",
      "Google Gemini API",
      "IndexedDB",
      "PWA",
    ],
    githubUrl: "https://github.com/mohiuddin200/cashFlow",
    featured: true,
    year: 2025,
  },
  {
    slug: "hangoutpay",
    title: "HangoutPay",
    shortDescription:
      "Real-time group expense tracker and splitter with optimized settlement algorithms",
    description:
      "A real-time group expense splitting app designed for friends and travel groups. HangoutPay lets users create trips, add shared expenses with flexible payer and participant selection, and automatically calculates who owes whom. Features an optimized settlement algorithm that minimizes the number of transactions needed to settle all debts. Built on Convex for real-time data synchronization, with Google OAuth authentication, ghost user support for non-registered participants, and a full audit trail. Installable as a PWA with offline fallback support.",
    coverImage: "/images/projects/hangoutpay-cover.jpg",
    screenshots: [],
    techStack: [
      "React",
      "TypeScript",
      "Convex",
      "Tailwind CSS",
      "Radix UI",
      "React Router",
      "PWA",
    ],
    githubUrl: "https://github.com/mohiuddin200/HangoutPay",
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
