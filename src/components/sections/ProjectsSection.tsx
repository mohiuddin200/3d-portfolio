"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { motion } from "motion/react";
import Link from "next/link";
import { useSectionInView } from "@/hooks/useSectionInView";
import { useCursor } from "@/components/providers/CursorProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFeaturedProjects } from "@/data/projects";

const featured = getFeaturedProjects();

export default function ProjectsSection() {
  const { ref: sectionRef } = useSectionInView(0.1);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { setVariant } = useCursor();

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

  // Image clip-path reveal animations
  useEffect(() => {
    const validImages = imageRefs.current.filter(Boolean);
    if (validImages.length === 0) return;

    const ctx = gsap.context(() => {
      validImages.forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: el,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  // Project content fade-in animations
  useEffect(() => {
    const validProjects = projectRefs.current.filter(Boolean);
    if (validProjects.length === 0) return;

    const ctx = gsap.context(() => {
      validProjects.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative min-h-screen bg-black py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <div className="text-center mb-20">
          <h2
            ref={headingRef}
            className="text-4xl sm:text-5xl font-bold text-white"
            style={{ opacity: 0 }}
          >
            Featured Projects
            <span className="text-[#FFD700]">.</span>
          </h2>
          <p className="mt-4 text-white/50 text-lg max-w-2xl mx-auto">
            A selection of projects I&apos;m proud of
          </p>
        </div>

        {/* Project teasers */}
        <div className="space-y-32">
          {featured.map((project, i) => {
            const isEven = i % 2 === 0;

            return (
              <div
                key={project.slug}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
              >
                {/* Image area */}
                <div
                  className={`${isEven ? "lg:order-1" : "lg:order-2"}`}
                >
                  <motion.div
                    onMouseEnter={() => setVariant("link")}
                    onMouseLeave={() => setVariant("default")}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div
                      ref={(el) => {
                        imageRefs.current[i] = el;
                      }}
                      className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-white/5 border border-white/10"
                      style={{ clipPath: "inset(0 100% 0 0)" }}
                    >
                      {/* Project image placeholder */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 via-transparent to-white/5" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-xl border border-[#FFD700]/30 mx-auto mb-3 flex items-center justify-center">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#FFD700"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                          </div>
                          <span className="text-white/30 text-sm">
                            {project.title}
                          </span>
                        </div>
                      </div>
                      {/* Year badge */}
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-[#FFD700] font-mono">
                        {project.year}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Content */}
                <div
                  ref={(el) => {
                    projectRefs.current[i] = el;
                  }}
                  className={`${
                    isEven ? "lg:order-2" : "lg:order-1 lg:text-right"
                  } space-y-5`}
                  style={{ opacity: 0 }}
                >
                  <p className="text-[#FFD700] text-sm font-mono uppercase tracking-wider">
                    Featured Project
                  </p>
                  <h3 className="text-3xl sm:text-4xl font-bold text-white">
                    {project.title}
                  </h3>
                  <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-lg">
                    {project.shortDescription}
                  </p>

                  {/* Tech stack */}
                  <div
                    className={`flex flex-wrap gap-2 ${
                      !isEven ? "lg:justify-end" : ""
                    }`}
                  >
                    {project.techStack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="border-white/20 text-white/60 hover:border-[#FFD700]/50 hover:text-[#FFD700] transition-colors text-xs px-2.5 py-1"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div
                    className={`flex gap-3 pt-2 ${
                      !isEven ? "lg:justify-end" : ""
                    }`}
                  >
                    <Button
                      asChild
                      className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-semibold"
                    >
                      <Link href={`/projects/${project.slug}`}>
                        View Project
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-1"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>
                    </Button>
                    {project.githubUrl && (
                      <Button
                        asChild
                        variant="outline"
                        className="border-white/20 text-white hover:border-white/40"
                      >
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Source
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
