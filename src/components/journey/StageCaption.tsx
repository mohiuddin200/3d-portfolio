"use client";

import { motion } from "motion/react";
import type { JourneyStage } from "@/data/journey";
import { TechIcon } from "@/data/skill-icons";

interface StageCaptionProps {
  stage: JourneyStage;
  index: number;
  animate?: boolean;
  className?: string;
}

export function StageCaption({ stage, index, animate = true, className = "" }: StageCaptionProps) {
  return (
    <div className={className}>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold mb-3">
        0{index + 1} · {stage.label}
      </p>
      <h3 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">{stage.title}</h3>
      <p className="text-white/55 text-base lg:text-lg leading-relaxed max-w-md mb-6">{stage.line}</p>
      <ul className="flex flex-wrap gap-2">
        {stage.techs.map((tech, i) => (
          <motion.li
            key={`${stage.id}-${tech}`}
            initial={animate ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: animate ? 0.15 + i * 0.06 : 0 }}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80"
          >
            <TechIcon name={tech} className="size-3.5 text-gold" />
            {tech}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
