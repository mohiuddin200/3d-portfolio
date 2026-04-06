"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLoading } from "@/components/providers/LoadingProvider";

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
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
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: 2 + Math.random() * 2,
      opacity: 0.4 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
    });
  }
  return particles;
}

export function LoadingScreen() {
  const { isLoaded } = useLoading();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const [showScreen, setShowScreen] = useState(true);
  const [progress, setProgress] = useState(0);

  // Check sessionStorage before rendering anything
  const [shouldRender] = useState(() => {
    if (typeof window === "undefined") return true;
    return !sessionStorage.getItem("splashShown");
  });

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    const convergeFactor = Math.min(elapsed / 2, 1); // converge over 2 seconds

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;

    // Update particles — lerp toward target positions
    for (const p of particles) {
      p.x += (p.targetX - p.x) * 0.015 * convergeFactor + Math.sin(elapsed * p.speed + p.phase) * (1 - convergeFactor) * 0.5;
      p.y += (p.targetY - p.y) * 0.015 * convergeFactor + Math.cos(elapsed * p.speed + p.phase) * (1 - convergeFactor) * 0.5;
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120 + convergeFactor * 60;

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.3 * convergeFactor;
          ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;
          ctx.lineWidth = 1;
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

    // Update progress
    setProgress(Math.min(elapsed / 2.5, 1));

    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!shouldRender) {
      setShowScreen(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = createParticles(canvas.width, canvas.height);
    };

    resize();
    startTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(animate);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [shouldRender, animate]);

  // When loaded, trigger exit animation then remove
  useEffect(() => {
    if (isLoaded && shouldRender) {
      // Let AnimatePresence handle the exit
      const timer = setTimeout(() => setShowScreen(false), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, shouldRender]);

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {showScreen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
          />

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Initial */}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-7xl font-bold text-[#FFD700]"
              style={{
                textShadow:
                  "0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 215, 0, 0.2)",
              }}
            >
              M
            </motion.span>

            {/* Progress bar */}
            <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#FFD700] rounded-full"
                style={{ width: `${progress * 100}%` }}
                initial={{ width: 0 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
