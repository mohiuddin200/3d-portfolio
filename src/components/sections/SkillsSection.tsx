"use client";

import { useRef, useState, useEffect, type ComponentType } from "react";
import { gsap } from "@/lib/gsap";
import { motion, AnimatePresence } from "motion/react";
import { useSectionInView } from "@/hooks/useSectionInView";
import { SKILLS, SKILL_CATEGORIES } from "@/data/skills";

import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiShadcnui,
  SiRedux,
  SiHtml5,
  SiNodedotjs,
  SiExpress,
  SiSupabase,
  SiPostgresql,
  SiPrisma,
  SiMongodb,
  SiGit,
  SiGithub,
  SiDocker,
  SiPostman,
  SiFigma,
  SiOpenai,
  SiLangchain,
  SiCss,
} from "react-icons/si";
import { VscJson } from "react-icons/vsc";
import { TbBrandAws, TbBrandFramerMotion } from "react-icons/tb";
import { BsRobot, BsCpu } from "react-icons/bs";

type IconProps = { className?: string; style?: React.CSSProperties };

const SKILL_ICON_MAP: Record<string, ComponentType<IconProps>> = {
  "React JS": SiReact,
  "Next JS": SiNextdotjs,
  "TypeScript": SiTypescript,
  "Tailwind CSS": SiTailwindcss,
  "Shadcn UI": SiShadcnui,
  "Zustand": TbBrandFramerMotion,
  "Redux Toolkit": SiRedux,
  "HTML/CSS": SiHtml5,
  "CSS": SiCss,
  "Node.js": SiNodedotjs,
  "Express.js": SiExpress,
  "Supabase": SiSupabase,
  "PostgreSQL": SiPostgresql,
  "Prisma": SiPrisma,
  "Convex DB": VscJson,
  "MongoDB": SiMongodb,
  "REST APIs": VscJson,
  "Git": SiGit,
  "GitHub": SiGithub,
  "Docker": SiDocker,
  "AWS": TbBrandAws,
  "Postman": SiPostman,
  "Figma": SiFigma,
  "Flowise AI": BsRobot,
  "AI SDK": BsCpu,
  "OpenAI API": SiOpenai,
  "LangChain": SiLangchain,
};

export default function SkillsSection() {
  const { ref: sectionRef } = useSectionInView(0.2);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Heading animation
  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const filteredSkills = activeCategory === "all"
    ? SKILLS
    : SKILLS.filter(s => s.category === activeCategory);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative min-h-screen bg-black py-32 overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-linear-to-b from-black via-zinc-900/20 to-black pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 relative z-10">
          <h2
            ref={headingRef}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ opacity: 0 }}
          >
            My Tech Stack
            <span className="text-[#FFD700]">.</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Technologies, frameworks, and tools I use to build robust digital products.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 relative z-20">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-sm ${activeCategory === "all"
              ? "bg-gold text-black border-gold shadow-[0_0_20px_rgba(255,215,0,0.3)]"
              : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
          >
            All Skills
          </button>
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-sm ${activeCategory === cat.id
                ? "bg-white/10 text-white shadow-lg border-white/30"
                : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              style={
                activeCategory === cat.id
                  ? { borderColor: cat.color, boxShadow: `0 0 20px ${cat.color}30` }
                  : {}
              }
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cat.color, boxShadow: `0 0 10px ${cat.color}` }}
              />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 lg:gap-4 relative z-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => {
              const Icon = SKILL_ICON_MAP[skill.name];

              return (
                <motion.div
                  layout
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.03,
                    ease: "easeOut"
                  }}
                  whileHover={{ y: -8, scale: 1.05, zIndex: 10 }}
                  className="group relative rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-md overflow-hidden flex flex-col items-center text-center hover:border-white/30 transition-colors duration-500"
                >
                  {/* Glowing background on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-xl"
                    style={{ background: "radial-gradient(circle at center, #FFD700, transparent 70%)" }}
                  />

                  <div className="relative mb-3 p-3 rounded-lg bg-white/5 border border-white/5 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 shadow-inner">
                    {Icon ? (
                      <Icon className="w-6 h-6 md:w-7 md:h-7 transition-transform duration-500 group-hover:rotate-12" style={{ color: "#FFD700" }} />
                    ) : (
                      <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gold/20" />
                    )}
                  </div>

                  <h3 className="text-white text-sm font-medium mb-0.5 z-10">{skill.name}</h3>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mb-3 z-10">
                    {SKILL_CATEGORIES.find(c => c.id === skill.category)?.label}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
