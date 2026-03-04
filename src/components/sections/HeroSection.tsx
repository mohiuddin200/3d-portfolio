"use client";

import { useRef, useEffect, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { motion, AnimatePresence } from "motion/react";
import { withSceneLoader } from "@/components/three/SceneLoader";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useAnimation } from "@/components/providers/AnimationProvider";
import { HERO_TITLES, HERO_SUBTITLE } from "@/data/hero";

const HeroSceneLoader = withSceneLoader(
  () => import("@/components/three/HeroScene")
);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition();
  const { reducedMotion } = useAnimation();

  const [titleIndex, setTitleIndex] = useState(0);

  // Rotating title
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % HERO_TITLES.length);
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  // Character-by-character stagger animation for name
  useEffect(() => {
    if (!nameRef.current) return;

    const chars = nameRef.current.querySelectorAll(".name-char");

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

  // Subtitle fade in after name
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

  const name = "Mohiuddin";

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
        reducedMotion={reducedMotion}
        className="z-0"
      />

      {/* Overlay content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center max-w-7xl mx-auto px-6 pointer-events-none">
        <div className="flex flex-col items-center justify-center pointer-events-auto">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FFD700]/20 bg-[#FFD700]/5 px-4 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(255,215,0,0.1)]"
          >
            <span className="h-2 w-2 rounded-full bg-[#FFD700] animate-pulse"></span>
            <span className="text-sm font-medium text-white/80 tracking-wide uppercase">Hello, I&apos;m</span>
          </motion.div>

          {/* Name */}
          <div className="relative holographic-scanlines">
            <h1
              ref={nameRef}
              className="holographic-title holographic-flicker text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white text-center leading-tight tracking-tight mb-2"
              style={{ perspective: "800px" }}
            >
              {name.split("").map((char, i) => (
                <motion.span
                  key={i}
                  className="name-char inline-block cursor-pointer"
                  style={{
                    opacity: 0,
                    color: char === " " ? undefined : undefined,
                  }}
                  whileHover={{
                    y: -10,
                    color: "#FFD700",
                    scale: 1.1,
                    rotate: [-5, 3, -2, 4, -4, 2, -3, 5, -1][i % 9],
                    transition: { duration: 0.2 },
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </h1>
          </div>

          {/* Rotating Title */}
          <div className="h-12 sm:h-16 md:h-20 flex items-center justify-center overflow-hidden mb-8">
            <AnimatePresence mode="wait">
              <motion.h2
                key={titleIndex}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-2xl sm:text-3xl md:text-5xl font-semibold text-white/90 text-center holographic-subtitle"
              >
                {HERO_TITLES[titleIndex]}
              </motion.h2>
            </AnimatePresence>
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-base sm:text-lg md:text-xl text-white/80 text-center max-w-2xl font-light"
            style={{ opacity: 0 }}
          >
            {HERO_SUBTITLE}
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#projects"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-[#FFD700] bg-[#FFD700]/10 px-8 py-3.5 text-sm font-semibold text-[#FFD700] transition-colors hover:bg-[#FFD700]/20"
            >
              <span className="relative z-10">View My Work</span>
              <div className="absolute inset-0 z-0 h-full w-0 bg-[#FFD700] transition-all duration-300 ease-out group-hover:w-full opacity-10"></div>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-white/60 hover:bg-white/5"
            >
              Get in Touch
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-auto"
        style={{ opacity: 0 }}
      >
        <span className="text-xs uppercase tracking-widest text-white/40 font-medium">
          Scroll
        </span>
        <div className="p-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
          <svg
            width="20"
            height="20"
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
      </div>
    </section>
  );
}
