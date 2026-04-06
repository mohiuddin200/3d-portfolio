"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface LoadingContextValue {
  isLoaded: boolean;
}

const LoadingContext = createContext<LoadingContextValue>({ isLoaded: true });

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [skipSplash, setSkipSplash] = useState(false);

  useEffect(() => {
    // Skip splash if already shown in this tab session
    if (sessionStorage.getItem("splashShown")) {
      setIsLoaded(true);
      setSkipSplash(true);
      return;
    }

    let timerDone = false;
    let documentReady = document.readyState === "complete";

    const tryFinish = () => {
      if (timerDone && documentReady) {
        setIsLoaded(true);
        sessionStorage.setItem("splashShown", "true");
        document.body.style.overflow = "";
      }
    };

    // Lock scroll during loading
    document.body.style.overflow = "hidden";

    // Minimum display time
    const minTimer = setTimeout(() => {
      timerDone = true;
      tryFinish();
    }, 2500);

    // Wait for document ready
    const onReady = () => {
      documentReady = true;
      tryFinish();
    };

    if (documentReady) {
      // already complete
    } else {
      window.addEventListener("load", onReady);
    }

    // Safety cap — always dismiss after 5s
    const safetyTimer = setTimeout(() => {
      setIsLoaded(true);
      sessionStorage.setItem("splashShown", "true");
      document.body.style.overflow = "";
    }, 5000);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(safetyTimer);
      window.removeEventListener("load", onReady);
      document.body.style.overflow = "";
    };
  }, []);

  // If skipping splash, don't even mount the loading state as false
  if (skipSplash) {
    return (
      <LoadingContext.Provider value={{ isLoaded: true }}>
        {children}
      </LoadingContext.Provider>
    );
  }

  return (
    <LoadingContext.Provider value={{ isLoaded }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
