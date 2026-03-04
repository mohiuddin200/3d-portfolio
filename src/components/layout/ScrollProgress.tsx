"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;

    gsap.set(barRef.current, { scaleX: 0 });

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
      onUpdate: (self) => {
        gsap.to(barRef.current, {
          scaleX: self.progress,
          duration: 0.1,
          ease: "none",
        });
      },
    });

    return () => {
      trigger.kill();
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
