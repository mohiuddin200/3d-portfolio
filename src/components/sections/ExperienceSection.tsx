"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useSectionInView } from "@/hooks/useSectionInView";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EXPERIENCES } from "@/data/experience";

export default function ExperienceSection() {
  const { ref: sectionRef } = useSectionInView(0.1);
  const [activeIndex, setActiveIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const leftPaneRef = useRef<HTMLDivElement>(null);

  // Content change animation (triggers on tab change)
  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 15, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power3.out" }
      );
    });

    return () => ctx.revert();
  }, [activeIndex]);

  // Initial scroll-in animations
  useEffect(() => {
    if (!headingRef.current || !leftPaneRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%" }
        }
      );

      gsap.fromTo(
        leftPaneRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.8, ease: "power3.out",
          delay: 0.2,
          scrollTrigger: { trigger: headingRef.current, start: "top 85%" }
        }
      );

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: 30 },
        {
          opacity: 1, x: 0, duration: 0.8, ease: "power3.out",
          delay: 0.4,
          scrollTrigger: { trigger: headingRef.current, start: "top 85%" }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const activeExp = EXPERIENCES[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative min-h-screen py-24 md:py-32 flex flex-col justify-center overflow-hidden"
    >
      {/* Background ambient glow matching dark futuristic theme */}
      <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
        {/* Section heading */}
        <div ref={headingRef} className="mb-16 md:mb-24 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
            Where I&apos;ve <span className="text-gold">Worked</span>.
          </h2>
          <p className="text-white/60 text-lg md:text-xl md:max-w-2xl">
            My professional journey and qualifications, turning complex problems into elegant, scaleable solutions.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          {/* Left Pane - Timeline / Tabs List */}
          <div ref={leftPaneRef} className="md:w-1/3 shrink-0 relative z-20">
            {/* Mobile horizontal scroller */}
            <div className="flex overflow-x-auto pb-4 md:hidden gap-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {EXPERIENCES.map((exp, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={exp.id}
                    onClick={() => setActiveIndex(index)}
                    className={`shrink-0 px-5 py-2.5 rounded-full border text-sm transition-all duration-300 font-medium whitespace-nowrap focus:outline-none ${isActive
                      ? "bg-gold/10 border-gold text-gold shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                      : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10"
                      }`}
                  >
                    {exp.organization}
                  </button>
                );
              })}
            </div>

            {/* Desktop vertical line list */}
            <div className="hidden md:flex flex-col relative border-l border-white/10 pl-6 space-y-2">
              {/* Highlight bar that perfectly glides on the border line */}
              <div
                className="absolute left-[-2px] w-[3px] bg-gold transition-transform duration-500 ease-in-out rounded-full shadow-[0_0_15px_rgba(255,215,0,0.8)]"
                style={{
                  transform: `translateY(calc(${activeIndex * 80}px + 16px))`,
                  height: '48px',
                  top: 0
                }}
              />

              {EXPERIENCES.map((exp, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={exp.id}
                    onClick={() => setActiveIndex(index)}
                    className={`h-[80px] flex flex-col justify-center text-left transition-all duration-300 focus:outline-none group pl-6 rounded-r-xl ${isActive ? "bg-white/3" : "hover:bg-white/2"
                      }`}
                  >
                    <span
                      className={`font-bold text-lg tracking-wide transition-colors duration-300 ${isActive ? "text-gold" : "text-white/60 group-hover:text-white"
                        }`}
                    >
                      {exp.organization}
                    </span>
                    <span
                      className={`text-sm tracking-widest uppercase transition-colors duration-300 mt-1 ${isActive ? "text-white/80" : "text-white/40 group-hover:text-white/60"
                        }`}
                    >
                      {exp.type === 'work' ? 'Experience' : 'Education'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Pane - Content Details */}
          <div className="md:w-2/3 min-h-[450px]">
            <div ref={contentRef} className="h-full">
              <Card className="bg-[#0a0a0a]/60 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group h-full transition-all duration-300 hover:border-white/20 hover:shadow-[0_10px_40px_-10px_rgba(255,215,0,0.1)]">
                {/* Decorative gradients */}
                <div className="absolute inset-0 bg-linear-to-br from-gold/5 via-transparent to-transparent opacity-50" />
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-110" />

                <CardContent className="p-8 md:p-12 relative z-10">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-10 gap-6">
                    <div>
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        {activeExp.title}
                      </h3>
                      <div className="text-xl font-medium text-gold flex flex-wrap items-center gap-2">
                        <span>@ {activeExp.organization}</span>
                        <span className="text-white/30 hidden md:inline px-1">•</span>
                        <span className="text-white/60">{activeExp.location}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-sm font-bold tracking-widest uppercase text-white/70 bg-white/5 py-2.5 px-5 rounded-full border border-white/10 shadow-inner">
                      {activeExp.startDate} — {activeExp.endDate}
                    </div>
                  </div>

                  {/* Role progression timeline */}
                  {activeExp.roles && activeExp.roles.length > 0 && (
                    <div className="mb-10 flex flex-col gap-3 relative pl-5">
                      {/* Line connecting dots - spans only between first and last dot centers */}
                      <div className="absolute left-0 top-[6px] bottom-[6px] w-[2px] bg-gold/30" />
                      {activeExp.roles.map((role, idx) => (
                        <div key={idx} className="relative flex items-center gap-4">
                          <div className={`absolute -left-[25px] w-3 h-3 rounded-full border-2 ${idx === 0 ? "bg-gold border-gold shadow-[0_0_10px_rgba(255,215,0,0.6)]" : "bg-white/10 border-white/30"}`} />
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className={`font-semibold text-base ${idx === 0 ? "text-gold" : "text-white/50"}`}>
                              {role.title}
                            </span>
                            <span className={`text-sm tracking-wide ${idx === 0 ? "text-white/60" : "text-white/30"}`}>
                              {role.period}
                            </span>
                            {idx === 0 && (
                              <span className="text-[11px] font-bold tracking-widest uppercase bg-gold/15 text-gold px-2.5 py-0.5 rounded-full border border-gold/30">
                                Promoted
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <ul className="space-y-6 mb-12">
                    {activeExp.description.map((item, idx) => (
                      <li key={idx} className="flex items-start text-gray-300 text-lg leading-relaxed group/item">
                        <span className="mr-5 mt-[6px] text-gold shrink-0 bg-gold/10 p-1.5 rounded-full group-hover/item:bg-gold group-hover/item:text-black transition-colors duration-300 shadow-[0_0_10px_rgba(255,215,0,0.2)] group-hover/item:shadow-[0_0_15px_rgba(255,215,0,0.6)]">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                        <span className="group-hover/item:text-white transition-colors duration-300">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-8 border-t border-white/10">
                    <p className="text-sm text-white/40 uppercase tracking-widest font-bold mb-5">Tech Stack</p>
                    <div className="flex flex-wrap gap-3">
                      {activeExp.techStack.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="bg-white/5 border border-white/10 text-white/80 hover:bg-gold hover:text-black hover:border-gold px-4 py-1.5 text-sm md:text-base font-medium transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(255,215,0,0.3)] cursor-default"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
