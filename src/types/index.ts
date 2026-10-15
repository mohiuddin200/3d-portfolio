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
  storeUrl?: string;
  featured: boolean;
  badge?: string;
  year: number;
}

export interface Skill {
  name: string;
  category: SkillCategory;
  icon?: string;
}

export type SkillCategory = "frontend" | "backend" | "tools" | "ai";

export interface ExperienceRole {
  title: string;
  period: string;
  /** One-line intro that is always visible for this role. */
  summary?: string;
  /** Bullet points revealed behind "See more". */
  highlights?: string[];
  /** How many highlights to show before "See more". Defaults to 0 for past roles, 3 for the current one. */
  previewCount?: number;
}

export interface Experience {
  id: string;
  type: "work" | "education";
  title: string;
  organization: string;
  /** Short label used in the timeline / tab list. */
  shortName?: string;
  logo?: string;
  location: string;
  employmentType?: string;
  website?: string;
  startDate: string;
  endDate: string | "Present";
  /** Always-visible intro paragraph. */
  summary?: string;
  roles?: ExperienceRole[];
  /** Bullet points; the first `previewCount` are visible, the rest sit behind "See more". */
  description: string[];
  previewCount?: number;
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

export type CursorVariant = "default" | "link" | "hover";
