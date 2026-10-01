"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    gsap.set(bar, { scaleX: 0 });
    // One reusable tween instead of a new gsap.to() on every scroll event
    const setScale = gsap.quickTo(bar, "scaleX", { duration: 0.1, ease: "none" });

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScale(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
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
