"use client";

import { useEffect, useRef } from "react";
import { useCursor } from "@/components/providers/CursorProvider";
import { useAnimation } from "@/components/providers/AnimationProvider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { CursorVariant } from "@/types";

/**
 * Anything the cursor should react to. Elements can opt in or override with
 * `data-cursor="link" | "hover" | "default"`; native interactive elements are
 * picked up automatically so every section behaves the same.
 */
const INTERACTIVE_SELECTOR =
  '[data-cursor], a[href], button, [role="button"], [role="link"], [role="tab"], summary, label, input, select, textarea';

function resolveVariant(target: EventTarget | null): CursorVariant {
  if (!(target instanceof Element)) return "default";
  const el = target.closest<HTMLElement>(INTERACTIVE_SELECTOR);
  if (!el) return "default";

  const explicit = el.dataset.cursor;
  if (explicit === "link" || explicit === "hover" || explicit === "default") {
    return explicit;
  }
  if (el.matches("input, select, textarea")) return "default";
  return "link";
}

export function CustomCursor() {
  const { variant, setVariant } = useCursor();
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

    // One delegated listener decides the variant for the whole page, so links,
    // buttons and cards react identically no matter which component renders them.
    const onMouseOver = (e: MouseEvent) => {
      setVariant(resolveVariant(e.target));
    };

    const onMouseLeave = () => {
      isVisible.current = false;
      setVariant("default");
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const animate = () => {
      const { x, y } = mousePos.current;

      // Dot follows instantly — use left/top to avoid transform conflicts
      if (dotRef.current) {
        dotRef.current.style.left = `${x - 4}px`;
        dotRef.current.style.top = `${y - 4}px`;
      }

      // Ring follows with spring lerp
      ringPos.current.x += (x - ringPos.current.x) * 0.15;
      ringPos.current.y += (y - ringPos.current.y) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x - 20}px`;
        ringRef.current.style.top = `${ringPos.current.y - 20}px`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseleave", onMouseLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, reducedMotion, setVariant]);

  if (isMobile || reducedMotion) return null;

  const ringStyle = (() => {
    switch (variant) {
      case "link":
        return "scale-150 bg-gold/20 border-gold";
      case "hover":
        return "scale-125 bg-gold/10 border-gold";
      default:
        return "border-gold/60";
    }
  })();

  // No blend mode: `mix-blend-difference` turned the gold ring blue/purple over
  // light backgrounds such as project screenshots. A soft shadow keeps it
  // readable on both dark and light surfaces instead.
  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed z-[9999] h-2 w-2 rounded-full bg-gold opacity-0 pointer-events-none shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className={`fixed z-[9999] h-10 w-10 rounded-full border-2 opacity-0 pointer-events-none shadow-[0_0_0_1px_rgba(0,0,0,0.25)] transition-[scale,border-color,background-color] duration-300 ease-out ${ringStyle}`}
      />
    </>
  );
}
