export interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  screenshots: string[];
  videoUrl?: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  year: number;
}

export interface Skill {
  name: string;
  category: SkillCategory;
  proficiency: number; // 0-100
  icon?: string;
}

export type SkillCategory = "frontend" | "backend" | "tools" | "ai";

export interface Experience {
  id: string;
  type: "work" | "education";
  title: string;
  organization: string;
  logo?: string;
  location: string;
  startDate: string;
  endDate: string | "Present";
  description: string[];
  techStack: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issuerLogo?: string;
  date: string;
  credentialUrl?: string;
  credentialId?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
  size: "sm" | "md" | "lg";
}

export type CursorVariant = "default" | "link" | "text";
