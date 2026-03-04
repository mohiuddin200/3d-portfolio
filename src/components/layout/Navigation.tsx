"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useCursor } from "@/components/providers/CursorProvider";
import { NAV_ITEMS } from "@/lib/constants";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const lenis = useLenis();
  const { setVariant } = useCursor();

  // Show/hide nav based on scroll position (appear after hero ~100vh)
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        const scrollY = self.scroll();
        const heroHeight = window.innerHeight;
        setVisible(scrollY > heroHeight * 0.85);
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Track active section with IntersectionObserver
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        {
          rootMargin: "-40% 0px -40% 0px",
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  // Animate nav visibility
  useEffect(() => {
    if (!navRef.current) return;

    gsap.to(navRef.current, {
      y: visible ? 0 : -100,
      opacity: visible ? 1 : 0,
      duration: 0.4,
      ease: "power2.out",
    });
  }, [visible]);

  const handleNavClick = useCallback(
    (href: string) => {
      setMobileOpen(false);
      if (lenis) {
        lenis.scrollTo(href, { offset: -80, duration: 1.2 });
      } else {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [lenis]
  );

  const handleMouseEnter = useCallback(() => {
    setVariant("link");
  }, [setVariant]);

  const handleMouseLeave = useCallback(() => {
    setVariant("default");
  }, [setVariant]);

  return (
    <nav
      ref={navRef}
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 opacity-0 -translate-y-[100px]"
      aria-label="Main navigation"
    >
      {/* Desktop navigation */}
      <div className="hidden md:flex items-center gap-1 px-2 py-2 backdrop-blur-lg bg-black/50 border border-white/10 rounded-full">
        {NAV_ITEMS.map((item) => {
          const sectionId = item.href.replace("#", "");
          const isActive = activeSection === sectionId;

          return (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full ${
                isActive
                  ? "text-[#FFD700]"
                  : "text-white/70 hover:text-white"
              }`}
              aria-current={isActive ? "true" : undefined}
            >
              {item.label}
              {isActive && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#FFD700] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile hamburger */}
      <div className="md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              className="flex items-center justify-center w-12 h-12 backdrop-blur-lg bg-black/50 border border-white/10 rounded-full"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-black/95 backdrop-blur-xl border-white/10 w-72"
          >
            <SheetTitle className="text-white text-lg px-2">
              Navigation
            </SheetTitle>
            <nav className="flex flex-col gap-2 mt-4 px-2" aria-label="Mobile navigation">
              {NAV_ITEMS.map((item) => {
                const sectionId = item.href.replace("#", "");
                const isActive = activeSection === sectionId;

                return (
                  <SheetClose asChild key={item.href}>
                    <button
                      onClick={() => handleNavClick(item.href)}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      className={`text-left px-4 py-3 text-base font-medium rounded-lg transition-colors duration-300 ${
                        isActive
                          ? "text-[#FFD700] bg-[#FFD700]/10"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                      aria-current={isActive ? "true" : undefined}
                    >
                      {item.label}
                    </button>
                  </SheetClose>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
