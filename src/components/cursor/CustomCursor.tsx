"use client";

import { useEffect, useRef } from "react";
import { useCursor } from "@/components/providers/CursorProvider";
import { useAnimation } from "@/components/providers/AnimationProvider";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function CustomCursor() {
  const { variant } = useCursor();
  const { reducedMotion } = useAnimation();
  const isMobile = useMediaQuery("(pointer: coarse)");

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const isVisible = useRef(false);

  useEffect(() => {
    if (isMobile || reducedMotion) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible.current) {
        isVisible.current = true;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }
    };

    const onMouseLeave = () => {
      isVisible.current = false;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const animate = () => {
      const { x, y } = mousePos.current;

      // Dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      }

      // Ring follows with spring lerp
      ringPos.current.x += (x - ringPos.current.x) * 0.15;
      ringPos.current.y += (y - ringPos.current.y) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, reducedMotion]);

  if (isMobile || reducedMotion) return null;

  const ringStyle = (() => {
    switch (variant) {
      case "link":
        return "scale-150 bg-gold/20 border-gold";
      case "project":
        return "scale-150 rounded-lg border-gold";
      case "text":
        return "scale-y-100 scale-x-50 rounded-sm border-gold";
      default:
        return "border-gold/60";
    }
  })();

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] h-2 w-2 rounded-full bg-gold opacity-0 pointer-events-none mix-blend-difference"
        style={{ willChange: "transform" }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 z-[9999] h-10 w-10 rounded-full border-2 opacity-0 pointer-events-none mix-blend-difference transition-all duration-300 ease-out ${ringStyle}`}
        style={{ willChange: "transform" }}
      />
    </>
  );
}
