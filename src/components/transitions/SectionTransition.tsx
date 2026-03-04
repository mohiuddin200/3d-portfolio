"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type TransitionType =
  | "parallax-fade"
  | "slide-up"
  | "gold-wipe"
  | "scale-fade"
  | "parallax-layers";

interface SectionTransitionProps {
  type: TransitionType;
  className?: string;
}

export function SectionTransition({
  type,
  className = "",
}: SectionTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const el = containerRef.current;
      if (!el) return;

      switch (type) {
        case "parallax-fade":
          setupParallaxFade(el);
          break;
        case "slide-up":
          setupSlideUp(el);
          break;
        case "gold-wipe":
          setupGoldWipe(el);
          break;
        case "scale-fade":
          setupScaleFade(el);
          break;
        case "parallax-layers":
          setupParallaxLayers(el);
          break;
      }
    }, containerRef);

    return () => ctx.revert();
  }, [type]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ height: getHeight(type) }}
    >
      {renderContent(type)}
    </div>
  );
}

function getHeight(type: TransitionType): string {
  switch (type) {
    case "parallax-layers":
      return "200px";
    case "gold-wipe":
      return "120px";
    default:
      return "150px";
  }
}

function renderContent(type: TransitionType) {
  switch (type) {
    case "parallax-fade":
      return (
        <div
          data-transition="parallax-fade"
          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.03] to-transparent"
        />
      );

    case "slide-up":
      return (
        <div
          data-transition="slide-up"
          className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-white/[0.05] to-transparent"
        />
      );

    case "gold-wipe":
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            data-transition="gold-wipe"
            className="w-full h-[2px] bg-[#FFD700]/40 origin-left"
          />
        </div>
      );

    case "scale-fade":
      return (
        <div
          data-transition="scale-fade"
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-2 h-2 rounded-full bg-[#FFD700]/30" />
        </div>
      );

    case "parallax-layers":
      return (
        <>
          <div
            data-layer="1"
            className="absolute inset-x-0 top-[30%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />
          <div
            data-layer="2"
            className="absolute inset-x-0 top-[50%] h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent"
          />
          <div
            data-layer="3"
            className="absolute inset-x-0 top-[70%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />
        </>
      );

    default:
      return null;
  }
}

// --- Animation setup functions ---

function setupParallaxFade(el: HTMLElement) {
  const inner = el.querySelector('[data-transition="parallax-fade"]');
  if (!inner) return;

  gsap.fromTo(
    inner,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: -30,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
}

function setupSlideUp(el: HTMLElement) {
  const inner = el.querySelector('[data-transition="slide-up"]');
  if (!inner) return;

  gsap.fromTo(
    inner,
    { yPercent: 100 },
    {
      yPercent: 0,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom 60%",
        scrub: true,
      },
    }
  );
}

function setupGoldWipe(el: HTMLElement) {
  const inner = el.querySelector('[data-transition="gold-wipe"]');
  if (!inner) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });

  tl.fromTo(inner, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 0.5 });
  tl.to(inner, {
    scaleX: 0,
    transformOrigin: "right center",
    ease: "none",
    duration: 0.5,
  });
}

function setupScaleFade(el: HTMLElement) {
  const inner = el.querySelector('[data-transition="scale-fade"]');
  if (!inner) return;

  const dot = inner.querySelector("div");
  if (!dot) return;

  gsap.fromTo(
    dot,
    { scale: 1, opacity: 0 },
    {
      scale: 40,
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom 60%",
        scrub: true,
      },
    }
  );

  gsap.fromTo(
    dot,
    { opacity: 1 },
    {
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "center center",
        end: "bottom top",
        scrub: true,
      },
    }
  );
}

function setupParallaxLayers(el: HTMLElement) {
  const layers = [
    { selector: '[data-layer="1"]', speed: -20 },
    { selector: '[data-layer="2"]', speed: -40 },
    { selector: '[data-layer="3"]', speed: -60 },
  ];

  layers.forEach(({ selector, speed }) => {
    const layer = el.querySelector(selector);
    if (!layer) return;

    gsap.fromTo(
      layer,
      { y: -speed },
      {
        y: speed,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });
}
