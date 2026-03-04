import type { SocialLink } from "@/types";

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/mohiuddin200",
    icon: "github",
    color: "#FFFFFF",
    size: "lg",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/mohiuddin2001/",
    icon: "linkedin",
    color: "#0A66C2",
    size: "md",
  },
  {
    name: "Phone",
    url: "tel:+8801307483244",
    icon: "phone",
    color: "#25D366",
    size: "md",
  },
  {
    name: "Email",
    url: "mailto:mohiuddin.200@outlook.com",
    icon: "mail",
    color: "#FFD700",
    size: "lg",
  },
];

export const CONTACT = {
  email: "mohiuddin.200@outlook.com",
  resumeUrl: "/Mohiuddin_Full-Stack-Developer_2025.pdf",
} as const;
