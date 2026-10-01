"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLoading } from "@/components/providers/LoadingProvider";
import { splashStartTime, useSplashShown } from "@/lib/splash";

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  opacity: number;
  phase: number;
  speed: number;
}

function createParticles(width: number, height: number): Particle[] {
  const particles: Particle[] = [];
  const cx = width / 2;
  const cy = height / 2;
  const count = 20;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const targetRadius = 60 + Math.random() * 40;
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      targetX: cx + Math.cos(angle) * targetRadius,
      targetY: cy + Math.sin(angle) * targetRadius - 30,
      size: 2 + Math.random() * 2,
      opacity: 0.4 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
    });
  }
  return particles;
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  elapsed: number
) {
  const canvas = ctx.canvas;
  const convergeFactor = Math.min(elapsed / 2, 1); // converge over 2 seconds

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update particles — lerp toward target positions
  for (const p of particles) {
    p.x +=
      (p.targetX - p.x) * 0.015 * convergeFactor +
      Math.sin(elapsed * p.speed + p.phase) * (1 - convergeFactor) * 0.5;
    p.y +=
      (p.targetY - p.y) * 0.015 * convergeFactor +
      Math.cos(elapsed * p.speed + p.phase) * (1 - convergeFactor) * 0.5;
  }

  // Draw connections
  const maxDist = 120 + convergeFactor * 60;
  ctx.lineWidth = 1;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.3 * convergeFactor;
        ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  // Draw particles
  for (const p of particles) {
    const pulse = 0.7 + 0.3 * Math.sin(elapsed * 2 + p.phase);
    ctx.fillStyle = `rgba(255, 215, 0, ${p.opacity * pulse})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    // Glow
    ctx.fillStyle = `rgba(255, 215, 0, ${p.opacity * pulse * 0.2})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Full-screen splash shown once per tab.
 *
 * The "M" and the progress bar are server-rendered and animated with CSS, so
 * they paint with the very first frame of the page instead of waiting for
 * JavaScript. Only the particle canvas and the exit fade need React.
 */
export function LoadingScreen() {
  const { isLoaded } = useLoading();
  const splashShown = useSplashShown();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showScreen, setShowScreen] = useState(true);

  // Particle canvas — plain rAF loop, no React state per frame
  useEffect(() => {
    if (splashShown) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let frame = 0;
    const start = splashStartTime();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = createParticles(canvas.width, canvas.height);
    };

    const tick = () => {
      drawFrame(ctx, particles, (performance.now() - start) / 1000);
      frame = requestAnimationFrame(tick);
    };

    resize();
    frame = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [splashShown]);

  // When loaded, trigger exit animation then remove
  useEffect(() => {
    if (!isLoaded || splashShown) return;
    const timer = setTimeout(() => setShowScreen(false), 100);
    return () => clearTimeout(timer);
  }, [isLoaded, splashShown]);

  if (splashShown) return null;

  return (
    <AnimatePresence>
      {showScreen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="splash-screen fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black"
        >
          <canvas ref={canvasRef} className="absolute inset-0" />

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Initial */}
            <span
              className="splash-initial text-7xl font-bold text-[#FFD700]"
              style={{
                textShadow:
                  "0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 215, 0, 0.2)",
              }}
            >
              M
            </span>

            {/* Progress bar */}
            <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div className="splash-progress h-full w-full bg-[#FFD700] rounded-full" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
