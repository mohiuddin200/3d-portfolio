"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useSectionInView } from "@/hooks/useSectionInView";
import { useCursor } from "@/components/providers/CursorProvider";
import { Badge } from "@/components/ui/badge";
import { ABOUT } from "@/data/about";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  type PanInfo,
} from "motion/react";

/* ------------------------------------------------------------------ */
/* Animated Counter                                                    */
/* ------------------------------------------------------------------ */
function AnimatedCounter({
  target,
  suffix,
  triggered,
}: {
  target: number;
  suffix: string;
  triggered: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!triggered) return;

    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: target,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => setCount(Math.round(obj.val)),
    });

    return () => {
      tween.kill();
    };
  }, [triggered, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Tinder-Style Swipeable Photo Stack                                  */
/* ------------------------------------------------------------------ */
function SwipePhotoStack({ photos }: { photos: readonly { src: string; label: string }[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitX, setExitX] = useState(0);

  const activeIndex = currentIndex % photos.length;

  const handleSwipe = useCallback(
    (direction: number) => {
      setExitX(direction > 0 ? 300 : -300);
      setCurrentIndex((prev) => prev + 1);
    },
    []
  );

  // Indices for stacked cards behind the top one
  const nextIndex = (currentIndex + 1) % photos.length;
  const thirdIndex = (currentIndex + 2) % photos.length;

  return (
    <div className="relative w-72 h-96 sm:w-80 sm:h-[28rem]">
      {/* Dots indicator */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
        {photos.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeIndex === i
                ? "bg-[#FFD700] scale-125 shadow-[0_0_8px_rgba(255,215,0,0.6)]"
                : "bg-white/20"
            }`}
          />
        ))}
      </div>

      {/* Background card (3rd) — fanned out right */}
      {photos.length > 2 && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-[#0a0a0a] border border-white/10 overflow-hidden shadow-xl"
          animate={{ rotate: 6, scale: 0.92, x: 16, y: 4 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{ zIndex: 1, transformOrigin: "bottom center" }}
        >
          <img
            src={photos[thirdIndex].src}
            alt={photos[thirdIndex].label}
            className="w-full h-full object-cover opacity-40"
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      )}

      {/* Middle card (2nd) — fanned out slightly */}
      {photos.length > 1 && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-[#0a0a0a] border border-white/15 overflow-hidden shadow-xl"
          animate={{ rotate: -4, scale: 0.96, x: -10, y: 2 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{ zIndex: 2, transformOrigin: "bottom center" }}
        >
          <img
            src={photos[nextIndex].src}
            alt={photos[nextIndex].label}
            className="w-full h-full object-cover opacity-60"
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      )}

      {/* Top card — draggable */}
      <AnimatePresence mode="popLayout">
        <SwipeCard
          key={currentIndex}
          card={photos[activeIndex]}
          exitX={exitX}
          onSwipe={handleSwipe}
        />
      </AnimatePresence>
    </div>
  );
}

function SwipeCard({
  card,
  exitX,
  onSwipe,
}: {
  card: { src: string; label: string };
  exitX: number;
  onSwipe: (direction: number) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const cardOpacity = useTransform(x, [-200, -150, 0, 150, 200], [0.6, 1, 1, 1, 0.6]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 80;
    const velocityThreshold = 400;

    if (
      Math.abs(info.offset.x) > threshold ||
      Math.abs(info.velocity.x) > velocityThreshold
    ) {
      onSwipe(info.offset.x > 0 ? 1 : -1);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 rounded-2xl border-2 border-[#FFD700]/80 bg-[#0a0a0a] overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{
        x,
        rotate,
        opacity: cardOpacity,
        zIndex: 10,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{
        x: exitX,
        opacity: 0,
        rotate: exitX > 0 ? 15 : -15,
        transition: { duration: 0.35, ease: "easeIn" },
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      whileDrag={{ scale: 1.02 }}
    >
      <img
        src={card.src}
        alt={card.label}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 pointer-events-none" />

      {/* Label */}
      <div className="absolute bottom-5 left-5 right-5 pointer-events-none">
        <p className="text-white font-semibold text-lg drop-shadow-lg">{card.label}</p>
      </div>

      {/* Corner accents */}
      <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-[#FFD700]/40 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-[#FFD700]/40 pointer-events-none" />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* About Section                                                       */
/* ------------------------------------------------------------------ */
export default function AboutSection() {
  const { ref: sectionRef } = useSectionInView(0.2);
  const { setVariant } = useCursor();
  const photoRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bioRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);
  const bottomGridRef = useRef<HTMLDivElement>(null);
  const learningRefs = useRef<(HTMLDivElement | null)[]>([]);
  const languageRef = useRef<HTMLDivElement>(null);
  const badgeContainerRef = useRef<HTMLDivElement>(null);

  const [statsTriggered, setStatsTriggered] = useState(false);
  const [activeLearningIndex, setActiveLearningIndex] = useState<number | null>(
    null
  );

  /* ---- Parallax photo ---- */
  useEffect(() => {
    if (!photoRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(photoRef.current, { y: 60 }, {
        y: -60,
        ease: "none",
        scrollTrigger: { trigger: photoRef.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);

  /* ---- Heading ---- */
  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 85%", toggleActions: "play none none none" },
      });
    });
    return () => ctx.revert();
  }, []);

  /* ---- Bio clip-path reveal ---- */
  useEffect(() => {
    const valid = bioRefs.current.filter(Boolean);
    if (valid.length === 0) return;
    const ctx = gsap.context(() => {
      valid.forEach((el, i) => {
        gsap.fromTo(el, { clipPath: "inset(0 100% 0 0)", opacity: 0 }, {
          clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 1, ease: "power3.inOut",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          delay: i * 0.15,
        });
      });
    });
    return () => ctx.revert();
  }, []);

  /* ---- Stats entrance + counter trigger ---- */
  useEffect(() => {
    if (!statsRef.current) return;
    const ctx = gsap.context(() => {
      const items = statsRef.current!.querySelectorAll("[data-stat-item]");
      gsap.fromTo(items, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out",
        scrollTrigger: {
          trigger: statsRef.current, start: "top 85%", toggleActions: "play none none none",
          onEnter: () => setStatsTriggered(true),
        },
      });
    });
    return () => ctx.revert();
  }, []);

  /* ---- Bottom grid columns fade up ---- */
  useEffect(() => {
    if (!bottomGridRef.current) return;
    const ctx = gsap.context(() => {
      const cols = bottomGridRef.current!.querySelectorAll("[data-col]");
      gsap.fromTo(cols, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.15, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: bottomGridRef.current, start: "top 85%", toggleActions: "play none none none" },
      });
    });
    return () => ctx.revert();
  }, []);

  /* ---- Currently Learning slide-in ---- */
  useEffect(() => {
    const valid = learningRefs.current.filter(Boolean);
    if (valid.length === 0) return;
    const ctx = gsap.context(() => {
      valid.forEach((el, i) => {
        gsap.fromTo(el, { x: 40, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
          delay: i * 0.08,
        });
      });
    });
    return () => ctx.revert();
  }, []);

  /* ---- Language bars ---- */
  useEffect(() => {
    if (!languageRef.current) return;
    const ctx = gsap.context(() => {
      const bars = languageRef.current!.querySelectorAll("[data-lang-bar]");
      gsap.fromTo(bars, { scaleX: 0 }, {
        scaleX: 1, stagger: 0.12, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: languageRef.current, start: "top 85%", toggleActions: "play none none none" },
      });
    });
    return () => ctx.revert();
  }, []);

  /* ---- Interest badges ---- */
  useEffect(() => {
    if (!badgeContainerRef.current) return;
    const badges = badgeContainerRef.current.querySelectorAll("[data-badge]");
    if (badges.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(badges, { scale: 0, opacity: 0 }, {
        scale: 1, opacity: 1, stagger: 0.05, duration: 0.35, ease: "back.out(1.7)",
        scrollTrigger: { trigger: badgeContainerRef.current, start: "top 85%", toggleActions: "play none none none" },
      });
    });
    return () => ctx.revert();
  }, []);

  const handleLearningHover = useCallback(
    (index: number | null) => {
      setActiveLearningIndex(index);
      setVariant(index !== null ? "link" : "default");
    },
    [setVariant]
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* ====== Top: Photo + Bio (balanced 2-col) ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Swipeable Photo Stack */}
          <div className="flex justify-center lg:justify-end">
            <div ref={photoRef} className="pb-10">
              <SwipePhotoStack photos={ABOUT.photos} />
            </div>
          </div>

          {/* Bio — only heading + paragraphs (matches photo height) */}
          <div className="space-y-6">
            <h2
              ref={headingRef}
              className="text-4xl sm:text-5xl font-bold text-white"
              style={{ opacity: 0 }}
            >
              {ABOUT.heading}
              <span className="text-[#FFD700]">.</span>
            </h2>

            <div className="space-y-4">
              {ABOUT.bio.map((paragraph, i) => (
                <p
                  key={i}
                  ref={(el) => { bioRefs.current[i] = el; }}
                  className="text-white/70 text-base sm:text-lg leading-relaxed"
                  style={{ opacity: 0 }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* ====== Stats Row (full width) ====== */}
        <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16">
          {ABOUT.stats.map((stat) => (
            <div
              key={stat.label}
              data-stat-item
              className="group relative p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#FFD700]/30 hover:bg-[#FFD700]/[0.04] transition-all duration-300 text-center cursor-default"
              style={{ opacity: 0 }}
              onMouseEnter={() => setVariant("text")}
              onMouseLeave={() => setVariant("default")}
            >
              <div className="text-3xl sm:text-4xl font-bold text-[#FFD700] tabular-nums">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} triggered={statsTriggered} />
              </div>
              <div className="text-xs text-white/40 mt-1.5 uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ====== Bottom: 3-column detail grid ====== */}
        <div
          ref={bottomGridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16"
        >
          {/* Currently Exploring */}
          <div data-col style={{ opacity: 0 }}>
            <h3 className="text-sm uppercase tracking-widest text-[#FFD700] mb-4 font-semibold">
              Currently Exploring
            </h3>
            <div className="space-y-1.5">
              {ABOUT.currentlyLearning.map((item, i) => (
                <div
                  key={item}
                  ref={(el) => { learningRefs.current[i] = el; }}
                  className={`group flex items-center gap-3 p-2.5 -mx-2.5 rounded-lg transition-all duration-300 cursor-default ${
                    activeLearningIndex === i ? "bg-[#FFD700]/[0.06]" : "hover:bg-white/[0.03]"
                  }`}
                  style={{ opacity: 0 }}
                  onMouseEnter={() => handleLearningHover(i)}
                  onMouseLeave={() => handleLearningHover(null)}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300 ${
                      activeLearningIndex === i
                        ? "bg-[#FFD700] scale-150 shadow-[0_0_8px_rgba(255,215,0,0.5)]"
                        : "bg-[#FFD700]/60 group-hover:bg-[#FFD700]"
                    }`}
                  />
                  <span
                    className={`text-sm transition-colors duration-300 ${
                      activeLearningIndex === i ? "text-white" : "text-white/60 group-hover:text-white/80"
                    }`}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div data-col ref={languageRef} style={{ opacity: 0 }}>
            <h3 className="text-sm uppercase tracking-widest text-[#FFD700] mb-4 font-semibold">
              Languages
            </h3>
            <div className="space-y-3">
              {ABOUT.languages.map((lang) => (
                <div key={lang.name} className="group cursor-default">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">
                      {lang.name}
                    </span>
                    <span className="text-white/30 text-xs uppercase tracking-wider group-hover:text-[#FFD700]/60 transition-colors">
                      {lang.level}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      data-lang-bar
                      className="h-full rounded-full origin-left bg-gradient-to-r from-[#FFD700] to-[#FFD700]/50"
                      style={{ width: `${lang.proficiency}%`, transform: "scaleX(0)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div data-col style={{ opacity: 0 }}>
            <h3 className="text-sm uppercase tracking-widest text-[#FFD700] mb-4 font-semibold">
              Interests
            </h3>
            <div ref={badgeContainerRef} className="flex flex-wrap gap-2">
              {ABOUT.interests.map((interest) => (
                <Badge
                  key={interest}
                  data-badge
                  variant="outline"
                  className="border-white/20 text-white/60 hover:border-[#FFD700]/50 hover:text-[#FFD700] hover:bg-[#FFD700]/[0.06] hover:scale-105 transition-all duration-300 px-3 py-1 cursor-default"
                  style={{ transform: "scale(0)", opacity: 0 }}
                  onMouseEnter={() => setVariant("text")}
                  onMouseLeave={() => setVariant("default")}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
