"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;

    gsap.set(barRef.current, { scaleX: 0 });

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      gsap.to(barRef.current, {
        scaleX: progress,
        duration: 0.1,
        ease: "none",
      });
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 w-full h-[3px] bg-[#FFD700] z-[60] origin-left pointer-events-none"
      role="progressbar"
      aria-label="Page scroll progress"
    />
  );
}
