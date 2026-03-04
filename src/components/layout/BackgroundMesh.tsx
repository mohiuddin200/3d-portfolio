"use client";

import { useRef, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DOT_COUNT = 80;
const CONNECTION_DIST = 150; // px distance to draw lines
const DOT_RADIUS = 1.5;
const DRIFT_SPEED = 0.15; // px per frame
const GOLD_R = 255;
const GOLD_G = 215;
const GOLD_B = 0;
const DOT_OPACITY = 0.25;
const LINE_OPACITY = 0.08;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  seed: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BackgroundMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  const initDots = useCallback((w: number, h: number) => {
    const dots: Dot[] = [];
    for (let i = 0; i < DOT_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      dots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * DRIFT_SPEED * (0.5 + Math.random()),
        vy: Math.sin(angle) * DRIFT_SPEED * (0.5 + Math.random()),
        seed: Math.random() * 1000,
      });
    }
    dotsRef.current = dots;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h };

      // Re-init dots if none exist or canvas resized significantly
      if (dotsRef.current.length === 0) {
        initDots(w, h);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    // Check reduced motion preference
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
    };
    motionQuery.addEventListener("change", onMotionChange);

    const animate = () => {
      const { w, h } = sizeRef.current;
      const dots = dotsRef.current;

      ctx.clearRect(0, 0, w, h);

      // Update positions (skip if reduced motion)
      if (!reducedMotion) {
        for (const dot of dots) {
          dot.x += dot.vx;
          dot.y += dot.vy;

          // Wrap around edges with padding
          if (dot.x < -20) dot.x = w + 20;
          if (dot.x > w + 20) dot.x = -20;
          if (dot.y < -20) dot.y = h + 20;
          if (dot.y > h + 20) dot.y = -20;
        }
      }

      // Draw connection lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const alpha = LINE_OPACITY * (1 - dist / CONNECTION_DIST);
            ctx.strokeStyle = `rgba(${GOLD_R},${GOLD_G},${GOLD_B},${alpha})`;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (const dot of dots) {
        ctx.fillStyle = `rgba(${GOLD_R},${GOLD_G},${GOLD_B},${DOT_OPACITY})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, [initDots]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
