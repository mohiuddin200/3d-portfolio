"use client";

import { type ReactNode, useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "@/lib/gsap";
import { useAnimation } from "./AnimationProvider";

function LenisGsapSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, [lenis]);

  return null;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const { reducedMotion } = useAnimation();

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        autoRaf: false,
      }}
    >
      <LenisGsapSync />
      {children}
    </ReactLenis>
  );
}
