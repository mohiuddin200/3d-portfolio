import type { SocialLink } from "@/types";

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/username",
    icon: "github",
    color: "#FFFFFF",
    size: "lg",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/username",
    icon: "linkedin",
    color: "#0A66C2",
    size: "md",
  },
  {
    name: "Twitter / X",
    url: "https://x.com/username",
    icon: "twitter",
    color: "#FFFFFF",
    size: "md",
  },
  {
    name: "Email",
    url: "mailto:hello@example.com",
    icon: "mail",
    color: "#FFD700",
    size: "lg",
  },
];

export const CONTACT = {
  email: "hello@example.com",
  resumeUrl: "/resume.pdf",
} as const;
