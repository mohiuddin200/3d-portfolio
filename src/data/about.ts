export const ABOUT = {
  heading: "About Me",
  bio: [
    "I'm a Full Stack Developer from Dhaka, Bangladesh, specializing in building modern web applications with Next.js, TypeScript, and AI integration.",
    "I craft scalable, high-performance solutions — from pixel-perfect frontends to robust backend architectures — with a focus on clean code and exceptional user experiences.",
    "Currently building AI-powered applications at KI-Quadrat, a Vienna-based AI company, where I integrate conversational AI, workflow automation, and intelligent features into production systems.",
  ],
  stats: [
    { label: "Years Experience", value: 2, suffix: "+" },
    { label: "Projects Built", value: 15, suffix: "+" },
    { label: "Technologies", value: 20, suffix: "+" },
    { label: "Languages Spoken", value: 4, suffix: "" },
  ],
  currentlyLearning: [
    "AI Agent Orchestration & Flowise",
    "Advanced Three.js & WebGL Shaders",
    "Rust for WebAssembly",
    "System Design & Microservices",
  ],
  languages: [
    { name: "Bangla", level: "Native", proficiency: 100 },
    { name: "English", level: "Proficient", proficiency: 85 },
    { name: "Hindi", level: "Conversational", proficiency: 60 },
    { name: "Urdu", level: "Conversational", proficiency: 55 },
  ],
  interests: [
    "AI / ML",
    "Full Stack Dev",
    "Creative Coding",
    "3D Graphics",
    "Open Source",
    "UI/UX Design",
    "DevOps",
    "System Design",
  ],
  photo: "/images/about/profile.jpg",
  photoAlt: "Md Mohiuddin — Full Stack Developer",
} as const;
