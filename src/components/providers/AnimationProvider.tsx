"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface AnimationContextValue {
  reducedMotion: boolean;
  duration: (ms: number) => number;
  stagger: (ms: number) => number;
}

const AnimationContext = createContext<AnimationContextValue>({
  reducedMotion: false,
  duration: (ms) => ms,
  stagger: (ms) => ms,
});

export function AnimationProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  const duration = (ms: number) => (reducedMotion ? 0 : ms);
  const stagger = (ms: number) => (reducedMotion ? 0 : ms);

  return (
    <AnimationContext.Provider value={{ reducedMotion, duration, stagger }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  return useContext(AnimationContext);
}
