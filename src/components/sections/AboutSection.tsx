"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { motion } from "motion/react";
import { useSectionInView } from "@/hooks/useSectionInView";
import { Badge } from "@/components/ui/badge";
import { ABOUT } from "@/data/about";

export default function AboutSection() {
  const { ref: sectionRef } = useSectionInView(0.2);
  const photoRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bioRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const learningRefs = useRef<(HTMLDivElement | null)[]>([]);
  const badgeContainerRef = useRef<HTMLDivElement>(null);

  // Parallax effect on photo
  useEffect(() => {
    if (!photoRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        photoRef.current,
        { y: 60 },
        {
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: photoRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Heading animation
  useEffect(() => {
    if (!headingRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
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

  // Bio paragraphs reveal line by line with clip-path
  useEffect(() => {
    const validRefs = bioRefs.current.filter(Boolean);
    if (validRefs.length === 0) return;

    const ctx = gsap.context(() => {
      validRefs.forEach((el, i) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            duration: 1,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            delay: i * 0.15,
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  // Currently Learning items slide from right
  useEffect(() => {
    const validRefs = learningRefs.current.filter(Boolean);
    if (validRefs.length === 0) return;

    const ctx = gsap.context(() => {
      validRefs.forEach((el, i) => {
        gsap.fromTo(
          el,
          { x: 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
            delay: i * 0.1,
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  // Interest badges scale in
  useEffect(() => {
    if (!badgeContainerRef.current) return;

    const badges = badgeContainerRef.current.querySelectorAll("[data-badge]");
    if (badges.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        badges,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.06,
          duration: 0.4,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: badgeContainerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen bg-black py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Photo Area */}
          <div className="flex justify-center lg:justify-end">
            <div
              ref={photoRef}
              className="relative w-72 h-96 sm:w-80 sm:h-[28rem] rounded-2xl border-2 border-[#FFD700] bg-white/5 overflow-hidden"
            >
              {/* Gold gradient overlay decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
              {/* Placeholder content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border-2 border-[#FFD700]/40 mx-auto mb-4 flex items-center justify-center">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FFD700"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <p className="text-white/30 text-sm">Photo</p>
                </div>
              </div>
              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-[#FFD700]/50" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-[#FFD700]/50" />
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-8">
            <h2
              ref={headingRef}
              className="text-4xl sm:text-5xl font-bold text-white"
              style={{ opacity: 0 }}
            >
              {ABOUT.heading}
              <span className="text-[#FFD700]">.</span>
            </h2>

            {/* Bio paragraphs */}
            <div className="space-y-4">
              {ABOUT.bio.map((paragraph, i) => (
                <p
                  key={i}
                  ref={(el) => {
                    bioRefs.current[i] = el;
                  }}
                  className="text-white/70 text-base sm:text-lg leading-relaxed"
                  style={{ opacity: 0 }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Currently Learning */}
            <div>
              <h3 className="text-sm uppercase tracking-widest text-[#FFD700] mb-4 font-semibold">
                Currently Learning
              </h3>
              <div className="space-y-3">
                {ABOUT.currentlyLearning.map((item, i) => (
                  <div
                    key={item}
                    ref={(el) => {
                      learningRefs.current[i] = el;
                    }}
                    className="flex items-center gap-3"
                    style={{ opacity: 0 }}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#FFD700] shrink-0" />
                    <span className="text-white/80 text-sm sm:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <h3 className="text-sm uppercase tracking-widest text-[#FFD700] mb-4 font-semibold">
                Interests
              </h3>
              <div ref={badgeContainerRef} className="flex flex-wrap gap-2">
                {ABOUT.interests.map((interest) => (
                  <Badge
                    key={interest}
                    data-badge
                    variant="outline"
                    className="border-white/20 text-white/70 hover:border-[#FFD700]/50 hover:text-[#FFD700] transition-colors px-3 py-1"
                    style={{ scale: 0, opacity: 0 }}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
