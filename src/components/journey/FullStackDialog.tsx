"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLenis } from "lenis/react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SKILLS, SKILL_CATEGORIES } from "@/data/skills";
import { TechIcon } from "@/data/skill-icons";

interface FullStackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FullStackDialog({ open, onOpenChange }: FullStackDialogProps) {
  const lenis = useLenis();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredSkills =
    activeCategory === "all" ? SKILLS : SKILLS.filter((s) => s.category === activeCategory);

  // Radix locks body scroll; Lenis must agree or wheel events keep moving the page.
  // Driven by `open` so it covers both the external trigger and Radix's own close paths.
  useEffect(() => {
    if (!lenis || !open) return;
    lenis.stop();
    return () => lenis.start();
  }, [lenis, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-lenis-prevent className="w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] sm:max-w-3xl max-h-[80vh] overflow-y-auto gap-0 border-white/10 bg-bg-secondary p-5 sm:p-6 [&>button]:top-4 [&>button]:right-4 [&>button]:rounded-full [&>button]:bg-black/70 [&>button]:p-1.5 [&>button]:text-white [&>button]:opacity-100 [&>button]:hover:bg-gold [&>button]:hover:text-black">
        <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
          Full stack<span className="text-gold">.</span>
        </DialogTitle>
        <DialogDescription className="text-white/50 text-sm mb-4">
          Every technology, framework and tool I work with.
        </DialogDescription>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
              activeCategory === "all"
                ? "bg-gold text-black border-gold shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            All
          </button>
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
                activeCategory === cat.id
                  ? "bg-white/10 text-white border-gold shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                  : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_#FFD700]" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills list: compact icon + name rows */}
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => (
              <motion.div
                layout
                key={skill.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.015, ease: "easeOut" }}
                className="group flex items-center gap-2.5 rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 hover:border-gold/40 transition-colors duration-300"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors duration-300">
                  <TechIcon name={skill.name} className="size-4 text-gold" />
                </span>
                <span className="text-white text-xs sm:text-sm font-medium truncate">{skill.name}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
