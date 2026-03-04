"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useSectionInView } from "@/hooks/useSectionInView";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EXPERIENCES } from "@/data/experience";

export default function ExperienceSection() {
  const { ref: sectionRef } = useSectionInView(0.1);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  // Timeline line draw animation (scaleY from 0 to 1)
  useEffect(() => {
    if (!timelineLineRef.current || !timelineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        timelineLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 70%",
            end: "bottom 30%",
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Card slide-in animations
  useEffect(() => {
    const validCards = cardRefs.current.filter(Boolean);
    if (validCards.length === 0) return;

    const ctx = gsap.context(() => {
      validCards.forEach((el, i) => {
        const isLeft = i % 2 === 0;
        gsap.fromTo(
          el,
          { x: isLeft ? -60 : 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
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

  // Dot scale + pulse animation
  useEffect(() => {
    const validDots = dotRefs.current.filter(Boolean);
    if (validDots.length === 0) return;

    const ctx = gsap.context(() => {
      validDots.forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.5,
            ease: "back.out(2)",
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
      id="experience"
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
            Experience
            <span className="text-[#FFD700]">.</span>
          </h2>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Center line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5">
            <div
              ref={timelineLineRef}
              className="h-full w-full origin-top bg-gradient-to-b from-[#FFD700] via-[#FFD700]/60 to-[#FFD700]/20"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          {/* Timeline items */}
          <div className="space-y-16">
            {EXPERIENCES.map((exp, i) => {
              const isLeft = i % 2 === 0;

              return (
                <div
                  key={exp.id}
                  className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-start"
                >
                  {/* Left content (desktop) */}
                  <div
                    className={`hidden md:block ${
                      isLeft ? "" : "order-3"
                    }`}
                  >
                    {isLeft && (
                      <div
                        ref={(el) => {
                          cardRefs.current[i] = el;
                        }}
                        style={{ opacity: 0 }}
                      >
                        <TimelineCard experience={exp} align="right" />
                      </div>
                    )}
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-4 md:relative md:left-auto flex items-start justify-center pt-2 z-10">
                    <div
                      ref={(el) => {
                        dotRefs.current[i] = el;
                      }}
                      className="relative flex items-center justify-center"
                      style={{ transform: "scale(0)" }}
                    >
                      {/* Pulse ring */}
                      <div className="absolute w-8 h-8 rounded-full border border-[#FFD700]/30 animate-ping" />
                      {/* Dot */}
                      <div className="w-4 h-4 rounded-full bg-[#FFD700] border-4 border-black z-10" />
                    </div>
                  </div>

                  {/* Right content (desktop) */}
                  <div
                    className={`hidden md:block ${
                      isLeft ? "order-3" : ""
                    }`}
                  >
                    {!isLeft && (
                      <div
                        ref={(el) => {
                          cardRefs.current[i] = el;
                        }}
                        style={{ opacity: 0 }}
                      >
                        <TimelineCard experience={exp} align="left" />
                      </div>
                    )}
                  </div>

                  {/* Mobile card (always on right of timeline) */}
                  <div className="md:hidden pl-12 col-span-1">
                    <div
                      ref={(el) => {
                        if (typeof window !== "undefined" && window.innerWidth < 768) {
                          cardRefs.current[i] = el;
                        }
                      }}
                      style={{ opacity: 0 }}
                    >
                      <TimelineCard experience={exp} align="left" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Timeline Card sub-component                                         */
/* ------------------------------------------------------------------ */

interface TimelineCardProps {
  experience: (typeof EXPERIENCES)[number];
  align: "left" | "right";
}

function TimelineCard({ experience, align }: TimelineCardProps) {
  const isWork = experience.type === "work";

  return (
    <Card
      className={`bg-white/5 border-white/10 backdrop-blur-sm ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      <CardHeader>
        <div
          className={`flex items-center gap-2 text-xs uppercase tracking-wider text-[#FFD700] font-semibold ${
            align === "right" ? "justify-end" : ""
          }`}
        >
          <span>
            {experience.startDate} - {experience.endDate}
          </span>
          <span className="text-white/20">|</span>
          <span className="text-white/40">
            {isWork ? "Work" : "Education"}
          </span>
        </div>
        <CardTitle className="text-white text-lg">
          {experience.title}
        </CardTitle>
        <CardDescription className="text-white/50">
          {experience.organization} &middot; {experience.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul
          className={`space-y-2 ${
            align === "right" ? "text-right" : "text-left"
          }`}
        >
          {experience.description.map((item, idx) => (
            <li
              key={idx}
              className="text-white/60 text-sm leading-relaxed"
            >
              {item}
            </li>
          ))}
        </ul>
        <div
          className={`flex flex-wrap gap-1.5 ${
            align === "right" ? "justify-end" : ""
          }`}
        >
          {experience.techStack.map((tech) => (
            <Badge
              key={tech}
              variant="outline"
              className="border-[#FFD700]/20 text-[#FFD700]/70 text-xs px-2 py-0.5"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
