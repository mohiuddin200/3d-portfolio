"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useSectionInView } from "@/hooks/useSectionInView";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EXPERIENCES } from "@/data/experience";
import type { Experience, ExperienceRole } from "@/types";

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function CheckBullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start text-gray-300 text-base md:text-lg leading-relaxed group/item">
      <span className="mr-4 mt-[5px] text-gold shrink-0 bg-gold/10 p-1.5 rounded-full group-hover/item:bg-gold group-hover/item:text-black transition-colors duration-300 shadow-[0_0_10px_rgba(255,215,0,0.2)] group-hover/item:shadow-[0_0_15px_rgba(255,215,0,0.6)]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </span>
      <span className="group-hover/item:text-white transition-colors duration-300">{children}</span>
    </li>
  );
}

function SeeMoreButton({
  expanded,
  hiddenCount,
  onClick,
  collapsedLabel,
}: {
  expanded: boolean;
  hiddenCount: number;
  onClick: () => void;
  collapsedLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      className="inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide text-gold/80 hover:text-gold transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded-full px-3 py-1.5 -ml-3 hover:bg-gold/5"
    >
      {expanded ? "See less" : collapsedLabel ?? `See more (${hiddenCount})`}
      <ChevronDown
        className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
      />
    </button>
  );
}

/**
 * Shows the first `previewCount` items; the rest are revealed behind a
 * "See more" toggle with a height animation.
 */
function ExpandableHighlights({
  items,
  previewCount,
  collapsedLabel,
}: {
  items: string[];
  previewCount: number;
  collapsedLabel?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = items.slice(0, previewCount);
  const hidden = items.slice(previewCount);

  const refresh = () => ScrollTrigger.refresh();

  if (items.length === 0) return null;

  return (
    <div>
      {visible.length > 0 && (
        <ul className="space-y-4">
          {visible.map((item, idx) => (
            <CheckBullet key={idx}>{item}</CheckBullet>
          ))}
        </ul>
      )}

      {hidden.length > 0 && (
        <>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="more"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onAnimationComplete={refresh}
                className="overflow-hidden"
              >
                <ul className={`space-y-4 ${visible.length > 0 ? "pt-4" : ""}`}>
                  {hidden.map((item, idx) => (
                    <CheckBullet key={idx}>{item}</CheckBullet>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={visible.length > 0 || expanded ? "mt-4" : "mt-1"}>
            <SeeMoreButton
              expanded={expanded}
              hiddenCount={hidden.length}
              collapsedLabel={collapsedLabel}
              onClick={() => setExpanded((v) => !v)}
            />
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Role progression timeline (promotions inside one company)           */
/* ------------------------------------------------------------------ */

function RoleTimeline({ roles }: { roles: ExperienceRole[] }) {
  return (
    <div className="relative pl-6 flex flex-col gap-8">
      {/* Connecting line between first and last dot */}
      <div className="absolute left-[5px] top-[10px] bottom-[10px] w-[2px] bg-linear-to-b from-gold/60 via-gold/25 to-white/10" />

      {roles.map((role, idx) => {
        const isCurrent = idx === 0;
        const hasHighlights = !!role.highlights && role.highlights.length > 0;
        const previewCount = role.previewCount ?? (isCurrent ? 3 : 0);

        return (
          <div key={role.title + role.period} className="relative">
            {/* Dot */}
            <div
              className={`absolute -left-6 top-[6px] w-3 h-3 rounded-full border-2 ${
                isCurrent
                  ? "bg-gold border-gold shadow-[0_0_12px_rgba(255,215,0,0.7)]"
                  : "bg-[#0a0a0a] border-white/30"
              }`}
            />

            {/* Role header */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-2">
              <span className={`font-bold text-lg md:text-xl ${isCurrent ? "text-gold" : "text-white/90"}`}>
                {role.title}
              </span>
              <span className={`text-sm tracking-wide ${isCurrent ? "text-white/60" : "text-white/40"}`}>
                {role.period}
              </span>
              {isCurrent && roles.length > 1 && (
                <span className="text-[11px] font-bold tracking-widest uppercase bg-gold/15 text-gold px-2.5 py-0.5 rounded-full border border-gold/30">
                  Promoted
                </span>
              )}
            </div>

            {role.summary && (
              <p className={`leading-relaxed mb-4 ${isCurrent ? "text-gray-300 text-base md:text-lg" : "text-white/55 text-base"}`}>
                {role.summary}
              </p>
            )}

            {hasHighlights && (
              <ExpandableHighlights
                items={role.highlights!}
                previewCount={previewCount}
                collapsedLabel={previewCount === 0 ? `See what I did (${role.highlights!.length})` : undefined}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Right-pane detail card                                              */
/* ------------------------------------------------------------------ */

function ExperienceDetail({ exp }: { exp: Experience }) {
  const hasRoles = !!exp.roles && exp.roles.length > 0;

  return (
    <Card className="bg-[#0a0a0a]/60 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group h-full transition-all duration-300 hover:border-white/20 hover:shadow-[0_10px_40px_-10px_rgba(255,215,0,0.1)]">
      {/* Decorative gradients */}
      <div className="absolute inset-0 bg-linear-to-br from-gold/5 via-transparent to-transparent opacity-50" />
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-110" />

      <CardContent className="p-8 md:p-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 gap-6">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">{exp.title}</h3>
            <div className="text-lg md:text-xl font-medium text-gold flex flex-wrap items-center gap-x-2 gap-y-1">
              {exp.website ? (
                <a
                  href={exp.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:underline underline-offset-4 decoration-gold/50"
                >
                  @ {exp.organization}
                  <ExternalLink className="w-4 h-4 opacity-70" />
                </a>
              ) : (
                <span>@ {exp.organization}</span>
              )}
              <span className="text-white/30 hidden md:inline px-1">•</span>
              <span className="text-white/60">{exp.location}</span>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <div className="text-sm font-bold tracking-widest uppercase text-white/70 bg-white/5 py-2.5 px-5 rounded-full border border-white/10 shadow-inner">
              {exp.startDate} — {exp.endDate}
            </div>
            {exp.employmentType && (
              <span className="text-xs tracking-widest uppercase text-white/40 px-2">
                {exp.employmentType}
              </span>
            )}
          </div>
        </div>

        {exp.summary && (
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 md:max-w-3xl">
            {exp.summary}
          </p>
        )}

        {/* Body: either a role timeline or a flat highlight list */}
        <div className="mb-10">
          {hasRoles ? (
            <RoleTimeline roles={exp.roles!} />
          ) : (
            <ExpandableHighlights items={exp.description} previewCount={exp.previewCount ?? 3} />
          )}
        </div>

        <div className="pt-8 border-t border-white/10">
          <p className="text-sm text-white/40 uppercase tracking-widest font-bold mb-5">Tech Stack</p>
          <div className="flex flex-wrap gap-3">
            {exp.techStack.map((tech) => (
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
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

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
        {
          opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power3.out",
          onComplete: () => ScrollTrigger.refresh(),
        }
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
            My professional journey and qualifications, turning complex problems into elegant, scalable solutions.
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
                    {exp.shortName ?? exp.organization}
                  </button>
                );
              })}
            </div>

            {/* Desktop vertical line list */}
            <div className="hidden md:flex flex-col relative border-l border-white/10 pl-6 space-y-2">
              {/* Highlight bar that glides along the border line */}
              <div
                className="absolute left-[-2px] w-[3px] bg-gold transition-transform duration-500 ease-in-out rounded-full shadow-[0_0_15px_rgba(255,215,0,0.8)]"
                style={{
                  transform: `translateY(calc(${activeIndex * 88}px + 20px))`,
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
                    className={`h-[88px] flex flex-col justify-center text-left transition-all duration-300 focus:outline-none group pl-6 pr-4 rounded-r-xl ${isActive ? "bg-white/3" : "hover:bg-white/2"
                      }`}
                  >
                    <span
                      className={`font-bold text-lg tracking-wide transition-colors duration-300 ${isActive ? "text-gold" : "text-white/60 group-hover:text-white"
                        }`}
                    >
                      {exp.shortName ?? exp.organization}
                    </span>
                    <span
                      className={`text-sm transition-colors duration-300 mt-1 ${isActive ? "text-white/80" : "text-white/40 group-hover:text-white/60"
                        }`}
                    >
                      {exp.title}
                    </span>
                    <span className={`text-xs tracking-widest uppercase mt-0.5 ${isActive ? "text-white/40" : "text-white/25"}`}>
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Pane - Content Details */}
          <div className="md:w-2/3 min-h-[450px]">
            <div ref={contentRef} className="h-full">
              {/* Keyed by id so "See more" state resets when switching companies */}
              <ExperienceDetail key={activeExp.id} exp={activeExp} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
