"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { motion } from "motion/react";
import { useSectionInView } from "@/hooks/useSectionInView";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { withSceneLoader } from "@/components/three/SceneLoader";
import { SKILLS, SKILL_CATEGORIES } from "@/data/skills";

const SkillsOrbitLoader = withSceneLoader(
  () => import("@/components/three/SkillsOrbit")
);

export default function SkillsSection() {
  const { ref: sectionRef } = useSectionInView(0.2);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

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

  const getCategoryColor = (categoryId: string) => {
    return (
      SKILL_CATEGORIES.find((c) => c.id === categoryId)?.color ?? "#FFD700"
    );
  };

  const getCategoryLabel = (categoryId: string) => {
    return SKILL_CATEGORIES.find((c) => c.id === categoryId)?.label ?? categoryId;
  };

  // Group skills by category
  const groupedSkills = SKILL_CATEGORIES.map((cat) => ({
    ...cat,
    skills: SKILLS.filter((s) => s.category === cat.id),
  }));

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative min-h-screen bg-black py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2
            ref={headingRef}
            className="text-4xl sm:text-5xl font-bold text-white"
            style={{ opacity: 0 }}
          >
            Skills & Expertise
            <span className="text-[#FFD700]">.</span>
          </h2>
          <p className="mt-4 text-white/50 text-lg max-w-2xl mx-auto">
            Technologies and tools I work with
          </p>
        </div>

        {isDesktop ? (
          /* Desktop: 3D SkillsOrbit + side legend */
          <div className="grid grid-cols-5 gap-8 items-center min-h-[500px]">
            {/* Category legend (left) */}
            <div className="col-span-1 space-y-6">
              {SKILL_CATEGORIES.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-white/70 text-sm font-medium">
                    {cat.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* 3D scene (center) */}
            <div className="col-span-3 h-[500px]">
              <SkillsOrbitLoader />
            </div>

            {/* Skill count summary (right) */}
            <div className="col-span-1 space-y-6">
              {groupedSkills.map((group, i) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-right"
                >
                  <div
                    className="text-2xl font-bold"
                    style={{ color: group.color }}
                  >
                    {group.skills.length}
                  </div>
                  <div className="text-white/40 text-xs uppercase tracking-wider">
                    {group.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Mobile: 2D grid of skill cards */
          <div className="space-y-12">
            {groupedSkills.map((group) => (
              <div key={group.id}>
                <h3
                  className="text-lg font-semibold mb-4 flex items-center gap-2"
                  style={{ color: group.color }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  {group.label}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {group.skills.map((skill, i) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: i * 0.05,
                        duration: 0.4,
                        ease: "easeOut",
                      }}
                      viewport={{ once: true, margin: "-50px" }}
                      className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                    >
                      <div className="text-white text-sm font-medium mb-2">
                        {skill.name}
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: getCategoryColor(skill.category) }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          transition={{ delay: i * 0.05 + 0.3, duration: 0.8 }}
                          viewport={{ once: true }}
                        />
                      </div>
                      <div className="mt-1 text-right text-xs text-white/40">
                        {skill.proficiency}%
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
