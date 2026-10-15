"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useAnimation } from "@/components/providers/AnimationProvider";
import { JOURNEY, JOURNEY_STAGES } from "@/data/journey";
import { MockApp } from "@/components/journey/MockApp";
import { StageCaption } from "@/components/journey/StageCaption";
import { JourneyRail } from "@/components/journey/JourneyRail";
import { FullStackDialog } from "@/components/journey/FullStackDialog";
import {
  N,
  STAGE_VH,
  buildJourneyTimeline,
  progressForStage,
  softSnap,
  stageForProgress,
} from "@/components/journey/journeyTimeline";

function Header({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "mb-6" : "mb-12"}>
      <h2
        className={`font-extrabold text-white tracking-tight ${
          compact ? "text-4xl xl:text-5xl" : "text-4xl md:text-5xl lg:text-6xl"
        }`}
      >
        {JOURNEY.heading}
        <span className="text-gold">.</span>
      </h2>
      <p className={`mt-3 text-white/60 max-w-2xl ${compact ? "text-base xl:text-lg" : "text-lg md:text-xl"}`}>
        {JOURNEY.subline}
      </p>
    </div>
  );
}

export default function BuildJourneySection() {
  const { reducedMotion } = useAnimation();
  const lenis = useLenis();
  const pinRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const lastStageRef = useRef(0);
  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Desktop: pin the stage and scrub the mock app's timeline with scroll.
  // Layout effect so the initial GSAP state lands before first paint (no wireframe/skin flash).
  // (GSAP pin instead of CSS sticky: overflow-x hidden on html/body breaks sticky.)
  useLayoutEffect(() => {
    if (reducedMotion || !pinRef.current || !frameRef.current) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const tl = buildJourneyTimeline(frameRef.current!);
      triggerRef.current = ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: `+=${N * STAGE_VH}%`,
        pin: true,
        anticipatePin: 1,
        animation: tl,
        scrub: true,
        onUpdate: (self) => {
          const k = stageForProgress(self.progress);
          if (k !== lastStageRef.current) {
            lastStageRef.current = k;
            setActive(k);
          }
          // Soft snap, written through Lenis (the page's only scroll writer):
          // ScrollTrigger's own snap tween is ignored while Lenis is smoothing.
          if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
          snapTimerRef.current = setTimeout(() => {
            snapTimerRef.current = null;
            const p = self.progress;
            const target = softSnap(p);
            if (Math.abs(target - p) < 0.002) return;
            const y = self.start + target * (self.end - self.start);
            const l = lenisRef.current;
            if (l) l.scrollTo(y, { duration: 0.5 });
            else window.scrollTo({ top: y, behavior: "smooth" });
          }, 160);
        },
      });
      return () => {
        triggerRef.current = null;
        if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
      };
    });

    return () => mm.revert();
  }, [reducedMotion]);

  const scrollToStage = useCallback(
    (k: number) => {
      const st = triggerRef.current;
      if (!st) return;
      const y = st.start + progressForStage(k) * (st.end - st.start);
      const distance = Math.abs(k - lastStageRef.current);
      if (lenis) {
        lenis.scrollTo(y, { duration: 0.8 + 0.15 * distance });
      } else {
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    },
    [lenis]
  );

  const stage = JOURNEY_STAGES[active];

  return (
    <section id="skills" className="relative">
      <div className="absolute top-1/3 right-[5%] w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Desktop: pinned scroll story. Wrapper div keeps GSAP's pin-spacer out of React's way. */}
      {!reducedMotion && (
        <div className="hidden lg:block">
          <div ref={pinRef} className="h-screen flex items-center">
            <div className="max-w-7xl mx-auto px-8 w-full pt-20 pb-4">
              <Header compact />
              <div className="grid grid-cols-[2fr_3fr] gap-12 xl:gap-16 items-center">
                <div className="flex gap-8 xl:gap-10 min-h-[380px]">
                  <JourneyRail
                    active={active}
                    onSelect={scrollToStage}
                    onOpenFullStack={() => setDialogOpen(true)}
                  />
                  <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={stage.id}
                        initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                        transition={{ duration: 0.35 }}
                      >
                        <StageCaption stage={stage} index={active} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
                <div className="pr-6 xl:pr-10">
                  <MockApp ref={frameRef} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile / reduced motion: stacked static snapshots */}
      <div className={`${reducedMotion ? "" : "lg:hidden"} max-w-7xl mx-auto px-6 lg:px-8 py-20`}>
        <Header />
        <div className="space-y-14 lg:space-y-20">
          {JOURNEY_STAGES.map((s, i) => (
            <motion.div
              key={s.id}
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
            >
              <StageCaption stage={s} index={i} animate={false} />
              <div className="pr-[6%] pb-[4%]">
                <MockApp stage={i} />
              </div>
            </motion.div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          data-cursor="hover"
          className="mt-12 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white/80 transition-colors duration-300 hover:border-gold/60 hover:bg-gold/10 hover:text-white"
        >
          {JOURNEY.cta}
          <span aria-hidden className="text-gold">→</span>
        </button>
      </div>

      <FullStackDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  );
}
