"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "motion/react";
import { SiClaude, SiOpenai } from "react-icons/si";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useAnimation } from "@/components/providers/AnimationProvider";
import { ZaiLogo } from "@/components/icons/ZaiLogo";
import {
  AGENTIC,
  AGENTIC_STEPS,
  type AgenticStep,
  type TerminalTone,
} from "@/data/agentic";

const TONE_CLASS: Record<TerminalTone, string> = {
  cmd: "text-white",
  edit: "text-white/60",
  ok: "text-emerald-400",
  warn: "text-amber-400",
  fail: "text-red-400",
  muted: "text-white/35",
  gold: "text-gold",
};

const TOOL_ICONS = {
  "Claude Code": SiClaude,
  Codex: SiOpenai,
  "Z.AI": ZaiLogo,
} as const;

/* ------------------------------------------------------------------ */
/* Terminal                                                            */
/* ------------------------------------------------------------------ */

// Remount with a new `key` to replay the typing animation.
function Terminal({
  step,
  animate,
  className = "",
}: {
  step: AgenticStep;
  animate: boolean;
  className?: string;
}) {
  const lines = step.terminal;
  const [progress, setProgress] = useState(() =>
    animate ? { line: 0, char: 0 } : { line: lines.length, char: 0 }
  );

  useEffect(() => {
    if (!animate) return;

    let line = 0;
    let char = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (line >= lines.length) return;
      const current = lines[line];
      if (current.tone === "cmd" && char < current.text.length) {
        char++;
        setProgress({ line, char });
        timer = setTimeout(tick, 26);
      } else {
        line++;
        char = 0;
        setProgress({ line, char });
        timer = setTimeout(tick, lines[line]?.tone === "cmd" ? 380 : 200);
      }
    };

    timer = setTimeout(tick, 350);
    return () => clearTimeout(timer);
  }, [animate, lines]);

  const done = progress.line >= lines.length;

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(255,215,0,0.15)] overflow-hidden ${className}`}
      aria-label={`Terminal: ${step.terminalTitle}`}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
        <span className="w-3 h-3 rounded-full bg-white/15" />
        <span className="w-3 h-3 rounded-full bg-white/15" />
        <span className="w-3 h-3 rounded-full bg-gold/60" />
        <span className="ml-3 font-mono text-xs text-white/40">{step.terminalTitle}</span>
      </div>
      <div className="p-5 md:p-6 font-mono text-[13px] md:text-sm leading-7">
        {lines.map((l, i) => {
          const isTyping = i === progress.line && l.tone === "cmd";
          if (i > progress.line || (i === progress.line && !isTyping)) return null;
          const text = isTyping ? l.text.slice(0, progress.char) : l.text;

          return (
            <div key={i} className={`whitespace-pre-wrap ${TONE_CLASS[l.tone]}`}>
              {l.tone === "cmd" && <span className="text-gold mr-2">›</span>}
              {text}
              {isTyping && <Caret />}
            </div>
          );
        })}
        {done && (
          <div className="text-white">
            <span className="text-gold mr-2">›</span>
            <Caret />
          </div>
        )}
      </div>
    </div>
  );
}

function Caret() {
  return (
    <span className="inline-block w-2 h-4 -mb-0.5 ml-0.5 bg-gold/80 animate-pulse" />
  );
}

/* ------------------------------------------------------------------ */
/* Step content                                                        */
/* ------------------------------------------------------------------ */

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function StepKicker({ index, text }: { index: number; text: string }) {
  return (
    <p className="font-mono text-xs md:text-sm uppercase tracking-widest text-gold mb-3">
      0{index + 1} · {text}
    </p>
  );
}

function StepContent({ step, animate }: { step: AgenticStep; animate: boolean }) {
  const motionProps = animate
    ? { variants: listVariants, initial: "hidden", animate: "show" }
    : {};
  const item = animate ? { variants: itemVariants } : {};

  if (step.id === "hard-way") {
    return (
      <div>
        <StepKicker index={0} text="2024 · The hard way" />
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-5">Four attempts.</h3>
        <motion.ol {...motionProps} className="space-y-2">
          {AGENTIC.attempts.map((a) => (
            <motion.li
              key={a.n}
              {...item}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5"
            >
              <span className="font-mono text-sm text-white/30">{a.n}</span>
              <span
                className={`flex-1 text-sm md:text-base ${
                  a.tone === "fail" ? "text-white/50 line-through decoration-red-400/50" : "text-white/85"
                }`}
              >
                {a.text}
              </span>
              <span
                className={`shrink-0 text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                  a.tone === "fail"
                    ? "text-red-400 border-red-400/30 bg-red-400/10"
                    : a.tone === "partial"
                      ? "text-amber-400 border-amber-400/30 bg-amber-400/10"
                      : "text-gold border-gold/40 bg-gold/15"
                }`}
              >
                {a.status}
              </span>
            </motion.li>
          ))}
        </motion.ol>
        <p className="mt-4 text-white/50 text-sm md:text-base">{AGENTIC.attemptsTakeaway}</p>
      </div>
    );
  }

  if (step.id === "method") {
    return (
      <div>
        <StepKicker index={1} text="Now · How I build" />
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Structure first. <span className="text-gold">Then speed.</span>
        </h3>
        <motion.ol {...motionProps} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AGENTIC.method.map((m, i) => (
            <motion.li
              key={m.title}
              {...item}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <p className="flex items-center gap-2 font-semibold text-white">
                <span className="font-mono text-xs text-gold">{i + 1}</span>
                {m.title}
              </p>
              <p className="mt-1 text-sm text-white/50">{m.text}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    );
  }

  const { proof } = AGENTIC;
  return (
    <div>
      <StepKicker index={2} text="Proof" />
      <h3 className="text-3xl md:text-5xl font-bold text-white">
        {proof.project}: <span className="text-gold">{proof.headline}</span>
      </h3>
      <p className="mt-3 text-lg text-white/60">{proof.subline}</p>
      <motion.div {...motionProps} className="mt-8 flex gap-10">
        {proof.stats.map((s) => (
          <motion.div key={s.label} {...item}>
            <p className="text-4xl md:text-5xl font-extrabold text-white">{s.value}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-white/40">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
      <Link
        href={`/projects/${proof.slug}`}
        data-cursor="link"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold/90"
      >
        See the case study
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function Header({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "mb-6" : "mb-10"}>
      <h2
        className={`font-extrabold text-white tracking-tight ${
          compact ? "text-4xl xl:text-5xl" : "text-4xl md:text-5xl lg:text-6xl"
        }`}
      >
        {AGENTIC.heading}
        <span className="text-gold">.</span>
      </h2>
      <p className={`mt-3 text-white/70 max-w-3xl ${compact ? "text-lg xl:text-xl" : "text-lg md:text-2xl"}`}>
        {AGENTIC.headline}
      </p>
    </div>
  );
}

function ToolsStrip({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${compact ? "mt-6 pt-4" : "mt-10 pt-6"} flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10`}>
      {AGENTIC.tools.map((tool) => {
        const Icon = TOOL_ICONS[tool.name];
        return (
          <div key={tool.name} className="flex items-center gap-3">
            <Icon className="w-6 h-6 text-white/80" />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">{tool.name}</p>
              <p className="text-[11px] uppercase tracking-widest text-white/40">{tool.role}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StepRail({ active }: { active: number }) {
  return (
    <div className="flex gap-3 mb-6">
      {AGENTIC_STEPS.map((s, i) => (
        <div key={s.id} className="flex-1">
          <div className="h-[3px] rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full bg-gold transition-transform duration-500 origin-left ${
                i <= active ? "scale-x-100 shadow-[0_0_10px_rgba(255,215,0,0.8)]" : "scale-x-0"
              }`}
            />
          </div>
          <p
            className={`mt-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${
              i === active ? "text-gold" : "text-white/35"
            }`}
          >
            0{i + 1} {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function AgenticSection() {
  const { reducedMotion } = useAnimation();
  const pinRef = useRef<HTMLDivElement>(null);
  const pinInView = useInView(pinRef, { amount: 0.5 });
  const [active, setActive] = useState(0);

  // Pin the panel for one extra screen per step; scroll progress picks the active step.
  // (GSAP pin instead of CSS sticky: overflow-x hidden on html/body breaks sticky.)
  useEffect(() => {
    if (reducedMotion || !pinRef.current) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: `+=${(AGENTIC_STEPS.length - 1) * 100}%`,
        pin: true,
        onUpdate: (self) => {
          setActive(Math.min(AGENTIC_STEPS.length - 1, Math.floor(self.progress * AGENTIC_STEPS.length)));
        },
      });
    });

    return () => mm.revert();
  }, [reducedMotion]);

  const step = AGENTIC_STEPS[active];

  return (
    <section id="agentic" className="relative">
      <div className="absolute top-1/3 left-[5%] w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Desktop: pinned scroll story. Wrapper div keeps GSAP's pin-spacer out of React's way. */}
      {!reducedMotion && (
        <div className="hidden lg:block">
          <div ref={pinRef} className="h-screen flex items-center">
            <div className="max-w-7xl mx-auto px-8 w-full pt-20 pb-4">
              <Header compact />
              <div className="grid grid-cols-2 gap-16 items-center">
                <div className="min-h-[380px]">
                  <StepRail active={active} />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                      transition={{ duration: 0.35 }}
                    >
                      <StepContent step={step} animate />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <Terminal
                  key={`${step.id}-${pinInView}`}
                  step={step}
                  animate={pinInView}
                  className="min-h-[320px]"
                />
              </div>
              <ToolsStrip compact />
            </div>
          </div>
        </div>
      )}

      {/* Mobile / reduced motion: stacked, static */}
      <div className={`${reducedMotion ? "" : "lg:hidden"} max-w-7xl mx-auto px-6 lg:px-8 py-24`}>
        <Header />
        <div className="space-y-16">
          {AGENTIC_STEPS.map((s) => (
            <div key={s.id} className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center">
              <StepContent step={s} animate={false} />
              <Terminal step={s} animate={false} />
            </div>
          ))}
        </div>
        <ToolsStrip />
      </div>
    </section>
  );
}
