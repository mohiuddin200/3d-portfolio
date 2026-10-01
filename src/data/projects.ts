import type { Project } from "@/types";

export const PROJECTS: Project[] = [
  {
    slug: "liftuno",
    title: "Liftuno",
    shortDescription:
      "Phone-first gym management for local gyms in Bangladesh — memberships, dues, payments, QR attendance and daily cash, in Bangla and English on web, Android and Windows",
    description:
      "Liftuno replaces paper ledgers and memorised balances for low- and mid-budget gyms in Bangladesh. One Expo codebase ships as a web app, an Android app and a Windows desktop app (Electron), built for non-technical gym owners and front-desk staff. It runs on Convex with Better Auth phone-number + PIN sign-in. The front desk gets a Today screen with check-ins, who owes and cash collected; member registration and timelines; part payments, multi-month prepaid offers, discounts and write-offs with shareable receipts and statements; desk check-in plus a gym QR code for self check-in; and an end-of-day drawer count with a required reason for any difference. Owners see profit vs cash profit, collected vs earned, expenses, recurring costs, dues by age and CSV exports. Records are never edited — corrections are reversals with a reason, and every change lands in the activity history. A public demo gives each visitor a private copy of a fictional gym to try.",
    coverImage: "/images/projects/liftuno-cover.png",
    screenshots: [
      "/images/projects/liftuno-1.png",
      "/images/projects/liftuno-2.png",
      "/images/projects/liftuno-3.png",
      "/images/projects/liftuno-4.png",
      "/images/projects/liftuno-5.png",
      "/images/projects/liftuno-6.png",
    ],
    techStack: [
      "Expo",
      "React Native",
      "TypeScript",
      "Convex",
      "Better Auth",
      "Electron",
      "Astro",
      "SMS Gateway",
    ],
    liveUrl: "https://liftuno-website.vercel.app",
    badge: "Built agent-first · 10 days",
    featured: true,
    year: 2026,
  },
  {
    slug: "mylearnio",
    title: "myLearnio",
    shortDescription:
      "Multi-tenant SaaS for coaching institutes — students, teachers, biometric attendance, exams, double-entry finance and SMS outreach",
    description:
      "myLearnio is a multi-tenant platform for coaching institutes in Bangladesh with role-based access for SuperAdmin, OrgAdmin, FinanceManager and AcademicCoordinator. Academics are modelled as Levels → Subjects → Class Sections with automatic enrollment, exams with question papers and grading, and student ID cards with barcodes and QR codes. Attendance for students and teachers comes from Steller and Tipsoi biometric devices, synced by a cron job with AES-256-GCM-encrypted device credentials. The finance module is a real double-entry ledger: fee structures, a monthly Student Fee Register with partial payments and printable receipts, Salary Payables, an Expense Register, manual journal entries with a chart of accounts, and Trial Balance, General Ledger, Income Statement and Balance Sheet reports exportable as PDF or CSV. SMS alerts and marketing go through the MRAM gateway in Bangla or English. Built on the Next.js App Router with Prisma 7 on Supabase Postgres, Supabase Auth and TanStack Query. The screenshots show the new interface prototype, which reconciles all 38 production pages and previews teacher, student and guardian portals.",
    coverImage: "/images/projects/mylearnio-cover.png",
    screenshots: [
      "/images/projects/mylearnio-1.png",
      "/images/projects/mylearnio-2.png",
      "/images/projects/mylearnio-3.png",
      "/images/projects/mylearnio-4.png",
      "/images/projects/mylearnio-5.png",
      "/images/projects/mylearnio-6.png",
    ],
    techStack: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Supabase Auth",
      "Tailwind CSS",
      "shadcn/ui",
      "Biometric API",
      "SMS Gateway",
    ],
    liveUrl: "https://mylearnio.com",
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
