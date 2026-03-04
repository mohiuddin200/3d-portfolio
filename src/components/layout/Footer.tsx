"use client";

import { useCallback } from "react";
import { useLenis } from "lenis/react";
import { useCursor } from "@/components/providers/CursorProvider";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const lenis = useLenis();
  const { setVariant } = useCursor();

  const scrollToTop = useCallback(() => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [lenis]);

  const handleMouseEnter = useCallback(() => {
    setVariant("link");
  }, [setVariant]);

  const handleMouseLeave = useCallback(() => {
    setVariant("default");
  }, [setVariant]);

  return (
    <footer className="border-t border-white/10">
      <div className="max-w-7xl mx-auto py-8 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-white/50">
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span>Built with Next.js, Three.js &amp; GSAP</span>
        </div>

        <button
          onClick={scrollToTop}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white/50 hover:text-[#FFD700] transition-colors duration-300 rounded-full border border-white/10 hover:border-[#FFD700]/30"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
          Back to top
        </button>
      </div>
    </footer>
  );
}
