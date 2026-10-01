"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  SPLASH_MAX_MS,
  SPLASH_MIN_MS,
  markSplashShown,
  splashStartTime,
  useSplashShown,
} from "@/lib/splash";

interface LoadingContextValue {
  isLoaded: boolean;
}

const LoadingContext = createContext<LoadingContextValue>({ isLoaded: true });

export function LoadingProvider({ children }: { children: ReactNode }) {
  // Splash already shown in this tab → treat the page as loaded immediately.
  const splashShown = useSplashShown();
  const [finished, setFinished] = useState(false);
  const isLoaded = splashShown || finished;

  useEffect(() => {
    if (splashShown) return;

    let done = false;
    let timerDone = false;
    let documentReady = document.readyState === "complete";

    const finish = () => {
      if (done) return;
      done = true;
      setFinished(true);
      markSplashShown();
      document.body.style.overflow = "";
    };
    const tryFinish = () => {
      if (timerDone && documentReady) finish();
    };

    // Lock scroll during loading
    document.body.style.overflow = "hidden";

    // Timers count from when the splash was first painted, not from hydration,
    // so a slow device does not pay for hydration twice.
    const start = splashStartTime();
    const now = performance.now();

    const minTimer = setTimeout(() => {
      timerDone = true;
      tryFinish();
    }, Math.max(0, start + SPLASH_MIN_MS - now));

    const onReady = () => {
      documentReady = true;
      tryFinish();
    };
    if (!documentReady) window.addEventListener("load", onReady);

    // Safety cap — always dismiss eventually
    const safetyTimer = setTimeout(
      finish,
      Math.max(0, start + SPLASH_MAX_MS - now)
    );

    return () => {
      clearTimeout(minTimer);
      clearTimeout(safetyTimer);
      window.removeEventListener("load", onReady);
      document.body.style.overflow = "";
    };
  }, [splashShown]);

  const value = useMemo(() => ({ isLoaded }), [isLoaded]);

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
