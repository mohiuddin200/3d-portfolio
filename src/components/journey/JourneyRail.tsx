"use client";

import { JOURNEY, JOURNEY_STAGES } from "@/data/journey";

interface JourneyRailProps {
  active: number;
  onSelect: (index: number) => void;
  onOpenFullStack: () => void;
}

export function JourneyRail({ active, onSelect, onOpenFullStack }: JourneyRailProps) {
  const n = JOURNEY_STAGES.length;

  return (
    <nav aria-label="Build stages" className="flex flex-col">
      <ol className="relative flex flex-col gap-1">
        {/* Track + progress line */}
        <span aria-hidden className="absolute left-[11px] top-3 bottom-3 w-px bg-white/10" />
        <span
          aria-hidden
          className="absolute left-[11px] top-3 w-px bg-gold transition-[height] duration-500 ease-out"
          style={{ height: `calc((100% - 1.5rem) * ${n > 1 ? active / (n - 1) : 0})` }}
        />
        {JOURNEY_STAGES.map((s, i) => {
          const isActive = i === active;
          const isDone = i < active;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={isActive ? "step" : undefined}
                data-cursor="hover"
                className="group relative flex items-center gap-3 py-1.5 text-left"
              >
                <span
                  className={`relative z-10 flex size-[23px] items-center justify-center rounded-full border font-mono text-[10px] transition-all duration-300 ${
                    isActive
                      ? "border-gold bg-gold text-black shadow-[0_0_16px_rgba(255,215,0,0.45)]"
                      : isDone
                        ? "border-gold/60 bg-black text-gold"
                        : "border-white/15 bg-black text-white/35 group-hover:border-white/40 group-hover:text-white/70"
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`text-sm transition-colors duration-300 ${
                    isActive ? "text-white" : isDone ? "text-white/60" : "text-white/35 group-hover:text-white/70"
                  }`}
                >
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        onClick={onOpenFullStack}
        data-cursor="hover"
        className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition-colors duration-300 hover:border-gold/60 hover:bg-gold/10 hover:text-white"
      >
        {JOURNEY.cta}
        <span aria-hidden className="text-gold">→</span>
      </button>
    </nav>
  );
}
