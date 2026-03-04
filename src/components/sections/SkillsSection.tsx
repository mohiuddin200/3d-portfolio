"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { motion, AnimatePresence } from "motion/react";
import { useSectionInView } from "@/hooks/useSectionInView";
import * as LucideIcons from "lucide-react";
import { SKILLS, SKILL_CATEGORIES } from "@/data/skills";

const IconRender = ({ iconName, color, className = "w-6 h-6" }: { iconName?: string; color: string; className?: string }) => {
  if (!iconName) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconNames = LucideIcons as unknown as Record<string, React.ComponentType<any>>;
  const Icon = IconNames[iconName];
  if (!Icon) return <LucideIcons.CheckCircle className={className} style={{ color }} />;
  return <Icon className={className} style={{ color }} />;
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
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6 relative z-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => {
              const categoryColor = SKILL_CATEGORIES.find(c => c.id === skill.category)?.color || "#FFD700";

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
                  className="group relative rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md overflow-hidden flex flex-col items-center text-center hover:border-white/30 transition-colors duration-500"
                >
                  {/* Glowing background on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl"
                    style={{ background: `radial-gradient(circle at center, ${categoryColor}, transparent 70%)` }}
                  />

                  <div className="relative mb-4 p-4 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 shadow-inner">
                    <IconRender iconName={skill.icon} color={categoryColor} className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-500 group-hover:rotate-12" />
                  </div>

                  <h3 className="text-white font-medium mb-1 z-10">{skill.name}</h3>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-4 z-10">
                    {SKILL_CATEGORIES.find(c => c.id === skill.category)?.label}
                  </p>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden z-10 mt-auto">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: categoryColor, boxShadow: `0 0 10px ${categoryColor}` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      transition={{ duration: 1, delay: 0.2 + (index * 0.02) }}
                      viewport={{ once: true }}
                    />
                  </div>
                  <div className="w-full flex justify-between mt-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[10px] text-white/40">Proficiency</span>
                    <span className="text-[10px] font-mono font-medium" style={{ color: categoryColor }}>{skill.proficiency}%</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
