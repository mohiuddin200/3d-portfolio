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
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] sm:max-w-5xl max-h-[88vh] overflow-y-auto gap-0 border-white/10 bg-bg-secondary p-6 sm:p-8 [&>button]:top-4 [&>button]:right-4 [&>button]:rounded-full [&>button]:bg-black/70 [&>button]:p-1.5 [&>button]:text-white [&>button]:opacity-100 [&>button]:hover:bg-gold [&>button]:hover:text-black">
        <DialogTitle className="text-2xl sm:text-3xl font-bold text-white">
          Full stack<span className="text-gold">.</span>
        </DialogTitle>
        <DialogDescription className="text-white/50 mb-6">
          Every technology, framework and tool I work with.
        </DialogDescription>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
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
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
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

        {/* Skills Grid */}
        <motion.div layout className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => (
              <motion.div
                layout
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, delay: index * 0.02, ease: "easeOut" }}
                className="group relative rounded-xl border border-white/10 bg-black/40 p-3 flex flex-col items-center text-center hover:border-gold/40 transition-colors duration-300"
              >
                <div className="mb-2 p-2.5 rounded-lg bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors duration-300">
                  <TechIcon name={skill.name} className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-white text-xs sm:text-sm font-medium mb-0.5">{skill.name}</h3>
                <p className="text-white/40 text-[10px] uppercase tracking-wider">
                  {SKILL_CATEGORIES.find((c) => c.id === skill.category)?.label}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
