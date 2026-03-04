"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { motion } from "motion/react";
import { withSceneLoader } from "@/components/three/SceneLoader";
import { useMousePosition } from "@/hooks/useMousePosition";
import { HERO_TITLES, HERO_SUBTITLE } from "@/data/hero";

const HeroSceneLoader = withSceneLoader(
  () => import("@/components/three/HeroScene")
);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition();

  // Character-by-character stagger animation for heading
  useEffect(() => {
    if (!headingRef.current) return;

    const chars = headingRef.current.querySelectorAll(".hero-char");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { opacity: 0, y: 40, rotateX: -90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.04,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.3,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Subtitle fade in after heading
  useEffect(() => {
    if (!subtitleRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          delay: 1.2,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Scroll indicator bounce animation
  useEffect(() => {
    if (!scrollIndicatorRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 2 }
      );
      gsap.to(scrollIndicatorRef.current, {
        y: 12,
        duration: 0.8,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2,
      });
    });

    return () => ctx.revert();
  }, []);

  // ScrollTrigger: fade out section as user scrolls down
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        animation: gsap.to(sectionRef.current, {
          opacity: 0,
          y: -80,
          ease: "none",
        }),
      });
    });

    return () => ctx.revert();
  }, []);

  const title = HERO_TITLES[0];

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* 3D Scene Background */}
      <HeroSceneLoader
        mouseX={mouse.normalizedX}
        mouseY={mouse.normalizedY}
        className="z-0"
      />

      {/* Overlay content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center max-w-7xl mx-auto px-6">
        <h1
          ref={headingRef}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white text-center leading-tight"
          style={{ perspective: "600px" }}
        >
          {title.split("").map((char, i) => (
            <span
              key={i}
              className="hero-char inline-block"
              style={{
                opacity: 0,
                color: char === " " ? undefined : undefined,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        <p
          ref={subtitleRef}
          className="mt-6 text-lg sm:text-xl md:text-2xl text-white/70 text-center max-w-2xl"
          style={{ opacity: 0 }}
        >
          {HERO_SUBTITLE}
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="mt-10 flex gap-4"
        >
          <a
            href="#projects"
            className="rounded-full border-2 border-[#FFD700] bg-[#FFD700]/10 px-8 py-3 text-sm font-semibold text-[#FFD700] transition-colors hover:bg-[#FFD700]/20"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="rounded-full border-2 border-white/30 px-8 py-3 text-sm font-semibold text-white transition-colors hover:border-white/60"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ opacity: 0 }}
      >
        <span className="text-xs uppercase tracking-widest text-white/50">
          Scroll
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#FFD700]"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
