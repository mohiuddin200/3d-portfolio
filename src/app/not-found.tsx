"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { withSceneLoader } from "@/components/three/SceneLoader";
import { useCursor } from "@/components/providers/CursorProvider";

const Lost404Scene = withSceneLoader(
  () => import("@/components/three/Lost404Scene")
);

const QUIPS = [
  "This page took a wrong turn at the event loop.",
  "Looks like this route got optimized out of the bundle.",
  "404: Page is in another dimension — check the debris field.",
  "Even my Three.js particles can't find this one.",
  "`undefined` is not a page (but here we are).",
  "The server shrugged. Eloquently.",
];

export default function NotFound() {
  const reducedMotion = useReducedMotion() ?? false;
  const { setVariant } = useCursor();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [quipIndex, setQuipIndex] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setQuipIndex(Math.floor(Math.random() * QUIPS.length));
    const id = window.setInterval(() => {
      setQuipIndex((i) => (i + 1) % QUIPS.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        setMouse({
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: -((e.clientY / window.innerHeight) * 2 - 1),
        });
      });
    }
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.14, delayChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const headline = {
    hidden: { opacity: 0, scale: 0.6, filter: "blur(16px)" },
    show: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const linkHover = {
    onMouseEnter: () => setVariant("link"),
    onMouseLeave: () => setVariant("default"),
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-bg-primary">
      <div className="absolute inset-0 z-0">
        <Lost404Scene
          mouseX={mouse.x}
          mouseY={mouse.y}
          reducedMotion={reducedMotion}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.9) 100%)",
        }}
      />

      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 text-center"
      >
        <motion.h1
          variants={headline}
          className="holographic-title holographic-scanlines holographic-flicker text-[clamp(7rem,22vw,16rem)] font-bold leading-none tracking-tight text-gold"
          style={{ textShadow: "0 0 60px rgba(255,215,0,0.35)" }}
        >
          404
        </motion.h1>

        <motion.div
          variants={item}
          className="relative h-16 w-full sm:h-12"
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={quipIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="holographic-subtitle absolute inset-0 flex items-center justify-center text-lg font-medium text-white/90 sm:text-xl"
            >
              {QUIPS[quipIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.p
          variants={item}
          className="max-w-md text-sm text-text-secondary sm:text-base"
        >
          The page you&apos;re looking for doesn&apos;t exist — or it&apos;s
          hiding really well. Try one of these instead.
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link
            href="/"
            {...linkHover}
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-md border border-gold bg-gold px-7 py-3 text-sm font-semibold text-black transition-transform duration-300 hover:scale-[1.03]"
          >
            <span className="relative z-10">← Back to Home</span>
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
          </Link>
          <Link
            href="/#projects"
            {...linkHover}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gold/60 bg-transparent px-7 py-3 text-sm font-semibold text-gold transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:scale-[1.03]"
          >
            View Projects →
          </Link>
        </motion.div>

        <motion.pre
          variants={item}
          className="mt-6 max-w-full overflow-hidden text-left font-mono text-[10px] leading-relaxed text-text-secondary/60 sm:text-xs"
        >
{`Error: Page not found
  at Router.resolve (/pages/¯\\_(ツ)_/¯)
  at You.wander (mohiuddin.me:404:∞)
  at window.history.lostInTheVoid`}
        </motion.pre>
      </motion.section>
    </main>
  );
}
